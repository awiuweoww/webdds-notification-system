/**
 * Created Date       : 31-03-2026
 * Description        : Header component for posko displaying logo, title, and notifications.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal Header.
 */
import React from "react";
import { Bell, User, CheckCircle2, X } from "lucide-react";
import logo from "../assets/images/logo-len.png";

/**
 * Notification item in the dropdown list.
 * @param props - Notification data.
 * @param props.title - Notification title.
 * @param props.time - Notification time.
 * @param props.status - Detail status.
 * @returns The rendered NotificationItem.
 */
function NotificationItem({ title, time, status }: { title: string; time: string; status: string }) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-md group transition-colors">
      <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-800 mb-0.5">{title}</h4>
        <p className="text-[10px] text-gray-500">{time} - {status}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Main application header with notifications toggle.
 * @param props - Component props.
 * @param props.showNotifications - Boolean to show/hide notifications.
 * @param props.setShowNotifications - Setter for showNotifications state.
 * @returns The rendered Header component.
 */
export default function Header({ showNotifications, setShowNotifications }: { showNotifications: boolean; setShowNotifications: (v: boolean) => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white relative z-50">
      <div className="flex items-center gap-3">
        {/* If image doesn't load gracefully, it shows an alt. Let's ensure a fallback icon if preferred, but img is okay */}
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <h1 className="text-[17px] font-bold tracking-wider text-gray-800">POSKO DAERAH: UNIT BANDUNG</h1>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right flex flex-col justify-center">
          <span className="text-[11px] font-bold text-gray-800 tracking-wide">OPERATOR FIELD</span>
          <span className="text-[10px] text-gray-400 font-medium">ID: FE2-09928</span>
        </div>
        
        <div className="relative">
          <button 
            type="button" 
            className="relative p-1.5 text-gray-800 hover:text-black transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#d32f2f] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-md overflow-hidden pb-2">
               <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="text-[11px] font-bold text-gray-800 tracking-wider">NOTIFIKASI LAPORAN</h3>
                  <button className="text-[10px] font-bold text-gray-500 hover:text-gray-800 tracking-wide">BERSIHKAN SEMUA</button>
               </div>
               <div className="flex flex-col px-2 pt-2">
                  <NotificationItem title="Laporan Sensor 04-B: Normal" time="14:45" status="Status diatasi secara sistem" />
                  <NotificationItem title="Sinkronisasi Unit FE 2 Selesai" time="14:12" status="Data berhasil diverifikasi" />
               </div>
            </div>
          )}
        </div>
        
        <button type="button" className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors">
           <User size={18} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}
