/**
 * Created Date       : 31-03-2026
 * Description        : Komponen Footer layout utama aplikasi.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal Footer.
 */
import { memo } from "react";

const Footer = memo(() => {
	return (
		<footer className="flex items-center justify-between px-6 py-4 text-xs text-gray-500 border-t border-gray-200 bg-white mt-auto">
			<span>© 2024 PUSAT BENCANA NASIONAL</span>
			<div className="flex items-center gap-6">
				<span className="hover:text-gray-700 cursor-pointer transition-colors">
					PRIVASI DATA
				</span>
				<span className="hover:text-gray-700 cursor-pointer transition-colors">
					STATUS
				</span>
				<span className="hover:text-gray-700 cursor-pointer transition-colors">
					DOKUMENTASI
				</span>
			</div>
		</footer>
	);
});

Footer.displayName = "Footer";
export default Footer;
