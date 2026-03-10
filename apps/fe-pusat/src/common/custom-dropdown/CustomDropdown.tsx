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
 * Description        : CustomDropdown component for selecting options with optional prefix and custom styling.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the CustomDropdown component.
 */
import React, { useEffect, useRef, useState } from "react";

export interface CustomDropdownProps {
	options: string[];
	value: string;
	onChange: (e: { target: { value: string } }) => void;
	disabled?: boolean;
	testid?: string;
	preffix?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	maxVisibleOptions?: number;
	leftSlotWidth?: number | string;
}

/**
 * A custom dropdown component with an optional prefix.
 *
 * @param {Object} props - Component props.
 * @param {string[]} props.options - List of options to be displayed in the dropdown.
 * @param {string} props.value - The currently selected value.
 * @param {(e: { target: { value: string } }) => void} props.onChange - Callback when selection changes.
 * @param {boolean} [props.disabled=false] - Whether the component is disabled.
 * @param {string} [props.testid="custom-dropdown-test"] - Test ID for the component.
 * @param {React.ReactNode} [props.preffix] - Optional prefix to be displayed before the dropdown.
 * @param {string|number} [props.leftSlotWidth=20] - Width of the prefix slot.
 * @param {number} [props.maxVisibleOptions=5] - Maximum number of visible options in the dropdown.
 * @param {object} [props.style] - Custom CSS styles for the component.
 * @param {string} [props.className] - Custom CSS classes for the component.
 *
 * @returns {ReactElement} The rendered dropdown component.
 */
const CustomDropdown: React.FC<CustomDropdownProps> = ({
	options,
	value,
	onChange,
	disabled = false,
	className,
	style,
	testid = "custom-dropdown-test",
	preffix,
	maxVisibleOptions = 5,
	leftSlotWidth = 20
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		/**
		 * Handles click event outside the dropdown menu.
		 * If the target element is not inside the dropdown menu, it will
		 * close the dropdown menu.
		 * @param {MouseEvent} e - The mouse event triggered by the click.
		 */
		const handleOutsideClick = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const shouldClamp = options.length > maxVisibleOptions;
	const optionRowPx = 32;
	const listMaxHeight = shouldClamp
		? maxVisibleOptions * optionRowPx
		: undefined;
	const leftWidth =
		typeof leftSlotWidth === "number" ? `${leftSlotWidth}px` : leftSlotWidth;

	return (
		<div
			data-testid={testid}
			ref={dropdownRef}
			style={style}
			className={`relative flex justify-start w-full ${
				disabled ? "opacity-60 rounded-lg" : ""
			} ${className ?? ""}`}
		>
			<style>
				{`
          .cd-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
          .cd-scroll::-webkit-scrollbar-thumb { background: #ffffff; border-radius: 8px; }
          .cd-scroll::-webkit-scrollbar-track { background: transparent; }
          .cd-scroll { scrollbar-color: #ffffff transparent; scrollbar-width: thin; }
        `}
			</style>

			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={`${
					isOpen ? "rounded-t-lg" : "rounded-lg"
				} w-full text-left border-none p-2 text-xs bg-background-100-2 appearance-none outline-none focus:outline-none font-montserrat flex items-center ${
					preffix ? "justify-start" : "justify-between"
				} ${disabled ? "cursor-not-allowed opacity-60" : ""} text-white`}
				disabled={disabled}
			>
				{preffix && (
					<span
						className="mr-3 my-1 flex items-center justify-center shrink-0"
						style={{ width: leftWidth }}
					>
						{preffix}
					</span>
				)}
				<span className={preffix ? "flex-1" : ""}>
					{value?.length > 15 ? value.substring(0, 15) + "..." : value}
				</span>
				<svg
					fill="none"
					height="20"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="4.5"
					viewBox="0 0 24 24"
					width="20"
					className={isOpen ? "transition transform rotate-180" : ""}
				>
					<path d="M6 9l6 6 6-6"></path>
				</svg>
			</button>

			{isOpen && (
				<div
					className={`absolute z-30 w-full mt-8 transition-all duration-300 ease-in-out rounded-b-lg shadow-lg text-xs bg-background-100-2 ${
						shouldClamp ? "overflow-y-auto cd-scroll" : "overflow-y-hidden"
					}`}
					style={
						listMaxHeight ? { maxHeight: `${listMaxHeight}px` } : undefined
					}
				>
					{options.map((option) => (
						<div
							role="none"
							key={option}
							className={`cursor-pointer hover:bg-accent-3 hover:text-white font-montserrat p-2 ${
								option === value
									? "bg-primary-green-3 text-white"
									: "text-white"
							} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
							onClick={() => {
								onChange({ target: { value: option } });
								setIsOpen(false);
							}}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CustomDropdown;
