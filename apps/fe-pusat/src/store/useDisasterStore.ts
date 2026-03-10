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

export interface DisasterStoreState {
	// State inti
	reportsById: ReportMap;

	// Actions (Mutations)
	applyIncomingReport: (report: DisasterReport) => void;
	updatePenanganan: (id: string, newPenangananStatus: number) => void;
	clearAll: () => void;
}

export const useDisasterStore = create<DisasterStoreState>((set) => ({
	reportsById: {},

	/**
	 * Apply an incoming report, updating the state if it exists.
	 * If the report does not exist in the state, it will be added.
	 * @param {DisasterReport} report - The incoming report.
	 */
	applyIncomingReport: (report) =>
		set((state) => {
			const id = report.id;
			return {
				reportsById: {
					...state.reportsById,
					[id]: {
						...(state.reportsById[id] ?? {}),
						...report
					}
				}
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

	clearAll: () => set({ reportsById: {} })
}));

/**
 * Returns all reports in the store.
 * @param {DisasterStoreState} s - The state of the disaster store.
 * @returns {DisasterReport[]} An array of all reports in the store.
 */
export const selectAllReportsList = (s: DisasterStoreState): DisasterReport[] =>
	Object.values(s.reportsById);

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
		(r) => r.statusLevel === enumMap.levelBencana.LEVEL_BAHAYA
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

export const selectLaporanHariIni = (s: DisasterStoreState): number => {
	const today = new Date().toDateString();
	return Object.values(s.reportsById).filter((r) => {
		try {
			const reportDate = new Date(r.timestamp).toDateString();
			return reportDate === today;
		} catch (e) {
			return false;
		}
	}).length;
};
