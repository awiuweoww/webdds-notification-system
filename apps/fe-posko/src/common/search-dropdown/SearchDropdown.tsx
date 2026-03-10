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
 * Description        : Reusable searchable dropdown component with disabled, enabled, hover,
 *                      and pressed states. Built with Tailwind CSS. Suitable for consistent UI/UX design.
 *
 * Changelog:
 * - 0.1.0 (15 May 2025): Initial creation of searchable dropdown component.
 */
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from "react";

import { highlightMatches } from "./Highlight";

type Option = { value: string; label: string };

export type SearchDropdownProps = {
	options: Option[];
	onSelect: (option: Option) => void;
	disabled?: boolean;
	dropdownWidth?: string;
	dropdownHeight?: string;
	align?: "left" | "right";
	selectedValue?: Option;
	maxVisibleItems?: number;
	renderOption?: (option: Option, query: string) => React.ReactNode;
	renderSelected?: (option: Option) => React.ReactNode;
};

/**
 * A reusable searchable dropdown component with disabled, enabled, hover, and pressed states.
 * Built with Tailwind CSS. Suitable for consistent UI/UX design.
 *
 * @param {SearchDropdownProps} props - Component props.
 * @param {Option[]} props.options - An array of options to be displayed in the dropdown.
 * @param {(option: Option) => void} props.onSelect - The callback function to be called when the selected value changes.
 * @param {boolean} [props.disabled=false] - Whether the component is disabled or not.
 * @param {string} [props.dropdownWidth="w-[250px]"] - The width of the dropdown menu.
 * @param {string} [props.dropdownHeight] - The height of the dropdown menu.
 * @param {"left" | "right"} [props.align="left"] - The alignment of the dropdown menu.
 * @param {Option} [props.selectedValue] - The currently selected value.
 * @param {number} [props.maxVisibleItems=5] - The maximum number of visible items in the dropdown menu.
 * @param {(option: Option) => React.ReactNode} [props.renderOption] - The function to be called to render each item in the dropdown menu.
 *
 * @returns {ReactElement} The rendered component.
 */
