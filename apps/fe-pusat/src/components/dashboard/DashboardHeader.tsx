/**
 * Created Date       : 31-03-2026
 * Description        : Komponen antarmuka DashboardHeader untuk memberikan navigasi header atas pada Dashboard.
 *
 * Changelog:
 * - 0.1.0 (31-03-2026): Implementasi awal DashboardHeader.
 */
import { memo } from "react";

const DashboardHeader = memo(() => {
	return (
		<div className="mb-6">
			<h1 className="text-2xl font-bold text-surface-dark">
				Pusat Komando Bencana (sebagai FE 1)
			</h1>
			<p className="text-sm text-gray-500 mt-1">
				Sistem pemantauan bencana Nasional
			</p>
		</div>
	);
});

DashboardHeader.displayName = "DashboardHeader";
export default DashboardHeader;
