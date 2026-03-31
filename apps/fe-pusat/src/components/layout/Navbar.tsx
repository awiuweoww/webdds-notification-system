/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Navbar layout utama aplikasi.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi desain baru dengan Notification Dropdown.
 */
import { memo, useState } from "react";
import NotificationDropdown from "../notification/NotificationDropdown";
import { useDisasterStore, selectUnreadReportsList } from "@store/useDisasterStore";

/**
 * Navbar utama FE 1 — Pusat Komando Bencana Nasional.
 * Menampilkan logo, navigasi, lonceng notifikasi (dengan dropdown menu),
 * status koneksi WebDDS, dan avatar pengguna.
 */
const Navbar = memo(() => {
    const [showNotif, setShowNotif] = useState(false);
    const unreadReports = useDisasterStore(selectUnreadReportsList);
    const unreadCount = unreadReports.length;

	return (
		<nav className="flex items-center justify-between bg-surface-dark text-white px-8 py-3.5 border-b border-gray-100/10 relative z-50">
			{/* Kiri: Logo + Nama Sistem */}
			<div className="flex items-center gap-3">
				<div className="p-1 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                        <path d="M12 2L2 19h20L12 2z" />
                    </svg>
                </div>
				<span className="text-[17px] font-bold tracking-wide text-white">
					Pusat Komando Bencana Nasional
				</span>
			</div>

			{/* Kanan: Navigasi + Ikon */}
			<div className="flex items-center gap-7">
				<span className="text-[13px] font-bold text-gray-300 hover:text-white cursor-pointer transition-colors">
					Dashboard
				</span>

				{/* Area Notifikasi */}
				<div className="relative relative-notif-container">
                    <button
                        className="relative p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Notifications"
                        onClick={(e) => { e.stopPropagation(); setShowNotif(!showNotif); }}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-white"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-btn-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface-dark">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <NotificationDropdown show={showNotif} onClose={() => setShowNotif(false)} />
                </div>

				{/* Status WebDDS */}
				<div className="flex items-center gap-2 bg-indicator-success text-white text-[11px] font-bold px-4 py-2.5 rounded-full hover:brightness-110 cursor-pointer transition-all tracking-widest leading-none">
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
					>
                        <path d="M12 20h.01" />
                        <path d="M2 8.82a15 15 0 0 1 20 0" />
                        <path d="M5 12.859a10 10 0 0 1 14 0" />
                        <path d="M8.5 16.429a5 5 0 0 1 7 0" />
					</svg>
					WEBDDS: CONNECTED
				</div>

				{/* Avatar */}
				<div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
					>
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
						<circle cx="12" cy="7" r="4" />
					</svg>
				</div>
			</div>
		</nav>
	);
});

Navbar.displayName = "Navbar";
export default Navbar;
