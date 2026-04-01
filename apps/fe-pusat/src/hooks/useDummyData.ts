/**
 * Created Date       : 31-03-2026
 * Description        : Hook untuk mengelola data dummy simulasi dan alert bahaya.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Ekstrak logika seed dummy data dari App.tsx.
 */
import { useCallback } from "react";

import { enumMap } from "../constants/stream.constants";
import { useDisasterStore } from "../store/useDisasterStore";

/**
 * Hook untuk mengelola data dummy simulasi dan alert bahaya.
 *
 * Hook ini akan memberikan 2 fungsi, yaitu `handleSeedDummyData` dan
 * `applyIncomingReport`. Fungsi `handleSeedDummyData` akan mengisi store dengan
 * data dummy untuk keperluan demo, sedangkan fungsi `applyIncomingReport`
 * akan mengisi store dengan laporan kejadian yang diterima dari WebDDS.
 *
 * @returns {Object} - Object yang berisi fungsi `handleSeedDummyData` dan
 * `applyIncomingReport`.
 */
export const useDummyData = () => {
	const applyIncomingReport = useDisasterStore((s) => s.applyIncomingReport);
	const setDangerAlert = useDisasterStore((s) => s.setDangerAlert);

	/**
	 * Mengisi store dengan data dummy untuk keperluan demo.
	 */
	const handleSeedDummyData = useCallback(() => {
		const dummyReports = [
			{
				id: "STREAM-GEDE-01",
				originId: "SENSOR-GEDE-01",
				sourceName: "Gunung Gede - Pos 1",
				latitude: "-6.0594",
				longitude: "105.8897",
				bencanaType: "Longsor",
				statusLevel: enumMap.levelBencana.LEVEL_NORMAL,
				statusPenanganan: enumMap.statusPenanganan.STATUS_AKTIF_BARU,
				observationDetail: "",
				timestamp: new Date().toISOString()
			},
			{
				id: "STREAM-CIREMAI-02",
				originId: "SENSOR-CIREMAI-02",
				sourceName: "Gunung Ciremai - Pos 2",
				latitude: "0.5071",
				longitude: "116.4112",
				bencanaType: "Longsor",
				statusLevel: enumMap.levelBencana.LEVEL_WASPADA,
				statusPenanganan: enumMap.statusPenanganan.STATUS_AKTIF_BARU,
				observationDetail: "",
				timestamp: new Date().toISOString()
			},
			{
				id: "MANUAL-CIREMAI-POS1-NORMAL",
				originId: "POSKO-CIREMAI-01",
				sourceName: "Gunung ciremai - Pos 1",
				latitude: "-6.8161",
				longitude: "107.6191",
				bencanaType: "Gempa Bumi",
				statusLevel: enumMap.levelBencana.LEVEL_NORMAL,
				statusPenanganan: enumMap.statusPenanganan.STATUS_SUDAH_DIATASI,
				observationDetail:
					"Berdasarkan pantauan di lapangan, debit air sungai Ciliwung mengalami peningkatan signifikan akibat curah hujan yang sangat tinggi di daerah hulu (Puncak).",
				timestamp: new Date().toISOString()
			}
		];

		dummyReports.forEach((r) => applyIncomingReport(r));

		setDangerAlert({
			id: "STREAM-MERAPI-01",
			sourceName: "Gunung Merapi - Sensor sektor 1",
			message: "mendeteksi aktivitas bahaya!"
		});
	}, [applyIncomingReport]);

	return { handleSeedDummyData };
};
