/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author        : Fauzan
 * Version       : 0.1.1
 * Created Date  : 2025-09-03
 * Description   : This file contains the Input component, a customizable input field with
 *
 * Changelog:
 * - 0.1.0 (2025-09-03): Initial version input component.
 * - 0.1.1 (2025-09-10): Added ClassName props for container, input, and unit.
 */
import React, {
	memo,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState
} from "react";

import { cn } from "@utils/cn";
import { logger } from "@utils/logger/logger";

/**
 * Props for Input component.
 */
export interface InputProps {
	name?: string;
	value: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
	onEnterPressed?: (name: string) => void;
	helperText?: string;
	errorText?: string;
	unit?: string;
	inputWidth?: string;
	inputHeight?: string;
	fontSize?: string;
	textAlign?: "left" | "right" | "center";
	min?: number;
	max?: number;
	showError?: boolean;
	validate?: (value: string | number) => boolean;
	placeholder?: string;
	disabled?: boolean;
	readOnly?: boolean;
	leftSlot?: React.ReactNode;
	inputPattern?: string;
	formatThousands?: boolean;
	onValidChange?: (isValid: boolean) => void;
	maxDecimal?: number;
	isNumeric?: boolean;
	resetFlag?: boolean;
	showSuccess?: boolean;
	successText?: string;
	style?: React.CSSProperties;
	showCharCount?: boolean;
	maxLength?: number;
	containerClass?: string;
	inputClass?: string;
	unitClass?: string;
	getErrorText?: (raw: string) => string;
}

/**
 * Format a number by inserting thousands separators and optionally a decimal separator.
 * @param value the number to format, or undefined/null/"" for an empty string
 * @returns the formatted string
 */
const formatNumber = (value: string | number | undefined): string => {
	if (value === undefined || value === null || value === "") return "";
	const [intPart, decPart] = String(value).split(".");
	const num = Number(intPart.replace(/,/g, ""));
	const intFormatted = isNaN(num) ? intPart : num.toLocaleString("en-US");
	return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted;
};

/**
 * Remove thousands separators from a string.
 * @param value the string to unformat
 * @returns the unformatted string
 */
const unformatNumber = (value: string): string => value.replace(/,/g, "");

/**
 * Validate a string or number based on the given pattern, minimum, maximum, and validation function.
 * @param raw the string or number to validate
 * @param pattern the RegExp pattern to use for validation
 * @param min the minimum value allowed
 * @param max the maximum value allowed
 * @param validate the validation function to use
 * @returns true if the string or number is valid, false otherwise
 */
const getValidationStatus = (
	raw: string,
	pattern: RegExp | null,
	min?: number,
	max?: number,
	validate?: (val: string | number) => boolean
): boolean => {
	const parsed = parseFloat(raw);
	if (validate) return validate(raw);
	if (!pattern?.test(raw)) return false;
	if (isNaN(parsed)) return false;
	if (min !== undefined && parsed < min) return false;
	if (max !== undefined && parsed > max) return false;
	return true;
};

/**
 * Clean a string that is supposed to be a numeric input by removing all but the valid
 * characters, and trimming any decimal part to the given maximum number of decimal places.
 * @param raw the string to clean
 * @param maxDecimal the maximum number of decimal places to allow
 * @returns the cleaned string
 */
const cleanNumericInput = (raw: string, maxDecimal: number): string => {
	const stripped = raw.replace(/[^\d.,-]/g, "").replace(/(?!^)-/g, "");
	const [intPart, decPart] = stripped.split(".");
	const sanitizedInt = intPart === "-" ? "-" : intPart.replace(/,/g, "");
	if (maxDecimal === 0) return sanitizedInt;
	if (decPart !== undefined)
		return `${sanitizedInt}.${decPart.slice(0, maxDecimal)}`;
	return sanitizedInt;
};

/**
 * Return the correct message to show in the input's message field based on the
 * showError and showHelper flags, as well as the errorText and helperText
 * strings. If showError is true, return the errorText if it exists, or a
 * generic error message if errorText is undefined. If showHelper is true,
 * return the helperText if it exists, or an empty string if helperText is
 * undefined. If neither flag is true, return an empty string.
 * @param showError if true, show the error message if errorText is defined, or
 * a generic error message if errorText is undefined
 * @param showHelper if true, show the helper message if helperText is defined, or
 * an empty string if helperText is undefined
 * @param errorText the error message to show if showError is true
 * @param helperText the helper message to show if showHelper is true
 * @param min the minimum numeric value, only used if showError is true and errorText
 * is undefined
 * @param max the maximum numeric value, only used if showError is true and errorText
 * is undefined
 * @returns the message to show in the input's message field
 */
