import { memo } from "react";

import type { ActivityLogEntry } from "@types/disaster.types";

import ActivityLogItem from "./ActivityLogItem";

// Data contoh statis — nanti akan diganti oleh data dari store/stream
const dummyLogs: ActivityLogEntry[] = [
	{
		id: "log-1",
		time: "10:45 AM",
		title: "Sinyal Bahaya Terdeteksi",
		description:
			"Sensor Seismik V2 (Pos 1) mendeteksi tremor skala 4.2 SR.",
		type: "danger"
	},
	{
		id: "log-2",
		time: "09:12 AM",
		title: "Pemeliharaan Selesai",
		description:
			"Sektor Anyer telah dikalibrasi ulang oleh Teknisi Lapangan.",
		type: "success"
	},
	{
		id: "log-3",
		time: "08:50 AM",
		title: "Peringatan Suhu Tinggi",
		description:
			"Titik panas terdeteksi di koordinat 0.5071° N (Kalimantan).",
		type: "warning"
	},
	{
		id: "log-4",
		time: "07:30 AM",
		title: "Sistem Reboot",
		description: "Otomatisasi harian berhasil diselesaikan.",
		type: "system"
	}
];

/**
 * Panel Recent Activity Log (Sebelah kanan tabel pada dashboard).
 */
const ActivityLog = memo(() => {
	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full lg:w-[340px] shrink-0">
			{/* Header */}
			<div className="px-5 py-4 border-b border-gray-100">
				<div className="flex items-center gap-2">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-[#1a2332]"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<h2 className="text-base font-bold text-[#1a2332]">
						Recent Activity Log
					</h2>
				</div>
			</div>

			{/* Filter */}
			<div className="px-5 py-3 border-b border-gray-100">
				<label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-1.5">
					Filter Tanggal
				</label>
				<input
					type="date"
					className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			{/* Timeline */}
			<div className="px-5 py-2 max-h-[400px] overflow-y-auto">
				{dummyLogs.map((log) => (
					<ActivityLogItem key={log.id} {...log} />
				))}
			</div>
		</div>
	);
});

ActivityLog.displayName = "ActivityLog";
export default ActivityLog;
