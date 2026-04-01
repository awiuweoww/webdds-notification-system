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

// =============================================================================
// KONFIGURASI
// =============================================================================

/**
 * URL WebDDS Broker (WebSocket server).
 * Rspack tidak membaca .env otomatis seperti Vite, jadi untuk development
 * kita hardcode URL-nya di sini. Nanti bisa diganti pakai DefinePlugin.
 */
const WEBDDS_BROKER_URL = "ws://localhost:8081";

/** Flag apakah sedang dalam mode simulasi (broker belum ada). */
const IS_SIMULATION = !WEBDDS_BROKER_URL;

// =============================================================================
// TIPE-TIPE WEBDDS
// =============================================================================

/**
 * Nama-nama topik WebDDS yang tersedia.
 * Harus sesuai dengan dokumentasi di proto README.
 */
export const WEBDDS_TOPICS = {
	/** Topik untuk laporan manual dari Posko → Pusat & BE. */
	DISASTER_REPORTS: "disaster-reports",

	/** Topik untuk data streaming sensor dari BE → Pusat. */
	SENSOR_STREAM: "sensor-stream",

	/** Topik untuk update status penanganan dari Pusat → Posko & BE. */
	STATUS_UPDATES: "status-updates",
} as const;

/** Callback yang dipanggil setiap ada data baru masuk dari topik. */
type OnMessageCallback = (report: DisasterReport) => void;

/** Callback yang dipanggil saat status koneksi berubah. */
type OnStatusCallback = (status: "connected" | "disconnected" | "error") => void;

// =============================================================================
// STATE INTERNAL
// =============================================================================

/** Referensi ke koneksi WebSocket aktif. */
let wsConnection: WebSocket | null = null;

/** Daftar subscriber yang terdaftar, per topik. */
const subscribers = new Map<string, Set<OnMessageCallback>>();

/** Callback untuk perubahan status koneksi. */
let statusCallback: OnStatusCallback | null = null;

/** ID interval untuk simulasi data sensor. */
let simulationIntervalId: ReturnType<typeof setInterval> | null = null;

/** Flag apakah pemutusan disengaja agar tidak reconnect. */
let isIntentionalDisconnect = false;

/** Penyimpanan sementara konfigurasi filter per topik agar bisa dikirim ulang saat reconnect. */
const subscriberConfigs = new Map<string, { filter?: { field: string; value: string } }>();

// =============================================================================
// FUNGSI-FUNGSI WEBDDS SERVICE
// =============================================================================

/**
 * Membuka koneksi ke WebDDS Broker.
 * Harus dipanggil sekali saat aplikasi dimuat (di hook useDisasterSync).
 *
 * @param onStatus - Callback saat status koneksi berubah.
 */
export function connect(onStatus?: OnStatusCallback): void {
	if (onStatus) statusCallback = onStatus;

	if (IS_SIMULATION) {
		// ── MODE SIMULASI ──
		// Tidak ada broker, langsung set status "connected".
		console.log("[WebDDS Simulasi] Mode simulasi aktif — broker belum tersedia.");
		statusCallback?.("connected");
		return;
	}

	isIntentionalDisconnect = false;

	// ── MODE PRODUKSI (nanti) ──
	// Buka koneksi WebSocket ke broker sesungguhnya.
	try {
		wsConnection = new WebSocket(WEBDDS_BROKER_URL);

		wsConnection.onopen = () => {
			console.log("[WebDDS] Terhubung ke broker:", WEBDDS_BROKER_URL);
			statusCallback?.("connected");

			// Kirim daftar topik yang ingin di-subscribe ke broker.
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
			// Broker mengirim data dalam format:
			// { topic: "disaster-reports", data: { ...DisasterReport } }
			try {
				const parsed = JSON.parse(event.data as string) as {
					topic: string;
					data: DisasterReport;
				};
				// Panggil semua subscriber yang terdaftar untuk topik ini.
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
 * @example
 * ```ts
 * const unsub = subscribe(WEBDDS_TOPICS.DISASTER_REPORTS, (report) => {
 *   store.applyIncomingReport(report);
 * });
 * // Untuk berhenti mendengarkan:
 * unsub();
 * ```
 */
export function subscribe(topic: string, callback: OnMessageCallback, filter?: { field: string; value: string }): () => void {
	// Tambahkan callback ke daftar subscriber topik ini.
	if (!subscribers.has(topic)) {
		subscribers.set(topic, new Set());
	}
	subscribers.get(topic)!.add(callback);

	if (filter) {
		subscriberConfigs.set(topic, { filter });
	}

	console.log(`[WebDDS] Subscribe ke topik: "${topic}" ${filter ? `[Filter: ${filter.field}=${filter.value}]` : ""}`);

	// Jika sudah terkoneksi, kirim subscription baru ke broker.
	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify({
			action: "subscribe",
			topic,
			filter
		}));
	}

	// Kembalikan fungsi unsubscribe.
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

		// Di mode simulasi, langsung teruskan ke subscriber lokal
		// (seolah-olah data sudah dikirim ke broker dan diterima kembali).
		const callbacks = subscribers.get(topic);
		if (callbacks) {
			callbacks.forEach((cb) => cb(data as DisasterReport));
		}
		return;
	}

	// ── MODE PRODUKSI ──
	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify({ action: "publish", topic, data }));
	} else {
		console.error(`[WebDDS] Gagal publish — tidak terhubung ke broker.`);
	}
}

/**
 * Menutup koneksi ke WebDDS Broker.
 * Dipanggil saat komponen di-unmount atau aplikasi ditutup.
 */
export function disconnect(): void {
	isIntentionalDisconnect = true;

	// Hentikan simulasi jika aktif.
	if (simulationIntervalId) {
		clearInterval(simulationIntervalId);
		simulationIntervalId = null;
	}

	// Tutup koneksi WebSocket.
	if (wsConnection) {
		wsConnection.close();
		wsConnection = null;
	}

	// Bersihkan semua subscriber.
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
