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
 * Description        : Table data for displaying row data.
 *
 * Changelog:
 * - 1.0.0 (1 Aug 2025): Initial creation Table data for displaying row data.
 */
import { memo } from "react";

interface TableDataProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
	className: string;
	getBorderTableDataClass: string;
	children?: React.ReactNode;
}

/**
 * Renders a table data cell with custom styling and children content.
 *
 * @param {TableDataProps} props - Props including className, getBorderClass, children, and any other props for the <td> element.
 * @returns {JSX.Element} The rendered table data cell.
 */
const TableData: React.FC<TableDataProps> = ({
	className,
	getBorderTableDataClass,
	children,
	...props
}) => {
	return (
		<td
			className={`relative p-2 bg-[#3F4640] h-8 max-h-8 text-xs first:rounded-l last:rounded-r
      ${getBorderTableDataClass} ${className}`}
			{...props}
		>
			{children}
		</td>
	);
};

export default memo(TableData);
