/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI StatusBadge untuk menampilkan label/tag status tingkat bahaya.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal StatusBadge.
 */
import { memo } from "react";

import { cn } from "@utils/cn";

interface StatusBadgeProps {
	level: number;
	timestamp?: string;
}


const config: Record<number, { text: string; className: string }> = {
	0: {
		text: "NORMAL",
		className: "bg-btn-success text-white"
	},
	1: {
		text: "WASPADA",
		className: "bg-yellow text-white"
	},
	2: {
		text: "SIAGA",
		className: "bg-btn-warning text-white"
	},
	3: {
		text: "AWAS",
		className: "bg-btn-error text-white"
	},
	4: {
		text: "OFF",
		className: "bg-neutral-2 text-white"
	}
};

const StatusBadge = memo(({ level, timestamp }: StatusBadgeProps) => {

	const { text, className } = config[level] || config[0];

	return (
		<div className="flex flex-col items-center gap-1">
			<span
				className={cn(
					"px-3 py-1 rounded-none text-[11px] font-bold tracking-wide w-[100px] text-center",
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
