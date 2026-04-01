/**
 * Created Date       : 31-03-2026
 * Description        : Hook untuk mengelola state toggle notifikasi di fe-pusat.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Ekstrak logika notifikasi dari Navbar.
 */
import { useState, useCallback } from "react";

/**
 * Custom hook untuk mengelola state visibilitas dropdown notifikasi.
 * @returns State dan handler untuk toggle notifikasi.
 */
export const useNotification = () => {
	const [showNotif, setShowNotif] = useState(false);
	const toggleNotif = useCallback(() => {
		setShowNotif((prev) => !prev);
	}, []);
	const closeNotif = useCallback(() => {
		setShowNotif(false);
	}, []);

	return {
		showNotif,
		toggleNotif,
		closeNotif
	};
};