const getMessage = (
	showError: boolean,
	showHelper: boolean,
	errorText?: string,
	helperText?: string,
	min?: number,
	max?: number
): string => {
	if (showError) return errorText ?? `Value must be between ${min} and ${max}`;
	if (showHelper) return helperText ?? "";
	return "";
};

/**
 * Return a Tailwind class string to set the background color of the input element.
 * If disabled is true, the input element will have a gray background with 50% opacity.
 * Otherwise, the input element will have a white background. The text color will
 * also be set accordingly.
 * @param {boolean} [disabled] if true, the input element will be grayed out
 * @returns {string} a Tailwind class string
 */
const getBackgroundClass = (disabled?: boolean) =>
	disabled
		? "bg-background-100-2/50 text-white/50"
		: "bg-background-100-2 text-white";

/**
 * Return a Tailwind class string to set the border color of the input element.
 * If showErrorMessage is true, the border color will be red.
 * If showSuccessMessage is true, the border color will be green.
 * If focused is true, the border color will be blue.
 * Otherwise, the border color will be transparent.
 * @param {boolean} [focused] if true, the input element will have a blue border
 * @param {boolean} [showErrorMessage] if true, the input element will have a red border
 * @param {boolean} [showSuccessMessage] if true, the input element will have a green border
 * @returns {string} a Tailwind class string
 */
const getBorderClass = (
	focused: boolean,
	showErrorMessage: boolean,
	showSuccessMessage: boolean
) => {
	if (showErrorMessage) return "border border-red-500";
	if (showSuccessMessage) return "border border-green-500";
	if (focused) return "border border-blue-500";
	return "border border-transparent";
};

/**
 * Return a Tailwind class string to set the text alignment of the input element.
 * The textAlign prop can be one of "left", "center", or "right". If textAlign is
 * "left" or undefined, the input element will have a CSS class of "pl-2 text-left".
 * If textAlign is "center", the input element will have a CSS class of "text-center".
 * If textAlign is "right", the input element will have a CSS class of "text-right".
 * @param {InputProps["textAlign"]} textAlign the text alignment of the input element
 * @returns {string} a Tailwind class string
 */
const getTextAlignClass = (textAlign: InputProps["textAlign"]) => {
	if (textAlign === "right") return "text-right";
	if (textAlign === "center") return "text-center";
	return "pl-2 text-left";
};

/**
 * Custom Input component with support for validation, formatting,
 * helper/error/success messages, unit labels, and character count.
 *
 * @param {Object} root0 - The props object.
 * @param {string} root0.name - The name of the input element.
 * @param {string|number} [root0.value] - The current input value.
 * @param {(e: React.ChangeEvent<HTMLInputElement>, value: string) => void} [root0.onChange] - Change handler.
 * @param {(name: string) => void} [root0.onEnterPressed] - Called when Enter is pressed (on blur).
 * @param {string} [root0.helperText] - Helper text shown when focused.
 * @param {string} [root0.errorText] - Error message text.
 * @param {boolean} [root0.showSuccess=false] - Whether to display the success message.
 * @param {string} [root0.successText="Update success"] - Success message text.
 * @param {string} [root0.unit] - Unit label displayed to the right of the input.
 * @param {string} [root0.inputWidth="w-full"] - Tailwind width classes for the container.
 * @param {string} [root0.inputHeight="h-9"] - Tailwind height classes for the container.
 * @param {string} [root0.fontSize="text-xs"] - Tailwind font size classes.
 * @param {"left"|"center"|"right"} [root0.textAlign="left"] - Text alignment inside the input.
 * @param {number} [root0.min] - Minimum value (for validation).
 * @param {number} [root0.max] - Maximum value (for validation).
 * @param {boolean} [root0.showError=true] - Whether to show the error message.
 * @param {(raw: string) => boolean} [root0.validate] - Custom validator function.
 * @param {string} [root0.placeholder] - Placeholder text.
 * @param {boolean} [root0.disabled=false] - Whether the input is disabled.
 * @param {boolean} [root0.readOnly=false] - Whether the input is read-only.
 * @param {React.ReactNode} [root0.leftSlot] - Left slot element (e.g. icon).
 * @param {string} [root0.inputPattern="^\\d+$"] - Regex pattern (string form).
 * @param {boolean} [root0.formatThousands=true] - Format numeric values with thousands separators.
 * @param {(isValid: boolean) => void} [root0.onValidChange] - Called when validation status changes.
 * @param {number} [root0.maxDecimal=0] - Maximum number of decimal places.
 * @param {boolean} [root0.isNumeric=true] - Whether only numeric input is allowed.
 * @param {boolean} [root0.resetFlag=false] - External trigger to reset blur/focus state.
 * @param {React.CSSProperties} [root0.style] - Inline styles applied to the container.
 * @param {boolean} [root0.showCharCount=false] - Whether to display a character counter.
 * @param {number} [root0.maxLength] - Maximum character length.
 * @param {string} [root0.containerClass] - Extra Tailwind/custom class names for the container.
 * @param {string} [root0.inputClass] - Extra Tailwind/custom class names for the input element.
 * @param {string} [root0.getErrorText] - Extra Tailwind/custom class names for the helper element.
 * @param {string} [root0.unitClass] - Extra Tailwind/custom class names for the unit element.
 *
 * @returns {JSX.Element} The rendered Input component.
 */
