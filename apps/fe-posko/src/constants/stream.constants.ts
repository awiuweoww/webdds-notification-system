/**
 * Created Date       : 31-03-2026
 * Description        : Mapping enum untuk data streaming gRPC/WebDDS.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Penyesuaian enum level bencana (4-tier) dan status penanganan.
 */
export const enumMap = {
	levelBencana: {
		LEVEL_NORMAL: 0,
		LEVEL_WASPADA: 1,
		LEVEL_SIAGA: 2,
		LEVEL_AWAS: 3,
		LEVEL_OFF: 4, 
	} as Record<string, number>,
	
	statusPenanganan: {
		STATUS_AKTIF_BARU: 0,
		STATUS_SEDANG_PROSES: 1,
		STATUS_SUDAH_DIATASI: 2,
		STATUS_GAGAL_TERATASI: 3
	} as Record<string, number>
};

