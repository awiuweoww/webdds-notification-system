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
 * Description        : AccordionItem component to display expandable/collapsible content.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the AccordionItem component.
 */
import React, { ReactNode, memo, useRef, useState } from "react";

export interface AccordionItemProps {
	title: string;
	contentComponent: ReactNode;
	defaultOpen?: boolean;
	top?: boolean;
	bottom?: boolean;
	className?: string;
	style?: React.CSSProperties;
	headerBgClass?: string;

	isOpen?: boolean;
	onToggle?: (nextOpen: boolean) => void;
}

/**
 * A single item for an accordion. Pass any JSX as content.
 *
 * @param {AccordionItemProps} props - The component props.
 * @param {string} props.title - Accordion title.
 * @param {ReactNode} props.contentComponent - JSX node for content.
 * @param {boolean} [props.defaultOpen=false] - Initially open?
 * @param {boolean} [props.top=false] - Add top rounded corner.
 * @param {boolean} [props.bottom=false] - Add bottom rounded + border.
 * @param {string} [props.className] - Custom className.
 * @param {React.CSSProperties} [props.style] - Custom style.
 * @param {string} [props.headerBgClass="bg-background-100-1"] - Header background color class.
 * @param {boolean} [props.isOpen] - Controlled open state.
 * @param {(nextOpen: boolean) => void} [props.onToggle] - Callback when opened/closed.
 *
 * @returns {JSX.Element} The rendered accordion item.
 */
const AccordionItem: React.FC<AccordionItemProps> = ({
	title,
	contentComponent,
	defaultOpen = false,
	top = false,
	bottom = false,
	className,
	style,
	headerBgClass = "bg-background-100-1",
	isOpen: controlledIsOpen,
	onToggle
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isOpen = controlledIsOpen ?? uncontrolledOpen;

	const contentRef = useRef<HTMLDivElement>(null);

	/**
	 * Toggles the accordion open/closed state.
	 * If the component is controlled (i.e. isOpen is passed as a prop),
	 * this function invokes the onToggle callback with the next open state.
	 * If it is uncontrolled (i.e. isOpen is not passed as a prop),
	 * this function updates the internal open state.
	 */
	const toggleAccordion = () => {
		if (onToggle) {
			onToggle(!isOpen);
		} else {
			setUncontrolledOpen((prev) => !prev);
		}
	};

	/**
	 * Prevents text selection when clicking or dragging on the accordion item
	 * header. This is to prevent the title from being highlighted when the
	 * accordion item is opened/closed.
	 * @param {React.MouseEvent | React.DragEvent} e - The event to prevent.
	 */
	const preventTextSelection = (e: React.MouseEvent | React.DragEvent) => {
		e.preventDefault();
	};

	const isTopClass = top ? "rounded-t" : "";
	const isBottomClass = bottom ? "rounded-b border-b-[1.8px]" : "";

	return (
		<div
			data-test-id="accordion-id"
			className={`w-full ${isTopClass} ${className ?? ""}`}
			style={style}
		>
			<div>
				<button
					className={`flex px-2 py-2 ${isTopClass} cursor-pointer list-none items-center rounded-md text-sm font-medium ${headerBgClass} w-full text-white`}
					onClick={toggleAccordion}
					onMouseDown={preventTextSelection}
					onDragStart={preventTextSelection}
					role="menuitem"
				>
					<span>{title}</span>
					<span className="ml-auto transition-transform duration-200">
						<svg
							fill="none"
							height="24"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="4.5"
							viewBox="0 0 24 24"
							width="20"
							className={
								isOpen
									? "rotate-180 transition-transform duration-200"
									: "rotate-0 transition-transform duration-200"
							}
						>
							<path d="M6 9l6 6 6-6"></path>
						</svg>
					</span>
				</button>

				{isOpen && (
					<div ref={contentRef} className={`py-2 ${isBottomClass}`}>
						{contentComponent}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AccordionItem);
