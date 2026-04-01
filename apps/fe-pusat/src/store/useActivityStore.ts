import { create } from "zustand";
import type { ActivityLogEntry } from "../types/disaster.types";

export interface ActivityStoreState {
    logsList: ActivityLogEntry[];
    filterDate: string;
    setFilterDate: (date: string) => void;
    appendLog: (newLog: ActivityLogEntry) => void;
    clearLogs: () => void;
}

export const useActivityStore = create<ActivityStoreState>((set) => ({
    logsList: [
        {
            id: `log-sys-${Date.now()}`,
            time: new Date().toLocaleTimeString("id-ID"),
            date: new Date().toISOString().split('T')[0],
            title: "Sistem Terhubung",
            description: "Modul pemantauan bencana Pusat Regional siap menerima data via WebDDS.",
            type: "system"
        }
    ],
    filterDate: "",
    setFilterDate: (date) => set({ filterDate: date }),

    /**
     * Menambahkan entri log baru ke daftar paling atas.
     * @param {ActivityLogEntry} newLog - Entri log baru yang akan ditambahkan.
     * @returns void
     */
    appendLog: (newLog) =>
        set((state) => ({
            logsList: [newLog, ...state.logsList]
        })),

    clearLogs: () => set({ logsList: [] })
}));
