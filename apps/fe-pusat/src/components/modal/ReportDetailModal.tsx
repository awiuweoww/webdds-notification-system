import { memo } from "react";

import Modal from "@common/modal/Modal";
import { Button } from "@common/button/Button";
import { useDisasterStore } from "@store/useDisasterStore";
import { enumMap } from "@constants/stream.constants";

import type { DisasterReport } from "@types/disaster.types";

import StatusBadge from "../table/StatusBadge";

interface ReportDetailModalProps {
	report: DisasterReport;
	onClose: () => void;
}

/**
 * Modal detail laporan kejadian bencana — ditampilkan saat user klik baris di tabel.
 * Menampilkan informasi lokasi, observasi, dan tombol aksi penanganan.
 */
const ReportDetailModal = memo(
	({ report, onClose }: ReportDetailModalProps) => {
		const updatePenanganan = useDisasterStore(
			(s) => s.updatePenanganan
		);

		const handleUpdateStatus = (newStatus: number) => {
			updatePenanganan(report.id, newStatus);
			onClose();
		};

		const formattedDate = (() => {
			try {
				const d = new Date(report.timestamp);
				return d.toLocaleDateString("id-ID", {
					day: "2-digit",
					month: "short",
					year: "numeric"
				}) + " - " + d.toLocaleTimeString("id-ID") + " WIB";
			} catch {
				return "-";
			}
		})();

		return (
			<Modal
				isOpen={true}
				onClose={onClose}
				title="DETAIL LAPORAN KEJADIAN"
				size="lg"
				footer={
					<div className="flex w-full gap-3">
						<Button
							color="warning"
							className="flex-1"
							size="sm"
							onClick={() =>
								handleUpdateStatus(
									enumMap.statusPenanganan.STATUS_SEDANG_PROSES
								)
							}
						>
							SEDANG PROSES
						</Button>
						<Button
							color="success"
							className="flex-1"
							size="sm"
							onClick={() =>
								handleUpdateStatus(
									enumMap.statusPenanganan
										.STATUS_SUDAH_DIATASI
								)
							}
						>
							SUDAH DIATASI
						</Button>
						<Button
							color="error"
							className="flex-1"
							size="sm"
							onClick={() =>
								handleUpdateStatus(
									enumMap.statusPenanganan.STATUS_GAGAL_TERATASI
								)
							}
						>
							GAGAL TERATASI
						</Button>
					</div>
				}
			>
				{/* Status Bar */}
				<div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6">
					<div>
						<span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
							Status Saat Ini
						</span>
						<StatusBadge level={report.statusLevel} />
					</div>
					<div className="text-right">
						<span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">
							Update Terakhir
						</span>
						<span className="text-sm font-semibold text-[#1a2332]">
							{formattedDate}
						</span>
					</div>
				</div>

				{/* Informasi Lokasi */}
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#e53e3e"
							strokeWidth="2"
						>
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						<h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wide">
							Informasi Lokasi
						</h3>
					</div>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between py-1">
							<span className="text-gray-500">
								Jenis Bencana
							</span>
							<span className="font-bold text-[#1a2332] uppercase">
								{report.bencanaType}
							</span>
						</div>
						<div className="flex justify-between py-1">
							<span className="text-gray-500">Coordinate</span>
							<span className="font-bold text-[#1a2332]">
								{report.latitude}, {report.longitude}
							</span>
						</div>
						<div className="flex justify-between py-1">
							<span className="text-gray-500">Region</span>
							<span className="font-bold text-[#1a2332]">
								{report.sourceName}
							</span>
						</div>
					</div>
				</div>

				{/* Detail Observasi */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
						</svg>
						<h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wide">
							Detail Laporan Observasi
						</h3>
					</div>
					<div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
						{report.observationDetail ||
							"Tidak ada catatan observasi."}
					</div>
				</div>
			</Modal>
		);
	}
);

ReportDetailModal.displayName = "ReportDetailModal";
export default ReportDetailModal;
