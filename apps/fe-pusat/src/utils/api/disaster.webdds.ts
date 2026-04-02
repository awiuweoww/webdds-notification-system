/**
 * Created Date       : 31-03-2026
 * Description        : Service layer untuk komunikasi WebDDS Pub/Sub real-time.
 *                      Menangani subscribe ke topik dan menerima data secara terus-menerus.
 *
 * Arsitektur:
 *   Publisher (Posko/BE) ──► WebDDS Topic ──► Subscriber (file ini) ──► Store
 *
 * Transport:
 *   WebDDS menggunakan WebSocket sebagai lapisan transport di browser.
 *   Konsep DDS (Topic, Publisher, Subscriber) diimplementasikan di atas WebSocket.
 *
 * Catatan:
 *   - Saat ini menggunakan mode SIMULASI karena WebDDS broker belum siap.
 *   - Ketika broker sudah siap, ganti transport di connect() dengan
 *     koneksi WebSocket ke broker sesungguhnya.
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal dengan mode simulasi.
 */

import type { DisasterReport } from "../../types/disaster.types";


const WEBDDS_BROKER_URL = "ws://localhost:8081";
const IS_SIMULATION = !WEBDDS_BROKER_URL;


export const WEBDDS_TOPICS = {
	/** Topik untuk laporan manual dari Posko → Pusat & BE. */
	DISASTER_REPORTS: "disaster-reports",
	/** Topik untuk data streaming sensor dari BE → Pusat. */
	SENSOR_STREAM: "sensor-stream",
	/** Topik untuk update status penanganan dari Pusat → Posko & BE. */
	STATUS_UPDATES: "status-updates",
} as const;


type OnMessageCallback = (report: DisasterReport) => void;
type OnStatusCallback = (status: "connected" | "disconnected" | "error") => void;



let wsConnection: WebSocket | null = null;
const subscribers = new Map<string, Set<OnMessageCallback>>();
let statusCallback: OnStatusCallback | null = null;
let simulationIntervalId: ReturnType<typeof setInterval> | null = null;
let isIntentionalDisconnect = false;
const subscriberConfigs = new Map<string, { filter?: { field: string; value: string } }>();


/**
 * Membuka koneksi ke WebDDS Broker.
 * Harus dipanggil sekali saat aplikasi dimuat (di hook useDisasterSync).
 *
 * @param onStatus - Callback saat status koneksi berubah.
 */
export function connect(onStatus?: OnStatusCallback): void {
	if (onStatus) statusCallback = onStatus;

	if (IS_SIMULATION) {
		console.log("[WebDDS Simulasi] Mode simulasi aktif — broker belum tersedia.");
		statusCallback?.("connected");
		return;
	}

	isIntentionalDisconnect = false;
	try {
		wsConnection = new WebSocket(WEBDDS_BROKER_URL);

		wsConnection.onopen = () => {
			console.log("[WebDDS] Terhubung ke broker:", WEBDDS_BROKER_URL);
			statusCallback?.("connected");

			const topicsToSubscribe = Array.from(subscribers.keys());
			if (topicsToSubscribe.length > 0 && wsConnection) {
				topicsToSubscribe.forEach(topic => {
					const config = subscriberConfigs.get(topic);
					wsConnection?.send(JSON.stringify({
						action: "subscribe",
						topic,
						filter: config?.filter
					}));
				});
			}
		};

		wsConnection.onmessage = (event) => {
			try {
				const parsed = JSON.parse(event.data as string) as {
					topic: string;
					data: DisasterReport;
				};
				const callbacks = subscribers.get(parsed.topic);
				if (callbacks) {
					callbacks.forEach((cb) => cb(parsed.data));
				}
			} catch (err) {
				console.error("[WebDDS] Gagal parse pesan dari broker:", err);
			}
		};


		wsConnection.onerror = () => {
			console.error("[WebDDS] Error koneksi ke broker.");
			statusCallback?.("error");
		};

		wsConnection.onclose = () => {
			console.log("[WebDDS] Koneksi ke broker terputus.");
			statusCallback?.("disconnected");

			if (!isIntentionalDisconnect) {
				// Auto-reconnect setelah 3 detik.
				setTimeout(() => {
					console.log("[WebDDS] Mencoba reconnect...");
					connect(onStatus);
				}, 3000);
			}
		};
	} catch (err) {
		console.error("[WebDDS] Gagal membuka koneksi:", err);
		statusCallback?.("error");
	}
}

/**
 * Mendaftarkan subscriber untuk topik tertentu.
 * Setiap data baru yang masuk ke topik akan diteruskan ke callback.
 *
 * @param topic - Nama topik (gunakan konstanta WEBDDS_TOPICS).
 * @param callback - Fungsi yang dipanggil setiap ada data baru.
 * @returns Fungsi unsubscribe untuk membersihkan listener.
 *
 */
export function subscribe(topic: string, callback: OnMessageCallback, filter?: { field: string; value: string }): () => void {

	if (!subscribers.has(topic)) {
		subscribers.set(topic, new Set());
	}
	subscribers.get(topic)!.add(callback);

	if (filter) {
		subscriberConfigs.set(topic, { filter });
	}

	console.log(`[WebDDS] Subscribe ke topik: "${topic}" ${filter ? `[Filter: ${filter.field}=${filter.value}]` : ""}`);

	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify({
			action: "subscribe",
			topic,
			filter
		}));
	}

	return () => {
		const callbacks = subscribers.get(topic);
		if (callbacks) {
			callbacks.delete(callback);
			console.log(`[WebDDS] Unsubscribe dari topik: "${topic}"`);
		}
	};
}

/**
 * Mempublikasikan data ke topik WebDDS.
 * Digunakan oleh Pusat untuk mengirim update status ke Posko.
 *
 * @param topic - Nama topik tujuan.
 * @param data - Data yang akan dikirim (DisasterReport atau objek lain).
 */
export function publish(topic: string, data: unknown): void {
	if (IS_SIMULATION) {
		console.log(`[WebDDS Simulasi] Publish ke "${topic}":`, data);

		const callbacks = subscribers.get(topic);
		if (callbacks) {
			callbacks.forEach((cb) => cb(data as DisasterReport));
		}
		return;
	}

	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify({ action: "publish", topic, data }));
	} else {
		console.error(`[WebDDS] Gagal publish — tidak terhubung ke broker.`);
	}
}


export function disconnect(): void {
	isIntentionalDisconnect = true;

	if (simulationIntervalId) {
		clearInterval(simulationIntervalId);
		simulationIntervalId = null;
	}
	if (wsConnection) {
		wsConnection.close();
		wsConnection = null;
	}
	subscribers.clear();
	statusCallback = null;

	console.log("[WebDDS] Koneksi ditutup, semua subscriber dibersihkan.");
}

/**
 * Mendapatkan status koneksi saat ini.
 *
 * @returns Status koneksi.
 */
export function getConnectionStatus(): "connected" | "disconnected" | "simulation" {
	if (IS_SIMULATION) return "simulation";
	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) return "connected";
	return "disconnected";
}
