/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Root Aplikasi FE 1 (Pusat Komando Bencana Nasional).
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal.
 * - 0.2.0 (31-03-2026): Refactor — logika dummy data dipindah ke useDummyData hook.
 * - 0.3.0 (31-03-2026): Integrasi useDisasterSync (gRPC + WebDDS).
 */
import ActivityLog from "@component/activity/ActivityLog";
import DangerAlert from "@component/alert/DangerAlert";
import DashboardHeader from "@component/dashboard/DashboardHeader";
import SummaryCards from "@component/dashboard/SummaryCards";
import Footer from "@component/layout/Footer";
import Navbar from "@component/layout/Navbar";
import DisasterTable from "@component/table/DisasterTable";

import { useDisasterSync } from "./hooks/useDisasterSync";
import { useDisasterStore } from "./store/useDisasterStore";

/**
 * Root App FE 1 — Pusat Komando Bencana Nasional.
 * Merakit seluruh komponen layout, dashboard, tabel, activity log, dan alert.
 * @returns Komponen aplikasi yang telah dirender.
 */
export default function App() {
	const dangerAlert = useDisasterStore((s) => s.dangerAlert);
	const setDangerAlert = useDisasterStore((s) => s.setDangerAlert);
	const setSelectedReportId = useDisasterStore((s) => s.setSelectedReportId);

	/**
	 * Menghandle notifikasi DangerAlert dan mengisi selectedReportId dengan ID laporan yang sesuai.
	 * Jika dangerAlert tidak null, maka selectedReportId akan diisi dengan ID laporan yang sesuai
	 * dan dangerAlert akan di-set menjadi null.
	 */
	const handleAlertDetail = () => {
		if (dangerAlert) {
			setSelectedReportId(dangerAlert.id);
			setDangerAlert(null);
		}
	};

	/**
	 * Mengdismiss notifikasi DangerAlert.
	 * Ketika tombol dismiss di klik, maka dangerAlert akan di-set menjadi null.
	 * @returns void
	 */
	const dismissAlert = () => setDangerAlert(null);

	/** Menghubungkan data masuk dari WebDDS ke store. */
	const { connectionStatus } = useDisasterSync();
	console.log("[App] Status koneksi WebDDS:", connectionStatus);

	return (
		<div className="min-h-screen flex flex-col bg-[#f0f2f5]">
			<Navbar />

			<main className="flex-1 px-6 py-6 max-w-[1280px] mx-auto w-full">
				<DashboardHeader />
				<SummaryCards />
				<div className="flex flex-col lg:flex-row gap-5">
					<DisasterTable />
					<ActivityLog />
				</div>
			</main>

			<Footer />

			{dangerAlert && (
				<DangerAlert
					sourceName={dangerAlert.sourceName}
					message={dangerAlert.message}
					onDismiss={dismissAlert}
					onDetail={handleAlertDetail}
				/>
			)}
		</div>
	);
}
