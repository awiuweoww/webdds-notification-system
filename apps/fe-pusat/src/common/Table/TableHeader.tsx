/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Soca
 * Version            : 0.1.0
 * Created Date       : 2025-05-26
 * Description        : Reusable component for table header
 *
 * Changelog:
 * - 0.1.0 (2025-05-26): Initial creation of the Reusable component for Reusable component for table header
 */
import { memo } from "react";

import TableHeaderColumn from "./TableHeaderColumn";

type SortOrder = "asc" | "desc";

interface ColumnsHeaderData {
	columnName: string;
	className: string;
	dataTestId: string;
	iconAsc?: JSX.Element;
	iconDesc?: JSX.Element;
}

interface TableHeaderProps {
	columnsHeaderData: ReadonlyArray<ColumnsHeaderData>;
	currentSortBy?: string;
	currentSortOrder?: SortOrder;
	handleSort?: (sortKey: string) => void;
}

/**
 * Renders the header for the table with sortable columns.
 *
 * @template T - The data type of each row.
 * @param {Object} props - The component props.
 * @param {ReadonlyArray<{ columnName: keyof T; className: string; dataTestId: string }>} props.columnsHeaderData - The array of header columns to render.
 * @param {string} [props.currentSortBy] - The current column key being sorted.
 * @param {"asc" | "desc"} [props.currentSortOrder] - The current sorting order.
 * @param {(sortKey: string) => void} [props.handleSort] - Function to trigger sort by column key.
 * @returns {JSX.Element} The rendered table header.
 */
const TableHeader = ({
	columnsHeaderData,
	currentSortBy,
	currentSortOrder,
	handleSort
}: TableHeaderProps): JSX.Element => {
	return (
		<thead>
			<tr>
				{columnsHeaderData.map((col) => (
					<TableHeaderColumn
						key={String(col.columnName)}
						className={col.className}
						columnName={String(col.columnName)}
						data-testid={col.dataTestId}
						sortBy={
							handleSort ? String(col.columnName).toLowerCase() : undefined
						}
						currentSortBy={currentSortBy ?? undefined}
						sortOrder={currentSortOrder ?? undefined}
						handleSort={handleSort ?? undefined}
						sortIconAsc={col.iconAsc ?? undefined}
						sortIconDesc={col.iconDesc ?? undefined}
					/>
				))}
			</tr>
		</thead>
	);
};

export default memo(TableHeader);
