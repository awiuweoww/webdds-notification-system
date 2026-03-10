# 🌋 Panduan Proyek PoC: Memahami WebDDS sebagai Sistem Notifikasi Real-Time (Studi Kasus: Pusat Komando Vulkanologi)

Selamat datang di proyek **Proof of Concept (PoC) WebDDS Pub/Sub**. Dokumen ini adalah panduan lengkap *(master guide)* yang dirancang khusus bagi Front-End Developer untuk mempelajari, memahami, dan membedah secara mendalam bagaimana WebDDS beroperasi sebagai **Sistem Notifikasi dan Streaming Kelas Enterprise**.

---

## 🎯 Inti Pembelajaran: Mengapa Kita Menggunakan WebDDS?

Sebelum menulis kode, kita harus paham *mengapa* arsitektur ini disebut sebagai **"Game Changer"** dibandingkan HTTP/REST API tradisional.

Pada aplikasi konvensional (Request/Response API):
- Jika Anda ingin melihat notifikasi terbaru, browser harus **selalu bertanya** ke server (Polling/Refresh): *"Halo Server, apakah ada notifikasi baru?"*
- Ini sangat lambat, membebani server/database, dan tidak cocok untuk peringatan darurat atau data sensor yang berubah setiap detik.

Di sisi lain, **WebDDS menggunakan arsitektur Publish/Subscribe (Pub/Sub) murni:**
- **Global Data Space (Papan Pengumuman):** Middleware / Gateway (Server) bertindak sebagai papan pengumuman virtual pintar berskala global. 
- **Publisher (Pengirim):** Alat sensor IoT atau aplikasi Posko Daerah yang melemparkan data *(Publish)* ke papan pengumuman tersebut (Topik tertentu, misal: `topik/peringatan-gempa`).
- **Subscriber (Pendengar):** Aplikasi Markas Pusat *(Dashboard FE)* mendaftarkan dirinya *(Subscribe)* ke topik tersebut.
- **Keajaibannya:** Ketika ada data yang dilempar ke topik tersebut, Papan Pengumuman (Gateway WebDDS) **secara otomatis dan seketika langsung mendorong (push/routing) data tersebut ke semua browser (FE) yang sedang mendengarkan**. Tidak ada jeda "*loading*", tidak ada *database query* yang berat. *Pure real-time routing!*

---

## 🗻 Gambaran Proyek: Pemantauan Gunung Api Indonesia

Untuk menguji kehebatan WebDDS, kita mengambil tema arsitektur pemantauan bencana gunung berapi. Kenapa? Karena skenario ini menuntut 2 hal yang paling sulit diatasi aplikasi konvensional:
1. **Diberondong data sensor tiada henti (Streaming).**
2. **Kewajiban merespons alarm seketika tanpa delay (Urgent Notification).**

### Arsitektur Alur Komunikasi Sistem

```mermaid
graph TD
    classDef iot fill:#b91c1c,stroke:#fca5a5,stroke-width:2px,color:#fff;
    classDef fe2 fill:#1d4ed8,stroke:#93c5fd,stroke-width:2px,color:#fff;
    classDef gateway fill:#0f172a,stroke:#3b82f6,stroke-width:4px,color:#fff;
    classDef fe1 fill:#15803d,stroke:#86efac,stroke-width:2px,color:#fff;

    ESP(((🤖 Alat Sensor IoT<br/>ESP32 Seismik<br/>Gunung Merapi))):::iot
    FE2[💻 Aplikasi Posko Daerah<br/>Operator Lereng Gunung<br/>FE 2]:::fe2
    GW{⚡ Middleware WebDDS<br/>Gateway Router<br/>(Node.js / Gripmock)}:::gateway
    FE1[🖥️ Aplikasi Markas Pusat<br/>Dashboard Nasional<br/>FE 1]:::fe1

    %% Jalur BE -> FE %%
    ESP -- "1. PUBLISH (Streaming Tiap Detik)\n[Suhu 80°C, Amplitudo 20mm]" --> GW
    
    %% Jalur FE -> FE %%
    FE2 -- "2. PUBLISH (Manual S.O.S)\n[Laporan: Awan Panas Terlihat!]" --> GW

    %% Routing ke FE 1 %%
    GW == "3. SUBSCRIBE / PUSH (Instant Route)\nData Sensor & Alert" ==> FE1
```

