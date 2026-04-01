/**
 * Created Date       : 31-03-2026
 * Description        : Hook untuk mengelola seluruh state dan logika form pelaporan bencana.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Ekstrak logika form dari MainForm.
 * - 0.2.0 (31-03-2026): Integrasi WebDDS publish saat submit.
 */
import { useCallback, useState } from "react";

import { useActivityStore } from "../store/useActivityStore";
import * as webddsService from "../utils/api/disaster.webdds";
import { WEBDDS_TOPICS } from "../utils/api/disaster.webdds";
import { formatCoordinate } from "../utils/conversion/coordinateConversion";
import { useCoordinate } from "./useCoordinate";

const DEFAULT_STATUS_LEVEL = "Level 1: Normal / Aman";

const STATUS_LEVEL_MAP: Record<string, number> = {
	"Level 1: Normal / Aman": 0,
	"Level 2: Waspada": 1,
	"Level 3: Siaga": 2,
	"Level 4: Awas": 3
};

/**
 * Custom hook untuk mengelola state form pelaporan bencana.
 * Mengintegrasikan useCoordinate untuk input koordinat cerdas.
 * @returns State form, handler, dan status validasi.
 */
export const useDisasterForm = () => {
	const [jenisBencana, setJenisBencana] = useState("");
	const [statusLevel, setStatusLevel] = useState(DEFAULT_STATUS_LEVEL);
	const [isStatusOpen, setIsStatusOpen] = useState(false);
	const [detail, setDetail] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);

	const latCoord = useCoordinate("", "LAT");
	const lngCoord = useCoordinate("", "LNG");

	const isFormComplete = !!(
		jenisBencana &&
		latCoord.value &&
		lngCoord.value &&
		detail
	);

	const handleReset = useCallback(() => {
		setJenisBencana("");
		setStatusLevel(DEFAULT_STATUS_LEVEL);
		setDetail("");
		setShowSuccess(false);
		latCoord.onChange({
			target: { value: "" }
		} as React.ChangeEvent<HTMLInputElement>);
		lngCoord.onChange({
			target: { value: "" }
		} as React.ChangeEvent<HTMLInputElement>);
	}, []);

	/**
	 * Menangani pengiriman form.
	 * 1. Validasi field.
	 * 2. Bangun objek DisasterReport.
	 * 3. Publish ke WebDDS topic "disaster-reports".
	 * 4. Catat hasil ke Activity Log.
	 * @param e - React Form Event.
	 */
	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			if (!(jenisBencana && latCoord.value && lngCoord.value && detail)) return;

			const statusLevelNum = STATUS_LEVEL_MAP[statusLevel] ?? 0;

			/** Membangun objek DisasterReport */
			const report = {
				id: `MANUAL-POSKO-BDG-${statusLevelNum}`,
				originId: "POSKO-BDG-01",
				sourceName: "Posko Daerah Bandung",
				latitude: latCoord.value,
				longitude: lngCoord.value,
				bencanaType: jenisBencana,
				statusLevel: statusLevelNum,
				statusPenanganan: 0,
				observationDetail: detail,
				timestamp: new Date().toISOString()
			};

			/** Publish ke WebDDS topic "disaster-reports" */
			const result = await webddsService.publish(
				WEBDDS_TOPICS.DISASTER_REPORTS,
				report
			);

			/** Catat hasil ke Activity Log */
			const appendLog = useActivityStore.getState().appendLog;
			appendLog({
				id: `log-${Date.now()}`,
				timestamp: new Date().toLocaleTimeString("id-ID"),
				title: result.success ? "Laporan Terkirim" : "Gagal Kirim Laporan",
				description: result.success
					? `${jenisBencana} — ${statusLevel} berhasil dikirim ke Pusat via WebDDS.`
					: result.message,
				statusType: result.success ? "success" : "danger"
			});

			if (result.success) {
				setShowSuccess(true);
				setTimeout(() => {
					setShowSuccess(false);
					setJenisBencana("");
					setStatusLevel(DEFAULT_STATUS_LEVEL);
					setDetail("");
				}, 3000);
			}
		},
		[jenisBencana, latCoord.value, lngCoord.value, detail, statusLevel]
	);

	const toggleStatusOpen = useCallback(() => {
		setIsStatusOpen((prev) => !prev);
	}, []);

	const selectStatusLevel = useCallback((value: string) => {
		setStatusLevel(value);
		setIsStatusOpen(false);
	}, []);

	const closeStatusDropdown = useCallback(() => {
		setIsStatusOpen(false);
	}, []);

	/** Koordinat yang sudah diformat untuk preview. */
	const formattedCoord = formatCoordinate(latCoord.value, lngCoord.value);

	return {
		jenisBencana,
		setJenisBencana,
		statusLevel,
		isStatusOpen,
		detail,
		setDetail,
		showSuccess,
		isFormComplete,
		formattedCoord,

		latCoord,
		lngCoord,

		handleSubmit,
		handleReset,
		toggleStatusOpen,
		selectStatusLevel,
		closeStatusDropdown
	};
};
