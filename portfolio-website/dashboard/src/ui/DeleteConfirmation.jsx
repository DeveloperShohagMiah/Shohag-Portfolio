
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    Check,
    LoaderCircle,
    ShieldAlert,
    Trash2,
    X,
} from "lucide-react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const cn = (...classes) => classes.filter(Boolean).join(" ");

export function DeleteConfirmation({
    open,
    onClose,
    onConfirm,
    title = "Delete item?",
    description = "This action cannot be undone. The selected item will be permanently removed.",
    itemName,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    isLoading: loadingProp = false,
}) {
    const reducedMotion = useReducedMotion();

    const [internalLoading, setInternalLoading] = useState(false);

    const cancelRef = useRef(null);
    const confirmRef = useRef(null);
    const previousFocusRef = useRef(null);
    const requestLockRef = useRef(false);

    const isLoading = loadingProp || internalLoading;

    const handleClose = useCallback(() => {
        if (isLoading) return;
        onClose?.();
    }, [isLoading, onClose]);

    useEffect(() => {
        if (!open) {
            requestLockRef.current = false;
            return undefined;
        }

        previousFocusRef.current = document.activeElement;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusFrame = requestAnimationFrame(() => {
            cancelRef.current?.focus();
        });

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
                return;
            }

            // Keep keyboard focus inside the modal.
            if (event.key === "Tab") {
                const first = cancelRef.current;
                const last = confirmRef.current;

                if (!first || !last) return;

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            cancelAnimationFrame(focusFrame);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;

            const previousFocus = previousFocusRef.current;

            if (previousFocus && typeof previousFocus.focus === "function") {
                previousFocus.focus();
            }
        };
    }, [open, handleClose]);

    const handleConfirm = async () => {
        if (!onConfirm || isLoading || requestLockRef.current) return;

        requestLockRef.current = true;
        setInternalLoading(true);

        try {
            await onConfirm();
        } catch (error) {
            // The parent can handle the error and display a toast.
            // Keep the dialog open so the user can retry.
            console.error("Delete confirmation failed:", error);
        } finally {
            requestLockRef.current = false;
            setInternalLoading(false);
        }
    };

    const motionTransition = reducedMotion
        ? { duration: 0.12 }
        : { duration: 0.28, ease: EASE };

    return (
        <AnimatePresence>
            {open && (
                <div
                    key="delete-confirmation"
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
                >
                    {/* Backdrop */}
                    <motion.button
                        type="button"
                        tabIndex={-1}
                        aria-label="Close confirmation dialog"
                        disabled={isLoading}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={motionTransition}
                        onClick={handleClose}
                        className="fixed inset-0 cursor-default bg-zinc-950/55 backdrop-blur-md disabled:cursor-wait dark:bg-black/75"
                    />

                    {/* Modal */}
                    <motion.section
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        aria-describedby="delete-dialog-description"
                        initial={
                            reducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 16, scale: 0.97 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                            reducedMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 8, scale: 0.985 }
                        }
                        transition={motionTransition}
                        className={cn(
                            "relative my-auto w-full max-w-[440px] overflow-hidden",
                            "rounded-[24px] border border-zinc-200/80",
                            "bg-white shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]",
                            "dark:border-white/[0.10] dark:bg-[#101013]",
                            "dark:shadow-[0_28px_100px_-20px_rgba(0,0,0,0.8)]",
                        )}
                    >
                        {/* Top accent */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent"
                        />

                        {/* Ambient background */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-rose-500/[0.07] blur-3xl dark:bg-rose-500/[0.10]"
                        />

                        <div className="relative p-5 sm:p-7">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-rose-100/70 text-rose-600 dark:border-rose-400/20 dark:from-rose-500/[0.14] dark:to-rose-500/[0.05] dark:text-rose-400">
                                        <AlertTriangle
                                            className="h-5 w-5"
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />

                                        <span
                                            aria-hidden="true"
                                            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white dark:border-[#101013]"
                                        >
                                            <X className="h-2.5 w-2.5" strokeWidth={3} />
                                        </span>
                                    </div>

                                    <div className="min-w-0 pt-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <ShieldAlert
                                                className="h-3 w-3 text-rose-500"
                                                aria-hidden="true"
                                            />
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-400">
                                                Destructive action
                                            </span>
                                        </div>

                                        <h2
                                            id="delete-dialog-title"
                                            className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-xl"
                                        >
                                            {title}
                                        </h2>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    aria-label="Close dialog"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-colors hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.06] dark:hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Description */}
                            <p
                                id="delete-dialog-description"
                                className="mt-5 text-[13px] leading-6 text-zinc-500 dark:text-zinc-400"
                            >
                                {description}
                            </p>

                            {/* Selected item */}
                            {itemName && (
                                <div className="mt-5 overflow-hidden rounded-2xl border border-rose-200/70 bg-rose-50/50 dark:border-rose-400/[0.14] dark:bg-rose-500/[0.045]">
                                    <div className="flex items-center gap-3 px-3.5 py-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200/70 bg-white text-rose-600 dark:border-rose-400/[0.15] dark:bg-white/[0.04] dark:text-rose-400">
                                            <Trash2
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-zinc-400 dark:text-zinc-500">
                                                Selected item
                                            </p>

                                            <p
                                                title={itemName}
                                                className="mt-1 truncate text-xs font-semibold text-zinc-800 dark:text-zinc-100"
                                            >
                                                {itemName}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-xl border border-rose-200/70 bg-white/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-rose-600 dark:border-rose-400/15 dark:bg-rose-400/[0.06] dark:text-rose-400">
                                            Delete
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Warning */}
                            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-zinc-200/70 bg-zinc-50/80 px-3.5 py-3 dark:border-white/[0.07] dark:bg-white/[0.025]">
                                <AlertTriangle
                                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500"
                                    aria-hidden="true"
                                />
                                <p className="text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                                    This action is permanent. You won't be able to recover this
                                    item after it has been deleted.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                <button
                                    ref={cancelRef}
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className={cn(
                                        "inline-flex h-11 items-center justify-center gap-2 rounded-xl",
                                        "border border-zinc-200 bg-white px-4",
                                        "text-xs font-semibold text-zinc-700",
                                        "transition-colors hover:bg-zinc-50",
                                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-zinc-500/15",
                                        "disabled:cursor-not-allowed disabled:opacity-50",
                                        "dark:border-white/[0.09] dark:bg-white/[0.035]",
                                        "dark:text-zinc-200 dark:hover:bg-white/[0.07]",
                                    )}
                                >
                                    {cancelLabel}
                                </button>

                                <button
                                    ref={confirmRef}
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className={cn(
                                        "group inline-flex h-11 items-center justify-center gap-2 rounded-xl",
                                        "border border-rose-500 bg-rose-600 px-4",
                                        "text-xs font-semibold text-white",
                                        "shadow-[0_4px_14px_-5px_rgba(225,29,72,0.65)]",
                                        "transition-colors hover:border-rose-400 hover:bg-rose-500",
                                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/25",
                                        "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                                            {confirmLabel}
                                            <ArrowRight className="ml-0.5 h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="mt-5 flex items-center justify-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                                <Check className="h-3 w-3" />
                                Review before confirming
                            </div>
                        </div>
                    </motion.section>
                </div>
            )}
        </AnimatePresence>
    );
}

export default DeleteConfirmation;
