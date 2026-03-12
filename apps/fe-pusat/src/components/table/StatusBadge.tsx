import { memo } from "react";

import { cn } from "@utils/cn";

interface StatusBadgeProps {
	level: number;
	timestamp?: string;
}

/**
 * Label status warna-warni (BAHAYA merah, WASPADA kuning, NORMAL hijau, OFF abu-abu).
 */
const StatusBadge = memo(({ level, timestamp }: StatusBadgeProps) => {
	const config: Record<number, { text: string; className: string }> = {
		0: {
			text: "NORMAL",
			className: "bg-green-600 text-white"
		},
		1: {
			text: "WASPADA",
			className: "bg-yellow-500 text-white"
		},
		2: {
			text: "BAHAYA",
			className: "bg-red-600 text-white"
		},
		3: {
			text: "OFF",
			className: "bg-gray-400 text-white"
		}
	};

	const { text, className } = config[level] || config[0];

	return (
		<div className="flex flex-col items-center gap-1">
			<span
				className={cn(
					"px-3 py-1 rounded-md text-[11px] font-bold tracking-wide",
					className
				)}
			>
				{text}
			</span>
			{timestamp && (
				<span className="text-[10px] text-gray-400">{timestamp}</span>
			)}
		</div>
	);
});

StatusBadge.displayName = "StatusBadge";
export default StatusBadge;
