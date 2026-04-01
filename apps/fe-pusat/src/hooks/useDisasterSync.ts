/**
 * Created Date       : 31-03-2026
 * Description        : Hook gabungan yang mengoordinasikan gRPC dan WebDDS service.
 *                      Menjadi satu-satunya "pintu masuk" bagi komponen UI
 *                      untuk berkomunikasi dengan backend dan menerima data real-time.
 *
 * Arsitektur:
 *   ┌─────────────────────────────────────────────────────┐
 *   │                useDisasterSync (Hook ini)           │
 *   │                                                     │
 *   │  ┌──────────────────┐    ┌────────────────────┐     │
 *   │  │  disaster.grpc   │    │  disaster.webdds   │     │
 *   │  │  (Request/Res)   │    │  (Pub/Sub)         │     │
 *   │  └────────┬─────────┘    └─────────┬──────────┘     │
 *   │           │                        │                │
 *   │           └──── useDisasterStore ──┘                │
 *   │                  (Sumber Kebenaran)                  │
 *   └─────────────────────────────────────────────────────┘
 *
 * Cara Pakai:
 *   Cukup panggil sekali di komponen root (App.tsx):
 *
 *   ```tsx
 *   function App() {
 *     const { connectionStatus } = useDisasterSync();
 *     // ... render UI ...
 *   }
 *   ```
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal.
 */

import { useEffect, useState } from "react";

import { useDisasterStore } from "@store/useDisasterStore";
import { enumMap } from "../constants/stream.constants";
import type { DisasterReport } from "@store/useDisasterStore";
import * as grpcService from "../utils/api/disaster.grpc";
import * as webddsService from "../utils/api/disaster.webdds";
import { WEBDDS_TOPICS } from "../utils/api/disaster.webdds";


type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error" | "simulation";

interface UseDisasterSyncReturn {
	/** Status koneksi WebDDS saat ini. */
	connectionStatus: ConnectionStatus;
}


/**
 * Hook utama yang menghubungkan kedua service layer ke store.
 *
 * Tugas hook ini:
 * 1. Saat mount  → Ambil data awal dari BE via gRPC (GetAllReports).
 * 2. Saat mount  → Buka koneksi WebDDS dan subscribe ke topik-topik real-time.
 * 3. Data masuk  → Teruskan ke useDisasterStore.applyIncomingReport().
 * 4. Saat unmount → Tutup koneksi WebDDS dan bersihkan listener.
 *
 * @returns Objek berisi status koneksi.
 */
export function useDisasterSync(): UseDisasterSyncReturn {
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
	const applyIncomingReport = useDisasterStore((s) => s.applyIncomingReport);
	const setLoading = useDisasterStore((s) => s.setLoading);
	const setError = useDisasterStore((s) => s.setError);

	useEffect(() => {
		/** Mengambil data awal dari gRPC dan memasukkan ke store. */
		const fetchInitialData = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await grpcService.getAllReports();
				response.reports.forEach((report) => {
					applyIncomingReport(report);
				});

				console.log(
					`[Sync] Data awal dimuat: ${response.reports.length} laporan dari gRPC.`
				);
			} catch (err) {
				const errorMsg = err instanceof Error ? err.message : "Gagal memuat data awal.";
				console.error("[Sync] Gagal fetch data awal:", errorMsg);
				setError(errorMsg);
			} finally {
				setLoading(false);
			}
		};

		void fetchInitialData();



		/**  Buka koneksi ke broker dan pantau statusnya. */
		webddsService.connect((status) => {
			setConnectionStatus(status === "connected" ? "connected" : status);
			console.log(`[Sync] Status WebDDS: ${status}`);
		});

		/** Subscribe topik "disaster-reports" — laporan manual dari Posko. */
		const unsubReports = webddsService.subscribe(
			WEBDDS_TOPICS.DISASTER_REPORTS,
			(report) => {
				const data = report as DisasterReport;
				console.log("[Sync] Data baru dari Posko diterima via WebDDS:", data.id);
				
				const previousState = useDisasterStore.getState().reportsById[data.id];
				const isNewOrChangedToAwas = !previousState || (previousState.statusLevel !== enumMap.levelBencana.LEVEL_AWAS && data.statusLevel === enumMap.levelBencana.LEVEL_AWAS);
				
				applyIncomingReport(data);

				if (isNewOrChangedToAwas && data.statusLevel === enumMap.levelBencana.LEVEL_AWAS) {
					useDisasterStore.getState().setDangerAlert({
						id: data.id,
						sourceName: data.sourceName,
						message: "melaporkan status AWAS (Kritis)!"
					});
				}
			}
		);

		/**  Subscribe topik "sensor-stream" — data sensor dari BE. */
		const unsubSensor = webddsService.subscribe(
			WEBDDS_TOPICS.SENSOR_STREAM,
			(report) => {
				const data = report as DisasterReport;
				const previousState = useDisasterStore.getState().reportsById[data.id];
				const isNewOrChangedToAwas = !previousState || (previousState.statusLevel !== enumMap.levelBencana.LEVEL_AWAS && data.statusLevel === enumMap.levelBencana.LEVEL_AWAS);
				
				applyIncomingReport(data);

				if (isNewOrChangedToAwas && data.statusLevel === enumMap.levelBencana.LEVEL_AWAS) {
					useDisasterStore.getState().setDangerAlert({
						id: data.id,
						sourceName: data.sourceName,
						message: "mendeteksi lonjakan sinyal AWAS (Bahaya)!"
					});
				}
			}
		);
		return () => {
			unsubReports();
			unsubSensor();
			webddsService.disconnect();
			console.log("[Sync] Cleanup: semua listener dibersihkan.");
		};
	}, [applyIncomingReport, setLoading, setError]);


	useEffect(() => {
		const status = webddsService.getConnectionStatus();
		if (status === "simulation") {
			setConnectionStatus("simulation");
		}
	}, []);

	return { connectionStatus };
}
