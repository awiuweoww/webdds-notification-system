# 🏗️ Arsitektur gRPC-Web Klasik & Docker Gateway

> **Perubahan Rencana Arsitektur:** Kita kembali menggunakan arsitektur _Production-Grade_ standar industri, yaitu menggunakan **gRPC-Web murni dari Google di Frontend**, **gRPC Murni (HTTP/2) di Backend**, dan **Docker (APISIX/Envoy) sebagai WebDDS Gateway**.

Dokumen ini menjelaskan alasan perubahan, alur komunikasi baru, dan langkah-langkah kerja (_roadmap_) kita ke depannya.

---

## 🧭 Mengapa Kembali Menggunakan Docker Gateway?

Dalam arsitektur _Microservices_ dan _Enterprise_ sungguhan, pemisahan tugas (_separation of concerns_) sangatlah esensial.

1. **Backend Murni gRPC:** Backend (Node.js/Golang) tidak perlu repot memikirkan cara melayani browser web (HTTP/1.1) atau masalah _CORS_. Backend murni hanya fokus memproses data berkecepatan tinggi menggunakan protokol gRPC murni (HTTP/2).
2. **Peran Docker Gateway (APISIX / Envoy):** Browser web tidak bisa berbicara HTTP/2 gRPC murni. Di sinilah **Docker Gateway** bertindak sebagai pahlawan (Pilar ke-5 WebDDS). Gateway ini berjalan di dalam Docker, menerima trafk `gRPC-Web` dari React, lalu membongkarnya dan meneruskannya sebagai `gRPC Murni` ke Backend.
3. **Kesesuaian Library:** Frontend akan menggunakan library resmi `grpc-web` dan `google-protobuf` (yang sudah ter-install di `package.json` Anda), menghasilkan file `.js` dan `.d.ts` persis seperti struktur proyek Radar/Militer Anda sebelumnya.

---

## 🔄 Alur Komunikasi WebDDS (Pub/Sub) via Docker

Berikut adalah bagaimana 3 komponen utama kita berinteraksi di arsitektur ini:

```mermaid
graph TD
    subgraph Frontend [Area Browser / Web]
        FE2[FE 2 - Posko <br> (Publisher)]
        FE1[FE 1 - Pusat <br> (Subscriber)]
    end

    subgraph Middleware [Area Infra / Docker]
        PROXY[Docker Gateway <br> APISIX / Envoy]
    end

    subgraph Backend [Area Server]
        BE[Node.js Server <br> (gRPC Murni)]
    end

    %% Alur Publish (FE 2 -> BE)
    FE2 -- "1. HTTP/1.1 (gRPC-Web Unary)" --> PROXY
    PROXY -- "2. HTTP/2 (gRPC murni)" --> BE

    %% Alur Subscribe (BE -> FE 1)
    BE -- "3. HTTP/2 (gRPC Server Stream)" --> PROXY
    PROXY -- "4. Server-Sent Events (gRPC-Web Stream)" --> FE1
```

### Penjelasan Alur (Skenario Laporan Bencana):

1. **PUBLISH (Ad-hoc):** Operator di **FE 2** menekan tombol "Submit". FE 2 membungkus data form menggunakan `google-protobuf` lalu mengirimkannya lewat HTTP/1.1 standar (gRPC-Web) menuju port yang dibuka oleh **Docker Gateway**.
2. **TRANSIT:** **Docker Gateway** (APISIX/Envoy) mencegat pesan itu, menerjemahkannya seketika menjadi paket gRPC murni (HTTP/2), dan melemparnya ke server **Backend Node.js**.
3. **BROKER / PROCESSING:** Server **Backend Node.js** menerima laporan, memprosesnya (bisa disimpan ke DB jika ada), lalu menyiarkannya (_broadcast_) ke semua saluran yang sedang terbuka.
4. **SUBSCRIBE (Streaming):** Karena **FE 1** sejak awal sudah membuka tab dan meminta data lewat jembatan **Docker**, pipa _Stream_ terus terbuka. Data bencana dari BE akan dipompa kembali ke Docker, diterjemahkan lagi ke format ramban, dan menyiram UI FE 1 seketika (Zustand _update_ warna menjadi merah/kuning).

---

## 🐾 Langkah Kita Ke Depannya (Roadmap)

Karena kita beralih ke jalur gRPC-Web Klasik + Docker, berikut adalah _To-Do List_ langkah demi langkah kita selanjutnya:

### Tahap 1: Setup Compiler Klasik (Proto to JS & TS)

- [ ] Memodifikasi `package.json` di root atau `shared/` untuk menggunakan _plugin compiler_ standar.
- [ ] Menjalankan skrip _generate_ agar kita mendapatkan **4 file hasil kompilasi** yang ramah TypeScript:
  1. `ddsgunung_pb.js` (Logika Data/Message)
  2. `ddsgunung_pb.d.ts` (Tipe TypeScript untuk Data/Message)
  3. `ddsgunung_grpc_web_pb.js` (Logika gRPC-Web Client)
  4. `ddsgunung_grpc_web_pb.d.ts` (Tipe TypeScript untuk gRPC-Web Client)

### Tahap 2: Mendirikan Jembatan (Docker Gateway)

- [ ] Membuat file `docker-compose.yml` di _root_ proyek.
- [ ] Membuat file konfigurasi proxy (contohnya `envoy.yaml` atau konfig `apisix`) untuk mengatur agar lalu lintas dari FE (port 8080 misalnya) diteruskan sebagai gRPC ke BE (port 9090).

### Tahap 3: Membangun Backend gRPC Murni

- [ ] Di dalam folder `server/node-gateway`, kita akan meng-install library `@grpc/grpc-js`.
- [ ] Menulis server Node.js yang me-_load_ file `ddsgunung.proto` dan membuka port 9090 untuk melayani fungsi `PublishManualReport` dan memompa _dummy data_ ke `SubscribeGlobalStream`.

### Tahap 4: Merakit Frontend React

- [ ] **Di FE 2 (Posko):** Membuat Form Input yang memanggil fungsi `PublishManualReport` dari library `grpc-web` yang baru kita _generate_.
- [ ] **Di FE 1 (Pusat):** Membangun UI Dashboard, lalu di dalam komponen utamanya (`useEffect`), kita memanggil fungsi `SubscribeGlobalStream` yang akan bereaksi (_trigger_ penambahan tabel) setiap kali paket mendarat.

---

_Dengan langkah ini, kita akan mendapatkan simulasi WebDDS yang 100% otentik dengan kondisi production industri skala besar!_
