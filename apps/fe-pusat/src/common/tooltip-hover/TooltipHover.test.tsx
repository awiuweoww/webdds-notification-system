/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Muhammad Fauzan Fithraturrahman
 * Version, Date      : 1.0.0, 14 May 2025
 * Description        : Unit test TooltipHover Component
 */
import React from "react";

import { render, screen } from "@testing-library/react";

import { TooltipHover } from "./TooltipHover";
import { TooltipHoverProps } from "./TooltipHover.types";

describe("TooltipHover", () => {
	const defaultProps: TooltipHoverProps = {
		children: <div>Test</div>,
		tooltipsText: "Test tooltip",
		position: "top"
	};

	it("renders with default position", () => {
		render(<TooltipHover {...defaultProps} />);

		// Check if children are rendered
		expect(screen.getByText("Test")).toBeInTheDocument();

		// Check if tooltip is hidden by default
		expect(screen.getByText("Test tooltip")).toHaveClass("hidden");
	});
});
