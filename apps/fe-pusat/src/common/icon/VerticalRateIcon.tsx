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
 * Created Date       : 24-08-2025
 * Description        : React icon component to visualize a vertical rate direction indicator
 *                      (up or down) using an SVG path.
 *
 * Changelog:
 * - 0.1.0 (24-08-2025): Initial implementation of the VerticalRateIcon component.
 */
import React from "react";

/**
 * VerticalRateIcon component.
 *
 * Renders an SVG arrow-like icon that represents a vertical rate direction (up or down).
 * The icon can be flipped vertically to indicate **down** or **up** vertical rate.
 *
 * @param {Object} props - Component props.
 * @param {boolean} [props.negative=false] - Direction of the vertical rate indicator.
 * @param {string} [props.title="Vertical rate direction"] - Accessible label for the SVG (aria-label).
 * @returns {JSX.Element} The SVG element representing the vertical rate direction.
 */
export const VerticalRateIcon: React.FC<{
	negative?: boolean;
	title?: string;
}> = ({ negative = false, title = "Vertical rate direction" }) => (
	<svg
		width="10"
		height="11"
		viewBox="0 0 10 11"
		xmlns="http://www.w3.org/2000/svg"
		className={negative ? "scale-y-[-1]" : ""}
		style={{ display: "inline-block" }}
		aria-label={title}
	>
		<path
			d="M0.471328 8.96932L7.18945 2.24932H2.50195C2.30304 2.24932 2.11228 2.17031 1.97162 2.02965C1.83097 1.889 1.75195 1.69824 1.75195 1.49932C1.75195 1.30041 1.83097 1.10965 1.97162 0.968994C2.11228 0.828341 2.30304 0.749324 2.50195 0.749324H9.00195C9.20087 0.749324 9.39163 0.828341 9.53228 0.968994C9.67294 1.10965 9.75195 1.30041 9.75195 1.49932L9.75195 7.99932C9.75195 8.19824 9.67294 8.389 9.53228 8.52965C9.39163 8.67031 9.20087 8.74932 9.00195 8.74932C8.80304 8.74932 8.61228 8.67031 8.47162 8.52965C8.33097 8.389 8.25195 8.19824 8.25195 7.99932V3.31182L1.53258 10.0299C1.46281 10.0997 1.37999 10.1551 1.28884 10.1928C1.19769 10.2306 1.09999 10.25 1.00133 10.25C0.902666 10.25 0.80497 10.2306 0.713818 10.1928C0.622665 10.1551 0.539844 10.0997 0.470078 10.0299C0.400313 9.96018 0.344973 9.87736 0.307217 9.78621C0.269461 9.69506 0.250027 9.59736 0.250027 9.4987C0.250027 9.40004 0.269461 9.30234 0.307217 9.21119C0.344973 9.12004 0.400313 9.03721 0.470078 8.96745L0.471328 8.96932Z"
			fill="currentColor"
		/>
	</svg>
);
