import { useState } from "react";

import Navbar from "@component/layout/Navbar";
import Footer from "@component/layout/Footer";
import DashboardHeader from "@component/dashboard/DashboardHeader";
import SummaryCards from "@component/dashboard/SummaryCards";
import DisasterTable from "@component/table/DisasterTable";
import ActivityLog from "@component/activity/ActivityLog";
import DangerAlert from "@component/alert/DangerAlert";

import { useDisasterStore } from "@store/useDisasterStore";
import { enumMap } from "@constants/stream.constants";

/**
 * Root App FE 1 — Pusat Komando Bencana Nasional.
 * Merakit seluruh komponen layout, dashboard, tabel, activity log, dan alert.
 */
export default function App() {
	const [dangerAlert, setDangerAlert] = useState<{
		sourceName: string;
		message: string;
	} | null>(null);

	// Simulasi data dummy untuk demo UI (akan digantikan oleh gRPC stream nanti)
	const applyIncomingReport = useDisasterStore((s) => s.applyIncomingReport);

	const handleSeedDummyData = () => {
		const dummyReports = [
			{
				id: "STREAM-MERAPI-01",
				originId: "SENSOR-MERAPI-01",
				sourceName: "Gunung Merapi - Sensor sektor 1",
				latitude: "-7.5407",
				longitude: "110.4457",
				bencanaType: "Gempa Bumi",
				statusLevel: enumMap.levelBencana.LEVEL_BAHAYA,
				statusPenanganan: enumMap.statusPenanganan.STATUS_AKTIF_BARU,
				observationDetail: "",
				timestamp: new Date().toISOString()
			},
			{
				id: "STREAM-GEDE-01",
				originId: "SENSOR-GEDE-01",
				sourceName: "Gunung Gede - Pos 1",
				latitude: "-6.0594",
				longitude: "105.8897",
				bencanaType: "Longsor",
				statusLevel: enumMap.levelBencana.LEVEL_NORMAL,
				statusPenanganan: enumMap.statusPenanganan.STATUS_AKTIF_BARU,
				observationDetail: "",
				timestamp: new Date().toISOString()
			},
			{
				id: "STREAM-CIREMAI-02",
				originId: "SENSOR-CIREMAI-02",
				sourceName: "Gunung Ciremai - Pos 2",
				latitude: "0.5071",
				longitude: "116.4112",
				bencanaType: "Longsor",
				statusLevel: enumMap.levelBencana.LEVEL_WASPADA,
				statusPenanganan: enumMap.statusPenanganan.STATUS_AKTIF_BARU,
				observationDetail: "",
				timestamp: new Date().toISOString()
			},
			{
				id: "MANUAL-CIREMAI-POS1-NORMAL",
				originId: "POSKO-CIREMAI-01",
				sourceName: "Gunung ciremai - Pos 1",
				latitude: "-6.8161",
				longitude: "107.6191",
				bencanaType: "Gempa Bumi",
				statusLevel: enumMap.levelBencana.LEVEL_NORMAL,
				statusPenanganan: enumMap.statusPenanganan.STATUS_SUDAH_DIATASI,
				observationDetail:
					"Berdasarkan pantauan di lapangan, debit air sungai Ciliwung mengalami peningkatan signifikan akibat curah hujan yang sangat tinggi di daerah hulu (Puncak).",
				timestamp: new Date().toISOString()
			}
		];

		dummyReports.forEach((r) => applyIncomingReport(r));

		// Simulasi alert bahaya untuk demo
		setDangerAlert({
			sourceName: "Sensor Gunung Merapi",
			message: "mendeteksi aktivitas bahaya!"
		});
	};

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
					onDismiss={() => setDangerAlert(null)}
					onDetail={() => {
						setDangerAlert(null);
					}}
				/>
			)}
		</div>
	);
}
