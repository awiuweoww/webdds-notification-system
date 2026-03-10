/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version, Date      : 0.1.0, 27 March 2025
 * Description        : Unit test for DotLoading component, verifying direction, dot rendering, and animation delay classes.
 *
 * Changelog:
 * - 0.1.0 (27 March 2025): Initial test for basic DotLoading rendering and class structure.
 */
import React from "react";

import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import DotLoading from "./DotLoading";

describe("DotLoading Component", () => {
	it("renders without crashing", () => {
		render(<DotLoading />);
	});

	it("renders exactly four animated dots", () => {
		const { container } = render(<DotLoading />);
		const dots = container.querySelectorAll(".dot");

		expect(dots).toHaveLength(4);
	});

	it("applies delay classes correctly", () => {
		const { container } = render(<DotLoading />);
		expect(container.querySelector(".dot.delay-1")).toBeInTheDocument();
		expect(container.querySelector(".dot.delay-2")).toBeInTheDocument();
		expect(container.querySelector(".dot.delay-3")).toBeInTheDocument();
	});

	it("renders direction row by default (right)", () => {
		const { container } = render(<DotLoading />);
		const wrapper = container.firstChild as HTMLElement;

		expect(wrapper).toHaveStyle("flex-direction: row-reverse");
	});

	it("renders direction row-reverse for left", () => {
		const { container } = render(<DotLoading direction="left" />);
		const wrapper = container.firstChild as HTMLElement;

		expect(wrapper).toHaveStyle("flex-direction: row-reverse");
	});

	it("renders direction column for down", () => {
		const { container } = render(<DotLoading direction="down" />);
		const wrapper = container.firstChild as HTMLElement;

		expect(wrapper).toHaveStyle("flex-direction: column");
	});

	it("renders direction column-reverse for up", () => {
		const { container } = render(<DotLoading direction="up" />);
		const wrapper = container.firstChild as HTMLElement;

		expect(wrapper).toHaveStyle("flex-direction: column-reverse");
	});
});
