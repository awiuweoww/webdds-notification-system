import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi utilitas untuk menggabungkan kelas tailwind secara aman.
 * @param inputs - Nama kelas atau objek kelas bersyarat.
 * @returns String kelas yang telah digabungkan dan diresolvasi.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(...inputs));
}