**Penjelasan Sistem Komunikasi:**
Proyek ini membuktikan dua fungsi utama WebDDS sebagai Notifikasi dan Streaming:

1. **Skenario Komunikasi 1: Streaming Sensor (BE -> FE)**
   Alat **ESP32 IoT** tertancap di kawah gunung. Tidak ada interaksi manusia di sana. ESP32 secara buta menembakkan metrik (Amplitudo Gempa) setiap **1 detik sekali** ke Gateway Server (BE). Aplikasi Markas Pusat (FE 1) secara pasif akan menampung semburan ribuan data IoT tersebut. Tabel di layar akan terus berkedip mengganti angka hidup-hidup (animasi *stopwatch/live counter*). Ini membuktikan WebDDS sanggup menangani transfer data berat.

2. **Skenario Komunikasi 2: Notifikasi Peringatan Instan (FE -> FE)**
   Seorang operator di Posko Babadan (Layar FE 2) melihat guguran lava pijar yang tak tertangkap sensor. Ia mengisi form di komputernya dan memukul tombol **🚨 S.O.S**. Laporan itu *(Publish)* melesat ke Gateway. Gateway yang tidak memiliki memori beban (*database*) seketika itu juga membelokkan (*routing*) sinyal tersebut ke Layar FE 1 Markas Nasional. Sebuah kotak **Pop-Up Notifikasi / Alarm Toast berwarna Merah** seketika menampar layar Markas Pusat membunyikan peringatan!

---

## 🛠️ Bagaimana Semua Ini Dibangun? (Komponen UI & State)

Untuk mengeksekusi arsitektur di atas tanpa membuat peramban (browser) menjadi *hang* atau menelan RAM tak terbatas, kita menyusun strategi Front-End sebagai berikut:

### 1. Front-End Markas Pusat (FE 1: Dashboard Nasional)
Sifatnya adalah **Global Subscriber**.
- **Komponen Tabel Beranimasi:** Baris dari setiap gunung/desa di render. Angkanya terus berdenyut.
- **Push Notification (Toast) Komponen:** Komponen terselubung menggunakan library `sonner` atau `react-hot-toast`. Ia akan meledak muncul di pojok kanan layar hanya saat Gateway meneriakan ada *Publish* "Urgent Alert" dari aplikasi FE 2.
- **Peran State (Zustand) sang "Pahlawan":** Rahasia agar React tidak macet ketika menerima puluhan pembaruan socket/gRPC per detik adalah **Zustand**. Zustand memotong dan menyimpan array mutakhir dari sensor, memperbarui memori React dalam orde milidetik (60FPS), dan FE 1 otomatis tergambar ulang sehalus mungkin.

### 2. Front-End Posko Daerah (FE 2: Pelapor Visual)
Sifatnya adalah **Regional Publisher**.
- **Komponen Form & Input:** Input "Koordinat Lokasi", "Pilihan Dropdown Bahaya", dan "Catatan Narasi".
- **Panic Button S.O.S:** Begitu tombol di-'klik', kode FE 2 merakit *JSON Payload* dan menembakkannya menggunakan gRPC-Web ke Middleware dengan tujuan *(Topic)* peringatan darurat. 

---

## ⚙️ Strategi Pengujian dengan DUA Versi Back-End

Protokol asli WebDDS (DDS RTPS) sangat kompleks. Maka di tingkat simulasi, kita menggunakan **gRPC-Web (Server Streaming RPC)** yang karakternya memplagiat standar WebDDS dengan sempurna.

### A. Versi Back-End 1: Gripmock (Pengetesan UI Streaming)
- Gripmock adalah mock server untuk *gRPC* (dijalankan via **Docker** agar instan).
- **Penggunaan:** Front-End Developer Anda (`FE 1`) tinggal mengkoneksikan layarnya ke port Gripmock. Gripmock akan otomatis mengirim aliran data Gunung Gempa palsu yang sangat deras. UI Developer bisa leluasa menata CSS animasi tabel dan mengetes kekuatan *store Zustand*-nya.

