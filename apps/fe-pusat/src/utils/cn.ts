import { clsx, type ClassValue } from "clsx";

/**
 * Combines class names conditionally using clsx.
 * @param {...ClassValue[]} inputs - Class values to combine.
 * @returns {string} The combined class name string.
 */
export function cn(...inputs: ClassValue[]): string {
	return clsx(inputs);
}
