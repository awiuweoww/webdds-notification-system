/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version, Date      : 2.0.0, 27 March 2025
 * Description        : TooltipHover Component
 */
import { memo, useMemo } from "react";

import { TooltipHoverProps } from "./TooltipHover.types";

export const TooltipHover = memo(
	({
		children,
		tooltipsText,
		position = "top",
		className = "",
		arrowClassName = ""
	}: TooltipHoverProps) => {
		const positionClass = useMemo(() => {
			switch (position) {
				case "right":
					return "absolute left-full top-1/2 z-20 ml-1 -translate-y-1/2";
				case "top":
					return "absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2";
				case "left":
					return "absolute right-full top-1/2 z-20 mr-1 -translate-y-1/2";
				default:
					return "absolute left-1/2 top-full z-20 mt-1 -translate-x-1/2";
			}
		}, [position]);

		const arrowBase = useMemo(() => {
			switch (position) {
				case "right":
					return "absolute left-[-3px] top-1/2 -translate-y-1/2";
				case "top":
					return "absolute bottom-[-3px] left-1/2 -translate-x-1/2";
				case "left":
					return "absolute right-[-3px] top-1/2 -translate-y-1/2";
				default:
					return "absolute left-1/2 top-[-3px] -translate-x-1/2";
			}
		}, [position]);

		return (
			<div className="relative inline-block select-none font-montserrat group">
				{children}
				<div
					className={`${positionClass} whitespace-nowrap rounded px-4 py-[6px] text-xs text-white bg-gray-800 hidden group-hover:block ${className}`}
				>
					<span
						className={`${arrowBase} -z-10 h-2 w-2 rotate-45 rounded-sm bg-gray-800 ${arrowClassName}`}
					/>
					{tooltipsText}
				</div>
			</div>
		);
	},
	(prev, next) =>
		prev.tooltipsText === next.tooltipsText &&
		prev.position === next.position &&
		prev.children === next.children
);
