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
            description: "Modul pelaporan darurat posko bersedia menunggu respon Gateway DDS.",
            statusType: "system"
        }
    ],

    
    /**
     * Append a new log entry to the logsList state.
     * @param {DashboardLog} newLog - The new log entry to append.
     */
    appendLog: (newLog) =>
        set((state) => ({
            logsList: [newLog, ...state.logsList]
        })),

    clearLogs: () => set({ logsList: [] })
}));
