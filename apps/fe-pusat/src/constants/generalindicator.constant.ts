/**
 * Created Date       : 31-03-2026
 * Description        : Konstanta mapping indikator status bencana dan penanganan.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Penyesuaian 4 level status bencana (Normal, Waspada, Siaga, Awas).
 */
export type IndicatorType =
	| "success"
	| "warning"
	| "siaga"
	| "danger"
	| "off"
	| "neutral";

export interface Indicator {
	title: string;
	type: IndicatorType;
}

/**
 * Mengembalikan indikator status bencana berdasarkan status yang diberikan.
 *
 * @param {number} status Status bencana yang ingin di-indikasikan.
 * @returns {Indicator | null} Indikator status bencana yang sesuai dengan status yang diberikan.
 * @example
 * getDisasterStatusIndicator(0) // => { title: "NORMAL", type: "success" }
 * getDisasterStatusIndicator(1) // => { title: "WASPADA", type: "warning" }
 * getDisasterStatusIndicator(2) // => { title: "SIAGA", type: "siaga" }
 * getDisasterStatusIndicator(3) // => { title: "AWAS", type: "danger" }
 * getDisasterStatusIndicator(4) // => { title: "OFF", type: "off" }
 */
export const getDisasterStatusIndicator = (
	status: number
): Indicator | null => {
	const statusBencana: Record<number, Indicator> = {
		0: { title: "NORMAL", type: "success" },
		1: { title: "WASPADA", type: "warning" },
		2: { title: "SIAGA", type: "siaga" },
		3: { title: "AWAS", type: "danger" },
		4: { title: "OFF", type: "off" }
	};

	return statusBencana[status] ?? null;
};

/**
 * Mengembalikan indikator status penanganan berdasarkan status yang diberikan.
 *
 * @param {number} status Status penanganan yang ingin di-indikasikan.
 * @returns {Indicator | null} Indikator status penanganan yang sesuai dengan status yang diberikan.
 * @example
 * getPenangananStatusIndicator(0) // => { title: "AKTIF", type: "danger" }
 * getPenangananStatusIndicator(1) // => { title: "PROSES", type: "warning" }
 * getPenangananStatusIndicator(2) // => { title: "SUDAH DIATASI", type: "success" }
 */
export const getPenangananStatusIndicator = (
	status: number
): Indicator | null => {
	const statusPenanganan: Record<number, Indicator> = {
		0: { title: "AKTIF", type: "danger" },
		1: { title: "PROSES", type: "warning" },
		2: { title: "SUDAH DIATASI", type: "success" }
	};

	return statusPenanganan[status] ?? null;
};
