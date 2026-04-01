/**
 * Created Date       : 31-03-2026
 * Description        : Utilitas untuk memetakan level status ke kelas warna Tailwind.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Ekstrak dari MainForm menjadi utilitas terpisah.
 */
import { textColor } from "../constants/colors.constant";

/**
 * Memetakan string level ke kelas warna teks semantik yang sesuai.
 * @param level - String level (contoh: "Level 1: Normal / Aman").
 * @returns Kelas warna teks tailwind.
 */
export const getStatusColor = (level: string): string => {
	if (level.includes("Level 1")) return textColor.success;
	if (level.includes("Level 2")) return textColor.warning;
	if (level.includes("Level 3")) return textColor.siaga;
	if (level.includes("Level 4")) return textColor.danger;
	return "text-neutral-1";
};
