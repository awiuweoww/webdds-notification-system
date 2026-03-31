/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI PenangananBadge untuk menampilkan progress evakuasi/tindak lanjut.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal PenangananBadge.
 */
import { memo } from "react";

import { cn } from "@utils/cn";

interface PenangananBadgeProps {
	status: number;
	timestamp?: string;
}

const config: Record<number, { text: string; className: string }> = {
	1: {
		text: "PROSES EVAKUASI",
		className:
			"border-yellow text-yellow bg-yellow/10"
	},
	2: {
		text: "SUDAH DIEVAKUASI",
		className:
			"border-btn-success text-btn-success bg-btn-success/10"
	},
	3: {
		text: "GAGAL DIEVAKUASI",
		className:
			"border-btn-error text-btn-error bg-btn-error/10"
	}
};

const PenangananBadge = memo(({ status, timestamp }: PenangananBadgeProps) => {
	if (status === 0) return null;

	const item = config[status];
	if (!item) return null;

	return (
		<div className="flex flex-col items-center gap-1">
			<span
				className={cn(
					"px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide border w-[130px] text-center whitespace-nowrap",
					item.className
				)}
			>
				{item.text}
			</span>
			{timestamp && (
				<span className="text-[10px] text-gray-400">{timestamp}</span>
			)}
		</div>
	);
});

PenangananBadge.displayName = "PenangananBadge";
export default PenangananBadge;