const SearchDropdown: React.FC<SearchDropdownProps> = ({
	options,
	onSelect,
	disabled = false,
	dropdownWidth = "w-[250px]",
	dropdownHeight,
	align = "left",
	selectedValue,
	maxVisibleItems = 5,
	renderOption,
	renderSelected
}) => {
	const [search, setSearch] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);
	const [justClickedIcon, setJustClickedIcon] = useState(false);

	/**
	 * Filters and ranks options by the search query.
	 * Priority: prefix match (0), word-boundary match (1), substring match (2).
	 * Tie-breakers: earliest match position, then alphabetical by label.
	 *
	 * @param options The full list of options.
	 * @param search The user-entered query.
	 * @returns Ranked and filtered options.
	 */
	function rankAndFilterOptions(options: Option[], search: string): Option[] {
		const query = search.trim().toLowerCase();
		if (!query) return options;

		const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const wordBoundaryRegex = new RegExp(`\\b${escapedQuery}`, "i");

		type Ranked = { option: Option; score: number; position: number };

		const rankedList: Array<Ranked | null> = options.map((option) => {
			const label = option.label;
			const labelLower = label.toLowerCase();

			const indexOfQuery = labelLower.indexOf(query);
			if (indexOfQuery === -1) return null;

			const startsWithQuery = labelLower.startsWith(query);
			const wordBoundaryMatch = wordBoundaryRegex.exec(label);
			const wordBoundaryIndex: number = wordBoundaryMatch
				? wordBoundaryMatch.index
				: -1;

			let score: number;
			if (startsWithQuery) {
				score = 0;
			} else if (wordBoundaryIndex >= 0) {
				score = 1;
			} else {
				score = 2;
			}

			let position: number;
			if (startsWithQuery) {
				position = 0;
			} else if (wordBoundaryIndex >= 0) {
				position = wordBoundaryIndex;
			} else {
				position = indexOfQuery;
			}

			return { option, score, position };
		});

		return rankedList
			.filter((entry): entry is Ranked => entry !== null)
			.sort(
				(a, b) =>
					a.score - b.score ||
					a.position - b.position ||
					a.option.label.localeCompare(b.option.label)
			)
			.map((entry) => entry.option);
	}

	const filteredOptions = useMemo(
		() => rankAndFilterOptions(options, search),
		[options, search]
	);

	/**
	 * Handle an option selection from the dropdown list.
	 * If the component is disabled, do nothing.
	 * Otherwise, call the onSelect callback with the selected option,
	 * update the search input with the selected option's label,
	 * and hide the dropdown list.
	 * @param {Option} option - The option that was selected.
	 */
	const handleSelect = (option: Option) => {
		if (disabled) return;
		onSelect(option);
		setSearch(option.label);
		setShowDropdown(false);
	};

	useEffect(() => {
		setSearch(selectedValue?.label ?? "");
	}, [selectedValue]);

	/**
	 * Handles a click event on the icon.
	 * If the component is disabled, do nothing.
	 * If the component is not disabled, set the justClickedIcon state to true,
	 * focus the search input, and toggle the showDropdown state.
	 */
	const handleIconClick = () => {
		if (disabled) return;
		setJustClickedIcon(true);
		setShowDropdown((open) => {
			const next = !open;
			if (next) {
				inputRef.current?.focus();
			} else {
				inputRef.current?.blur();
			}
			return next;
		});
	};

	const handleFocus = useCallback(() => {
		if (disabled) return;
		setIsFocused(true);
		setShowDropdown(true);
	}, [disabled]);

	const handleBlur = useCallback(() => {
		setIsFocused(false);
	}, []);

	useEffect(() => {
		/**
		 * Handles a click event outside the dropdown menu.
		 * If the icon was just clicked, do nothing.
		 * If the target element is not inside the dropdown menu, it will
		 * close the dropdown menu.
		 * @param {MouseEvent} event - The mouse event triggered by the click.
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (justClickedIcon) {
				setJustClickedIcon(false);
				return;
			}
			const t = event.target;
			if (!(t instanceof Node)) return;
			if (rootRef.current && !rootRef.current.contains(t))
				setShowDropdown(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [justClickedIcon]);

	const alignClass =
		align === "right" ? "right-0 left-auto" : "left-0 right-auto";
	const ITEM_HEIGHT_PX = 36;
	const listMaxHeightPx = maxVisibleItems * ITEM_HEIGHT_PX;
	const showSelectedOverlay = !!(
		renderSelected &&
		selectedValue &&
		!showDropdown
	);
	const inputValue = showDropdown ? search : "";

	return (
		<div
			ref={rootRef}
			className={`relative ${dropdownWidth} ${disabled ? "opacity-50" : ""}`}
			aria-disabled={disabled}
		>
			<div className="relative">
				{!showDropdown && selectedValue && renderSelected && (
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center px-3 text-xs text-gray-100">
						{renderSelected(selectedValue)}
					</div>
				)}

				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					disabled={disabled}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onChange={(e) => setSearch(e.target.value)}
					className={
						(dropdownHeight ? dropdownHeight + " " : "") +
						(disabled
							? "w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-0 text-white bg-background-100-2 cursor-not-allowed font-medium "
							: "w-full px-3 py-2 pr-10 rounded-md focus:outline-none focus:ring-0 text-white bg-background-100-2 font-medium ") +
						(isFocused ? "border border-blue-500 " : "border-none ") +
						"text-xs " +
						(showSelectedOverlay
							? "!text-transparent caret-transparent selection:bg-transparent "
							: "") +
						"relative z-0"
					}
					autoComplete="off"
				/>

				<span
					aria-hidden
					onMouseDown={(e) => {
						e.preventDefault();
						handleIconClick();
					}}
					className={`absolute right-3 top-1/2 -translate-y-1/2 text-white ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:text-primary-green-3"} transition`}
				>
					<svg
						fill="none"
						height="20"
						width="20"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="4.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={showDropdown ? "transition transform rotate-180" : ""}
					>
						<path d="M6 9l6 6 6-6"></path>
					</svg>
				</span>
			</div>

			{showDropdown && filteredOptions.length > 0 && !disabled && (
				<ul
					className={`absolute ${alignClass} w-full mt-1 bg-background-100-2 border border-none rounded-md shadow-lg z-10 overflow-y-auto cd-scroll`}
					style={{ maxHeight: `${listMaxHeightPx}px` }}
				>
					{filteredOptions.map((option) => {
						const isSelected = selectedValue?.value === option.value;
						const base =
							"px-3 py-2 text-xs text-gray-100 transition select-none flex items-center gap-2";
						const state = isSelected ? " bg-primary-green-3" : "";
						const hover = isSelected
							? " hover:bg-primary-green-3"
							: " hover:bg-neutral-6";
						const cursor = " cursor-pointer";
						return (
							<li
								aria-hidden
								key={option.value}
								onMouseDown={() => handleSelect(option)}
								className={base + state + hover + cursor}
							>
								{renderOption ? (
									renderOption(option, search)
								) : (
									<span className="truncate" title={option.label}>
										{highlightMatches(option.label, search)}
									</span>
								)}
							</li>
						);
					})}
				</ul>
			)}

			<style>{`
        .cd-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .cd-scroll::-webkit-scrollbar-thumb { background: #ffffff; border-radius: 8px; }
        .cd-scroll::-webkit-scrollbar-track { background: transparent; }
        .cd-scroll { scrollbar-color: #ffffff transparent; scrollbar-width: thin; }
      `}</style>
		</div>
	);
};

export default SearchDropdown;
export type { Option };
