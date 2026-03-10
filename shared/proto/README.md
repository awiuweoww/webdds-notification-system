# 📄 Dokumentasi Kontrak Proto — `ddsgunung.proto`

> Direktori ini berisi file kontrak komunikasi gRPC untuk sistem **WebDDS Disaster Command PoC**.
> File `.proto` adalah "bahasa bersama" yang wajib dipahami oleh seluruh komponen sistem.

---

## 🧭 Peran File Ini dalam Sistem

```
FE 2 (Posko)          Node.js Gateway          FE 1 (Pusat)
   [Publisher]    →   [Terminal Transit]   →   [Subscriber]
        ↑                                           ↑
        └──────── ddsgunung.proto ──────────────────┘
                  (Kontrak Bersama)
```

File `.proto` ini di-_compile_ oleh **ConnectRPC (Buf)** menjadi kode TypeScript yang bisa langsung di-_import_ di React (FE) maupun Node.js (BE). Tidak perlu APISIX atau Docker.

---

## 📦 Daftar Pesan (Messages)

Pesan adalah "cetakan/template" struktur data yang terbang di jaringan.

> ⚠️ **Penting:** Nomor field (1, 2, 3...) tidak boleh diubah setelah sistem berjalan di _production_, karena angka tersebut yang dipakai sebagai kode biner di jaringan — bukan nama teksnya.

### 1. `EmptyRequest`

Pesan kosong. Dipakai saat sebuah RPC tidak memerlukan input dari client.

**Dipakai oleh:** `SubscribeGlobalStream` — FE 1 cukup "mengetuk pintu" Gateway tanpa membawa data apapun agar bisa mulai berlangganan stream.

---

### 2. `DisasterReport`

**Inti dari seluruh sistem.** Satu objek ini merepresentasikan tepat **satu baris data** di tabel Bencana Nasional FE 1.

| Field                | Tipe     | No. | Penjelasan                                                                |
| :------------------- | :------- | :-- | :------------------------------------------------------------------------ |
| `id`                 | `string` | 1   | Kunci unik baris. Lihat aturan Composite Key di bawah.                    |
| `origin_id`          | `string` | 2   | Identifier pengirim. Contoh: `"POSKO-BDO-01"`, `"SENSOR-MERAPI-01"`       |
| `source_name`        | `string` | 3   | Label tampilan di tabel. Contoh: `"Gunung Merapi - Pos 1"`                |
| `latitude`           | `string` | 4   | Koordinat desimal. Contoh: `"-7.5407"`                                    |
| `longitude`          | `string` | 5   | Koordinat desimal. Contoh: `"110.4457"`                                   |
| `bencana_type`       | `string` | 6   | Kategori. Contoh: `"Erupsi Gunung"`, `"Banjir Lahar"`                     |
| `status_level`       | `int32`  | 7   | Level urgensi (lihat tabel Enum di bawah)                                 |
| `status_penanganan`  | `int32`  | 8   | Status tim penanganan (lihat tabel Enum di bawah)                         |
| `observation_detail` | `string` | 9   | Narasi bebas dari operator FE 2. Kosong `""` untuk data streaming sensor. |
| `timestamp`          | `string` | 10  | Format ISO 8601. Contoh: `"2026-03-10T14:22:38+07:00"`                    |

#### Enum: `status_level`

| Nilai | Nama    | Efek di UI FE 1                                             |
| :---: | :------ | :---------------------------------------------------------- |
|  `0`  | NORMAL  | Baris berwarna hijau/redup                                  |
|  `1`  | WASPADA | Baris berwarna kuning, lonceng notifikasi berbunyi          |
|  `2`  | BAHAYA  | Baris berwarna merah, **Pop-Up Alert Merah** muncul agresif |
|  `3`  | OFF     | Sensor mati/offline, baris berwarna abu-abu                 |

#### Enum: `status_penanganan`

| Nilai | Nama          | Efek di UI FE 1                            |
| :---: | :------------ | :----------------------------------------- |
|  `0`  | AKTIF         | Baris terang, masalah baru belum ditangani |
|  `1`  | PROSES        | Sedang dalam penanganan tim                |
|  `2`  | SUDAH DIATASI | Baris menjadi lebih gelap/redup otomatis   |

#### Aturan Composite Key (Anti-Spam Form)

Field `id` bukan sekadar UUID acak. Nilainya dirancang secara strategis:

- **Data Manual (FE 2):**
  Format: `"MANUAL-{originId}-{statusLevel}"`
  Contoh: `"MANUAL-POSKO-BDO-BAHAYA"`

  > Efek: Jika operator menekan tombol Submit berkali-kali dengan status yang _sama_, data tidak menumpuk. Hanya baris terakhir yang diperbarui.
  > Jika status _berbeda_ (misal pertama WASPADA, lalu BAHAYA), keduanya muncul sebagai dua baris terpisah.

