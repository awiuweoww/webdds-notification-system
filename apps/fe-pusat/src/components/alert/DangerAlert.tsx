/**
 * Created Date       : 31-03-2026
 * Description        : Komponen notifikasi DangerAlert untuk memberi peringatan visual darurat.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal DangerAlert.
 */
import { memo, useState, useEffect } from "react";

interface DangerAlertProps {
	message: string;
	sourceName: string;
	onDismiss: () => void;
	onDetail: () => void;
}


const DangerAlert = memo(
	({ message, sourceName, onDismiss, onDetail }: DangerAlertProps) => {
		const [isVisible, setIsVisible] = useState(false);

		useEffect(() => {
			const timeout = setTimeout(() => setIsVisible(true), 50);
			return () => clearTimeout(timeout);
		}, []);


/**
 * Menghilangkan notifikasi DangerAlert dan memanggil fungsi onDismiss setelah 200ms.
 * Fungsi ini digunakan ketika tombol "Tutup" ditekan.
 */
		const handleDismiss = () => {
			setIsVisible(false);
			setTimeout(onDismiss, 200);
		};

		return (
			<div
				className={`fixed bottom-6 right-6 z-50 w-[360px] bg-btn-error text-white rounded-xl shadow-2xl p-5 transition-all duration-300 ${
					isVisible
						? "translate-y-0 opacity-100"
						: "translate-y-4 opacity-0"
				}`}
			>
				<div className="flex items-start gap-3">
					<div className="shrink-0 mt-0.5">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z" />
							<path d="M11 10h2v5h-2z" />
							<path d="M11 17h2v2h-2z" />
						</svg>
					</div>

					<div className="flex-1">
						<h3 className="font-bold text-sm uppercase tracking-wide">
							Peringatan Kritis
						</h3>
						<p className="text-sm mt-1 opacity-90">
							{sourceName} {message}
						</p>
					</div>
				</div>

				<div className="flex gap-3 mt-4">
					<button
						onClick={onDetail}
						className="flex-1 py-2 border-2 border-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-btn-error transition-colors"
					>
						Lihat Detail
					</button>
					<button
						onClick={handleDismiss}
						className="flex-1 py-2 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-colors"
					>
						Abaikan
					</button>
				</div>
			</div>
		);
	}
);

DangerAlert.displayName = "DangerAlert";
export default DangerAlert;
