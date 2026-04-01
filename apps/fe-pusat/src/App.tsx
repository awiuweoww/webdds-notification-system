/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Root Aplikasi FE 1 (Pusat Komando Bencana Nasional).
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal.
 * - 0.2.0 (31-03-2026): Refactor — logika dummy data dipindah ke useDummyData hook.
 * - 0.3.0 (31-03-2026): Integrasi useDisasterSync (gRPC + WebDDS).
 */
import Navbar from "@component/layout/Navbar";
import Footer from "@component/layout/Footer";
import DashboardHeader from "@component/dashboard/DashboardHeader";
import SummaryCards from "@component/dashboard/SummaryCards";
import DisasterTable from "@component/table/DisasterTable";
import ActivityLog from "@component/activity/ActivityLog";
import DangerAlert from "@component/alert/DangerAlert";
import { useDummyData } from "./hooks/useDummyData";
import { useDisasterSync } from "./hooks/useDisasterSync";
import { useDisasterStore } from "./store/useDisasterStore";

/**
 * Root App FE 1 — Pusat Komando Bencana Nasional.
 * Merakit seluruh komponen layout, dashboard, tabel, activity log, dan alert.
 * @returns Komponen aplikasi yang telah dirender.
 */
export default function App() {
	const { handleSeedDummyData } = useDummyData();
	const dangerAlert = useDisasterStore((s) => s.dangerAlert);
	const setDangerAlert = useDisasterStore((s) => s.setDangerAlert);
	const setSelectedReportId = useDisasterStore((s) => s.setSelectedReportId);

	const handleAlertDetail = () => {
		if (dangerAlert) {
			setSelectedReportId(dangerAlert.id);
			setDangerAlert(null);
		}
	};

	const dismissAlert = () => setDangerAlert(null);

	// Menghubungkan gRPC (data awal) + WebDDS (real-time) ke store.
	// connectionStatus bisa dipakai nanti untuk badge status di Navbar.
	const { connectionStatus } = useDisasterSync();
	console.log("[App] Status koneksi WebDDS:", connectionStatus);

	return (
		<div className="min-h-screen flex flex-col bg-[#f0f2f5]">
			<Navbar />

			<main className="flex-1 px-6 py-6 max-w-[1280px] mx-auto w-full">
				<DashboardHeader />
				<SummaryCards />

				{/* Tombol Demo Dummy — klik untuk mengisi tabel dengan data contoh */}
				<div className="mb-4">
					<button
						onClick={handleSeedDummyData}
						className="px-4 py-2 bg-[#1a2332] text-white text-xs font-semibold rounded-lg hover:bg-[#2c3e50] transition-colors"
					>
						🚀 Simulasi Data Masuk (Demo)
					</button>
				</div>

				{/* Area Tabel + Activity Log */}
				<div className="flex flex-col lg:flex-row gap-5">
					<DisasterTable />
					<ActivityLog />
				</div>
			</main>

			<Footer />

			{/* Toast Alert Bahaya */}
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
