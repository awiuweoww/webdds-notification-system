
import {
    useEffect,
    useRef,
    memo,
    type ReactNode,
    type FC,
    type HTMLAttributes
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

// --- Types ---

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "color"> {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    headerClassName?: string;
}

// --- Icons ---

const XIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

// --- Component ---

const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
    description,
    footer,
    size = "md",
    className,
    headerClassName,
    ...props
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isOpen && event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            // Restore scrolling on body
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Handle click outside
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (overlayRef.current === e.target) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-full m-4 h-[calc(100vh-2rem)]",
    };

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
            <div
                ref={contentRef}
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative w-full overflow-hidden rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-neutral-950/5 dark:bg-neutral-950 dark:text-neutral-100 dark:ring-neutral-800 font-montserrat flex flex-col max-h-[90vh]",
                    "animate-in zoom-in-95 duration-200",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {/* Header */}
                {(title || description) && (
                    <div className={cn("flex flex-col space-y-1.5 p-5 pb-4 border-b border-neutral-100 shrink-0", headerClassName)}>
                        {title && (
                            <div className="font-semibold leading-none tracking-tight text-lg pr-8">
                                {title}
                            </div>
                        )}
                        {description && (
                            <div className="text-sm opacity-90 mt-1">
                                {description}
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className={cn("absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2", 
                                headerClassName ? "text-white" : "text-neutral-500")}
                        >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                )}

                {!title && !description && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
                    >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                )}

                {/* Content - Scrollable area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 p-6 pt-4 mt-auto border-t border-neutral-100 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default memo(Modal);
