"use strict";

/**
 * WebDDS Broker — Plain Node.js (tanpa dependensi eksternal)
 * Jalankan: node broker.js
 */

var http = require("http");
var crypto = require("crypto");

var PORT = 8081;
var clients = new Map();
var clientCounter = 0;

function log(tag, msg) {
	var t = new Date().toLocaleTimeString("id-ID");
	console.log("[" + t + "] [" + tag + "] " + msg);
}

// --- WebSocket Frame ---
function decodeFrame(buffer) {
	if (buffer.length < 2) return "";

	var firstByte = buffer[0];
	var opcode = firstByte & 0x0f;

	// Close frame
	if (opcode === 0x08) return null;
	// Ping - ignore
	if (opcode === 0x09) return "";
	// Pong - ignore
	if (opcode === 0x0a) return "";

	var secondByte = buffer[1];
	var isMasked = (secondByte & 0x80) !== 0;
	var payloadLength = secondByte & 0x7f;
	var offset = 2;

	if (payloadLength === 126) {
		if (buffer.length < 4) return "";
		payloadLength = buffer.readUInt16BE(2);
		offset = 4;
	} else if (payloadLength === 127) {
		if (buffer.length < 10) return "";
		payloadLength = buffer.readUInt32BE(6);
		offset = 10;
	}

	var maskOffset = offset;
	if (isMasked) {
		offset += 4;
	}

	if (buffer.length < offset + payloadLength) return "";

	var result = Buffer.alloc(payloadLength);
	for (var i = 0; i < payloadLength; i++) {
		if (isMasked) {
			result[i] = buffer[offset + i] ^ buffer[maskOffset + (i % 4)];
		} else {
			result[i] = buffer[offset + i];
		}
	}

	return result.toString("utf8");
}

function encodeFrame(text) {
	var payload = Buffer.from(text, "utf8");
	var len = payload.length;
	var header;

	if (len < 126) {
		header = Buffer.alloc(2);
		header[0] = 0x81;
		header[1] = len;
	} else if (len < 65536) {
		header = Buffer.alloc(4);
		header[0] = 0x81;
		header[1] = 126;
		header.writeUInt16BE(len, 2);
	} else {
		header = Buffer.alloc(10);
		header[0] = 0x81;
		header[1] = 127;
		header.writeUInt32BE(0, 2);
		header.writeUInt32BE(len, 6);
	}

	return Buffer.concat([header, payload]);
}

// --- Relay ---
function relayToSubscribers(topic, data, sender) {
	var count = 0;
	var payload = JSON.stringify({ topic: topic, data: data });
	var frame = encodeFrame(payload);

	clients.forEach(function (info, socket) {
		if (socket === sender) return;
		if (!info.subscribedTopics.has(topic)) return;
		try {
			if (!socket.destroyed) {
				socket.write(frame);
				count++;
			}
		} catch (e) {
			// client disconnected
		}
	});

	log("RELAY", '"' + topic + '" -> ' + count + " subscriber(s)");
}

// --- Handle Messages ---
function handleMessage(socket, info, raw) {
	var msg;
	try {
		msg = JSON.parse(raw);
	} catch (e) {
		log("ERROR", info.label + ": invalid JSON");
		return;
	}

	if (msg.action === "subscribe") {
		var topics = msg.topics || (msg.topic ? [msg.topic] : []);
		topics.forEach(function (t) {
			info.subscribedTopics.add(t);
			log("SUB", info.label + ' -> "' + t + '"');
		});
	} else if (msg.action === "publish") {
		if (!msg.topic) return;
		log("PUB", info.label + ' -> "' + msg.topic + '"');
		relayToSubscribers(msg.topic, msg.data, socket);
	}
}

function publishSensor() {
	var s = SENSORS[Math.floor(Math.random() * SENSORS.length)];
	var rand = Math.random();
	var lvl = rand < 0.4 ? 0 : rand < 0.7 ? 1 : rand < 0.9 ? 2 : 3;
	var names = ["NORMAL", "WASPADA", "SIAGA", "AWAS"];

	var report = {
		id: s.id,
		originId: s.id,
		sourceName: s.sourceName,
		latitude: s.lat,
		longitude: s.lng,
		bencanaType: s.type,
		statusLevel: lvl,
		statusPenanganan: 0,
		observationDetail: "",
		timestamp: new Date().toISOString()
	};

	log("SENSOR", s.sourceName + " -> " + names[lvl]);
	relayToSubscribers("sensor-stream", report);
}

var server = http.createServer(function (req, res) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("WebDDS Broker OK");
});

server.on("upgrade", function (req, socket, head) {
	var key = req.headers["sec-websocket-key"];
	if (!key) {
		socket.destroy();
		return;
	}

	var accept = crypto
		.createHash("sha1")
		.update(key + "258EAFA5-E914-47DA-95CA-5AB9ADB63923")
		.digest("base64");

	socket.write(
		"HTTP/1.1 101 Switching Protocols\r\n" +
			"Upgrade: websocket\r\n" +
			"Connection: Upgrade\r\n" +
			"Sec-WebSocket-Accept: " +
			accept +
			"\r\n" +
			"\r\n"
	);

	clientCounter++;
	var label = "Client-" + clientCounter;
	var info = { subscribedTopics: new Set(), label: label };
	clients.set(socket, info);

	log("CONNECT", label + " terhubung. Total: " + clients.size);

	socket.on("data", function (buffer) {
		try {
			var decoded = decodeFrame(buffer);
			if (decoded === null) {
				socket.end();
				return;
			}
			if (decoded && decoded.length > 0) {
				handleMessage(socket, info, decoded);
			}
		} catch (err) {
			log("ERROR", label + " frame error: " + err.message);
		}
	});

	socket.on("close", function () {
		clients.delete(socket);
		log("DISCONNECT", label + " terputus. Total: " + clients.size);
	});

	socket.on("error", function () {
		clients.delete(socket);
	});
});

server.listen(PORT, function () {
	console.log("");
	console.log("============================================");
	console.log("  WebDDS Broker - ws://localhost:" + PORT);
	console.log("============================================");
	console.log("");
	console.log("Topik:");
	console.log("  disaster-reports  (Posko -> Pusat)");
	console.log("  sensor-stream     (Sensor -> Pusat)");
	console.log("  status-updates    (Pusat -> Posko)");
	console.log("");
	console.log("Sensor simulator: setiap 5 detik");
	console.log("Menunggu koneksi...");
	console.log("");
});

setInterval(publishSensor, 5000);
