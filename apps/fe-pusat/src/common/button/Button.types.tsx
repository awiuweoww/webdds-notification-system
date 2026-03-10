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
 * Description        : Type definitions for the Button component and its variants, colors, and props.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of Button type definitions.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonColor = "primary" | "error" | "success" | "warning" | "gray";

export type ButtonProps = {
	children: ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: "xs" | "sm" | "md" | "lg";
	loading?: boolean;
	spinnerColor?: string;
	className?: string;
	fullWidth?: boolean;
	dataTestId?: string;
	loadingDirection?: "left" | "right" | "up" | "down";
} & ButtonHTMLAttributes<HTMLButtonElement>;
