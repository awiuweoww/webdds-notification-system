import { memo } from "react";

/**
 * Navbar utama FE 1 — Pusat Komando Bencana Nasional.
 * Menampilkan logo, navigasi, lonceng notifikasi, status koneksi WebDDS, dan avatar pengguna.
 */
const Navbar = memo(() => {
	return (
		<nav className="flex items-center justify-between bg-[#1a2332] text-white px-6 py-3 shadow-md">
			{/* Kiri: Logo + Nama Sistem */}
			<div className="flex items-center gap-3">
				<svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="text-white"
				>
					<path d="M12 2L2 19h20L12 2z" />
					<path d="M12 2L2 19h20L12 2z" />
				</svg>
				<span className="text-lg font-bold tracking-wide">
					Pusat Komando Bencana Nasional
				</span>
			</div>

			{/* Kanan: Navigasi + Ikon */}
			<div className="flex items-center gap-5">
				<span className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
					Dashboard
				</span>

				{/* Lonceng Notifikasi */}
				<button
					className="relative p-1 hover:bg-white/10 rounded-lg transition-colors"
					aria-label="Notifications"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
				</button>

				{/* Status WebDDS */}
				<div className="flex items-center gap-2 bg-[#2d8a4e] text-white text-xs font-semibold px-4 py-2 rounded-full">
					<svg
						width="14"
						height="14"
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
				<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
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
