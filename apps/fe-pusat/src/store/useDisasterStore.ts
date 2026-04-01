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
	reportsById: ReportMap;
	selectedReportId: string | null;
	readReportIds: string[];
	isLoading: boolean;
	error: string | null;
	dangerAlert: DangerAlertData | null;

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
	 * Apply incoming report to store.
	 * If report is invalid, print warning and ignore it.
	 * @param report - Incoming report to apply.
	 * @returns void
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

	/**
	 * Update status penanganan laporan di store.
	 * Jika laporan tidak ditemukan, abaikan operasi.
	 * @param id - ID laporan yang ingin diupdate.
	 * @param newPenangananStatus - Status baru (0=Aktif, 1=Proses, 2=Diatasi, 3=Gagal).
	 * @returns void
	 */
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

	/**
	 * Menghapus laporan berdasarkan ID di store.
	 * Jika laporan yang dihapus sedang dipilih, maka selectedReportId akan direset menjadi null.
	 * @param id - ID laporan yang ingin dihapus.
	 * @returns void
	 */
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

/**
 * Mark a report as read.
 * If the report is already marked as read, do nothing.
 * If the report is not marked as read, add it to the list of read reports.
 * @param id - The ID of the report to mark as read.
 * @returns void
 */
	markAsRead: (id) =>
		set((state) => ({
			readReportIds: state.readReportIds.includes(id)
				? state.readReportIds
				: [...state.readReportIds, id]
		})),

/**
 * Membuat semua laporan sebagai sudah dibaca.
 * Jika laporan belum dibaca, maka akan ditambahkan ke dalam daftar laporan yang sudah dibaca.
 * @returns void
 */
	markAllAsRead: () =>
		set((state) => ({
			readReportIds: Object.keys(state.reportsById)
		}))
}));


/**
 * Mengembalikan daftar semua laporan yang ada dalam store.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {DisasterReport[]} Daftar laporan yang ada dalam store.
 */
export const selectAllReportsList = (s: DisasterStoreState): DisasterReport[] =>
	Object.values(s.reportsById);


/**
 * Mengembalikan daftar laporan yang belum dibaca.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {DisasterReport[]} Daftar laporan yang belum dibaca.
 */
export const selectUnreadReportsList = (s: DisasterStoreState): DisasterReport[] =>
	Object.values(s.reportsById).filter(r => !s.readReportIds.includes(r.id));


/**
 * Mengembalikan jumlah total laporan yang ada dalam store.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {number} Jumlah total laporan yang ada dalam store.
 */
export const selectTotalLaporanMasuk = (s: DisasterStoreState): number =>
	Object.keys(s.reportsById).length;


/**
 * Mengembalikan jumlah total laporan yang berstatus penanganan AWAS.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {number} Jumlah total laporan yang berstatus penanganan AWAS.
 */
export const selectTotalBahayaMasuk = (s: DisasterStoreState): number =>
	Object.values(s.reportsById).filter(
		(r) => r.statusLevel === enumMap.levelBencana.LEVEL_AWAS
	).length;


/**
 * Mengembalikan jumlah total laporan yang berstatus penanganan SUDAH DIATASI.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {number} Jumlah total laporan yang berstatus penanganan SUDAH DIATASI.
 */
export const selectTotalDiatasi = (s: DisasterStoreState): number =>
	Object.values(s.reportsById).filter(
		(r) => r.statusPenanganan === enumMap.statusPenanganan.STATUS_SUDAH_DIATASI
	).length;


/**
 * Mengembalikan jumlah total laporan yang terjadi hari ini.
 * @param {DisasterStoreState} s - State dari store laporan.
 * @returns {number} Jumlah total laporan yang terjadi hari ini.
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
