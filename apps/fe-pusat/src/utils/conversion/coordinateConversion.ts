/**
 * Mengonversi nilai Latitude (Garis Lintang) dan Longitude (Garis Bujur) dari bentuk angka/string mentah
 * menjadi format pembacaan derajat lengkap dengan arah Mata Angin (N, S, E, W), sesuai dengan Mockup UI WebDDS.
 *
 * Contoh: 
 * formatCoordinate("-7.5407", "110.4457")  --> "7.5407° S, 110.4457° E"
 *
 * @param {string | number} latitude - Titik Lintang. Negatif berarti Selatan (S).
 * @param {string | number} longitude - Titik Bujur. Negatif berarti Barat (W).
 * @returns {string} String titik koordinat yang sudah diformat secara visual.
 */
export const formatCoordinate = (
	latitude: string | number,
	longitude: string | number
): string => {
	if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
		return "-";
	}

	const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;
	const lon = typeof longitude === "string" ? parseFloat(longitude) : longitude;

	if (isNaN(lat) || isNaN(lon)) return "-";

	// Lintang / Latitude: Positif = Utara (N), Negatif = Selatan (S)
	const latDirection = lat >= 0 ? "N" : "S";
	// Bujur / Longitude: Positif = Timur (E), Negatif = Barat (W)
	const lonDirection = lon >= 0 ? "E" : "W";

	const absoluteLat = Math.abs(lat).toFixed(4); // Format ke 4 angka di belakang koma (akurasi GPS GPS generik)
	const absoluteLon = Math.abs(lon).toFixed(4);

	return `${absoluteLat}° ${latDirection}, ${absoluteLon}° ${lonDirection}`;
};
