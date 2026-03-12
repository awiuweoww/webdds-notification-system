import { memo } from "react";

import type { ActivityLogEntry } from "@types/disaster.types";

/**
 * Satu item timeline di panel Activity Log.
 */
const ActivityLogItem = memo(({ time, title, description, type }: ActivityLogEntry) => {
	const dotColor: Record<string, string> = {
		danger: "bg-red-500",
		warning: "bg-yellow-500",
		success: "bg-gray-700",
		neutral: "bg-gray-400",
		system: "bg-gray-400"
	};

	return (
		<div className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0">
			{/* Dot */}
			<div className="flex flex-col items-center pt-1.5">
				<div
					className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor[type] || dotColor.neutral}`}
				/>
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<span className="text-[10px] text-gray-400 block">{time}</span>
				<h4 className="text-sm font-semibold text-[#1a2332] mt-0.5">
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
