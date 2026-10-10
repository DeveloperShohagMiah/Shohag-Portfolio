import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiMessageCircle, FiX } from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";

const PopUpModal = ({
    href = "#contact",
    status = "Available",
    label = "Wanna talk?",
}) => {
    const [dismissed, setDismissed] = useState(false);
    const [visible, setVisible] = useState(false);
    const reduced = useReducedMotion();

    // Slide in after 1.2s
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
    }, []);

    const dismiss = () => setDismissed(true);

    // Don't render until the entrance delay has passed, or after dismiss
    if (dismissed || !visible) return null;

    return (
        <motion.div
            key="floating-cta"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={
                reduced
                    ? { duration: 0.2 }
                    : { type: "spring", stiffness: 260, damping: 24 }
            }
            className="fixed right-4 bottom-[calc(1rem_+_env(safe-area-inset-bottom,0px))] z-50 sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8"
        >
            <div className="group relative">
                {/* Soft halo — breathing */}
                <motion.span
                    aria-hidden="true"
                    animate={reduced ? undefined : { opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -inset-4 -z-20 rounded-full bg-primary/40 blur-2xl"
                    style={reduced ? { opacity: 0.5 } : undefined}
                />

                {/* Tight glow — brightens on hover/focus */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-primary/50 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none"
                />

                {/* Main CTA */}
                <a
                    href={href}
                    className="
            relative flex items-center gap-3 overflow-hidden rounded-full
            bg-primary px-6 py-3 text-primary-foreground
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]
            transition-transform duration-300
            hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80
            
          "
                >
                    {/* Icon badge with live status dot */}
                    <span className="relative shrink-0">
                        <span className="flex h-8 w-8 items-center justify-center clip-polygon bg-white/15 backdrop-blur-sm sm:h-9 sm:w-9">
                            <FiMessageCircle size={15} aria-hidden="true" />
                        </span>

                        <span
                            className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5"
                            aria-hidden="true"
                        >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary" />
                        </span>
                    </span>

                    {/* Two-line label */}
                    <span className="flex flex-col text-left leading-tight">
                        {status && (
                            <span className="font-code text-[8px] uppercase tracking-[0.14em] text-primary-foreground/70">
                                {status}
                            </span>
                        )}
                        <span className="text-[13px] font-medium tracking-wide sm:text-xs">
                            {label}
                        </span>
                    </span>

                    <FiArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                    {/* Sheen sweep on hover */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[420%] motion-reduce:hidden"
                    />
                </a>

                {/* Dismiss badge */}
                <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss"
                    className="
            absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full
            border border-border/70 bg-background/90 text-muted-foreground shadow-md backdrop-blur-md
            transition-all duration-200
            before:absolute before:-inset-2 before:content-['']
            hover:border-primary/50 hover:text-primary
            focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
            [@media(hover:hover)]:scale-90 [@media(hover:hover)]:opacity-0
            [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100
            [@media(hover:hover)]:group-focus-within:scale-100 [@media(hover:hover)]:group-focus-within:opacity-100
          "
                >
                    <FiX size={12} aria-hidden="true" />
                </button>
            </div>
        </motion.div>
    );
};

export default PopUpModal;