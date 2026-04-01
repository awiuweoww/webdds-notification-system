/**
 * Created Date       : 31-03-2026
 * Description        : Store khusus notifikasi untuk FE Posko.
 *                      Hanya menyimpan respons dari Pusat terhadap laporan yang dikirim.
 *
 * Perbedaan dengan useActivityStore:
 *   - useActivityStore   = Log aktivitas lokal (submit form, error, dll)
 *   - useNotifStore (ini) = Notifikasi dari Pusat (update status, konfirmasi, dll)
 *
 * Data masuk via WebDDS topic "status-updates":
 *   Pusat publish → Posko subscribe → masuk ke store ini → tampil di bell icon
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal.
 */
import { create } from "zustand";

/** Satu item notifikasi dari Pusat. */
export interface PusatNotification {
	id: string;
	reportId?: string;
	timestamp: string;
	title: string;
	description: string;
	type: "info" | "success" | "warning";
	isRead: boolean;
}

/** State store notifikasi. */
export interface NotifStoreState {
	notifications: PusatNotification[];
	unreadCount: number;

	/** Menambahkan notifikasi baru dari Pusat. Notifikasi baru selalu masuk sebagai belum dibaca. */
	addNotification: (notif: Omit<PusatNotification, "isRead">) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearAll: () => void;
}

/**Store notifikasi */
export const useNotifStore = create<NotifStoreState>((set) => ({
	notifications: [],
	unreadCount: 0,

	/**
	 * Menambahkan notifikasi baru dari Pusat. Notifikasi baru selalu masuk sebagai belum dibaca.
	 * Jika notifikasi dengan konten yang sama sudah ada di store, maka tidak akan ditambahkan.
	 * @param {Omit<PusatNotification, "isRead">} notif - Objek notifikasi dari Pusat.
	 * @returns void
	 */
	addNotification: (notif) =>
		set((state) => {
			// Cegah duplikat total (pesan yang sama UNTUK laporan yang sama)
			// Ini mengizinkan pesan "Sudah Diatasi" muncul berkali-kali asal reportId-nya berbeda
			const isDuplicate = state.notifications.some(
				(n) => n.description === notif.description && n.title === notif.title && n.reportId === notif.reportId
			);
			if (isDuplicate) return state;

			return {
				notifications: [{ ...notif, isRead: false }, ...state.notifications],
				unreadCount: state.unreadCount + 1
			};
		}),

	/**
	 * Membuat notifikasi dengan id tertentu sebagai sudah dibaca.
	 * Dipanggil saat operator membuka notifikasi yang belum dibaca.
	 * @param {string} id - Id notifikasi yang ingin dibuat sudah dibaca.
	 * @returns void
	 */
	markAsRead: (id) =>
		set((state) => {
			const notifications = state.notifications.map((n) =>
				n.id === id ? { ...n, isRead: true } : n
			);
			const unreadCount = notifications.filter((n) => !n.isRead).length;
			return { notifications, unreadCount };
		}),

	/**
	 * Membuat semua notifikasi sebagai sudah dibaca.
	 * Dipanggil saat operator ingin menghapus semua notifikasi yang belum dibaca.
	 * @returns void
	 */
	markAllAsRead: () =>
		set((state) => ({
			notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
			unreadCount: 0
		})),

	clearAll: () => set({ notifications: [], unreadCount: 0 })
}));
