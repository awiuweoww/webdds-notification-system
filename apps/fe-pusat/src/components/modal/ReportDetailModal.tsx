/**
 * Created Date       : 31-03-2026
 * Description        : Komponen ReportDetailModal untuk menampilkan pop-up detail laporan saat tabel di klik.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal ReportDetailModal.
 */
import { memo, useMemo, useCallback, useState } from "react";

import Modal from "@common/modal/Modal";
import { Button } from "@common/button/Button";
import { useDisasterStore } from "@store/useDisasterStore";
import { useActivityStore } from "@store/useActivityStore";
import { enumMap } from "@constants/stream.constants";

import type { DisasterReport } from "../../types/disaster.types";
import { publish, WEBDDS_TOPICS } from "../../utils/api/disaster.webdds";

import StatusBadge from "../table/StatusBadge";

interface ReportDetailModalProps {
	report: DisasterReport;
	onClose: () => void;
}

const ReportDetailModal = memo(
	({ report, onClose }: ReportDetailModalProps) => {
		const updatePenanganan = useDisasterStore(
			(s) => s.updatePenanganan
		);

		const [confirmPendingStatus, setConfirmPendingStatus] = useState<number | null>(null);

		const executeUpdateStatus = useCallback(() => {
            if (confirmPendingStatus !== null) {
                // Update ke store lokal
                updatePenanganan(report.id, confirmPendingStatus);
                
                // Publish status update ke broker untuk Posko
                let messageStr = "";
                // Pilih string untuk type badge ActivityLog
                let logType: "danger" | "warning" | "success" | "neutral" | "system" = "neutral";
                if (confirmPendingStatus === enumMap.statusPenanganan.STATUS_SEDANG_PROSES) {
                    messageStr = `Laporan sedang diproses: ${report.sourceName}`;
                    logType = "warning";
                } else if (confirmPendingStatus === enumMap.statusPenanganan.STATUS_SUDAH_DIATASI) {
                    messageStr = `Laporan telah diselesaikan: ${report.sourceName}`;
                    logType = "success";
                } else {
                    messageStr = `Evakuasi gagal untuk: ${report.sourceName}`;
                    logType = "danger";
                }
                
                publish(WEBDDS_TOPICS.STATUS_UPDATES, {
                    reportId: report.id,
                    newStatus: confirmPendingStatus.toString(), // Posko expects string or any representation
                    message: messageStr
                });

                // Catat aktivitas ke log dashboard
                const appendLog = useActivityStore.getState().appendLog;
                appendLog({
                    id: `log-update-${report.id}-${Date.now()}`,
                    time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
                    date: new Date().toISOString().split('T')[0],
                    title: "Status Diperbarui",
                    description: `Operator (Pusat) telah merubah status penanganan: ${messageStr}`,
                    type: logType
                });

                setConfirmPendingStatus(null);
                onClose();
            }
		}, [report.id, report.sourceName, confirmPendingStatus, updatePenanganan, onClose]);

		const formattedDate = useMemo(() => {
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
		}, [report.timestamp]);

        if (confirmPendingStatus !== null) {
            const isProses = confirmPendingStatus === enumMap.statusPenanganan.STATUS_SEDANG_PROSES;
            const isSelesai = confirmPendingStatus === enumMap.statusPenanganan.STATUS_SUDAH_DIATASI;

            let statusLabel = "GAGAL DIEVAKUASI";
            let borderColorClass = "border-b-btn-error";
            let textColorClass = "text-btn-error";
            let btnColor: "error" | "warning" | "success" | "primary" | "neutral" = "error";

            if (isProses) {
                statusLabel = "SEDANG PROSES / PROSES EVAKUASI";
                borderColorClass = "border-b-yellow";
                textColorClass = "text-yellow";
                btnColor = "warning";
            } else if (isSelesai) {
                statusLabel = "SUDAH DIEVAKUASI / SELESAI";
                borderColorClass = "border-b-btn-success";
                textColorClass = "text-btn-success";
                btnColor = "success";
            }

            return (
                <Modal
                    isOpen={true}
                    onClose={() => setConfirmPendingStatus(null)}
                    size="md"
                    className={`border-b-[6px] ${borderColorClass}`}
                    headerClassName="bg-surface-dark text-white border-none py-4"
                    title={
                        <div className="flex items-center gap-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                            </svg>
                            KONFIRMASI UPDATE STATUS
                        </div>
                    }
                >
                    <div className="text-center pt-2">
                            <h2 className="text-[15px] font-bold text-surface-dark mb-6">
                                Apakah Anda yakin ingin memperbarui status penanganan laporan ini?
                            </h2>

                            <div className="bg-neutral-50 border border-neutral-100 px-6 py-5 mb-6 text-sm flex flex-col gap-5 relative opacity-90 rounded">
                                <div>
                                    <span className="text-[9px] text-gray-400 uppercase tracking-[0.15em] block font-bold mb-1.5">Lokasi</span>
                                    <span className="font-bold text-surface-dark text-[15px]">{report.sourceName}</span>
                                </div>
                                <div className="border-t border-neutral-200" />
                                <div>
                                    <span className="text-[9px] text-gray-400 uppercase tracking-[0.15em] block font-bold mb-1.5">Waktu Kejadian</span>
                                    <span className="font-bold text-surface-dark text-[15px]">{formattedDate}</span>
                                </div>
                                <div className="border-t border-neutral-200" />
                                <div>
                                    <span className="text-[9px] text-gray-400 uppercase tracking-[0.15em] block font-bold mb-1.5">Status</span>
                                    <span className={`font-bold text-[15px] ${textColorClass}`}>{statusLabel}</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-left text-gray-500 italic flex items-start gap-2 mb-8 leading-relaxed">
                                <span className="bg-gray-400 text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0 not-italic text-[10px] uppercase font-bold mt-0.5">!</span>
                                Data yang dikirimkan akan segera didistribusikan ke unit tanggap darurat terkait. Pastikan seluruh informasi sudah akurat.
                            </p>

                            <div className="flex flex-col gap-3">
                                <Button color={btnColor} fullWidth onClick={executeUpdateStatus} className="uppercase font-bold tracking-widest py-4 hover:brightness-90">
                                    Konfirmasi Update Status <span className="ml-[2px] tracking-normal mb-[1px]">➤</span>
                                </Button>
                                <Button variant="outline" color="neutral" fullWidth onClick={() => setConfirmPendingStatus(null)} className="uppercase font-bold tracking-widest py-4 border-gray-200 text-gray-400 hover:text-gray-600">
                                    Batal
                                </Button>
                            </div>
                    </div>
                </Modal>
            )
        }

		return (
			<Modal
				isOpen={true}
				onClose={onClose}
				size="lg"
				title={
                    <div className="flex items-center gap-2.5 text-surface-dark tracking-wide uppercase text-[15px] font-bold">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="2"></circle>
                            <path d="M16 8a6 6 0 0 1 0 8"></path>
                            <path d="M20 4a11 11 0 0 1 0 16"></path>
                            <path d="M8 8a6 6 0 0 0 0 8"></path>
                            <path d="M4 4A11 11 0 0 0 4 20"></path>
                        </svg>
                        DETAIL LAPORAN KEJADIAN
                    </div>
                }
				footer={
					<div className="flex w-full gap-3 pt-2">
						<Button
							color="warning"
							className="flex-1 font-bold text-xs uppercase py-3.5"
							onClick={() =>
								setConfirmPendingStatus(
									enumMap.statusPenanganan.STATUS_SEDANG_PROSES
								)
							}
						>
							SEDANG PROSES
						</Button>
						<Button
							color="success"
							className="flex-1 font-bold text-xs uppercase py-3.5"
							onClick={() =>
								setConfirmPendingStatus(
									enumMap.statusPenanganan
										.STATUS_SUDAH_DIATASI
								)
							}
						>
							SUDAH DIATASI
						</Button>
						<Button
							color="error"
							className="flex-1 font-bold text-xs uppercase py-3.5"
							onClick={() =>
								setConfirmPendingStatus(
									enumMap.statusPenanganan.STATUS_GAGAL_TERATASI
								)
							}
						>
							GAGAL TERATASI
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-7 pt-2">
                    {/* Status Top Box */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                        <div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">
                                Status Saat Ini
                            </span>
                            <StatusBadge level={report.statusLevel} />
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5 font-bold">
                                Update Terakhir
                            </span>
                            <span className="text-sm font-bold text-surface-dark">
                                {formattedDate}
                            </span>
                        </div>
                    </div>

                    {/* Informasi Lokasi */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-5 px-1">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor" className="text-surface-dark"
                                strokeWidth="2.5"
                            >
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <h3 className="text-sm font-bold text-surface-dark uppercase tracking-wide">
                                Informasi Lokasi
                            </h3>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100 text-[13.5px]">
                            <span className="text-gray-500">
                                Jenis Bencana
                            </span>
                            <span className="font-bold text-surface-dark uppercase">
                                {report.bencanaType}
                            </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100 text-[13.5px]">
                            <span className="text-gray-500">Coordinate</span>
                            <span className="font-bold text-surface-dark">
                                {report.latitude}, {report.longitude}
                            </span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-gray-100 text-[13.5px]">
                            <span className="text-gray-500">Region</span>
                            <span className="font-bold text-surface-dark">
                                {report.sourceName}
                            </span>
                        </div>
                    </div>

                    {/* Detail Observasi */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2.5 mb-5 px-1">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor" className="text-surface-dark"
                                strokeWidth="2.5"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            <h3 className="text-sm font-bold text-surface-dark uppercase tracking-wide">
                                Detail Laporan Observasi
                            </h3>
                        </div>
                        <div className="bg-gray-50/50 border border-gray-100 rounded p-6 text-[13.5px] text-gray-500 leading-relaxed shadow-sm">
                            {report.observationDetail ||
                                "Tidak ada catatan observasi untuk laporan ini."}
                        </div>
                    </div>
                </div>
			</Modal>
		);
	}
);

ReportDetailModal.displayName = "ReportDetailModal";
export default ReportDetailModal;
