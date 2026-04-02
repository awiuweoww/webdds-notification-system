/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Sidebar untuk menampilkan log aktivitas dan status sistem.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal Sidebar.
 * - 0.2.0 (31-03-2026): Refactor — data diambil dari useActivityStore, bukan hardcoded.
 */
import React from "react";

import { useActivityStore } from "../store/useActivityStore";
import { statusColorMap } from "../constants/colors.constant";



/**
 * Komponen Sidebar untuk log aktivitas regional.
 * Data diambil dari useActivityStore.
 * @returns Komponen Sidebar yang telah dirender.
 */
export default function Sidebar() {
	const logsList = useActivityStore((s) => s.logsList);

	return (
		<aside className="w-[300px] bg-[#f4f6f8] border-r border-[#e5e7eb] flex flex-col h-full shrink-0">
			<div className="px-6 py-5">
				<h2 className="text-[12px] font-bold text-[#334155] tracking-widest mb-1.5 uppercase">
					LOG AKTIVITAS REGIONAL
				</h2>
				<p className="text-[11px] text-[#475569] font-medium tracking-wide">
					Unit: FE 2 - Jawa Barat
				</p>
			</div>

			<div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 shadow-inner pt-2">
				{logsList.length === 0 && (
					<div className="text-center text-[11px] text-[#94a3b8] py-8">
						Belum ada log aktivitas.
					</div>
				)}
				{logsList.map((log, i) => {
					const colors =
						statusColorMap[log.statusType] || statusColorMap.neutral;
					return (
						<div
							key={log.id || i}
							className={`bg-white rounded-sm p-4 shadow-sm border-b-[3px] ${colors.borderColor} mb-2 relative group`}
						>
							<div className="flex items-center justify-between mb-2">
								<span
									className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-sm uppercase tracking-wider ${colors.tagColor}`}
								>
									{log.statusType.toUpperCase()}
								</span>
								<span className="text-[10px] text-[#94a3b8] font-semibold tracking-wide">
									{log.timestamp}
								</span>
							</div>
							<h4 className="text-[12px] font-bold text-[#1e293b] mb-1.5 leading-tight">
								{log.title}
							</h4>
							<p className="text-[11px] text-[#64748b] leading-relaxed">
								{log.description}
							</p>
						</div>
					);
				})}
			</div>
		</aside>
	);
}
