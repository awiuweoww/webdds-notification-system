/**
 * WebDDS Broker — WebSocket Server Utama
 * Server ini menyalurkan pesan (relay) antara Posko dan Pusat secara real-time.
 */
import { WebSocket, WebSocketServer } from "ws";

// --- KONFIGURASI ---
const PORT = 8081;

// --- TIPE DATA ---

interface ClientMessage {
	action: "subscribe" | "publish";
	topic?: string;
	topics?: string[];
	filter?: {
		field: string;
		value: string;
	};
	data?: any;
}

/** Mapping client yang terhubung */
interface ClientInfo {
	ws: WebSocket;
	subscriptions: Map<string, { field?: string; value?: string }>;
	label: string;
}

const clients: Map<WebSocket, ClientInfo> = new Map();
let clientCounter = 0;

// --- UTILITAS ---

/** Logging aktivitas broker */
function log(tag: string, message: string): void {
	const time = new Date().toLocaleTimeString("id-ID");
	console.log(`[${time}] [${tag}] ${message}`);
}

/**
 * Meneruskan data ke subscriber yang terdaftar di topik tertentu.
 * Data hanya akan diteruskan jika subscriber memiliki filter yang sesuai dengan nilai di data.
 * Jika sender tidak null, maka data tidak akan diteruskan ke sender tersebut.
 *
 * @param topic - Nama topik yang akan diteruskan data.
 * @param data - Data yang akan diteruskan ke subscriber.
 * @param sender - Client yang mengirim data, jika tidak null maka data tidak akan diteruskan ke sender tersebut.
 */
function relayToSubscribers(
	topic: string,
	data: any,
	sender?: WebSocket
): void {
	let relayCount = 0;

	clients.forEach((clientInfo) => {
		if (clientInfo.ws === sender) return;
		const subConfig = clientInfo.subscriptions.get(topic);
		if (!subConfig) return;

		if (subConfig.field && subConfig.value) {
			const fieldValue = (data as any)[subConfig.field];
			if (fieldValue !== subConfig.value) return;
		}

		if (clientInfo.ws.readyState !== WebSocket.OPEN) return;

		clientInfo.ws.send(JSON.stringify({ topic, data }));
		relayCount++;
	});

	if (relayCount > 0) {
		log("RELAY", `Topic "${topic}" ditujukan ke ${relayCount} subscriber.`);
	}
}

/**
 * Menghandle pesan yang diterima dari client.
 * Pesan harus dalam format JSON yang valid dan memiliki struktur yang sesuai dengan ClientMessage.
 * Jika pesan tidak valid, maka akan dicatatkan error dengan log level "ERROR".
 * @param clientInfo - Informasi tentang client yang mengirim pesan, termasuk WebSocket dan label untuk logging.
 * @param rawMessage - Pesan mentah yang diterima dari client, dalam bentuk string.
 * @returns void
 */
function handleClientMessage(clientInfo: ClientInfo, rawMessage: string): void {
	let message: ClientMessage;

	try {
		message = JSON.parse(rawMessage) as ClientMessage;
	} catch {
		log("ERROR", `${clientInfo.label}: Format JSON tidak valid.`);
		return;
	}

	switch (message.action) {
		case "subscribe": {
			const topics = message.topics || (message.topic ? [message.topic] : []);
			topics.forEach((t) => {
				clientInfo.subscriptions.set(t, {
					field: message.filter?.field,
					value: message.filter?.value
				});
				log(
					"SUB",
					`${clientInfo.label} sub ke "${t}" ${message.filter ? `[Filter: ${message.filter.field}=${message.filter.value}]` : ""}`
				);
			});
			break;
		}

		case "publish": {
			if (!message.topic) return;
			log("PUB", `${clientInfo.label} kirim ke "${message.topic}"`);
			relayToSubscribers(message.topic, message.data, clientInfo.ws);
			break;
		}
	}
}

// --- INISIALISASI SERVER ---

const wss = new WebSocketServer({ port: PORT });

log("BROKER", `Server WebDDS siap di ws://localhost:${PORT} 🚀`);

wss.on("connection", (ws: WebSocket) => {
	clientCounter++;
	const label = `Client-${clientCounter}`;
	const clientInfo: ClientInfo = { ws, subscriptions: new Map(), label };

	clients.set(ws, clientInfo);
	log("CONN", `${label} terhubung. (Total: ${clients.size})`);

	ws.on("message", (rawData: Buffer) => {
		handleClientMessage(clientInfo, rawData.toString());
	});

	ws.on("close", () => {
		clients.delete(ws);
		log("EXIT", `${label} terputus. (Total: ${clients.size})`);
	});

	ws.on("error", (err: Error) => {
		log("ERR", `${label}: ${err.message}`);
	});
});

// --- SIMULATOR SENSOR (Data Otomatis) ---

function publishSensorData(): void {
	const report = {
		id: "STREAM-MERAPI-01",
		originId: "STREAM-MERAPI-01",
		sourceName: "Sensor Gunung Merapi",
		latitude: "-7.5407",
		longitude: "110.4457",
		bencanaType: "Erupsi Gunung",
		statusLevel: Math.floor(Math.random() * 4), // Acak Level 0-3
		statusPenanganan: 0,
		observationDetail: "Data sensor otomatis.",
		timestamp: new Date().toISOString()
	};

	log("SENSOR", `Kirim data: ${report.sourceName}`);
	relayToSubscribers("sensor-stream", report);
}

// Jalankan simulasi setiap 5 detik
setInterval(publishSensorData, 5000);
