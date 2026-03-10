/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version            : 0.1.0
 * Created Date       : 01-07-2025
 * Description        : Tooltip component to display hover content.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the Tooltip component.
 */
import React from "react";

type TooltipProps = {
	x: number;
	y: number;
	text: string;
};

/**
 * A small tooltip that appears at a given (x, y) coordinate, containing some text.
 * This is a very simple component, and does not include any behavior for handling
 * mouse events, or for preventing the tooltip from appearing outside the bounds of
 * the window.
 *
 * @param {{ x: number, y: number, text: string }} x
 *   The coordinates of the tooltip, and the text to display.
 * @returns {JSX.Element}
 *   A div, with the given text as its contents, and with its position set to
 *   "fixed" at the given coordinates.
 */
const Tooltip: React.FC<TooltipProps> = ({ x, y, text }) => (
	<div
		style={{
			position: "fixed",
			left: x,
			top: y,
			zIndex: 9999,
			pointerEvents: "none"
		}}
		className="
        rounded-md px-3 py-1.5 
        bg-background-100-2 
        text-xs text-white 
        shadow-md whitespace-nowrap
        outline outline-white/40
        "
	>
		{text}
	</div>
);

export default Tooltip;
