import { memo } from "react";

/**
 * Footer halaman dashboard FE 1.
 */
const Footer = memo(() => {
	return (
		<footer className="flex items-center justify-between px-6 py-4 text-xs text-gray-500 border-t border-gray-200 bg-white mt-auto">
			<span>© 2024 PUSAT KOMANDO NASIONAL</span>
			<div className="flex items-center gap-6">
				<span className="hover:text-gray-700 cursor-pointer transition-colors">
					PRIVASI DATA
				</span>
				<span className="hover:text-gray-700 cursor-pointer transition-colors">
					STATUS API
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
