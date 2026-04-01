/**
 * Created Date       : 31-03-2026
 * Description        : Hook untuk mengelola state toggle notifikasi.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Ekstrak logika notifikasi dari Header/App.
 */
import { useCallback, useState } from "react";

/**
 * Custom hook untuk mengelola state visibilitas dropdown notifikasi.
 * @returns State dan handler untuk toggle notifikasi.
 */
export const useNotification = () => {
	const [showNotifications, setShowNotifications] = useState(false);

	const toggleNotifications = useCallback(() => {
		setShowNotifications((prev) => !prev);
	}, []);

	const closeNotifications = useCallback(() => {
		setShowNotifications(false);
	}, []);

	const openNotifications = useCallback(() => {
		setShowNotifications(true);
	}, []);

	return {
		showNotifications,
		toggleNotifications,
		closeNotifications,
		openNotifications
	};
};
