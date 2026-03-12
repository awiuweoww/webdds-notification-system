import { memo } from "react";

import { cn } from "@utils/cn";

interface PenangananBadgeProps {
	status: number;
	timestamp?: string;
}

/**
 * Badge kondisi pelaporan (SUDAH DIEVAKUASI, SEDANG PROSES, atau kosong jika AKTIF).
 */
const PenangananBadge = memo(({ status, timestamp }: PenangananBadgeProps) => {
	if (status === 0) return null;

	const config: Record<number, { text: string; className: string }> = {
		1: {
			text: "SEDANG PROSES",
			className:
				"border-yellow-500 text-yellow-700 bg-yellow-50"
		},
		2: {
			text: "SUDAH DIEVAKUASI",
			className:
				"border-green-600 text-green-700 bg-green-50"
		},
		3: {
			text: "GAGAL TERATASI",
			className:
				"border-red-600 text-red-700 bg-red-50"
		}
	};

	const item = config[status];
	if (!item) return null;

	return (
		<div className="flex flex-col items-center gap-1">
			<span
				className={cn(
					"px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide border",
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
