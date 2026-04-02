/**
 * Created Date       : 31-03-2026
 * Description        : Hook yang menghubungkan fe-posko ke WebDDS broker.
 *                      Membuka koneksi WebSocket dan subscribe ke topik status-updates.
 *
 * Alur Kerja WebDDS (Posko):
 *   1. Publish: Form Terinput -> UI -> publish() -> Broker WebDDS -> Pusat (fe-pusat) & BE.
 *   2. Subscribe: Pusat Update Status -> Broker WebDDS -> usePoskoSync -> useNotifStore.
 *   3. QoS: Memastikan laporan terkirim (Reliable) dan status update diterima meski koneksi lag.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal.
 * - 0.2.0 (02-04-2026): Sinkronisasi dengan arsitektur aliran data pusat.
 */

import { useEffect, useState } from "react";
import { useNotifStore } from "../store/useNotifStore";
import * as webddsService from "../utils/api/disaster.webdds";
import { WEBDDS_TOPICS } from "../utils/api/disaster.webdds";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

const CURRENT_POSKO_ID = "POSKO-BDG-01";

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
		webddsService.connect((status) => {
			setConnectionStatus(status === "connected" ? "connected" : status);
			console.log(`[Posko Sync] Status WebDDS: ${status}`);
		});

		const unsubStatus = webddsService.subscribe(
			WEBDDS_TOPICS.STATUS_UPDATES,
			(data) => {
				const update = data as { reportId: string; newStatus: string; message: string };
				const addNotification = useNotifStore.getState().addNotification;
				addNotification({
					id: `notif-${Date.now()}`,
					reportId: update.reportId, 
					timestamp: new Date().toLocaleTimeString("id-ID"),
					title: "Update dari Pusat",
					description: update.message || `Laporan ${update.reportId} diperbarui.`,
					type: "info",
				});
				console.log("[Posko Sync] Update status dari Pusat diterima via Filter:", update);
			},
			{ field: "targetPoskoId", value: CURRENT_POSKO_ID } 
		);
		return () => {
			unsubStatus();
			webddsService.disconnect();
			console.log("[Posko Sync] Cleanup selesai.");
		};
	}, []);


	return { connectionStatus };
}
