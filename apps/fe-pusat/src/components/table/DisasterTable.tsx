/**
 * Created Date       : 31-03-2026
 * Description        : Komponen UI DisasterTable untuk menampilkan Live Data Grid laporan kejadian.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal DisasterTable.
 */
import { memo, useState } from "react";

import { useDisasterStore, selectAllReportsList } from "@store/useDisasterStore";
import { formatCoordinate } from "@utils/conversion/coordinateConversion";
import { formatToShortTime } from "@utils/conversion/timeConversion";



import StatusBadge from "./StatusBadge";
import PenangananBadge from "./PenangananBadge";
import ReportDetailModal from "../modal/ReportDetailModal";
import Modal from "../../common/modal/Modal";
import Button from "../../common/button/Button";


const DisasterTable = memo(() => {
	const reports = useDisasterStore(selectAllReportsList);
	const selectedReportId = useDisasterStore((state) => state.selectedReportId);
	const setSelectedReportId = useDisasterStore((state) => state.setSelectedReportId);
	const deleteReport = useDisasterStore((state) => state.deleteReport);
	
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const selectedReport = selectedReportId ? reports.find((r) => r.id === selectedReportId) : null;

	const sortedReports = [...reports].sort((a, b) => {
		const aResolved = a.statusPenanganan === 2 || a.statusPenanganan === 3;
		const bResolved = b.statusPenanganan === 2 || b.statusPenanganan === 3;
		if (aResolved && !bResolved) return 1;
		if (!aResolved && bResolved) return -1;
		return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
	});

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
						{sortedReports.map((report) => {
							const isResolved = report.statusPenanganan === 2 || report.statusPenanganan === 3;

							return (
								<tr
									key={report.id}
									className={`border-b border-gray-50 transition-colors cursor-pointer ${isResolved ? "bg-gray-200 hover:bg-gray-200" : "hover:bg-gray-50/70"}`}
									onClick={() => setSelectedReportId(report.id)}
								>
									<td className="px-5 py-4 font-medium text-surface-dark max-w-[160px]">
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
											{/* Delete */}
											<button
												className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
												onClick={(e) => {
													e.stopPropagation();
													setConfirmDeleteId(report.id);
												}}
												aria-label="Hapus"
											>
												<svg
													width="18"
													height="18"
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
					onClose={() => setSelectedReportId(null)}
				/>
			)}

			{/* Modal Konfirmasi Hapus */}
			{confirmDeleteId && (
				<Modal
					isOpen={true}
					onClose={() => setConfirmDeleteId(null)}
					size="md"
					title={
						<div className="flex items-center gap-2">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
							<span className="font-bold text-[15px] uppercase tracking-wide">Konfirmasi Hapus</span>
						</div>
					}
					className="border-b-[6px] border-b-btn-error"
					headerClassName="bg-surface-dark text-white border-none py-4"
				>
					<div className="p-6">
						<p className="text-sm text-gray-600 mb-6 leading-relaxed">
							Apakah Anda yakin ingin menghapus laporan ini? Data yang terhapus tidak dapat dikembalikan.
						</p>
						<div className="flex gap-3">
							<Button color="neutral" variant="outline" onClick={() => setConfirmDeleteId(null)} className="flex-1 font-bold tracking-widest py-3">
								Batal
							</Button>
							<Button color="error" onClick={() => { deleteReport(confirmDeleteId); setConfirmDeleteId(null); }} className="flex-1 font-bold tracking-widest py-3">
								Hapus
							</Button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
});

DisasterTable.displayName = "DisasterTable";
export default DisasterTable;
