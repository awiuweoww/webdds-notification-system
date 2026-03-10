export type IndicatorType = "success" | "warning" | "danger" | "off" | "neutral";

export interface Indicator {
	title: string;
	type: IndicatorType;
}

export const getDisasterStatusIndicator = (
	status: number
): Indicator | null => {
	const statusBencana: Record<number, Indicator> = {
		0: { title: "NORMAL", type: "success" },
		1: { title: "WASPADA", type: "warning" },
		2: { title: "BAHAYA", type: "danger" },
		3: { title: "OFF", type: "off" } 
	};

	return statusBencana[status] ?? null;
};

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
