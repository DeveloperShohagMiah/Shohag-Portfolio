import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * DeleteConfirmation
 *
 * A reusable modal that asks the user to confirm a destructive action.
 *
 * Props:
 *  - open: boolean — controls visibility
 *  - onClose: () => void — called when user cancels / presses Escape / clicks backdrop
 *  - onConfirm: () => void | Promise<void> — called when user confirms (may be async)
 *  - title: string — modal heading
 *  - description: string | ReactNode — body text
 *  - itemName: string — the specific item being deleted (rendered in a mono chip)
 *  - confirmLabel: string — text on the confirm button (default "Delete")
 *  - cancelLabel: string — text on the cancel button (default "Cancel")
 *  - isLoading: boolean — optional; shows a spinner and disables buttons
 */
export function DeleteConfirmation({
    open,
    onClose,
    onConfirm,
    title = "Delete item",
    description = "This action cannot be undone. This will permanently remove the item and its data from our servers.",
    itemName,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    isLoading: loadingProp = false,
}) {
    const reduced = useReducedMotion();
    const [internalLoading, setInternalLoading] = useState(false);
    const cancelRef = useRef(null);
    const isLoading = loadingProp || internalLoading;

    // Close on Escape (but not while loading)
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape" && !isLoading) {
                e.preventDefault();
                onClose?.();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        // Prevent background scroll while modal is open
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, isLoading, onClose]);

    // Autofocus cancel button when the modal opens
    useEffect(() => {
        if (open) {
            const t = setTimeout(() => cancelRef.current?.focus(), 80);
            return () => clearTimeout(t);
        }
    }, [open]);

    const handleConfirm = async () => {
        if (!onConfirm) return;
        try {
            setInternalLoading(true);
            await onConfirm();
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    {/* Backdrop */}
                    <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduced ? 0.15 : 0.25, ease: EASE }}
                        onClick={() => !isLoading && onClose?.()}
                        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={
                            reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                            reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }
                        }
                        transition={{ duration: 0.28, ease: EASE }}
                        className="
              relative my-8 w-full max-w-md overflow-hidden clip-polygon
              border border-zinc-200/80 bg-white/95 backdrop-blur-xl
              shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_64px_-16px_rgba(0,0,0,0.55),0_0_80px_-24px_rgba(244,63,94,0.4)]
              dark:border-zinc-800/80 dark:bg-zinc-900/95
            "
                    >
                        {/* Top accent — danger tone */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/80 to-transparent"
                        />

                        {/* Corner accents */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l border-t border-rose-500/40"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b border-r border-rose-500/40"
                        />

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => !isLoading && onClose?.()}
                            disabled={isLoading}
                            aria-label="Close"
                            className="absolute right-3 top-3 z-20 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-40 disabled:hover:bg-transparent dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        >
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>

                        <div className="relative px-6 pb-6 pt-8 sm:px-7 sm:pb-7 sm:pt-9">
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className="relative flex h-14 w-14 items-center justify-center clip-polygon border border-rose-500/30 bg-rose-500/10 text-rose-500">
                                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />

                                    {/* Pulsing halo */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 -z-10 animate-[pulseGlow_3s_ease-in-out_infinite] rounded-full bg-rose-500/25 blur-xl motion-reduce:animate-none"
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                id="delete-dialog-title"
                                className="mt-6 text-center text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl"
                            >
                                {title}
                            </h2>

                            {/* Description */}
                            <p
                                id="delete-dialog-description"
                                className="mx-auto mt-3 max-w-sm text-center text-sm leading-7 text-zinc-500 dark:text-zinc-400"
                            >
                                {description}
                            </p>

                            {/* Item chip */}
                            {itemName && (
                                <div className="mx-auto mt-5 flex max-w-sm items-center justify-center">
                                    <span className="inline-flex max-w-full items-center gap-2 truncate border border-zinc-200 bg-zinc-50 px-3 py-1.5 font-code text-[11px] text-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-200">
                                        <Trash2
                                            className="h-3 w-3 shrink-0 text-rose-500"
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{itemName}</span>
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-center">
                                <button
                                    ref={cancelRef}
                                    type="button"
                                    onClick={() => !isLoading && onClose?.()}
                                    disabled={isLoading}
                                    className="
                    inline-flex h-11 items-center justify-center rounded-lg
                    border border-zinc-200 bg-white px-5
                    text-sm font-medium text-zinc-700
                    transition-all duration-200
                    hover:border-zinc-300 hover:bg-zinc-50
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900
                    disabled:cursor-not-allowed disabled:opacity-50
                    sm:max-w-[160px] sm:flex-1
                    dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200
                    dark:hover:border-zinc-700 dark:hover:bg-zinc-800
                    dark:focus-visible:outline-zinc-100
                  "
                                >
                                    {cancelLabel}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className="
                    group/del inline-flex h-11 items-center justify-center gap-2 rounded-lg
                    bg-rose-600 px-5 text-sm font-semibold text-white
                    transition-all duration-200
                    hover:bg-rose-500
                    hover:shadow-[0_0_30px_-6px_rgba(244,63,94,0.6)]
                    active:scale-[0.98]
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500
                    disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none
                    sm:max-w-[160px] sm:flex-1
                  "
                                >
                                    {isLoading ? (
                                        <>
                                            <span
                                                aria-hidden="true"
                                                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                            />
                                            Deleting…
                                        </>
                                    ) : (
                                        <>
                                            <Trash2
                                                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/del:scale-110"
                                                aria-hidden="true"
                                            />
                                            {confirmLabel}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Warning footer */}
                            <p className="mt-5 text-center font-code text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                                This action cannot be undone
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default DeleteConfirmation;