- **Data Streaming Sensor (BE → FE 1):**
  Format: `"STREAM-{sensorId}"`
  Contoh: `"STREAM-MERAPI-01"`
  > Efek: Data sensor terbaru selalu me-_replace_ baris yang sama secara _real-time_.

---

### 3. `UpdatePenangananRequest`

Request khusus untuk memperbarui status penanganan laporan dari FE 1.

| Field               | Tipe     | No. | Penjelasan                                            |
| :------------------ | :------- | :-- | :---------------------------------------------------- |
| `report_id`         | `string` | 1   | ID laporan yang ingin diubah statusnya                |
| `status_penanganan` | `int32`  | 2   | Status baru: `0` AKTIF, `1` PROSES, `2` SUDAH DIATASI |

**Dipakai oleh:** `UpdateStatusPenanganan` — Dipanggil saat operator FE 1 mengklik tombol di Modal (Contoh: "SUDAH DIATASI").

---

### 4. `PublishResponse`

Respons balasan dari Gateway setelah memproses RPC dari FE 1 maupun FE 2.

| Field        | Tipe     | No. | Penjelasan                                                                                     |
| :----------- | :------- | :-- | :--------------------------------------------------------------------------------------------- |
| `success`    | `bool`   | 1   | `true` jika berhasil, `false` jika gagal                                                       |
| `message`    | `string` | 2   | Teks notifikasi untuk Log Activity FE 2. Contoh: `"Laporan berhasil dikirim ke Markas Pusat."` |
| `receipt_id` | `string` | 3   | ID kwitansi penerimaan. Contoh: `"RCPT-1741582958"`                                            |

---

## ⚙️ Daftar Layanan (Service RPC)

Service `DisasterCommandService` berisi tiga metode yang bisa dipanggil client (FE) ke server (Gateway).

### 1. `SubscribeGlobalStream` — Server Streaming

```
Input  : EmptyRequest
Output : stream DisasterReport (koneksi terbuka selamanya)
Pemanggil : FE 1 (fe-pusat)
```

Kata kunci `stream` berarti koneksi **tidak ditutup** setelah satu balasan. Gateway terus-menerus memompa `DisasterReport` baru ke FE 1 selama tab browser masih terbuka. Ini adalah **inti dari konsep Subscribe WebDDS.**

**Alur:**

1. FE 1 memanggil RPC ini saat komponen di-_mount_ (halaman dimuat).
2. Gateway membuka "pipa data" permanen ke FE 1.
3. Setiap ada laporan baru (dari FE 2 atau sensor _dummy_), Gateway menyemprot data ke pipa.
4. React + Zustand di FE 1 menangkap → `applyIncomingReport(data)` → Tabel diperbarui otomatis.

---

### 2. `PublishManualReport` — Unary

```
Input  : DisasterReport
Output : PublishResponse (sekali balas, koneksi tutup)
Pemanggil : FE 2 (fe-posko)
```

Tidak ada `stream`. Ini adalah panggilan biasa: **Kirim → Proses → Balas → Selesai.** Ini adalah **inti dari konsep Publish WebDDS.**

**Alur:**

1. Operator FE 2 menekan tombol `"SUBMIT LAPORAN"`.
2. React mengemas data form ke dalam `DisasterReport`.
3. ConnectRPC Client menembakkan RPC ini ke Gateway.
4. Gateway menerima → menyebarkan ke **semua** FE 1 yang aktif via `SubscribeGlobalStream`.
5. Gateway membalas FE 2 dengan `PublishResponse`.
6. FE 2 mencatat hasilnya ke `useActivityStore` (Log Panel Kiri).

---

### 3. `UpdateStatusPenanganan` — Unary

```
Input  : UpdatePenangananRequest
Output : PublishResponse (sekali balas)
Pemanggil : FE 1 (fe-pusat)
```

Dipanggil saat operator Markas Pusat mengubah status penanganan laporan via Modal.

**Alur:**

1. Operator FE 1 klik baris di tabel → Modal muncul.
2. Operator klik `"SUDAH DIATASI"`.
3. RPC ini dikirim ke Gateway.
4. Gateway memperbarui data di semua stream aktif FE 1 → baris tersebut meredup warnanya secara serentak di semua tab yang terbuka.
5. Gateway membalas sukses/gagal ke FE 1 yang meminta.

---

## 🔧 Cara Compile (Generate TypeScript)

Setelah instalasi `buf` CLI, jalankan dari root folder:

```bash
# Instal buf CLI (sekali saja)
npm install -g @bufbuild/buf

# Generate TypeScript dari file .proto
buf generate
```

Output yang dihasilkan di folder `shared/gen/`:

- `ddsgunung_pb.ts` — Tipe data Message (DisasterReport, dll.)
- `ddsgunung_connect.ts` — Service client/server siap pakai di React & Node.js
