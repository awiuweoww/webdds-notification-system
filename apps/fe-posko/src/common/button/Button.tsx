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
 * Description        : Button component supporting variant, color, loading, and size options for modern UI.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the Button component.
 */
import { memo } from "react";

import { cn } from "@utils/cn";

import DotLoading from "../dot-loading/DotLoading";
import { ButtonColor, ButtonProps, ButtonVariant } from "./Button.types";

const buttonBaseStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
	solid: {
		primary: "bg-blue-600 text-white",
		error: "bg-btn-error text-white",
		success: "bg-btn-success text-white",
		warning: "bg-yellow-500 text-white",
		gray: "bg-gray-600 text-white"
	},
	outline: {
		primary: "border border-primary-20 text-primary-20",
		error: "border border-btn-error text-btn-error",
		success: "border border-btn-success text-btn-success",
		warning: "border border-yellow text-yellow",
		gray: "border border-neutral-2 text-neutral-2"
	},
	ghost: {
		primary: "bg-transparent text-blue-600",
		error: "bg-transparent text-red-600",
		success: "bg-transparent text-green-600",
		warning: "bg-transparent text-yellow-500",
		gray: "bg-transparent text-gray-600"
	}
};

const buttonHoverStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
	solid: {
		primary: "hover:bg-blue-700",
		error: "hover:bg-btn-error-hover",
		success: "hover:bg-btn-success-hover",
		warning: "hover:bg-yellow-600",
		gray: "hover:bg-gray-700"
	},
	outline: {
		primary: "hover:bg-primary-50 hover:text-white",
		error: "hover:border-btn-error-hover hover:text-btn-error-hover",
		success: "hover:border-btn-success-hover hover:text-btn-success-hover",
		warning: "hover:bg-yellow-200 hover:text-black",
		gray: "hover:bg-neutral-1 hover:text-black"
	},
	ghost: {
		primary: "hover:bg-blue-50",
		error: "hover:bg-red-50",
		success: "hover:bg-green-50",
		warning: "hover:bg-yellow-50",
		gray: "hover:bg-gray-50"
	}
};

const sizeStyles = {
	xs: "h-6 px-3 text-xs",
	sm: "h-8 px-3 text-sm",
	md: "h-12 px-[18px] text-base",
	lg: "h-14 px-12 text-lg"
};

/**
 * A customizable button component that supports variants, colors, sizes,
 * loading state, spinner, full-width layout, and native button attributes.
 *
 * @param {Object} props - All props passed to the Button component.
 * @param {React.ReactNode} props.children - The button's content (text, icon, etc.).
 * @param {string} [props.className] - Additional Tailwind or custom class names.
 * @param {"solid" | "outline" | "ghost"} [props.variant="solid"] - Visual style variant of the button.
 * @param {"primary" | "secondary" | "danger" | string} [props.color="primary"] - Color scheme.
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Button size.
 * @param {boolean} [props.loading] - Shows a spinner instead of content when true.
 * @param {string} [props.spinnerColor="text-white"] - Tailwind text color class for the spinner.
 * @param {boolean} [props.fullWidth=false] - Makes the button take full container width.
 * @param {string} [props.dataTestId] - Value for the `data-testid` attribute (for testing).
 * @param {boolean} [props.disabled] - Whether the button is disabled.
 * @param {() => void} [props.onClick] - Click event handler.
 *
 * @returns {JSX.Element} The rendered button element.
 */
export const Button = memo(
	({
		children,
		className,
		variant = "solid",
		color = "primary",
		size = "md",
		loading,
		loadingDirection = "left",
		spinnerColor = "text-white",
		fullWidth = false,
		dataTestId,
		...rest
	}: ButtonProps) => {
		const isDisabled = rest.disabled;

		return (
			<button
				data-testid={dataTestId}
				className={cn(
					"group inline-flex items-center justify-center rounded-lg font-medium transition-all",
					sizeStyles[size],
					buttonBaseStyles[variant][color],
					!isDisabled && buttonHoverStyles[variant][color],
					!isDisabled && "active:scale-[0.96] active:shadow-inner",
					isDisabled && "opacity-60 cursor-not-allowed",
					fullWidth && "w-full",
					className
				)}
				{...rest}
			>
				{loading ? (
					<DotLoading direction={loadingDirection} color={spinnerColor} />
				) : (
					children
				)}
			</button>
		);
	}
);
