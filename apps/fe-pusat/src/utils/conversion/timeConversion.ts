/**
 * Utilities for Date and Time conversions.
 */

/**
 * Mengonversi string menjadi format jam singkat (Contoh: "10:45 AM") yang diperlukan untuk UI log dan tabel.
 *
 * @param {string} timestampStr - String waktu (ISO 8601 format direkomendasikan).
 * @returns {string} String waktu yang diformat. Mengembalikan "-" jika invalid.
 */
export const formatToShortTime = (timestampStr: string): string => {
	if (!timestampStr) return "-";
	try {
		const date = new Date(timestampStr);
		if (isNaN(date.getTime())) return "-";

		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		});
	} catch (error) {
		return "-";
	}
};
