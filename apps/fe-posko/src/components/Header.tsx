/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Header untuk posko yang menampilkan logo, judul, dan notifikasi.
 * Notifikasi diambil dari useNotifStore yang khusus menyimpan respons dari Pusat (bukan log lokal).
 *
 * Sumber data notifikasi:
 *   WebDDS topic "status-updates" → useNotifStore → Header bell icon
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal Header.
 * - 0.2.0 (31-03-2026): Refactor — notifikasi dikelola oleh useNotification hook.
 * - 0.3.0 (31-03-2026): Notifikasi terhubung ke useActivityStore (data dinamis).
 * - 0.4.0 (31-03-2026): Pisahkan notifikasi ke useNotifStore (hanya respons Pusat).
 */
import React, { useState } from "react";

import { AlertTriangle, Bell, CheckCircle2, Info, User } from "lucide-react";

import logo from "../assets/images/logo-len.png";
import Modal from "../common/modal/Modal";
import { useNotification } from "../hooks/useNotification";
import { useNotifStore } from "../store/useNotifStore";
import type { PusatNotification } from "../store/useNotifStore";


const notifStyle: Record<
	PusatNotification["type"],
	{ color: string; Icon: React.ElementType }
> = {
	info: { color: "text-blue-500", Icon: Info },
	success: { color: "text-green-500", Icon: CheckCircle2 },
	warning: { color: "text-yellow-500", Icon: AlertTriangle }
};

/**
 * Item notifikasi dalam dropdown.
 * @param root0 - Objek properti.
 * @param root0.notif - Entri notifikasi dari Pusat.
 * @param root0.onClick - Fungsi saat item diklik.
 * @returns NotificationItem yang telah dirender.
 */
function NotificationItem({
	notif,
	onClick
}: {
	notif: PusatNotification;
	onClick?: () => void;
}) {
	const style = notifStyle[notif.type] || notifStyle.info;
	const IconComp = style.Icon;
	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-full text-left flex items-start gap-3 p-3 rounded-none transition-colors ${notif.isRead ? "opacity-60" : "hover:bg-gray-50"}`}
		>
			<IconComp size={16} className={`${style.color} mt-0.5 shrink-0`} />
			<div className="flex-1">
				<h4 className="text-xs font-bold text-gray-800 mb-0.5">
					{notif.title}
				</h4>
				<p className="text-[10px] text-gray-500 line-clamp-2">
					{notif.timestamp} — {notif.description}
				</p>
			</div>
			{!notif.isRead && (
				<span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
			)}
		</button>
	);
}

/**
 * Header utama aplikasi dengan toggle notifikasi.
 * Notifikasi hanya menampilkan respons dari Pusat (bukan log lokal).
 * @returns Komponen Header yang telah dirender.
 */
export default function Header() {
	const { showNotifications, toggleNotifications } = useNotification();
	const [selectedNotif, setSelectedNotif] = useState<PusatNotification | null>(
		null
	);


	const notifications = useNotifStore((s) => s.notifications);
	const unreadCount = useNotifStore((s) => s.unreadCount);
	const markAsRead = useNotifStore((s) => s.markAsRead);
	const clearAll = useNotifStore((s) => s.clearAll);
	const recentNotifs = notifications.slice(0, 5);

	/**
	 * Toggle visibilitas dropdown notifikasi.
	 * Jika di-*toggle*, maka notifikasi akan ditampilkan atau disembunyikan.
	 * Jika diinginkan untuk otomatis satu per satu/all saat dropdown dibuka,
	 * maka gunakan fungsi markAllAsRead() untuk mengubah status semua notifikasi menjadi
	 * telah dibaca.
	 */
	const handleToggle = () => {
		toggleNotifications();
	};

	return (
		<header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white relative z-50">
			<div className="flex items-center gap-3">
				<img
					src={logo}
					alt="Logo"
					className="w-8 h-8 object-contain"
					onError={(e) => {
						e.currentTarget.style.display = "none";
					}}
				/>
				<h1 className="text-[17px] font-bold tracking-wider text-gray-800">
					POSKO DAERAH: UNIT BANDUNG
				</h1>
			</div>
			<div className="flex items-center gap-6">
				<div className="text-right flex flex-col justify-center">
					<span className="text-[11px] font-bold text-gray-800 tracking-wide">
						OPERATOR FIELD
					</span>
					<span className="text-[10px] text-gray-400 font-medium">
						ID: FE2-09928
					</span>
				</div>

				<div className="relative">
					<button
						type="button"
						className="relative p-1.5 text-gray-800 hover:text-black transition-colors"
						onClick={handleToggle}
					>
						<Bell size={20} strokeWidth={2.5} />
						{unreadCount > 0 && (
							<span className="absolute top-0 right-0 w-[18px] h-[18px] bg-[#d32f2f] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
								{unreadCount > 99 ? "99+" : unreadCount}
							</span>
						)}
					</button>

					{showNotifications && (
						<div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-none overflow-hidden pb-2">
							<div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
								<h3 className="text-[11px] font-bold text-gray-800 tracking-wider">
									RESPONS PUSAT
								</h3>
								<button
									className="text-[10px] font-bold text-gray-500 hover:text-gray-800 tracking-wide"
									onClick={clearAll}
								>
									BERSIHKAN
								</button>
							</div>
							<div className="flex flex-col px-2 pt-2">
								{recentNotifs.length === 0 && (
									<div className="p-4 text-center text-[11px] text-gray-400">
										Belum ada respons dari Pusat.
									</div>
								)}
								{recentNotifs.map((notif) => (
									<NotificationItem
										key={notif.id}
										notif={notif}
										onClick={() => {
											markAsRead(notif.id);
											setSelectedNotif(notif);
											if (showNotifications) toggleNotifications();
										}}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				<button
					type="button"
					className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors"
				>
					<User size={18} strokeWidth={2.5} />
				</button>
			</div>

			{selectedNotif && (
				<Modal
					isOpen={true}
					onClose={() => setSelectedNotif(null)}
					size="md"
					headerClassName="bg-[#1e293b] text-white border-none py-4"
					className="border-b-[6px] border-[#1e293b]"
					title={
						<div className="flex items-center gap-2 text-white tracking-wide uppercase text-[15px] font-bold">
							<Info size={18} strokeWidth={2.5} />
							DETAIL RESPONS PUSAT
						</div>
					}
				>
					<div className="flex flex-col gap-5 pt-2">
						<div className="bg-gray-50 border border-gray-100 rounded-none p-5 text-sm">
							<div className="mb-4 text-center">
								{(() => {
									const style =
										notifStyle[selectedNotif.type] || notifStyle.info;
									const ModalIconComp = style.Icon;
									return (
										<ModalIconComp
											size={48}
											className={`mx-auto mb-3 ${style.color}`}
											strokeWidth={1.5}
										/>
									);
								})()}
								<h3 className="font-bold text-gray-800 text-[16px]">
									{selectedNotif.title}
								</h3>
								<span className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">
									{selectedNotif.timestamp}
								</span>
							</div>
							<div className="border-t border-gray-200 pt-4">
								<p className="text-gray-600 leading-relaxed text-[13.5px]">
									{selectedNotif.description}
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={() => setSelectedNotif(null)}
							className="w-full h-11 bg-white border border-gray-300 text-gray-700 font-bold uppercase tracking-widest text-[11px] rounded-none transition-colors hover:bg-gray-50"
						>
							Tutup
						</button>
					</div>
				</Modal>
			)}
		</header>
	);
}