### B. Versi Back-End 2: Server Node.js (Pengetesan Komunikasi FE -> FE)
- Gripmock **TIDAK BISA** menerima laporan interaktif (publish) dari FE 2 dan merutekannya otomatis ke FE 1.
- **Penggunaan:** Jika desain UI kelar, nyalakan skrip `Node.js Gateway` asli (dijalankan via Node murni). Dengan Node.js asli ini, uji coba *"menekan tombol S.O.S di Komputer 2 memicu Alarm berbunyi di Komputer 1"* akan beroperasi dengan mulus secara penuh.

---

## 📂 Struktur Proyek: Sistem Monorepo Modern (pnpm Workspaces)

Untuk menghemat ratusan _megabytes_ penyimpanan dan menyederhanakan manajemen *dependencies* yang identik pada `fe-pusat` dan `fe-posko` (Contoh: `react`, `zustand`, `tailwindcss`), kita wajib menggunakan **pnpm workspaces**. 

Ini memungkinkan kita untuk tidak perlu menginstal kumpulan Node *packages* berulang kali di setiap *folder* FE.

### 1. Struktur Folder (Pohon Direktori Monorepo)

```text
webdds-gunung-monorepo/
├── package.json               [File Induk Monorepo]
├── pnpm-lock.yaml             [Kunci Versi Terpusat (Bisa dibagi/sharing ke semua folder)]
├── pnpm-workspace.yaml        [Mendata folder apa saja yang "berbagi" node_modules]
│
├── shared/
│   └── proto/                 [Berisi file kontrak DDS streaming: *.proto]
│
├── apps/
│   ├── fe-pusat/              [Aplikasi Pusat - React 18 & Rspack]
│   │   └── package.json       (Hanya deklarasi dependensi, tapi ditarik dari root)
│   └── fe-posko/              [Aplikasi Daerah - React 18 & Rspack]
│       └── package.json       (Klon dependensi yang sama)
│
└── servers/
    └── node-gateway/          [Kode JavaScript Node.js Router (BE Versi 2)]
```

### 2. File Konfigurasi Pembangun Monorepo

Ini adalah dua *file* krusial yang harus Anda buat pertama kali di *root* (akar) folder proyek Anda:

#### `pnpm-workspace.yaml`
Memerintahkan pnpm bahwa folder-folder tertentu saling terkait.
```yaml
packages:
  # Folder berisi aplikasi React Front-End
  - 'apps/*'
  # Folder berisi Backend Node.js
  - 'servers/*'
  # (Konvensional) Folder untuk meletakkan librari yang dipakai berkala (seperti File Proto)
  - 'shared/*'
```

#### `package.json` (Di dalam folder *root*)
Dapat digunakan untuk mengatur *scripts* agar Anda bisa menghidupkan kedua FE sekaligus dengan 1 perintah *(run-in-parallel)*.
```json
{
  "name": "webdds-gunung-monorepo",
  "private": true,
  "scripts": {
    "dev:fe": "pnpm --filter \"./apps/*\" run dev",
    "dev:be": "pnpm --filter \"node-gateway\" run start",
    "dev:all": "pnpm dev:be & pnpm dev:fe"
  }
}
```

### 3. Kehebatan Pnpm Workspaces (Cara Install dan Sharing)
1.  **Satu Command Menguasai Semua:** Dari root folder (`webdds-gunung-monorepo/`), Anda cukup membuka terminal dan mengetik `pnpm install` **HANYA SATU KALI**.
2.  **`pnpm-lock.yaml` Sebagai Dewa Penyelamat:** *File* *lock* ini hanya akan ada satu biji di dalam folder *root*. Ini menjamin seluruh aplikasi FE Anda (bahkan jika sewaktu-waktu ditambahkan sampai `fe-3`, `fe-mobile`, dst) dipastikan berjalan menggunakan versi *React*, *Zustand*, dan *protoc-gen* yang sama persis hingga tingkat *patch*-nya. 
3.  **Tidak Ada Duplikasi Dependencies (`node_modules` Berbasis Hard-Links):** Ratusan Mega *node_modules* tidak akan menggandakan diri membebani SSD komputer Anda di dalam `fe-pusat` dan `fe-posko`. `pnpm` secara cerdas mengikat (*sharing hard links*) kedua folder tersebut ke *Global Store* pnpm di mesin Anda. File pustaka React 18 secara fisik hanya di- *download* satu kali oleh komputer Anda.

Dengan arsitektur ini, proyek *PoC WebDDS* Anda kini berstandar absolut dari hulu hingga hilir infrastruktur FE!