const Input: React.FC<InputProps> = ({
	name,
	value,
	onChange = () => {},
	onEnterPressed,
	helperText,
	errorText,
	showSuccess = false,
	successText = "Update success",
	unit,
	inputWidth = "w-full",
	inputHeight = "h-9",
	fontSize = "text-xs",
	textAlign = "left",
	min,
	max,
	showError = true,
	validate,
	placeholder,
	disabled = false,
	readOnly = false,
	leftSlot,
	inputPattern = "^\\d+$",
	formatThousands = true,
	onValidChange,
	maxDecimal = 0,
	isNumeric = true,
	resetFlag = false,
	style,
	showCharCount = false,
	maxLength,
	getErrorText,
	...props
}) => {
	const [focused, setFocused] = useState(false);
	const [hasBlurred, setHasBlurred] = useState(false);
	const [internalValue, setInternalValue] = useState(String(value ?? ""));
	const id = useId();
	const prevValidRef = useRef<boolean | null>(null);
	const focusSnapshotRef = useRef<string>("");

	const UNIT_BOX_WIDTH_PX = 25;

	useEffect(() => {
		setInternalValue(String(value ?? ""));
	}, [value]);

	const charCount = internalValue.length;
	const charCounter =
		showCharCount && maxLength ? `${charCount}/${maxLength}` : "";
	const hasTyped = internalValue !== "";

	useEffect(() => {
		setHasBlurred(false);
	}, [resetFlag]);

	const compiledPattern = useMemo(() => {
		try {
			return new RegExp(inputPattern);
		} catch (err) {
			logger.error("Invalid inputPattern:", inputPattern, err);
			return null;
		}
	}, [inputPattern]);

	const rawValue = useMemo(
		() => unformatNumber(internalValue),
		[internalValue]
	);

	const isValid = useMemo(() => {
		return getValidationStatus(rawValue, compiledPattern, min, max, validate);
	}, [rawValue, compiledPattern, min, max, validate]);

	useEffect(() => {
		if (prevValidRef.current !== isValid) {
			prevValidRef.current = isValid;
			onValidChange?.(isValid);
		}
	}, [isValid, onValidChange]);

	const showErrorMessage = hasBlurred && showError && !isValid;
	const showSuccessMessage = hasBlurred && !showErrorMessage && showSuccess;
	const showHelper = focused && !showErrorMessage && !!helperText && hasTyped;

	const message = useMemo(() => {
		if (showErrorMessage) {
			const dynamicError = getErrorText ? getErrorText(rawValue) : undefined;
			return (
				dynamicError ?? getMessage(true, false, errorText, helperText, min, max)
			);
		}
		if (showSuccessMessage) return successText;
		if (showHelper)
			return getMessage(false, true, errorText, helperText, min, max);
		return "";
	}, [
		showErrorMessage,
		showSuccessMessage,
		showHelper,
		getErrorText,
		rawValue,
		errorText,
		helperText,
		successText,
		min,
		max
	]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value;

			if (!isNumeric) {
				if (raw === "" || compiledPattern?.test(raw)) {
					setInternalValue(raw);
					onChange(e, raw);
				}
				return;
			}

			const cleaned = cleanNumericInput(raw, maxDecimal);
			if (cleaned === "" || compiledPattern?.test(cleaned)) {
				setInternalValue(cleaned);
				onChange(e, cleaned);
			}
		},
		[compiledPattern, isNumeric, maxDecimal, onChange]
	);

	const handleFocus = useCallback(() => {
		focusSnapshotRef.current = String(value ?? "");
		setFocused(true);
		setHasBlurred(false);
	}, [value]);

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			setFocused(false);
			setHasBlurred(true);
			onEnterPressed?.(e.currentTarget.name);
		},
		[onEnterPressed]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Escape") {
				const resetTo = focusSnapshotRef.current ?? "";
				setInternalValue(resetTo);
				onChange?.(
					e as unknown as React.ChangeEvent<HTMLInputElement>,
					resetTo
				);
				setHasBlurred(false);
				setFocused(false);
				(e.currentTarget as HTMLInputElement).blur();
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			if (e.key === "Enter") e.currentTarget.blur();
		},
		[onChange]
	);

	const handleClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
		(e.target as HTMLInputElement).select();
	}, []);

	const displayValue =
		formatThousands && internalValue !== ""
			? formatNumber(internalValue)
			: internalValue;

	const feedbackClass = useMemo(() => {
		if (showErrorMessage) return "text-red-500";
		if (showSuccessMessage) return "text-green-500";
		return "text-gray-400";
	}, [showErrorMessage, showSuccessMessage]);

	const inputCls = useMemo(
		() =>
			cn(
				"w-full",
				fontSize,
				disabled ? "text-white/50" : "text-white",
				getTextAlignClass(textAlign),
				"bg-transparent border-none outline-none appearance-none",
				"[&::-webkit-inner-spin-button]:appearance-none",
				"[&::-webkit-outer-spin-button]:appearance-none",
				"focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent focus:shadow-none",
				"focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent",
				disabled || readOnly ? "cursor-not-allowed" : "cursor-pointer"
			),
		[fontSize, disabled, readOnly, textAlign]
	);

	const containerCls = useMemo(
		() =>
			cn(
				"flex items-center",
				inputWidth,
				inputHeight,
				"rounded-md transition-colors duration-200",
				getBackgroundClass(disabled),
				readOnly ? "pointer-events-none opacity-50" : "",
				getBorderClass(focused, showErrorMessage, showSuccessMessage),
				"pr-3 gap-4"
			),
		[
			inputWidth,
			inputHeight,
			disabled,
			readOnly,
			focused,
			showErrorMessage,
			showSuccessMessage
		]
	);

	const unitBoxClass = useMemo(
		() =>
			cn(
				"shrink-0 text-left",
				fontSize,
				disabled ? "text-white/50" : "text-white/80"
			),
		[fontSize, disabled]
	);

	return (
		<div className="relative w-full" data-testid="custom-input-test">
			<div className={cn(containerCls, props.containerClass)} style={style}>
				{leftSlot && <div className="mr-1">{leftSlot}</div>}

				<input
					id={name ?? id}
					name={name}
					value={displayValue}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onClick={handleClick}
					disabled={disabled}
					readOnly={readOnly}
					className={cn(inputCls, "flex-1", props.inputClass)}
					placeholder={placeholder}
					data-testid={name}
					autoComplete="off"
					maxLength={maxLength}
					{...props}
				/>

				{unit && (
					<span
						className={cn(unitBoxClass, props.unitClass)}
						style={{ width: UNIT_BOX_WIDTH_PX }}
						aria-hidden
					>
						{unit}
					</span>
				)}
			</div>

			{message && (
				<div className="absolute mt-1 text-[10px] whitespace-nowrap">
					<span data-testid="feedback-message" className={feedbackClass}>
						{message}
					</span>
				</div>
			)}

			{showCharCount && maxLength && focused && hasTyped && (
				<div className="absolute right-1 mt-1 text-[12px] text-neutral-6">
					{charCounter}
				</div>
			)}
		</div>
	);
};

export default memo(Input);
