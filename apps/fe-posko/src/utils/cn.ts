import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge tailwind classes safely.
 * @param inputs - Class names or conditional class objects.
 * @returns The merged and resolved class string.
 */
export function cn(...inputs: ClassValue[]): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return twMerge(clsx(...inputs));
}

