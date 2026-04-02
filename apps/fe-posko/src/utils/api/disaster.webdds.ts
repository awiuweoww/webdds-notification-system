/**
 * Created Date       : 31-03-2026
 * Description        : Service layer WebDDS untuk FE Posko.
 *                      Fokus utama: PUBLISH data laporan manual ke topik WebDDS.
 *
 * Arsitektur:
 *   FE Posko (Publisher) ──► WebDDS Topic "disaster-reports" ──► FE Pusat + BE
 *
 * Perbedaan dengan fe-pusat:
 *   - fe-pusat = SUBSCRIBER (mendengarkan data masuk)
 *   - fe-posko = PUBLISHER  (mengirim data keluar) ← file ini
 *
 * Catatan:
 *   - Saat ini menggunakan mode SIMULASI karena WebDDS broker belum siap.
 *   - Ketika broker sudah siap, isi VITE_WEBDDS_BROKER_URL di .env.
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal dengan mode simulasi.
 */


const WEBDDS_BROKER_URL = "ws://localhost:8081";

const IS_SIMULATION = false;


export const WEBDDS_TOPICS = {
	DISASTER_REPORTS: "disaster-reports",
	STATUS_UPDATES: "status-updates",
} as const;


type OnStatusCallback = (status: "connected" | "disconnected" | "error") => void;
type OnMessageCallback = (data: unknown) => void;

export interface PublishResult {
	success: boolean;
	message: string;
}

let wsConnection: WebSocket | null = null;
let statusCallback: OnStatusCallback | null = null;
const subscribers = new Map<string, Set<OnMessageCallback>>();
let isIntentionalDisconnect = false;
const subscriberConfigs = new Map<string, { filter?: { field: string; value: string } }>();


/**
 * Membuka koneksi ke WebDDS Broker.
 * @param onStatus - Callback saat status koneksi berubah.
 */
export function connect(onStatus?: OnStatusCallback): void {
	if (onStatus) statusCallback = onStatus;

	if (isIntentionalDisconnect) {
		isIntentionalDisconnect = false;
	}

	isIntentionalDisconnect = false;

	try {
		wsConnection = new WebSocket(WEBDDS_BROKER_URL);

		wsConnection.onopen = () => {
			console.log("[WebDDS Posko] Terhubung ke broker:", WEBDDS_BROKER_URL);
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
					data: unknown;
				};
				const callbacks = subscribers.get(parsed.topic);
				if (callbacks) {
					callbacks.forEach((cb) => cb(parsed.data));
				}
			} catch (err) {
				console.error("[WebDDS Posko] Gagal parse pesan:", err);
			}
		};

		wsConnection.onerror = () => {
			console.error("[WebDDS Posko] Error koneksi.");
			statusCallback?.("error");
		};

		wsConnection.onclose = () => {
			console.log("[WebDDS Posko] Koneksi terputus.");
			statusCallback?.("disconnected");

			if (!isIntentionalDisconnect) {
				setTimeout(() => {
					console.log("[WebDDS Posko] Mencoba reconnect...");
					connect(onStatus);
				}, 3000);
			}
		};
	} catch (err) {
		console.error("[WebDDS Posko] Gagal membuka koneksi:", err);
		statusCallback?.("error");
	}
}

/**
 * Mempublikasikan laporan ke topik WebDDS.
 * Ini adalah fungsi utama yang dipanggil saat operator klik "Submit Laporan".
 *
 * @param topic - Nama topik tujuan (gunakan WEBDDS_TOPICS.DISASTER_REPORTS).
 * @param data - Data laporan yang akan dikirim.
 * @returns Hasil publish (sukses/gagal + pesan).
 */
export async function publish(topic: string, data: unknown): Promise<PublishResult> {

	if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
		return {
			success: false,
			message: "Gagal mengirim — tidak terhubung ke WebDDS broker."
		};
	}

	try {
		wsConnection.send(JSON.stringify({ action: "publish", topic, data }));
		return {
			success: true,
			message: "Laporan berhasil dikirim via WebDDS."
		};
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : "Gagal mengirim data.";
		return { success: false, message: errorMsg };
	}
}

/**
 * Subscribe ke topik WebDDS (untuk menerima data dari publisher lain).
 * Posko menggunakan ini untuk mendengarkan update status dari Pusat.
 *
 * @param topic - Nama topik yang di-subscribe.
 * @param callback - Fungsi yang dipanggil setiap data baru masuk.
 * @returns Fungsi unsubscribe.
 */
export function subscribe(topic: string, callback: OnMessageCallback, filter?: { field: string; value: string }): () => void {
	if (!subscribers.has(topic)) {
		subscribers.set(topic, new Set());
	}
	subscribers.get(topic)!.add(callback);
	
	if (filter) {
		subscriberConfigs.set(topic, { filter });
	}

	console.log(`[WebDDS Posko] Subscribe ke topik: "${topic}" ${filter ? `[Filter: ${filter.field}=${filter.value}]` : ""}`);

	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
		wsConnection.send(JSON.stringify({
			action: "subscribe",
			topic,
			filter
		}));
	}

	return () => {
		subscribers.get(topic)?.delete(callback);
		console.log(`[WebDDS Posko] Unsubscribe dari topik: "${topic}"`);
	};
}


/**
 * Menutup koneksi ke WebDDS Broker.
 * Dipanggil saat komponen di-unmount atau aplikasi ditutup.
 *
 * @remarks
 *   - Menghentikan simulasi jika aktif.
 *   - Menutup koneksi WebSocket.
 *   - Membersihkan semua subscriber.
 *   - Menghilangkan status koneksi.
 *   - Menghilangkan callback status koneksi.
 */
export function disconnect(): void {
	isIntentionalDisconnect = true;

	if (wsConnection) {
		wsConnection.close();
		wsConnection = null;
	}
	subscribers.clear();
	statusCallback = null;
	console.log("[WebDDS Posko] Koneksi ditutup.");
}

/**
 * Mendapatkan status koneksi saat ini.
 *
 * @returns Status koneksi.
 */
export function getConnectionStatus(): "connected" | "disconnected" {
	if (wsConnection && wsConnection.readyState === WebSocket.OPEN) return "connected";
	return "disconnected";
}
