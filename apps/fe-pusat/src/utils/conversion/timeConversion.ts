/**
 * Utilitas untuk konversi Tanggal dan Waktu.
 */

/**
 * Mengubah timestamp (ISO string atau Number) menjadi format tanggal singkat (Contoh: "31 Mar 2026") yang diperlukan untuk UI log aktivitas lokal FE2.
 * menjadi format jam singkat (Contoh: "10:45 AM") yang diperlukan untuk UI log aktivitas lokal FE2.
 *
 * @param {string | number} timestamp - Waktu asal (ISO string atau timestamp Number).
 * @returns {string} String waktu yang diformat. Mengembalikan "-" jika invalid.
 */
export const formatToShortTime = (timestamp: string | number): string => {
	if (!timestamp) return "-";
	try {
		const date = new Date(timestamp);
		if (isNaN(date.getTime())) return "-";

		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
	} catch {
		return "-";
	}
};

