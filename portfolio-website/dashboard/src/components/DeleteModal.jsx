import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone and all associated data will be permanently removed.",
    itemName,
    isLoading = false,
}) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-lg bg-[#121215] border border-zinc-800/80  shadow-2xl p-6 sm:p-7 text-zinc-100 z-10 antialiased overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-zinc-600"
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Icon Badge */}
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                                <AlertTriangle size={22} />
                            </div>

                            {/* Content */}
                            <div className="space-y-2 flex-1 pt-0.5">
                                <h2
                                    id="delete-modal-title"
                                    className="text-lg font-semibold tracking-tight text-zinc-100"
                                >
                                    {title}
                                </h2>

                                <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                                    {description}
                                </p>

                                {itemName && (
                                    <div className="pt-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 max-w-full truncate">
                                            <Trash2 size={13} className="text-zinc-500 flex-shrink-0" />
                                            <span className="truncate">{itemName}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-800/60">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-zinc-600"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all duration-150 active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white  animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Delete</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;