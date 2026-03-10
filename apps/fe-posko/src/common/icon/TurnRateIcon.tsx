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
 * Description        : React icon component to visualize a turn rate direction indicator
 *                      (left or right) using an SVG path.
 *
 * Changelog:
 * - 0.1.0 (24-08-2025): Initial implementation of the TurnRateIcon component.
 */

/**
 * TurnRateIcon component.
 *
 * Renders an SVG arrow-like icon that represents a turn rate direction.
 * The icon can be flipped horizontally to indicate **left** or **right** turn rate.
 *
 * @param {Object} props - Component props.
 * @param {"left" | "right"} [props.direction="left"] - Direction of the turn indicator.
 * @param {string} [props.title="Turn rate direction"] - Accessible label for the SVG (aria-label).
 * @returns {JSX.Element} The SVG element representing the turn rate direction.
 */
export const TurnRateIcon: React.FC<{
	direction?: "left" | "right";
	title?: string;
}> = ({ direction = "left", title = "Turn rate direction" }) => (
	<svg
		width="8"
		height="14"
		viewBox="0 0 8 14"
		xmlns="http://www.w3.org/2000/svg"
		className={direction === "right" ? "scale-x-[-1]" : ""}
		style={{ display: "inline-block" }}
		aria-label={title}
	>
		<path
			d="M7.2514 13.9999L3.2514 13.9999C3.05249 13.9999 2.86172 13.9209 2.72107 13.7802C2.58042 13.6396 2.5014 13.4488 2.5014 13.2499L2.5014 9.24988C2.5014 9.05097 2.58042 8.8602 2.72107 8.71955C2.86172 8.5789 3.05249 8.49988 3.2514 8.49988C3.45031 8.49988 3.64108 8.5789 3.78173 8.71955C3.92238 8.8602 4.0014 9.05097 4.0014 9.24988V11.4311L4.96202 10.4636C5.69664 9.72958 6.19705 8.79415 6.39996 7.77566C6.60288 6.75717 6.49917 5.70138 6.10196 4.74184C5.70475 3.7823 5.03188 2.96212 4.16847 2.38505C3.30506 1.80797 2.2899 1.49993 1.2514 1.49988C1.05249 1.49988 0.86172 1.42086 0.721068 1.28021C0.580416 1.13956 0.501398 0.94879 0.501398 0.749878C0.501398 0.550966 0.580416 0.3602 0.721068 0.219548C0.86172 0.0788956 1.05249 -0.000122063 1.2514 -0.000122063C2.58647 -0.000183074 3.89157 0.395665 5.00166 1.13736C6.11175 1.87906 6.97696 2.93328 7.48788 4.16672C7.99879 5.40016 8.13247 6.75741 7.87199 8.06682C7.61151 9.37623 6.96859 10.579 6.02452 11.523L5.0539 12.4999H7.2514C7.45031 12.4999 7.64108 12.5789 7.78173 12.7195C7.92238 12.8602 8.0014 13.051 8.0014 13.2499C8.0014 13.4488 7.92238 13.6396 7.78173 13.7802C7.64108 13.9209 7.45031 13.9999 7.2514 13.9999Z"
			fill="currentColor"
		/>
	</svg>
);
