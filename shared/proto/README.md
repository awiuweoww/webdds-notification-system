# 📄 Dokumentasi Kontrak Proto — `ddsgunung.proto`

> Direktori ini berisi file kontrak komunikasi untuk sistem **WebDDS Disaster Command PoC**.
> File `.proto` adalah "bahasa bersama" yang wajib dipahami oleh seluruh komponen sistem.

---

## 🧭 Peran File Ini dalam Sistem

```
FE Posko (FE 2)                                        FE Pusat (FE 1)
   [Publisher]                                           [Subscriber]
       │                                                      │
       │         ┌─────────────────────────┐                  │
       ├─WebDDS──┤     WebDDS Pub/Sub      ├──WebDDS──────────┤
       │         │   (Real-time Topics)    │                  │
       │         └────────────┬────────────┘                  │
       │                      │                               │
       │                  [Subscribe]                         │
       │                      │                               │
       │              ┌───────┴───────┐                       │
       ├──gRPC-Web──► │   APISIX      │ ◄──gRPC-Web──────────┤
       │              │   (Proxy)     │                       │
       │              └───────┬───────┘                       │
       │                      │ gRPC                          │
       │              ┌───────┴───────┐                       │
       │              │   BE Server   │                       │
       │              │   (Database)  │                       │
       │              └───────────────┘                       │
       │                                                      │
       └──────── ddsgunung.proto (Kontrak Bersama) ───────────┘
```

### Dua Jalur Komunikasi

| Jalur                | Via            | Fungsi                           | Kapan Dipakai                           |
| :------------------- | :------------- | :------------------------------- | :-------------------------------------- |
| **WebDDS** (Pub/Sub) | Topic langsung | Notifikasi & streaming real-time | Data perlu sampai **sekarang juga**     |
| **gRPC** (Req/Res)   | APISIX proxy   | CRUD ke database                 | Data perlu **disimpan/diambil** dari DB |

---

## 📦 Daftar Pesan (Messages)

Pesan adalah "cetakan/template" struktur data yang dikirim lewat jaringan.

> ⚠️ **Penting:** Nomor field (1, 2, 3...) tidak boleh diubah setelah sistem berjalan di _production_, karena angka tersebut yang dipakai sebagai kode biner di jaringan — bukan nama teksnya.

### 1. `EmptyRequest`

Pesan kosong. Dipakai saat sebuah RPC tidak memerlukan input dari client.

**Dipakai oleh:** `GetAllReports` — FE cukup memanggil tanpa parameter untuk mendapatkan seluruh data laporan dari DB.

---

### 2. `DisasterReport`

**Inti dari seluruh sistem.** Satu objek ini merepresentasikan tepat **satu baris data** di tabel Bencana Nasional FE Pusat. Digunakan oleh **gRPC dan WebDDS** sebagai format data bersama.

| Field                | Tipe     | No. | Penjelasan                                                          |
| :------------------- | :------- | :-- | :------------------------------------------------------------------ |
| `id`                 | `string` | 1   | Kunci unik baris. Lihat aturan Composite Key di bawah.              |
| `origin_id`          | `string` | 2   | Identifier pengirim. Contoh: `"POSKO-BDO-01"`, `"SENSOR-MERAPI-01"` |
| `source_name`        | `string` | 3   | Label tampilan di tabel. Contoh: `"Gunung Merapi - Pos 1"`          |
| `latitude`           | `string` | 4   | Koordinat desimal. Contoh: `"-7.5407"`                              |
| `longitude`          | `string` | 5   | Koordinat desimal. Contoh: `"110.4457"`                             |
| `bencana_type`       | `string` | 6   | Kategori. Contoh: `"Gempa Bumi"`, `"Banjir"`, `"Tanah Longsor"`     |
| `status_level`       | `int32`  | 7   | Level bahaya (lihat tabel Enum di bawah)                            |
| `status_penanganan`  | `int32`  | 8   | Status penanganan (lihat tabel Enum di bawah)                       |
| `observation_detail` | `string` | 9   | Narasi bebas dari operator FE Posko. Kosong `""` untuk data sensor. |
| `timestamp`          | `string` | 10  | Format ISO 8601. Contoh: `"2026-03-10T14:22:38+07:00"`              |

#### Enum: `status_level`

| Nilai | Nama    | Efek di UI FE Pusat                        |
| :---: | :------ | :----------------------------------------- |
|  `0`  | NORMAL  | Badge hijau                                |
|  `1`  | WASPADA | Badge kuning, notifikasi muncul            |
|  `2`  | SIAGA   | Badge oranye                               |
|  `3`  | AWAS    | Badge merah, **Pop-Up Alert Merah** muncul |
|  `4`  | OFF     | Sensor mati/offline, badge abu-abu         |

