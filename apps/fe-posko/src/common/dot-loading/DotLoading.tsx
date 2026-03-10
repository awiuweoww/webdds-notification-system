/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version, Date      : 0.2.0, 27 March 2025
 * Description        : DotLoading is used for display loading state.
 *
 * Changelog:
 * - 0.2.0 (27 Mar 2025): Added directional support (left, right, up, down) using flexDirection.
 * - 0.1.0 (15 Mar 2025): Initial version with basic animated dot loading.
 */
import React, { memo } from "react";

import "./dotloading.css";

export interface DotLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	direction?: "left" | "right" | "up" | "down";
}

/**
 * A component for displaying a loading state with animated dots.
 *
 * @param {Object} props Component props
 * @param {"left" | "right" | "up" | "down"} [props.direction="left"] Direction of the loading animation
 * @param {string} [props.className=""] Additional class names to apply to the element
 * @param {Object} [props.style={}] Additional CSS styles to apply to the element
 * @returns A JSX element of the DotLoading component.
 */
const DotLoading: React.FC<DotLoadingProps> = ({
	direction = "left",
	className = "",
	style = {},
	...props
}) => {
	/**
	 * Get the correct CSS flex-direction value based on the given direction.
	 *
	 * @returns A string value for the CSS flex-direction property.
	 */
	const getFlexDirection = () => {
		if (direction === "up") return "column-reverse";
		if (direction === "down") return "column";
		if (direction === "left") return "row-reverse";
		return "row";
	};

	return (
		<div
			className={`dot-loading ${className}`}
			data-testid="dot-loading"
			style={{
				display: "flex",
				flexDirection: getFlexDirection(),
				alignItems: "center",
				justifyContent: "center",
				...style
			}}
			{...props}
		>
			<span className="dot" />
			<span className="dot delay-1" />
			<span className="dot delay-2" />
			<span className="dot delay-3" />
		</div>
	);
};

export default memo(DotLoading);
