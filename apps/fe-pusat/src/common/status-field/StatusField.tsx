/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS, Muhammad Rifky Janzani
 * Version            : 0.1.0
 * Created Date       : 31 Oct 2025
 * Description        : StatusField component that displays a labeled field with
 *                      a title on the left and its value content on the right.
 *                      Used for rendering status fields in detail views.
 *
 * Changelog:
 * - 0.1.0 (31 Oct 2025): Initial implementation of the StatusField component with
 *                       support for title and children as value content.
 */
import React, { ReactNode } from "react";

export interface StatusFieldProps {
	title: string;
	children?: ReactNode;
	maxWidth?: number;
	centerColon?: boolean;
}

/**
 * A StatusField component renders a label and its associated value.
 * It is used in the DetailPage to render the status fields.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The title of the status field
 * @param {ReactNode} [props.children] - The value of the status field
 * @param {number} [props.maxWidth=115] - Maximum width for the title column in pixels
 * @param {boolean} [props.centerColon=false] - Whether to center the colon vertically
 *
 * @returns {ReactElement} The rendered StatusField component
 */
const StatusField: React.FC<StatusFieldProps> = ({ title, children, maxWidth = 115, centerColon = false }) => {
	return (
		<div
			className={`flex ${centerColon ? 'items-center' : 'items-start'} gap-2`}
			data-testid={`status-field-${title}`}
		>
			{centerColon ? (
				<>
					<div className="flex-shrink-0" style={{ width: `${maxWidth}px` }}>
						<span className="block text-xs leading-5">
							{title}
						</span>
					</div>
					<div className="w-2 flex-shrink-0 text-xs">:</div>
					<div className="flex flex-col gap-2 items-start text-xs leading-5">
						{children}
					</div>
				</>
			) : (
				<>
					<div style={{ width: `${maxWidth}px` }}>
						<span className="block text-xs leading-5 after:content-[':'] after:ml-2">
							{title}
						</span>
					</div>
					<div className="flex flex-col gap-2 items-start text-xs leading-5">
						{children}
					</div>
				</>
			)}
		</div>
	);
};
export default StatusField;