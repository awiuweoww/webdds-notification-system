/**
 * Created Date       : 31-03-2026
 * Description        : Service layer untuk komunikasi gRPC-Web ke Backend via APISIX.
 *                      Menangani operasi request/response (CRUD) ke database.
 *
 * Arsitektur:
 *   Browser ──gRPC-Web──► APISIX (proxy) ──gRPC──► BE Server ──► Database
 *
 * Catatan:
 *   - Saat ini menggunakan mode SIMULASI karena BE dan APISIX belum siap.
 *   - Ketika BE sudah siap, ganti implementasi di dalam setiap fungsi
 *     dengan pemanggilan gRPC-Web client yang sesungguhnya.
 *   - Tipe data mengikuti kontrak dari ddsgunung.proto.
 *
 * Changelog:
 *   - 0.1.0 (31-03-2026): Implementasi awal dengan mode simulasi.
 */

import type { DisasterReport } from "../../types/disaster.types";


/**
 * URL endpoint APISIX proxy.
 */
const GRPC_PROXY_URL = "http://localhost:9080";
const IS_SIMULATION = true;

/** Respons dari operasi mutasi (update, delete). */
interface MutationResponse {
	success: boolean;
	message: string;
	receiptId: string;
}

/** Respons dari GetAllReports. */
interface ReportListResponse {
	reports: DisasterReport[];
	totalCount: number;
}


/**
 * Mengambil seluruh laporan dari database.
 * Dipanggil saat FE pertama kali dibuka untuk mengisi tabel.
 *
 * gRPC RPC: DisasterCommandService.GetAllReports
 * 
 * @returns Daftar laporan dan total count.
 */
export async function getAllReports(): Promise<ReportListResponse> {
	if (IS_SIMULATION) {
		// ── MODE SIMULASI ──
		// Mengembalikan array kosong — data dummy akan diisi oleh useDummyData hook.
		console.log("[gRPC Simulasi] GetAllReports dipanggil — BE belum tersedia.");
		return { reports: [], totalCount: 0 };
	}

	// ── MODE PRODUKSI (nanti) ──
	// TODO: Ganti dengan pemanggilan gRPC-Web client yang sesungguhnya.
	// Contoh dengan grpc-web:
	//
	// const client = new DisasterCommandServiceClient(GRPC_PROXY_URL);
	// const request = new EmptyRequest();
	// const response = await client.getAllReports(request, {});
	// return {
	//   reports: response.getReportsList().map(protoToDisasterReport),
	//   totalCount: response.getTotalCount()
	// };

	const response = await fetch(`${GRPC_PROXY_URL}/disaster.v1.DisasterCommandService/GetAllReports`, {
		method: "POST",
		headers: { "Content-Type": "application/grpc-web-text" },
	});
	const data = await response.json();
	return data as ReportListResponse;
}

/**
 * Mengambil detail satu laporan berdasarkan ID.
 *
 * gRPC RPC: DisasterCommandService.GetReportById
 *
 * @param reportId - ID laporan yang ingin diambil.
 * @returns Data lengkap laporan, atau null jika tidak ditemukan.
 */
export async function getReportById(reportId: string): Promise<DisasterReport | null> {
	if (IS_SIMULATION) {
		console.log(`[gRPC Simulasi] GetReportById("${reportId}") — BE belum tersedia.`);
		return null;
	}

	// TODO: Implementasi gRPC-Web client
	const response = await fetch(`${GRPC_PROXY_URL}/disaster.v1.DisasterCommandService/GetReportById`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ reportId }),
	});
	const data = await response.json();
	return data as DisasterReport;
}

/**
 * Mengupdate status penanganan sebuah laporan di database.
 * Dipanggil saat operator Pusat mengubah status di Modal detail.
 *
 * gRPC RPC: DisasterCommandService.UpdateStatusPenanganan
 *
 * @param reportId - ID laporan target.
 * @param statusPenanganan - Status baru (0=Aktif, 1=Proses, 2=Diatasi, 3=Gagal).
 * @returns Respons sukses/gagal.
 */
export async function updateStatusPenanganan(
	reportId: string,
	statusPenanganan: number
): Promise<MutationResponse> {
	if (IS_SIMULATION) {
		console.log(`[gRPC Simulasi] UpdateStatus("${reportId}", ${statusPenanganan}) — BE belum tersedia.`);
		return {
			success: true,
			message: `[Simulasi] Status berhasil diubah ke ${statusPenanganan}.`,
			receiptId: `SIM-${Date.now()}`
		};
	}

	// TODO: Implementasi gRPC-Web client
	const response = await fetch(`${GRPC_PROXY_URL}/disaster.v1.DisasterCommandService/UpdateStatusPenanganan`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ reportId, statusPenanganan }),
	});
	return (await response.json()) as MutationResponse;
}

/**
 * Menghapus laporan dari database.
 * Dipanggil saat operator Pusat menghapus laporan dari tabel.
 *
 * gRPC RPC: DisasterCommandService.DeleteReport
 *
 * @param reportId - ID laporan yang akan dihapus.
 * @returns Respons sukses/gagal.
 */
export async function deleteReport(reportId: string): Promise<MutationResponse> {
	if (IS_SIMULATION) {
		console.log(`[gRPC Simulasi] DeleteReport("${reportId}") — BE belum tersedia.`);
		return {
			success: true,
			message: `[Simulasi] Laporan ${reportId} berhasil dihapus.`,
			receiptId: `SIM-${Date.now()}`
		};
	}

	// TODO: Implementasi gRPC-Web client
	const response = await fetch(`${GRPC_PROXY_URL}/disaster.v1.DisasterCommandService/DeleteReport`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ reportId }),
	});
	return (await response.json()) as MutationResponse;
}
