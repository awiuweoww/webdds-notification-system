/**
 * =============================================================================
 * WebDDS Broker — Server WebSocket Pub/Sub
 * =============================================================================
 *
 * Server ini bertindak sebagai "jembatan" antar FE dan BE.
 * Menerima pesan publish dari satu client, lalu meneruskannya ke semua
 * client lain yang sudah subscribe ke topik tersebut.
 *
 * Arsitektur:
 *   FE Posko ──ws──► Broker (server ini) ──ws──► FE Pusat
 *                         │
 *                         └──► (juga simpan ke DB nanti via gRPC)
 *
 * Fitur:
 *   1. Pub/Sub relay — meneruskan publish ke subscriber
 *   2. Sensor simulator — publish data dummy ke topic "sensor-stream"
 *   3. Logging — semua aktivitas di-log ke console
 *
 * Cara menjalankan:
 *   pnpm --filter ws-broker run dev
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal.
 * =============================================================================
 */
import { WebSocket, WebSocketServer } from "ws";

// =============================================================================
// KONFIGURASI
// =============================================================================

/** Port server WebSocket. */
const PORT = 8081;

/** Interval simulasi data sensor (dalam milidetik). */
const SENSOR_INTERVAL_MS = 5000; // Setiap 5 detik

// =============================================================================
// TIPE-TIPE
// =============================================================================

/** Pesan yang dikirim client ke broker. */
interface ClientMessage {
	/** Aksi yang diminta: subscribe ke topik, atau publish data. */
	action: "subscribe" | "publish";
	/** Topik tujuan (untuk publish) atau daftar topik (untuk subscribe). */
	topic?: string;
	topics?: string[];
	/** Data yang dikirim (untuk publish). */
	data?: unknown;
}

/** Informasi tentang satu client yang terhubung. */
interface ClientInfo {
	/** Koneksi WebSocket client. */
	ws: WebSocket;
	/** Daftar topik yang di-subscribe client ini. */
	subscribedTopics: Set<string>;
	/** Label deskriptif untuk logging. */
	label: string;
}

// =============================================================================
// STATE BROKER
// =============================================================================

/** Daftar semua client yang terhubung. */
const clients: Map<WebSocket, ClientInfo> = new Map();

/** Counter untuk memberi label unik ke setiap client. */
let clientCounter = 0;

// =============================================================================
// UTILITAS LOGGING
// =============================================================================

/**
 * Log pesan ke console dengan timestamp.
 * @param tag - Kategori log (BROKER, CLIENT, SENSOR).
 * @param message - Pesan yang di-log.
 */
function log(tag: string, message: string): void {
	const time = new Date().toLocaleTimeString("id-ID");
	console.log(`[${time}] [${tag}] ${message}`);
}

// =============================================================================
// FUNGSI UTAMA BROKER
// =============================================================================

/**
 * Meneruskan data dari publisher ke semua subscriber topik tersebut.
 * Ini adalah inti dari fungsi broker — relay data.
 *
 * @param topic - Nama topik yang di-publish.
 * @param data - Data yang dikirim.
 * @param sender - WebSocket pengirim (agar tidak dikirim balik ke diri sendiri).
 */
function relayToSubscribers(
	topic: string,
	data: unknown,
	sender?: WebSocket
): void {
	let relayCount = 0;

	// Loop semua client yang terhubung.
	clients.forEach((clientInfo) => {
		// Skip pengirim — jangan kirim balik ke diri sendiri.
		if (clientInfo.ws === sender) return;

		// Cek apakah client ini subscribe ke topik ini.
		if (!clientInfo.subscribedTopics.has(topic)) return;

		// Cek apakah koneksi masih terbuka.
		if (clientInfo.ws.readyState !== WebSocket.OPEN) return;

		// Kirim data ke subscriber.
		const payload = JSON.stringify({ topic, data });
		clientInfo.ws.send(payload);
		relayCount++;
	});

	log("RELAY", `Topik "${topic}" → ${relayCount} subscriber menerima data.`);
}

/**
 * Menangani pesan masuk dari client.
 *
 * @param clientInfo - Informasi client yang mengirim pesan.
 * @param rawMessage - Pesan mentah (string JSON).
 */
function handleClientMessage(clientInfo: ClientInfo, rawMessage: string): void {
	let message: ClientMessage;

	try {
		message = JSON.parse(rawMessage) as ClientMessage;
	} catch {
		log("ERROR", `${clientInfo.label}: Gagal parse pesan — bukan JSON valid.`);
		return;
	}

	switch (message.action) {
		// ── SUBSCRIBE ──
		// Client ingin berlangganan satu atau beberapa topik.
		case "subscribe": {
			const topics = message.topics || (message.topic ? [message.topic] : []);
			topics.forEach((t) => {
				clientInfo.subscribedTopics.add(t);
				log("SUBSCRIBE", `${clientInfo.label} subscribe ke "${t}"`);
			});
			break;
		}

		// ── PUBLISH ──
		// Client mengirim data ke topik — broker teruskan ke subscriber lain.
		case "publish": {
			if (!message.topic) {
				log("ERROR", `${clientInfo.label}: Publish tanpa topik.`);
				return;
			}
			log("PUBLISH", `${clientInfo.label} publish ke "${message.topic}"`);
			relayToSubscribers(message.topic, message.data, clientInfo.ws);
			break;
		}

		default:
			log(
				"ERROR",
				`${clientInfo.label}: Aksi tidak dikenal: "${message.action}"`
			);
	}
}

