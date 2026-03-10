/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Soca
 * Version, Date      : 1.0.0, 1 August 2025
 * Description        : Table header column for displaying rows data.
 *
 * Changelog:
 * - 1.0.0 (1 Aug 2025): Initial creation Table header column for displaying rows data.
 */
import React, { memo } from "react";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

import TableHead from "./TableHead";

type SortOrder = "asc" | "desc";

interface TableHeaderColumnProps
	extends React.ThHTMLAttributes<HTMLTableCellElement> {
	columnName: string;
	sortBy?: string;
	currentSortBy?: string;
	sortOrder?: SortOrder;
	sortIconAsc?: JSX.Element;
	sortIconDesc?: JSX.Element;
	handleSort?: (sortKey: string) => void;
	showIdleIcon?: boolean;
}

/**
 * Table header column component for displaying table header with sorting
 * functionality.
 *
 * @param {TableHeaderColumnProps} props - Component props
 * @param {string} props.columnName - The column name to display
 * @param {string} [props.sortBy] - The column key to sort by
 * @param {"asc" | "desc"} [props.sortOrder] - The sorting order
 * @param {JSX.Element} [props.sortIconAsc] - The icon to display when sorting in ascending order
 * @param {JSX.Element} [props.sortIconDesc] - The icon to display when sorting in descending order
 * @param {(sortKey: string) => void} [props.handleSort] - The function to be called when sorting is triggered
 * @param {string} [props.currentSortBy] - The current column key being sorted
 * @param {string} [props.className] - The class name to apply to the component
 * @param {boolean} [props.showIdleIcon] - Whether to show sorting icon when not sorting
 * @returns {JSX.Element} The rendered table header column
 */
const TableHeaderColumn: React.FC<TableHeaderColumnProps> = ({
	columnName,
	sortBy,
	sortOrder = "desc",
	sortIconAsc,
	sortIconDesc,
	handleSort,
	currentSortBy,
	className,
	showIdleIcon = false,
	...props
}) => {
	const isSortable = Boolean(sortBy) && Boolean(handleSort);
	const isActive = isSortable && currentSortBy === sortBy;
	let icon: JSX.Element | null = null;

	if (isActive) {
		if (sortOrder === "desc") {
			icon = sortIconDesc ?? <FaSortAmountDown size={12} />;
		} else {
			icon = sortIconAsc ?? <FaSortAmountDownAlt size={12} />;
		}
	} else if (showIdleIcon) {
		if (sortIconAsc) {
			icon = React.cloneElement(sortIconAsc, { className: "opacity-60" });
		} else {
			icon = <FaSortAmountDownAlt size={12} className="opacity-60" />;
		}
	}

	return (
		<TableHead className={className} {...props}>
			<div
				className={`flex items-center justify-center ${isSortable ? "cursor-pointer" : ""}`}
			>
				<span className="ml-2">{columnName}</span>
				{isSortable && (
					<button
						type="button"
						onClick={() => sortBy && handleSort && handleSort(sortBy)}
						className="flex items-center p-1 rounded"
						aria-label={`Sort by ${columnName}`}
					>
						{icon}
					</button>
				)}
			</div>
		</TableHead>
	);
};

export default memo(TableHeaderColumn);
