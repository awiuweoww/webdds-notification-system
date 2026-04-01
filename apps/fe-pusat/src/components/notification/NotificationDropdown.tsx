/**
 * Created Date       : 31-03-2026
 * Description        : Komponen NotificationDropdown untuk menampilkan daftar notifikasi popover.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal NotificationDropdown.
 */
import { memo, useRef, useEffect } from "react";
import { useDisasterStore, selectUnreadReportsList } from "@store/useDisasterStore";
import { enumMap } from "@constants/stream.constants";

interface NotificationDropdownProps {
    show: boolean;
    onClose: () => void;
}

const NotificationDropdown = memo(({ show, onClose }: NotificationDropdownProps) => {
    const notifRef = useRef<HTMLDivElement>(null);
    const unreadReports = useDisasterStore(selectUnreadReportsList);
    const setSelectedReportId = useDisasterStore((state) => state.setSelectedReportId);
    const markAsRead = useDisasterStore((state) => state.markAsRead);
    const markAllAsRead = useDisasterStore((state) => state.markAllAsRead);

    useEffect(() => {
/**
 * Fungsi untuk menangani klik di luar komponen NotificationDropdown.
 * Jika klik terjadi di luar komponen, maka fungsi onClose akan dijalankan.
 * Fungsi ini digunakan untuk menutup komponen NotificationDropdown secara otomatis ketika klik terjadi di luar komponen.
 * @param {MouseEvent} event - Objek event klik.
 */
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        
        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);

    if (!show) return null;

    const latestReports = [...unreadReports]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

/**
 * Fungsi untuk menghapus semua notifikasi yang belum dibaca.
 * Dipanggil saat button "Mark all as read" diklik.
 * Fungsi ini akan menghapus semua notifikasi yang belum dibaca dan menutup komponen NotificationDropdown secara otomatis.
 */
    const handleMarkAllRead = () => {
        markAllAsRead();
        onClose();
    };

    return (
        <div ref={notifRef} className="absolute right-0 mt-3 w-[360px] bg-white rounded-lg shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50 bg-white shadow-sm z-10">
                <h3 className="font-bold text-sm text-surface-dark">Notifikasi</h3>
                <button 
                    className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 tracking-wide" 
                    onClick={handleMarkAllRead}
                >
                    Tandai dibaca
                </button>
            </div>

            <div className="flex flex-col max-h-[400px] overflow-y-auto w-full text-left">
                {latestReports.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-400">Belum ada notifikasi baru.</div>
                )}
                {latestReports.map((report) => {
                    const isDanger = report.statusLevel === enumMap.levelBencana.LEVEL_SIAGA || report.statusLevel === enumMap.levelBencana.LEVEL_AWAS;
                    const isWarning = report.statusLevel === enumMap.levelBencana.LEVEL_WASPADA;
                    const isResolved = report.statusPenanganan === enumMap.statusPenanganan.STATUS_SUDAH_DIATASI || report.statusPenanganan === enumMap.statusPenanganan.STATUS_GAGAL_TERATASI;
                    
                    let bgClass = "bg-white hover:bg-gray-50";
                    let iconBg = "bg-neutral-2";
                    let textColor = "text-gray-500";
                    let iconNode = (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    );

                    if (isResolved) {
                        iconBg = "bg-btn-success";
                        iconNode = (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        );
                    } else if (isDanger) {
                        bgClass = "bg-red-50/40 hover:bg-red-50/60";
                        iconBg = "bg-btn-error";
                        textColor = "text-btn-error";
                        iconNode = (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        );
                    } else if (isWarning) {
                        iconBg = "bg-yellow";
                        textColor = "text-yellow";
                        iconNode = (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        );
                    }

                    return (
                        <div 
                            key={report.id} 
                            onClick={() => { 
                                markAsRead(report.id);
                                setSelectedReportId(report.id); 
                                onClose(); 
                            }} 
                            className={`flex gap-4 p-6 border-b border-gray-50 cursor-pointer transition-colors w-full ${bgClass}`}
                        >
                            <div className={`w-[30px] h-[30px] rounded ${iconBg} flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm`}>
                                {iconNode}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[13px] font-bold text-surface-dark mb-0.5 tracking-wide pt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                                    Laporan Masuk
                                </h4>
                                <p className={`text-[11.5px] ${textColor} leading-relaxed mb-2 font-medium`}>{report.bencanaType} di {report.sourceName}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

NotificationDropdown.displayName = "NotificationDropdown";
export default NotificationDropdown;
