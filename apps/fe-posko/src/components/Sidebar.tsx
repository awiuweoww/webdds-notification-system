/**
 * Created Date       : 31-03-2026
 * Description        : Sidebar component for displaying activity logs and system statuses.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal Sidebar.
 */
import React from "react";

const LOGS = [
  { type: "NORMAL", time: "14:20:05", title: "Laporan Rutin Diterima", desc: "Koordinat 6.2088° S, 106.8456° E aman terkendali.", tagColor: "bg-[#22c55e]", borderColor: "border-[#22c55e]" },
  { type: "WARNING", time: "13:45:12", title: "Fluktuasi Sensor Terdeteksi", desc: "Peningkatan suhu di titik observasi 04-B.", tagColor: "bg-[#f59e0b]", borderColor: "border-[#f59e0b]" },
  { type: "SYSTEM", time: "12:30:00", title: "Sinkronisasi Basis Data", desc: "Seluruh data lapangan telah dicadangkan.", tagColor: "bg-[#64748b]", borderColor: "border-[#64748b]" }
];

/**
 * Sidebar component for regional activity logs.
 * @returns The rendered Sidebar component.
 */
export default function Sidebar() {
  return (
    <aside className="w-[300px] bg-[#f4f6f8] border-r border-[#e5e7eb] flex flex-col h-full shrink-0">
      <div className="px-6 py-5">
        <h2 className="text-[12px] font-bold text-[#334155] tracking-widest mb-1.5 uppercase">LOG AKTIVITAS REGIONAL</h2>
        <p className="text-[11px] text-[#475569] font-medium tracking-wide">Unit: FE 2 - Jawa Barat</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 shadow-inner pt-2">
        {LOGS.map((log, i) => (
          <div key={i} className={`bg-white rounded-sm p-4 shadow-sm border-b-[3px] ${log.borderColor} mb-2 relative group`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-sm uppercase tracking-wider ${log.tagColor}`}>
                {log.type}
              </span>
              <span className="text-[10px] text-[#94a3b8] font-semibold tracking-wide">{log.time}</span>
            </div>
            <h4 className="text-[12px] font-bold text-[#1e293b] mb-1.5 leading-tight">{log.title}</h4>
            <p className="text-[11px] text-[#64748b] leading-relaxed">{log.desc}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
