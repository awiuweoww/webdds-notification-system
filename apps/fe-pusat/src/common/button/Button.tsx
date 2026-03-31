import { forwardRef, memo } from "react";
import { cn } from "../../utils/cn";
import DotLoading from "../dot-loading/DotLoading";
import type { ButtonProps, ButtonVariant, ButtonColor } from "./Button.types";

const buttonBaseStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
    solid: {
        primary: "bg-primary-50 text-white",
        error: "bg-btn-error text-white",
        success: "bg-btn-success text-white",
        warning: "bg-btn-warning text-white",
        neutral: "bg-neutral-600 text-white"
    },
    outline: {
        primary: "border border-primary-50 text-primary-50",
        error: "border border-btn-error text-btn-error",
        success: "border border-btn-success text-btn-success",
        warning: "border border-btn-warning text-btn-warning",
        neutral: "border border-neutral-600 text-neutral-600"
    },
    ghost: {
        primary: "bg-transparent text-primary-50",
        error: "bg-transparent text-btn-error",
        success: "bg-transparent text-btn-success",
        warning: "bg-transparent text-btn-warning",
        neutral: "bg-transparent text-neutral-600"
    }
};

const buttonHoverStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
    solid: {
        primary: "hover:bg-primary-50/90",
        error: "hover:bg-btn-error-hover",
        success: "hover:bg-btn-success-hover",
        warning: "hover:bg-btn-warning-hover",
        neutral: "hover:bg-neutral-700"
    },
    outline: {
        primary: "hover:bg-primary-50/10",
        error: "hover:bg-btn-error/10",
        success: "hover:bg-btn-success/10",
        warning: "hover:bg-btn-warning/10",
        neutral: "hover:bg-neutral-50"
    },
    ghost: {
        primary: "hover:bg-primary-50/10",
        error: "hover:bg-btn-error/10",
        success: "hover:bg-btn-success/10",
        warning: "hover:bg-btn-warning/10",
        neutral: "hover:bg-neutral-50"
    }
};

const sizeStyles = {
    xs: "h-6 px-3 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-12 px-[18px] text-base",
    lg: "h-14 px-12 text-lg"
};

/**
 * Komponen tombol yang dapat disesuaikan yang mendukung varian, warna, ukuran,
 * status pemuatan, spinner, tata letak lebar penuh, dan atribut tombol asli.
 */
export const Button = memo(
    forwardRef<HTMLButtonElement, ButtonProps>(
        (
            {
                children,
                className,
                variant = "solid",
                color = "primary",
                size = "md",
                loading,
                loadingDirection = "left",
                spinnerColor = "text-current",
                fullWidth = false,
                dataTestId,
                type = "button",
                ...rest
            },
            ref
        ) => {
            const isDisabled = rest.disabled || loading;

            return (
                <button
                    ref={ref}
                    type={type}
                    data-testid={dataTestId}
                    className={cn(
                        "group inline-flex items-center justify-center rounded-lg font-medium transition-all select-none font-montserrat",
                        // Gaya dasar
                        sizeStyles[size],
                        buttonBaseStyles[variant]?.[color],
                        // Keadaan Hover & Active (hanya jika tidak disabled)
                        !isDisabled && buttonHoverStyles[variant]?.[color],
                        !isDisabled && "active:scale-[0.98] active:shadow-inner cursor-pointer",
                        // Keadaan Disabled
                        isDisabled && "opacity-60 cursor-not-allowed pointer-events-none",
                        // Tata Letak
                        fullWidth && "w-full",
                        className
                    )}
                    disabled={isDisabled}
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
    )
);

Button.displayName = "Button";

export default Button;
