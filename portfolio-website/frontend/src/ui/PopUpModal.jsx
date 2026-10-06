import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiMessageCircle, FiX } from "react-icons/fi";

const PopUpModal = () => {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Slide in after 1.2s
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
    }, []);

    if (dismissed) return null;

    return (
        <div
            className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0 pointer-events-none"
                }`}
        >
            <div className="group relative flex items-center gap-2">
                {/* Pulsing glow ring */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/40 blur-xl opacity-70 animate-pulse"
                    style={{ animationDuration: "3s" }}
                />

                {/* Main CTA */}
                <a
                    href="#contact"
                    className="
            relative inline-flex items-center gap-2.5
            rounded-full bg-primary
            pl-4 pr-5 py-3 sm:pl-5 sm:pr-6
            text-xs sm:text-xs font-medium tracking-wide text-primary-foreground
            shadow-[0_8px_32px_-8px_theme(colors.primary/60),inset_0_1px_0_0_rgba(255,255,255,0.15)]
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_theme(colors.primary/70)]
            active:translate-y-0 active:scale-[0.98]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          "
                >
                    {/* Icon badge */}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                        <FiMessageCircle size={12} aria-hidden="true" />
                    </span>

                    <span>Wanna talk?</span>

                    <FiArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </a>

                {/* Dismiss button */}
                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                    className="
            flex h-7 w-7 items-center justify-center rounded-full
            border border-border/60 bg-card/60 backdrop-blur-md
            text-muted-foreground
            opacity-0 transition-all duration-300
            group-hover:opacity-100 hover:border-primary/40 hover:text-primary
          "
                >
                    <FiX size={12} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export default PopUpModal;