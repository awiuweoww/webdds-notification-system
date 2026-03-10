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
 * Description        : Table Component Custom.
 *
 * Changelog:
 * - 0.1.0 (2025-05-26): Initial creation of Table Component Custom.
 */
import React, { forwardRef, memo } from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
	className?: string;
	children?: React.ReactNode;
};

const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {
	const { className, children, ...restProps } = props;

	return (
		<div
			ref={ref}
			className={`${className ?? "w-full h-full"} relative scroller flex-grow overflow-auto text-xs align-middle`}
		>
			<table
				className={`w-full special-table border-separate border-spacing-y-[0.35rem]`}
				{...restProps}
			>
				{children}
			</table>
		</div>
	);
});

export default memo(Table);
