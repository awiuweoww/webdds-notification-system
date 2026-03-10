# 🌋 WebDDS Disaster Command PoC

> Sistem Pemantauan Posko Gunung Vulkanik Indonesia berbasis WebDDS (Publish-Subscribe) _Real-Time Network_.

Proyek ini adalah sebuah **Proof of Concept (PoC)** berskala _Enterprise_ yang mendemonstrasikan kekuatan arsitektur pertukaran pesan WebDDS di ranah antarmuka web modern. Proyek ini membuktikan bagaimana aplikasi Web mampu berinteraksi layaknya _Subscriber_ pasif dan _Publisher_ aktif di tengah gempuran data berkecepatan tinggi tanpa menggunakan server _database HTTP REST_ tradisional.

---

## 🛠️ Tech Stack & Monorepo

Proyek ini dibangun menggunakan arsitektur **pnpm workspaces** (Monorepo) yang membagikan satu _file_ kontrak komunikasi secara serempak.

- **Frontend 1 & 2:** React 18, TypeScript, Rspack (Ultra-fast Bundler), Tailwind CSS.
- **State Management:** Zustand (Dengan optimasi `Record<string, Data>` berkecepatan `O(1)`).
- **Backend Gateway:** Node.js, Express, Socket/gRPC Dummy Generator.
- **Protokol:** gRPC-Web / WebDDS Pattern (Pub/Sub).

---

## 🏗️ Arsitektur & Analisis Alur Data Sistem

### 1. Markas Pusat - FE 1 (Global Subscriber)

FE 1 berfungsi sebagai _Monitoring Dashboard_. Sifatnya memonitor secara pasif namun sangat reaktif terhadap puluhan _Data Streaming_ maupun interupsi notifikasi manual.

- **Lonceng Notifikasi:** Hanya akan berdentang jika data terbaru bersetatus **BAHAYA** atau **WASPADA** (terutama kiriman dari posko lapangan).
- **Summary Cards Statistik:**
  - **Total Laporan Masuk:** Akumulasi _all-time_ semua klik dari FE 2 dan Sensor.
  - **Laporan Hari Ini:** Tersaring akurat berdasar 24 jam terakhir.
- **Tabel Live Data Grid:**
  - Menampilkan kombinasi riwayat otomatis _Streaming_ dan input _Manual_.
  - **Leveling System:** Menyimpan riwayat jika status level berbeda (Misal Pos A melapor Waspada dan Bahaya di jam berbeda, keduanya akan tampil tersusun rapi). Baris bahaya akan berwarna putih terang, baris "Sudah Diatasi" akan meredup gelap otomatis.
- **Recent Activity Log:** Mengalir ke bawah otomatis **hanya** ketika sistem mendeteksi ada perubahan lompatan status (Bukan _Spam_).
- **🚨 Peringatan Kritis (Red Toast):** Pop-up agresif yang menginvasi layar tiap sistem Gateway mendorong paket berstempel "BAHAYA".

### 2. Posko Darurat Daerah - FE 2 (Regional Publisher)

Berbeda dengan FE 1, FE 2 lebih difokuskan pada pengumpulan **Data Laporan Manual Eksekutif** yang harus dikirim murni melewati jalur _WebDDS_.

- **Header Regional:** Membawa _Payload Identifier_ otomatis (`Operator Field ID`).
- **Form Observasi:** Tempat operator menekan pelatuk _JSON Payload_ (Titik Koordinat, Level Kondisi, dan Kronologi) ber-arsitektur _Composite Key_ pintar (Anti-Spam Form).
- **Tombol 🚨 "SUBMIT LAPORAN":** Begitu ditekan, Frontend _by-pass_ database berat dan membombardir Gateway, mengirim daya komputasi secara instan menyebrang menuju Tabel FE 1 secara ajaib kurang dari setengah detik.

### 3. Simulator Dummy Node.js (Gateway Middleware)

Karena proyek ini menganut logika asinkron **Global Data Space**:

1. Server Node.js ini akan bertingkah layaknya _Alat Sensor IoT (ESP32)_ yang terus menyemprotkan angka-angka _dummy streaming_ (Data Pabrik).
2. Ini memvalidasi algoritma UI FE 1 yang dirancang dengan **Zustand**—membuktikan bahwa komponen tidak bocor memory / _lag_ saat dihantam gempuran interval _rendering_ data tingkat tinggi, yang menjadi nyawa kekuatan _"Game Changer WebDDS"_.

---

## 🚀 Panduan Instalasi (Getting Started)

### 1. Prasyarat Sistem

Pastikan komputer Anda sudah terinstal:

- [Node.js](https://nodejs.org/) (Versi 18 LTS atau lebih baru)
- [pnpm](https://pnpm.io/installation) (Global package manager). _Install dengan mengetik: `npm install -g pnpm`_ di terminal jika belum memilikinya.

### 2. Cara Menginisialisasi Proyek

Karena proyek ini berbasis Monorepo _pnpm_, Anda hanya perlu melakukan instalasi dependensi satu kali di akar dokumen (_root_), dan _pnpm_ akan menyebarkannya (_Hard Link_) secara ajaib ke semua folder FE!

Buka Terminal / Command Prompt di folder Root proyek Anda:

```bash
# 1. Kloning (atau buka) repositori Anda
cd webdds-notification-system

# 2. Instal semua dependensi untuk ketiga sub-proyek (Hanya dipanggil sekali dari Root)
pnpm install
```

---

## ⚡ Daftar Script Terminal (Perintah Menjalankan)

Proyek ini memiliki _Custom Scripts_ paralelisasi yang sudah diatur rapi di di `package.json` Root.

### Menjalankan Frontend Masing-Masing

Jika Anda hanya ingin menyalakan salah satu komputer secara spesifik (Misalnya Anda sedang fokus mendesain UI).

| Perintah Terminal       | Kegunaan                                 | Alamat Port Akses       |
| :---------------------- | :--------------------------------------- | :---------------------- |
| `pnpm dev:pusat`        | Menyalakan **FE 1 (Markas Pusat)**       | `http://localhost:3000` |
| `pnpm dev:posko`        | Menyalakan **FE 2 (Posko Daerah)**       | `http://localhost:3001` |
| `pnpm dev:node-gateway` | Menyalakan **Server Middleware Node.js** | `http://localhost:4000` |

### 🌟 Menjalankan Semuanya Bersamaan (Super Command)

Jika Anda sudah siap melakukan simulasi komunikasi FE -> FE layaknya dua tab bersautan:

```bash
# Perintah ampuh untuk menyalakan 2 Tab Frontend dan 1 Backend secara serentak (Paralel)
pnpm dev:all
```

_Tunggu sesaat, dan Anda sudah siap menguji simulasi DDS tercepat di planet ini!_
