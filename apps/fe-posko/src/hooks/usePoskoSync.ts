/**
 * Created Date       : 31-03-2026
 * Description        : Hook yang menghubungkan fe-posko ke WebDDS broker.
 *                      Membuka koneksi WebSocket dan subscribe ke topik status-updates.
 *
 * Perbedaan dengan useDisasterSync (fe-pusat):
 *   - fe-pusat: subscribe disaster-reports + sensor-stream (menerima data)
 *   - fe-posko: subscribe status-updates (menerima respons Pusat) + publish disaster-reports
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal.
 */
import { useEffect, useState } from "react";
import { useNotifStore } from "../store/useNotifStore";
import * as webddsService from "../utils/api/disaster.webdds";
import { WEBDDS_TOPICS } from "../utils/api/disaster.webdds";

/** Status koneksi WebDDS yang bisa ditampilkan di UI. */
type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error" | "simulation";


/**
 * Hook yang menghubungkan fe-posko ke WebDDS broker.
 * Membuka koneksi WebSocket dan subscribe ke topik status-updates.
 *
 * Perbedaan dengan useDisasterSync (fe-pusat):
 *   - fe-pusat: subscribe disaster-reports + sensor-stream (menerima data)
 *   - fe-posko: subscribe status-updates (menerima respons Pusat) + publish disaster-reports
 *
 * @returns Nilai yang berisi status koneksi WebDDS, berupa "connecting", "connected", "disconnected", "error", atau "simulation".
 */
export function usePoskoSync(): { connectionStatus: ConnectionStatus } {
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");

	useEffect(() => {
		/** Buka koneksi ke broker WebDDS. */
		webddsService.connect((status) => {
			setConnectionStatus(status === "connected" ? "connected" : status);
			console.log(`[Posko Sync] Status WebDDS: ${status}`);
		});

		/** Subscribe ke topik status-updates untuk menerima update dari Pusat. */
		const unsubStatus = webddsService.subscribe(
			WEBDDS_TOPICS.STATUS_UPDATES,
			(data) => {
				/** Proses data update status dari Pusat. */
				const update = data as { reportId: string; newStatus: string; message: string };
				const addNotification = useNotifStore.getState().addNotification;
				addNotification({
					id: `notif-${Date.now()}`,
					timestamp: new Date().toLocaleTimeString("id-ID"),
					title: "Update dari Pusat",
					description: update.message || `Laporan ${update.reportId} diperbarui.`,
					type: "info",
				});
				console.log("[Posko Sync] Update status dari Pusat:", update);
			}
		);
		return () => {
			unsubStatus();
			webddsService.disconnect();
			console.log("[Posko Sync] Cleanup selesai.");
		};
	}, []);

	/** Cek apakah sedang dalam mode simulasi  */
	useEffect(() => {
		const status = webddsService.getConnectionStatus();
		if (status === "simulation") {
			setConnectionStatus("simulation");
		}
	}, []);

	return { connectionStatus };
}
