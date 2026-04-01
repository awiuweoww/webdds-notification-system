/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Form Utama untuk pelaporan bencana, mengintegrasikan input koordinat cerdas dan dropdown semantik.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal MainForm dan input koordinat.
 * - 0.2.0 (31-03-2026): Refactor — logika dipindah ke useDisasterForm dan utils/statusColor.
 */
import React from "react";

import {
	CloudUpload,
	Compass,
	MapPin,
	Send,
	Shield,
	ShieldCheck
} from "lucide-react";

import { bgColor, textColor } from "../constants/colors.constant";
import { useDisasterForm } from "../hooks/useDisasterForm";
import { getStatusColor } from "../utils/statusColor";

/**
 * Komponen Form Utama untuk pelaporan bencana, mengintegrasikan input koordinat cerdas dan dropdown semantik.
 *
 * @returns {JSX.Element} Komponen Form Utama
 * @example
 * <MainForm />
 */
export default function MainForm() {
	const {
		jenisBencana,
		setJenisBencana,
		statusLevel,
		isStatusOpen,
		detail,
		setDetail,
		showSuccess,
		isFormComplete,
		formattedCoord,
		latCoord,
		lngCoord,
		handleSubmit,
		handleReset,
		toggleStatusOpen,
		selectStatusLevel,
		closeStatusDropdown
	} = useDisasterForm();

	return (
		<div className="w-full pt-4 pb-8">
			<div className="mb-10">
				<h2 className="text-[28px] font-bold text-[#1e293b] mb-2 tracking-tight">
					Input Laporan Bencana
				</h2>
				<p className="text-[#64748b] text-[15px] font-medium tracking-wide">
					Lengkapi parameter observasi lapangan secara presisi.
				</p>
			</div>

			<form className="flex flex-col gap-[28px]" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2.5">
					<label className="text-[11px] font-bold tracking-[0.15em] text-[#475569] uppercase">
						JENIS BENCANA
					</label>
					<div className="relative">
						<select
							className="h-[52px] w-full border border-[#cbd5e1] rounded-sm px-4 text-[13px] font-medium text-[#334155] focus:outline-none focus:border-[#64748b] bg-white shadow-sm appearance-none cursor-pointer"
							value={jenisBencana}
							onChange={(e) => setJenisBencana(e.target.value)}
						>
							<option value="" disabled>
								-- Pilih Jenis Bencana --
							</option>
							<option value="gempa_bumi">Gempa Bumi</option>
							<option value="banjir">Banjir</option>
							<option value="tanah_longsor">Tanah Longsor</option>
						</select>
						<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2.5 w-full">
					<div className="flex gap-6 w-full">
						<div className="flex flex-col gap-2.5 flex-1">
							<label className="text-[11px] font-bold tracking-[0.15em] text-[#475569] uppercase">
								LATITUDE
							</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
									<MapPin size={16} strokeWidth={2.5} />
								</div>
								<input
									type="text"
									value={latCoord.value}
									onChange={latCoord.onChange}
									onFocus={latCoord.onFocus}
									onBlur={latCoord.onBlur}
									className="h-[52px] w-full border border-[#cbd5e1] rounded-sm pl-11 pr-4 text-[13px] font-medium text-[#334155] focus:outline-none focus:border-[#64748b] bg-white shadow-sm"
									placeholder="Contoh: -6.1751"
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2.5 flex-1">
							<label className="text-[11px] font-bold tracking-[0.15em] text-[#475569] uppercase">
								LONGITUDE
							</label>
							<div className="relative">
								<div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
									<Compass size={16} strokeWidth={2.5} />
								</div>
								<input
									type="text"
									value={lngCoord.value}
									onChange={lngCoord.onChange}
									onFocus={lngCoord.onFocus}
									onBlur={lngCoord.onBlur}
									className="h-[52px] w-full border border-[#cbd5e1] rounded-sm pl-11 pr-4 text-[13px] font-medium text-[#334155] focus:outline-none focus:border-[#64748b] bg-white shadow-sm"
									placeholder="Contoh: 106.8272"
								/>
							</div>
						</div>
					</div>
					{latCoord.value && lngCoord.value && (
						<div className="px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm mt-1 text-[11px] text-[#64748b] font-medium tracking-wide flex items-center justify-between">
							<span>Koordinat Preview:</span>
							<span className="font-bold text-[#334155]">{formattedCoord}</span>
						</div>
					)}
				</div>

				<div className="flex flex-col gap-2.5">
					<label className="text-[11px] font-bold tracking-[0.15em] text-[#475569] uppercase">
						STATUS LEVEL KONDISI
					</label>
					<div className="relative">
						<div
							className={`h-[52px] w-full border ${isStatusOpen ? "border-[#64748b]" : "border-[#cbd5e1]"} rounded-sm px-4 text-[13px] font-bold bg-white shadow-sm cursor-pointer flex items-center justify-between ${getStatusColor(statusLevel)}`}
							onClick={toggleStatusOpen}
						>
							{statusLevel}
							<div
								className={`pointer-events-none text-[#94a3b8] transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
							>
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M19 9l-7 7-7-7"
									></path>
								</svg>
							</div>
						</div>

						{isStatusOpen && (
							<>
								<div
									className="fixed inset-0 z-40"
									onClick={closeStatusDropdown}
								/>
								<div className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-[#cbd5e1] rounded-sm shadow-lg z-50 overflow-hidden">
									{[
										{
											value: "Level 1: Normal / Aman",
											color: textColor.success,
											bgColor: bgColor.success,
											hoverBg: "hover:bg-btn-success/10",
											activeBg: "bg-btn-success/10"
										},
										{
											value: "Level 2: Waspada",
											color: textColor.warning,
											bgColor: bgColor.warning,
											hoverBg: "hover:bg-yellow/10",
											activeBg: "bg-yellow/10"
										},
										{
											value: "Level 3: Siaga",
											color: textColor.siaga,
											bgColor: bgColor.siaga,
											hoverBg: "hover:bg-btn-warning/10",
											activeBg: "bg-btn-warning/10"
										},
										{
											value: "Level 4: Awas",
											color: textColor.danger,
											bgColor: bgColor.danger,
											hoverBg: "hover:bg-btn-error/10",
											activeBg: "bg-btn-error/10"
										}
									].map((status) => (
										<div
											key={status.value}
											className={`px-4 py-3 text-[13px] font-semibold cursor-pointer transition-colors flex items-center gap-2 ${statusLevel === status.value ? status.activeBg + " " + status.color : "text-surface-dark hover:bg-background-200"} ${status.hoverBg}`}
											onClick={() => selectStatusLevel(status.value)}
										>
											<span
												className={`w-2 h-2 rounded-full ${status.bgColor}`}
											/>
											<span
												className={
													statusLevel === status.value ? status.color : ""
												}
											>
												{status.value}
											</span>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2.5 mb-2">
					<label className="text-[11px] font-bold tracking-[0.15em] text-[#475569] uppercase">
						DETAIL LAPORAN OBSERVASI
					</label>
					<textarea
						className="w-full min-h-[160px] border border-[#cbd5e1] rounded-sm p-4 text-[13px] font-medium text-[#334155] focus:outline-none focus:border-[#64748b] bg-white shadow-sm resize-y leading-relaxed placeholder:text-[#94a3b8]"
						placeholder="Tuliskan temuan mendetail di lapangan, anomali yang ditemukan, atau tindakan awal yang telah dilakukan..."
						value={detail}
						onChange={(e) => setDetail(e.target.value)}
					/>
				</div>

				<div className="flex gap-4">
					<button
						type="submit"
						disabled={!isFormComplete}
						className={`flex-1 h-[52px] rounded-sm flex items-center justify-center gap-2.5 font-bold tracking-[0.05em] transition-all shadow-sm text-[13px] ${
							isFormComplete
								? "bg-surface-dark text-white hover:bg-slate-800"
								: "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-100"
						}`}
					>
						<Send
							size={16}
							fill="currentColor"
							strokeWidth={1}
							className="-mt-[1px]"
						/>
						SUBMIT LAPORAN
					</button>
					<button
						type="button"
						onClick={handleReset}
						className="w-40 bg-white border border-[#cbd5e1] text-[#334155] font-bold tracking-[0.05em] h-[52px] rounded-sm hover:bg-[#f8fafc] transition-colors shadow-sm text-[13px]"
					>
						BATALKAN
					</button>
				</div>
			</form>

			<div className="mt-[72px] pt-8 border-t border-[#f1f5f9] flex items-start justify-between text-[#4b5563] px-2">
				<div className="flex gap-3 max-w-[240px]">
					<Shield
						className="mt-0.5 shrink-0 text-[#3f3f46] stroke-[2]"
						size={22}
					/>
					<div>
						<h4 className="text-[11px] font-bold tracking-wider text-[#1e293b] mb-1.5 uppercase">
							ENKRIPSI DATA
						</h4>
						<p className="text-[10px] leading-[1.6] text-[#64748b]">
							Seluruh transmisi data dilindungi.
						</p>
					</div>
				</div>
				<div className="flex gap-3 max-w-[240px]">
					<CloudUpload
						className="mt-0.5 shrink-0 text-[#3f3f46] stroke-[2]"
						size={22}
					/>
					<div>
						<h4 className="text-[11px] font-bold tracking-wider text-[#1e293b] mb-1.5 uppercase">
							AUTO-SYNC
						</h4>
						<p className="text-[10px] leading-[1.6] text-[#64748b]">
							Laporan disinkronkan langsung ke server pusat Regional 2.
						</p>
					</div>
				</div>
				<div className="flex gap-3 max-w-[240px]">
					<ShieldCheck
						className="mt-0.5 shrink-0 text-[#3f3f46] stroke-[2]"
						size={22}
					/>
					<div>
						<h4 className="text-[11px] font-bold tracking-wider text-[#1e293b] mb-1.5 uppercase">
							VERIFIKASI UNIT
						</h4>
						<p className="text-[10px] leading-[1.6] text-[#64748b]">
							Sistem memverifikasi identitas perangkat secara berkala.
						</p>
					</div>
				</div>
			</div>

			<div
				className={`fixed bottom-8 right-8 bg-[#22c55e] text-white px-5 py-4 rounded-sm shadow-xl flex items-center gap-3.5 transition-all duration-400 transform z-50 ${showSuccess ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}`}
			>
				<ShieldCheck size={22} strokeWidth={2.5} className="text-white" />
				<div>
					<h4 className="text-[13px] font-bold tracking-wide mb-0.5">
						Laporan Berhasil Terkirim
					</h4>
					<p className="text-[11px] font-medium text-white/90">
						Data lapangan telah disinkronisasikan ke Komando Pusat.
					</p>
				</div>
			</div>
		</div>
	);
}
