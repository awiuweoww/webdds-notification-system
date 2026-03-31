/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI ActivityLogItem untuk merender satu item riwayat aktivitas/timeline.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal ActivityLogItem.
 */
import { memo } from "react";

import type { ActivityLogEntry } from "../../types/disaster.types";
import { dotColor } from "@constants/colors.constant";

const ActivityLogItem = memo(({ time, title, description, type }: ActivityLogEntry) => {

	return (
		<div className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0">

			<div className="flex flex-col items-center pt-1.5">
				<div
					className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor[type] || dotColor.neutral}`}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<span className="text-[10px] text-gray-400 block">{time}</span>
				<h4 className="text-sm font-semibold text-surface-dark mt-0.5">
					{title}
				</h4>
				<p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
					{description}
				</p>
			</div>
		</div>
	);
});

ActivityLogItem.displayName = "ActivityLogItem";
export default ActivityLogItem;
