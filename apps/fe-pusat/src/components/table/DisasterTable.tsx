import { memo, useState } from "react";

import { useDisasterStore, selectAllReportsList } from "@store/useDisasterStore";
import { formatCoordinate } from "@utils/conversion/coordinateConversion";
import { formatToShortTime } from "@utils/conversion/timeConversion";

import type { DisasterReport } from "@types/disaster.types";

import StatusBadge from "./StatusBadge";
import PenangananBadge from "./PenangananBadge";
import ReportDetailModal from "../modal/ReportDetailModal";

/**
 * Tabel Bencana Nasional — Menampilkan Live Data Grid dari Zustand store.
 */
const DisasterTable = memo(() => {
	const reports = useDisasterStore(selectAllReportsList);
	const [selectedReport, setSelectedReport] =
		useState<DisasterReport | null>(null);

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1">
			{/* Table Header */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
				<h2 className="text-base font-bold text-[#1a2332]">
					Tabel Bencana Nasional
				</h2>
				<button className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Ekspor Data
				</button>
			</div>

			{/* Table Content */}
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left">
					<thead>
						<tr className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
							<th className="px-5 py-3">Unit Pelapor</th>
							<th className="px-5 py-3">Koordinat</th>
							<th className="px-5 py-3">Jenis Bencana</th>
							<th className="px-5 py-3">Kondisi Pelaporan</th>
							<th className="px-5 py-3 text-center">Status</th>
							<th className="px-5 py-3 text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{reports.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="px-5 py-10 text-center text-gray-400 text-sm"
								>
									Belum ada data laporan masuk.
								</td>
							</tr>
						)}
						{reports.map((report) => {
							const isResolved = report.statusPenanganan === 2;

							return (
								<tr
									key={report.id}
									className={`border-b border-gray-50 transition-colors hover:bg-gray-50/70 cursor-pointer ${isResolved ? "bg-gray-100/60 opacity-70" : ""}`}
									onClick={() => setSelectedReport(report)}
								>
									<td className="px-5 py-4 font-medium text-[#1a2332] max-w-[160px]">
										{report.sourceName}
									</td>
									<td className="px-5 py-4 text-xs text-gray-600">
										{formatCoordinate(
											report.latitude,
											report.longitude
										)}
									</td>
									<td className="px-5 py-4 text-gray-700">
										{report.bencanaType}
									</td>
									<td className="px-5 py-4">
										<PenangananBadge
											status={report.statusPenanganan}
											timestamp={formatToShortTime(
												report.timestamp
											)}
										/>
									</td>
									<td className="px-5 py-4 text-center">
										<StatusBadge
											level={report.statusLevel}
											timestamp={formatToShortTime(
												report.timestamp
											)}
										/>
									</td>
									<td className="px-5 py-4 text-center">
										<div className="flex items-center justify-center gap-2">
											{/* View */}
											<button
												className="text-gray-400 hover:text-blue-600 transition-colors"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedReport(report);
												}}
												aria-label="Lihat Detail"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
													<circle
														cx="12"
														cy="12"
														r="3"
													/>
												</svg>
											</button>
											{/* Delete */}
											<button
												className="text-gray-400 hover:text-red-600 transition-colors"
												onClick={(e) => {
													e.stopPropagation();
												}}
												aria-label="Hapus"
											>
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
												>
													<polyline points="3 6 5 6 21 6" />
													<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
												</svg>
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Modal Detail */}
			{selectedReport && (
				<ReportDetailModal
					report={selectedReport}
					onClose={() => setSelectedReport(null)}
				/>
			)}
		</div>
	);
});

DisasterTable.displayName = "DisasterTable";
export default DisasterTable;
