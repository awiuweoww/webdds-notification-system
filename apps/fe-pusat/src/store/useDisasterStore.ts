import { create } from "zustand";

import { enumMap } from "@constants/stream.constants";

export interface DisasterReport {
	id: string;
	originId: string;
	sourceName: string;
	latitude: string;
	longitude: string;
	bencanaType: string;
	statusLevel: number;
	statusPenanganan: number;
	observationDetail: string;
	timestamp: string;
}

type ReportMap = Record<string, DisasterReport>;

/**
 * Validasi runtime untuk memastikan report dari API memiliki field yang dibutuhkan.
 * @param report - Objek yang akan divalidasi.
 * @returns true jika valid, false jika tidak.
 */
const validateReport = (report: unknown): report is DisasterReport => {
	if (!report || typeof report !== "object") return false;
	const r = report as Record<string, unknown>;
	return (
		typeof r.id === "string" && r.id.length > 0 &&
		typeof r.sourceName === "string" &&
		typeof r.bencanaType === "string" &&
		typeof r.statusLevel === "number" &&
		typeof r.statusPenanganan === "number" &&
		typeof r.timestamp === "string"
	);
};

export interface DangerAlertData {
	id: string;
	sourceName: string;
	message: string;
}

export interface DisasterStoreState {
	// State inti
	reportsById: ReportMap;
	selectedReportId: string | null;
	readReportIds: string[];
	isLoading: boolean;
	error: string | null;
	dangerAlert: DangerAlertData | null;

	// Actions (Mutations)
	applyIncomingReport: (report: DisasterReport) => void;
	updatePenanganan: (id: string, newPenangananStatus: number) => void;
	deleteReport: (id: string) => void;
	setSelectedReportId: (id: string | null) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearAll: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setDangerAlert: (alert: DangerAlertData | null) => void;
}

export const useDisasterStore = create<DisasterStoreState>((set) => ({
	reportsById: {},
	selectedReportId: null,
	readReportIds: [],
	isLoading: false,
	error: null,
	dangerAlert: null,

	setLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),
	setDangerAlert: (alert) => set({ dangerAlert: alert }),

	/**
	 * Menerima report baru setelah validasi runtime.
	 * Report yang tidak valid akan diabaikan dengan warning di console.
	 * @param report - Report yang masuk.
	 */
	applyIncomingReport: (report) =>
		set((state) => {
			if (!validateReport(report)) {
				console.warn("[Store] Report tidak valid, diabaikan:", report);
				return state;
			}
			const id = report.id;
			return {
				reportsById: {
					...state.reportsById,
					[id]: {
						...(state.reportsById[id] ?? {}),
						...report
					}
				},
				error: null
			};
		}),

	updatePenanganan: (id, newPenangananStatus) =>
		set((state) => {
			const existing = state.reportsById[id];
			if (!existing) return state;

			return {
				reportsById: {
					...state.reportsById,
					[id]: {
						...existing,
						statusPenanganan: newPenangananStatus,
						statusLevel:
							newPenangananStatus ===
							enumMap.statusPenanganan.STATUS_SUDAH_DIATASI
								? enumMap.levelBencana.LEVEL_NORMAL
								: existing.statusLevel
					}
				}
			};
		}),

	clearAll: () => set({ reportsById: {}, readReportIds: [] }),

	deleteReport: (id) =>
		set((state) => {
			const newReports = { ...state.reportsById };
			delete newReports[id];
			
			return {
				reportsById: newReports,
				readReportIds: state.readReportIds.filter((rId) => rId !== id),
				selectedReportId: state.selectedReportId === id ? null : state.selectedReportId
			};
		}),

	setSelectedReportId: (id) => set({ selectedReportId: id }),

	markAsRead: (id) =>
		set((state) => ({
			readReportIds: state.readReportIds.includes(id)
				? state.readReportIds
				: [...state.readReportIds, id]
		})),

	markAllAsRead: () =>
		set((state) => ({
			readReportIds: Object.keys(state.reportsById)
		}))
}));

/**
 * Returns all reports in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {DisasterReport[]} An array of all reports in the store.
 */
export const selectAllReportsList = (s: DisasterStoreState): DisasterReport[] =>
	Object.values(s.reportsById);

/**
 * Returns all unread reports in the store.
 * @param s - The state of the disaster store.
 * @returns An array of unread reports.
 */
export const selectUnreadReportsList = (s: DisasterStoreState): DisasterReport[] =>
	Object.values(s.reportsById).filter(r => !s.readReportIds.includes(r.id));

/**
 * Returns the total number of reports in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {number} The total number of reports in the store.
 */
export const selectTotalLaporanMasuk = (s: DisasterStoreState): number =>
	Object.keys(s.reportsById).length;

/**
 * Returns the total number of reports with a status level of BAHAYA in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {number} The total number of reports with a status level of BAHAYA in the store.
 */
export const selectTotalBahayaMasuk = (s: DisasterStoreState): number =>
	Object.values(s.reportsById).filter(
		(r) => r.statusLevel === enumMap.levelBencana.LEVEL_AWAS
	).length;

/**
 * Returns the total number of reports with a status penanganan of SUDAH DIATASI in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {number} The total number of reports with a status penanganan of SUDAH DIATASI in the store.
 */
export const selectTotalDiatasi = (s: DisasterStoreState): number =>
	Object.values(s.reportsById).filter(
		(r) => r.statusPenanganan === enumMap.statusPenanganan.STATUS_SUDAH_DIATASI
	).length;

/**
 * Returns the total number of reports created today in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {number} The total number of reports created today in the store.
 */

/**
 * Returns the count of reports received today.
 * @param s - The state of the disaster store.
 * @returns The count of today's reports.
 */
export const selectLaporanHariIni = (s: DisasterStoreState): number => {
	const today = new Date().toDateString();
	return Object.values(s.reportsById).filter((r) => {
		try {
			const reportDate = new Date(r.timestamp).toDateString();
			return reportDate === today;
		} catch {
			return false;
		}
	}).length;
};
