/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS, Muhammad Rifky Janzani
 * Version, Date      : 0.1.0, 17 May 2025
 * Description        : Reusable React component to visually display status messages with color indicators.
 *
 * Changelog:
 * - 0.1.0 (31 Oct 2025): Initial creation of StatusIndicator component with color-coded visual box
 *                        and dynamic message display.
 */
import React from "react";

interface StatusIndicatorProps {
	/** The message text to display (e.g., "Data sent") - optional */
	message?: string;
	/** The color of the indicator box (e.g., "critical", "default") */
	color?: "critical" | "default";
	/** Optional additional className */
	className?: string;
	/** Custom margin-left for color box, e.g., 'ml-8' */
	mlClass?: string;
	/** Size of the indicator - 'small' for w-3 h-3, 'default' for w-4 h-4 */
	size?: "small" | "default";
}

/**
 * A reusable dynamic status indicator with a colored square and optional label.
 *
 * @param {Object} props - The props object.
 * @param {string} [props.message] - The label text to display (optional).
 * @param {"critical" | "default"} [props.color="default"] - The color of the status indicator.
 * @param {string} [props.className] - Optional additional class names for the container.
 * @param {string} [props.mlClass] - Optional additional class names for the container.
 * @param {"small" | "default"} [props.size="default"] - Size of the indicator.
 * @returns {JSX.Element} The rendered status indicator component.
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({
	message,
	color = "default",
	className = "",
	mlClass = "ml-6",
	size = "default"
}) => {
	const colorMap: Record<string, string> = {
		critical: "bg-indicator-critical",
		default: "bg-indicator-default"
	};

	const sizeClasses = {
		small: "w-3.5 h-3.5",
		default: "w-4 h-4"
	};

	const shadowClasses = {
		small: "shadow-compact-ring-sm",
		default: "shadow-triple-ring"
	};

	return (
		<div
			className={`flex items-center justify-between bg-transparent text-white rounded-md py-0.5 w-fit ${className}`}
		>
			{message && <span className="text-[28px] font-medium flex-grow">{message}</span>}
			<div
				data-testid="color-box"
				className={`${mlClass} ${sizeClasses[size]} rounded-sm ${colorMap[color]} ${shadowClasses[size]} flex-shrink-0`}	
			/>
		</div>
	);
};

export default StatusIndicator;