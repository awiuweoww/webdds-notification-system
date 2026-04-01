/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI ActivityLog untuk menampilkan daftar riwayat interaksi atau log sistem pada Dashboard.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal ActivityLog.
 */
import { memo } from "react";

import Input from "@common/input/Input";
import { useActivityStore } from "../../store/useActivityStore";
import ActivityLogItem from "./ActivityLogItem";

const ActivityLog = memo(() => {
	const logsList = useActivityStore((s) => s.logsList);
	const filterDate = useActivityStore((s) => s.filterDate);
	const setFilterDate = useActivityStore((s) => s.setFilterDate);

	const filteredLogs = filterDate 
		? logsList.filter(log => log.date === filterDate)
		: logsList;

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full lg:w-[340px] shrink-0">
			<div className="px-5 py-4 border-b border-gray-100">
				<div className="flex items-center gap-2">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-surface-dark"
					>
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
					<h2 className="text-base font-bold text-surface-dark">
						Recent Activity Log
					</h2>
				</div>
			</div>

			<div className="px-5 py-3 border-b border-gray-100">
				<Input
					type="date"
					label="Filter Tanggal"
					value={filterDate}
					onChange={(e) => setFilterDate(e.target.value)}
					containerClassName="w-full"
					className="text-sm border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500"
				/>
			</div>

			<div className="px-5 py-2 max-h-[400px] overflow-y-auto">
				{filteredLogs.length === 0 && (
					<div className="text-center text-sm text-gray-400 py-4">Belum ada aktivitas.</div>
				)}
				{filteredLogs.map((log) => (
					<ActivityLogItem key={log.id} {...log} />
				))}
			</div>
		</div>
	);
});

ActivityLog.displayName = "ActivityLog";
export default ActivityLog;
