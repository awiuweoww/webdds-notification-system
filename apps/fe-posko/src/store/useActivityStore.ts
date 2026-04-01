import { create } from "zustand";

export interface DashboardLog {
	id: string;
	timestamp: string;
	title: string;
	description: string;
	statusType: "success" | "warning" | "danger" | "neutral" | "system";
}

export interface ActivityStoreState {
	logsList: DashboardLog[];

	appendLog: (newLog: DashboardLog) => void;
	clearLogs: () => void;
}

export const useActivityStore = create<ActivityStoreState>((set) => ({
	logsList: [
		{
			id: "sys-init",
			timestamp: new Date().toLocaleTimeString(),
			title: "Sistem Terinisiasi",
			description:
				"Modul pelaporan darurat posko bersedia menunggu respon Gateway DDS.",
			statusType: "system"
		}
	],

	/**
	 * Menambahkan entri log baru ke daftar paling atas.
	 * @param {DashboardLog} newLog - Entri log baru yang akan ditambahkan.
	 * @returns void
	 */
	appendLog: (newLog) =>
		set((state) => ({
			logsList: [newLog, ...state.logsList]
		})),

	clearLogs: () => set({ logsList: [] })
}));
