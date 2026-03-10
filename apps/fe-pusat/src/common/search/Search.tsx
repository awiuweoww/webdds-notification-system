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
 * Description        : Search component with live search and visual state indicator for modern UI.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the Search component.
 */
import React, { ChangeEvent, useEffect, useState } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";

import { sanitize } from "@utils/stringSanitizer";

export interface SearchProps {
	placeHolder: string;
	searchFunction?: (searchTerm: string) => void;
	initialSearch?: string;
	className?: string;
	inputClassName?: string;
	/** Maximum input length; default 20. */
	maxLength?: number;
	/** Regex pattern for HTML validation; default disallows newlines and caps at maxLength. */
	pattern?: string;
}

/**
 * Search component with live search and visual state indicator for modern UI.
 *
 * @param {SearchProps} props - Component props.
 * @param {string} props.placeHolder - Placeholder text.
 * @param {(searchTerm: string) => void} [props.searchFunction=() => {}] - Function to be called when the search input changes.
 * @param {string} [props.initialSearch=""] - Initial search term.
 * @param {string} [props.className=""] - Tailwind classes for the component.
 * @param {string} [props.inputClassName=""] - Tailwind classes for the input element.
 * @param {number} [props.maxLength=20] - Maximum input length.
 * @param {string} [props.pattern] - Regex pattern for HTML validation.
 * @default The default values for each prop are as follows:
 * - props.searchFunction: an empty function
 * - props.initialSearch: an empty string
 * - props.className: an empty string
 * - props.inputClassName: an empty string
 * - props.maxLength: 20
 * - props.pattern: no pattern, allowing all alphanumeric characters and symbols.
 * @returns {JSX.Element} The rendered Search component.
 */
const Search: React.FC<SearchProps> = ({
	placeHolder,
	searchFunction = () => {},
	initialSearch = "",
	className = "",
	inputClassName = "",
	maxLength = 20,
	pattern
}) => {
	const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
	const [borderColor, setBorderColor] = useState<string>("border-none");

	const effectivePattern =
		pattern ?? `^[^\\r\\n]{0,${Math.max(0, maxLength)}}$`;

	useEffect(() => {
		setBorderColor(
			searchTerm !== "" ? "border border-blue-500" : "border-none"
		);
		searchFunction(searchTerm);
	}, [searchTerm]);

	/**
	 * Handle changes to the search input. Set the border color to blue-500 and update the searchTerm with the sanitized input value.
	 * @param {ChangeEvent<HTMLInputElement>} e - The change event object.
	 */
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setBorderColor("border border-blue-500");
		setSearchTerm(sanitize(e.target.value, maxLength));
	};

	/**
	 * Set the border color to blue-500 when the search input is focused.
	 * @returns {void}
	 */
	const handleFocus = () => setBorderColor("border border-blue-500");

	/**
	 * Sets the border color back to its original state (green if there is a search term, otherwise none)
	 * when the search input is blurred.
	 * @returns {void}
	 */
	const handleBlur = () =>
		setBorderColor(
			searchTerm !== "" ? "border border-blue-500" : "border-none"
		);

	/**
	 * Clear the search input by setting the searchTerm to an empty string and calling the searchFunction with an empty string.
	 */
	const clearSearch = () => {
		setSearchTerm("");
		searchFunction("");
	};

	return (
		<div className={`relative w-fit ${className}`} data-testid="Search">
			<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<IoIosSearch className="text-gray-400" size={14} />
			</div>
			<input
				type="text"
				value={searchTerm}
				onChange={onChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				onClick={(e) => (e.target as HTMLInputElement).select()}
				data-testid="search-input"
				placeholder={placeHolder}
				maxLength={maxLength}
				pattern={effectivePattern}
				title={`Alphanumeric and symbols, 0–${maxLength} chars`}
				className={`w-full ring-0 ${borderColor} placeholder-white/60 h-[32px] text-xs py-1 pl-10 pr-4 rounded bg-background-100-2 outline-none [appearance:textfield] focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName}`}
			/>
			{searchTerm && (
				<button
					type="button"
					onClick={clearSearch}
					className="absolute inset-y-0 right-0 flex items-center pr-3"
					aria-label="Clear search"
				>
					<IoMdClose className="text-gray-400" size={14} />
				</button>
			)}
		</div>
	);
};

export default Search;
