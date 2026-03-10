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
 * Description        : TableHead.
 *
 * Changelog:
 * - 0.1.0 (2025-05-26): Initial creation of TableHead.
 */
import React, { ReactNode, ThHTMLAttributes, memo } from "react";

type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
	className?: string;
	children?: ReactNode;
};

/**
 * Renders a table header cell with the specified class and children.
 *
 * @param {TableHeadProps} props - Props including className and children
 * @returns {JSX.Element} the rendered table header cell
 */
const TableHead: React.FC<TableHeadProps> = ({
	className,
	children,
	...props
}) => (
	<th
		className={`sticky top-0 z-10 p-1 first:rounded-l last:rounded-r ${className ?? ""}`}
		{...props}
	>
		{children}
	</th>
);

export default memo(TableHead);
