/*
 * Copyright PT Len Innovation Technology
 *
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version, Date      : 0.1.0, 15 May 2025
 * Description        : A reusable Card component with optional title and custom content styling.
 *
 * Changelog:
 * - 0.1.0 (15 May 2025): Initial creation of Card component with title and children support.
 */
import { cn } from "@utils/cn";

export type CardProps = {
	title?: string;
	className?: string;
	children?: React.ReactNode;
};

/**
 * A reusable card component that displays a title and content area.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.title] - Optional title displayed at the top of the card.
 * @param {React.ReactNode} props.children - The content to render inside the card.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @returns {JSX.Element} The rendered card element.
 */
export default function Card({
	title,
	children,
	className
}: Readonly<CardProps>) {
	return (
		<div
			className={cn(
				"rounded-2xl p-4 bg-background-100-1 text-white",
				className
			)}
		>
			{title && <p className="mb-4 text-xl font-bold">{title}</p>}
			{children}
		</div>
	);
}