#### Enum: `status_penanganan`

| Nilai | Nama           | Efek di UI FE Pusat                        |
| :---: | :------------- | :----------------------------------------- |
|  `0`  | AKTIF          | Baris terang, masalah baru belum ditangani |
|  `1`  | PROSES         | Badge kuning "PROSES EVAKUASI"             |
|  `2`  | SUDAH DIATASI  | Badge hijau, baris menjadi gelap/redup     |
|  `3`  | GAGAL TERATASI | Badge merah "GAGAL DIEVAKUASI"             |

#### Aturan Composite Key (Anti-Spam Form)

Field `id` bukan sekadar UUID acak. Nilainya dirancang secara strategis:

- **Data Manual (FE Posko):**
  Format: `"MANUAL-{originId}-{statusLevel}"`
  Contoh: `"MANUAL-POSKO-BDO-AWAS"`

  > Efek: Jika operator menekan Submit berkali-kali dengan status yang _sama_, data tidak menumpuk. Hanya baris terakhir yang diperbarui.
  > Jika status _berbeda_ (misal WASPADA lalu AWAS), keduanya muncul sebagai dua baris terpisah.

- **Data Streaming Sensor (BE → FE Pusat):**
  Format: `"STREAM-{sensorId}"`
  Contoh: `"STREAM-MERAPI-01"`
  > Efek: Data sensor terbaru selalu me-_replace_ baris yang sama secara _real-time_.

---

### 3. `ReportByIdRequest`

Request untuk mengambil satu laporan spesifik dari database.

| Field       | Tipe     | No. | Penjelasan                    |
| :---------- | :------- | :-- | :---------------------------- |
| `report_id` | `string` | 1   | ID laporan yang ingin diambil |

**Dipakai oleh:** `GetReportById`

---

### 4. `UpdatePenangananRequest`

Request untuk memperbarui status penanganan laporan dari FE Pusat.

| Field               | Tipe     | No. | Penjelasan                                                 |
| :------------------ | :------- | :-- | :--------------------------------------------------------- |
| `report_id`         | `string` | 1   | ID laporan yang ingin diubah statusnya                     |
| `status_penanganan` | `int32`  | 2   | Status baru: `0` Aktif, `1` Proses, `2` Diatasi, `3` Gagal |

**Dipakai oleh:** `UpdateStatusPenanganan` — Dipanggil saat operator FE Pusat mengklik tombol di Modal.

---

### 5. `DeleteReportRequest`

Request untuk menghapus laporan dari database.

| Field       | Tipe     | No. | Penjelasan                   |
| :---------- | :------- | :-- | :--------------------------- |
| `report_id` | `string` | 1   | ID laporan yang akan dihapus |

**Dipakai oleh:** `DeleteReport`

---

### 6. `PublishResponse`

Respons umum dari server setelah memproses operasi mutasi.

| Field        | Tipe     | No. | Penjelasan                                             |
| :----------- | :------- | :-- | :----------------------------------------------------- |
| `success`    | `bool`   | 1   | `true` jika berhasil, `false` jika gagal               |
| `message`    | `string` | 2   | Teks deskriptif. Contoh: `"Laporan berhasil dihapus."` |
| `receipt_id` | `string` | 3   | ID tanda terima. Contoh: `"RCPT-1741582958"`           |

---

### 7. `ReportListResponse`

Respons berisi daftar laporan dari database.

| Field         | Tipe                      | No. | Penjelasan                  |
| :------------ | :------------------------ | :-- | :-------------------------- |
| `reports`     | `repeated DisasterReport` | 1   | Array laporan dari database |
| `total_count` | `int32`                   | 2   | Total jumlah laporan        |

**Dipakai oleh:** `GetAllReports`

---

## ⚙️ Daftar Layanan gRPC (Service RPC)

Service `DisasterCommandService` berisi metode **request/response** yang dipanggil client (FE) ke server (BE) melalui APISIX proxy.

> **Catatan:** Streaming real-time TIDAK ada di service ini — streaming ditangani oleh **WebDDS Topics** (lihat bagian di bawah).

### 1. `GetAllReports` — Unary

```
Input     : EmptyRequest
Output    : ReportListResponse (array laporan + total count)
Pemanggil : FE Pusat (saat halaman pertama kali dibuka)
```

