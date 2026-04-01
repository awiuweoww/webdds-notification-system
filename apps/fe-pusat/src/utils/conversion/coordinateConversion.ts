/**
 * Mengonversi nilai Latitude (Garis Lintang) dan Longitude (Garis Bujur) dari bentuk angka/string mentah
 * menjadi format pembacaan derajat lengkap dengan arah Mata Angin (N, S, E, W), sesuai dengan Mockup UI WebDDS.
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
	const latDirection = lat >= 0 ? "N" : "S";
	const lonDirection = lon >= 0 ? "E" : "W";

	const absoluteLat = Math.abs(lat).toFixed(4); 
	const absoluteLon = Math.abs(lon).toFixed(4);

	return `${absoluteLat}° ${latDirection}, ${absoluteLon}° ${lonDirection}`;
};