// =============================================================================
// SIMULASI DATA SENSOR
// =============================================================================

/** Daftar sensor dummy yang bisa publish data. */
const DUMMY_SENSORS = [
	{
		id: "STREAM-MERAPI-01",
		sourceName: "SensorGunung Merapi - Pos 1",
		lat: "-7.5407",
		lng: "110.4457",
		type: "Erupsi Gunung"
	}
];

/**
 * Menghasilkan data sensor acak dan mempublikasikannya ke topik "sensor-stream".
 * Dipanggil secara berkala oleh setInterval.
 *
 * Alur:
 *   1. Pilih sensor acak dari daftar.
 *   2. Acak status_level (0-3) → simulasi perubahan kondisi.
 *   3. Bangun DisasterReport.
 *   4. relayToSubscribers("sensor-stream", report).
 */
function publishSensorData(): void {
	// Pilih sensor secara acak.
	const sensor =
		DUMMY_SENSORS[Math.floor(Math.random() * DUMMY_SENSORS.length)];

	// Acak status level: 0=Normal, 1=Waspada, 2=Siaga, 3=Awas
	// Bobot: Normal lebih sering (40%), Waspada (30%), Siaga (20%), Awas (10%).
	const rand = Math.random();
	let statusLevel: number;
	if (rand < 0.4) statusLevel = 0;
	else if (rand < 0.7) statusLevel = 1;
	else if (rand < 0.9) statusLevel = 2;
	else statusLevel = 3;

	// Bangun objek DisasterReport sesuai kontrak proto.
	const report = {
		id: sensor.id,
		originId: sensor.id,
		sourceName: sensor.sourceName,
		latitude: sensor.lat,
		longitude: sensor.lng,
		bencanaType: sensor.type,
		statusLevel,
		statusPenanganan: 0, // Sensor selalu AKTIF
		observationDetail: "",
		timestamp: new Date().toISOString()
	};

	const levelNames = ["NORMAL", "WASPADA", "SIAGA", "AWAS"];
	log("SENSOR", `${sensor.sourceName} → ${levelNames[statusLevel]}`);

	// Publish ke topik "sensor-stream".
	relayToSubscribers("sensor-stream", report);
}

// =============================================================================
// SERVER STARTUP
// =============================================================================

/** Membuat dan menjalankan WebSocket server. */
const wss = new WebSocketServer({ port: PORT });

log("BROKER", "=".repeat(60));
log("BROKER", "  WebDDS Broker — WebSocket Pub/Sub Server");
log("BROKER", `  Listening di ws://localhost:${PORT}`);
log("BROKER", "=".repeat(60));
log("BROKER", "");
log("BROKER", "Topik yang tersedia:");
log("BROKER", "  📋 disaster-reports  — laporan manual Posko → Pusat");
log("BROKER", "  📊 sensor-stream     — data sensor BE → Pusat");
log("BROKER", "  🔄 status-updates    — update status Pusat → Posko");
log("BROKER", "");
log(
	"BROKER",
	`Simulasi sensor aktif setiap ${SENSOR_INTERVAL_MS / 1000} detik.`
);
log("BROKER", "Menunggu koneksi client...");
log("BROKER", "");

// ── Event: Client Baru Terhubung ──
wss.on("connection", (ws: WebSocket) => {
	clientCounter++;
	const label = `Client-${clientCounter}`;

	// Daftarkan client baru.
	const clientInfo: ClientInfo = {
		ws,
		subscribedTopics: new Set(),
		label
	};
	clients.set(ws, clientInfo);

	log("CONNECT", `${label} terhubung. Total client: ${clients.size}`);

	// ── Event: Pesan Masuk dari Client ──
	ws.on("message", (rawData: Buffer) => {
		const rawMessage = rawData.toString();
		handleClientMessage(clientInfo, rawMessage);
	});

	// ── Event: Client Terputus ──
	ws.on("close", () => {
		clients.delete(ws);
		log("DISCONNECT", `${label} terputus. Total client: ${clients.size}`);
	});

	// ── Event: Error ──
	ws.on("error", (err: Error) => {
		log("ERROR", `${label}: ${err.message}`);
	});
});

// ── Mulai Simulasi Sensor ──
setInterval(publishSensorData, SENSOR_INTERVAL_MS);

log("BROKER", "Server siap! 🚀");