**Alur:**

1. FE Pusat di-_mount_ (halaman dimuat).
2. `setLoading(true)` → kirim RPC ke BE via APISIX.
3. BE query seluruh laporan dari database → balas `ReportListResponse`.
4. FE loop `reports` → `applyIncomingReport()` per item → `setLoading(false)`.
5. Tabel dan SummaryCards terisi.

---

### 2. `GetReportById` — Unary

```
Input     : ReportByIdRequest (report_id)
Output    : DisasterReport (data lengkap 1 laporan)
Pemanggil : FE Pusat (saat user klik baris tabel untuk lihat detail)
```

**Alur:**

1. User klik baris di tabel → Modal detail terbuka.
2. FE bisa ambil data terbaru dari BE (opsional, karena data sudah ada di store).
3. Berguna jika data di store sudah _stale_ dan perlu di-refresh dari DB.

---

### 3. `UpdateStatusPenanganan` — Unary

```
Input     : UpdatePenangananRequest (report_id + status baru)
Output    : PublishResponse (sukses/gagal + pesan)
Pemanggil : FE Pusat (saat operator ubah status di Modal)
```

**Alur:**

1. Operator FE Pusat klik baris di tabel → Modal muncul.
2. Operator klik `"SUDAH DIATASI"`.
3. RPC ini dikirim ke BE via APISIX → BE update database.
4. BE membalas `PublishResponse` sukses/gagal.
5. Bersamaan, perubahan di-_publish_ ke WebDDS topic `status-updates` agar FE Posko langsung tahu.

---

### 4. `DeleteReport` — Unary

```
Input     : DeleteReportRequest (report_id)
Output    : PublishResponse (sukses/gagal + pesan)
Pemanggil : FE Pusat (saat operator hapus laporan dari tabel)
```

**Alur:**

1. Operator klik tombol hapus di tabel → Modal konfirmasi muncul.
2. Operator klik `"Hapus"`.
3. RPC ini dikirim ke BE via APISIX → BE hapus dari database.
4. BE membalas `PublishResponse` sukses/gagal.

---

## 🌐 WebDDS Topics (Pub/Sub Real-time)

Berikut adalah topik WebDDS untuk komunikasi langsung antar komponen. Data yang dikirim menggunakan format `DisasterReport` yang sama.

### 1. Topic: `disaster-reports`

```
Publisher  : FE Posko (saat submit form laporan)
Subscriber : FE Pusat (terima notif + data), BE (simpan ke DB)
Data       : DisasterReport
```

**Alur:**

1. Operator FE Posko mengisi form → klik `"SUBMIT LAPORAN"`.
2. Data form dikemas menjadi `DisasterReport`.
3. FE Posko **publish** ke topic `disaster-reports`.
4. FE Pusat (subscriber) langsung terima → `applyIncomingReport()` → 🔔 notifikasi + tabel update.
5. BE (subscriber) juga terima → simpan ke database untuk persistensi.

---

### 2. Topic: `sensor-stream`

```
Publisher  : BE (setiap beberapa detik)
Subscriber : FE Pusat (live data update)
Data       : DisasterReport
```

**Alur:**

1. BE membaca data dari sensor (atau simulasi dummy).
2. Setiap 3-5 detik, BE **publish** `DisasterReport` dengan `status_level` yang berubah-ubah.
3. FE Pusat (subscriber) terima → `applyIncomingReport()` → baris tabel di-_replace_ secara real-time.
4. Karena `id` menggunakan format `"STREAM-{sensorId}"`, data selalu menimpa baris yang sama.

---

### 3. Topic: `status-updates`

```
Publisher  : FE Pusat (saat update status penanganan)
Subscriber : FE Posko (terima status terbaru), BE (update DB)
Data       : UpdatePenangananRequest
```

**Alur:**

1. Operator FE Pusat mengubah status penanganan di Modal.
2. Selain kirim gRPC ke BE, perubahan juga di-**publish** ke topic ini.
3. FE Posko (subscriber) langsung terima → tahu bahwa statusnya sudah diubah.

---

## 🔧 Cara Compile (Generate Code)

Dari root folder project, jalankan:

```bash
# Generate kode dari file .proto (menggunakan protoc + grpc-web plugin)
pnpm --filter grpc-shared run generate-proto
```

Output yang dihasilkan di folder `shared/gen/`:

- `ddsgunung_pb.js` — Kelas Message (DisasterReport, ReportListResponse, dll.)
- `ddsgunung_grpc_web_pb.js` — Service client untuk gRPC-Web
