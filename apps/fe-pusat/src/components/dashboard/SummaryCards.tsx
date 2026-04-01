/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI SummaryCards yang bertugas sebagai *container* untuk metrik statistik metrik utama.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal SummaryCards.
 */
import { memo } from "react";

import { useDisasterStore } from "@store/useDisasterStore";
import {
	selectTotalLaporanMasuk,
	selectTotalBahayaMasuk,
	selectTotalDiatasi,
	selectLaporanHariIni
} from "@store/useDisasterStore";

import SummaryCardItem from "./SummaryCardItem";

const SummaryCards = memo(() => {
	const totalMasuk = useDisasterStore(selectTotalLaporanMasuk);
	const totalHariIni = useDisasterStore(selectLaporanHariIni);
	const totalBahaya = useDisasterStore(selectTotalBahayaMasuk);
	const totalDiatasi = useDisasterStore(selectTotalDiatasi);
	const isLoading = useDisasterStore((s) => s.isLoading);
	const error = useDisasterStore((s) => s.error);

	/** Nilai yang ditampilkan: placeholder saat loading, tanda error, atau nilai asli. */
	const displayValue = (val: number) => {
		if (isLoading) return "--";
		if (error) return "!";
		return val;
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<SummaryCardItem
				label="Total Laporan Masuk"
				value={displayValue(totalMasuk)}
				trend="~5%"
				trendColor="bg-green-100 text-green-700"
			/>
			<SummaryCardItem
				label="Laporan Hari Ini"
				value={displayValue(totalHariIni)}
				trend="~2%"
				trendColor="bg-red-100 text-red-600"
			/>
			<SummaryCardItem
				label="Total Laporan Bahaya Masuk"
				value={displayValue(totalBahaya)}
				icon={
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="16" x2="12" y2="12" />
						<line x1="12" y1="8" x2="12.01" y2="8" />
					</svg>
				}
			/>
			<SummaryCardItem
				label="Total Laporan Diatasi"
				value={displayValue(totalDiatasi)}
				icon={
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2.5">
						<circle cx="12" cy="12" r="10" />
						<path d="m9 12 2 2 4-4" />
					</svg>
				}
			/>
		</div>
	);
});

SummaryCards.displayName = "SummaryCards";
export default SummaryCards;
