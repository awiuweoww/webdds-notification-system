/**
 * Tipe data utama untuk sistem WebDDS Disaster Command — FE Pusat.
 */

/** Satu baris data di Tabel Bencana Nasional. */
export interface DisasterReport {
	id: string;
	originId: string;
	sourceName: string;
	latitude: string;
	longitude: string;
	bencanaType: string;
	statusLevel: number;
	statusPenanganan: number;
	observationDetail: string;
	timestamp: string;
}

/** Satu item di panel Activity Log. */
export interface ActivityLogEntry {
	id: string;
	time: string;
	title: string;
	description: string;
	type: "danger" | "warning" | "success" | "neutral" | "system";
}

/** Props untuk komponen SummaryCardItem. */
export interface SummaryCardProps {
	label: string;
	value: number | string;
	trend?: string;
	trendColor?: string;
	icon?: React.ReactNode;
}
