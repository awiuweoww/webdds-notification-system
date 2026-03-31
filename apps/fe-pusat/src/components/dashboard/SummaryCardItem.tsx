/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI SummaryCardItem untuk satu *card* / blok tunggal metrik statistik di Dasboard.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal SummaryCardItem.
 */
import { memo } from "react";

import type { SummaryCardProps } from "../../types/disaster.types";

const SummaryCardItem = memo(
	({ label, value, trend, trendColor, icon }: SummaryCardProps) => {
		return (
			<div className="flex flex-col justify-between bg-white rounded-xl border border-gray-200 p-5 min-w-[200px] flex-1 shadow-sm hover:shadow-md transition-shadow">
				<span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
					{label}
				</span>
				<div className="flex items-end justify-between mt-3">
					<span className="text-3xl font-bold text-surface-dark">
						{typeof value === "number" ? value.toLocaleString("id-ID") : value}
					</span>
					{trend && (
						<span
							className={`text-xs font-medium px-2 py-0.5 rounded-full ${trendColor || "bg-green-100 text-green-700"}`}
						>
							{trend}
						</span>
					)}
					{icon && (
						<span className="text-gray-400 ml-2">{icon}</span>
					)}
				</div>
			</div>
		);
	}
);

SummaryCardItem.displayName = "SummaryCardItem";
export default SummaryCardItem;
