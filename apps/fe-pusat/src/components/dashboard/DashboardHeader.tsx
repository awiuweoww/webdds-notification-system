import { memo } from "react";

/**
 * Header bagian atas konten dashboard — Judul halaman dan deskripsi singkat.
 */
const DashboardHeader = memo(() => {
	return (
		<div className="mb-6">
			<h1 className="text-2xl font-bold text-[#1a2332]">
				Pusat Komando Nasional (sebagai FE 1)
			</h1>
			<p className="text-sm text-gray-500 mt-1">
				Sistem pemantauan bencana gempa bumi Nasional
			</p>
		</div>
	);
});

DashboardHeader.displayName = "DashboardHeader";
export default DashboardHeader;
