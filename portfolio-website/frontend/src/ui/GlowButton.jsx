
import React from "react";
import { Link } from "react-router-dom";

const GlowButton = ({ to = "/", onClick, label = "Open" }) => {
    const className = `
    group relative isolate inline-flex
    h-24 w-24 items-center justify-center
    overflow-hidden rounded-[26px]
    border border-white/[0.06]
    bg-[#050505]
    shadow-[0_8px_25px_rgba(0,0,0,0.45)]
    transition-all duration-500 ease-out
    hover:-translate-y-1
    hover:shadow-[0_12px_35px_rgba(125,55,255,0.25)]
    active:scale-95
    sm:h-28 sm:w-28
  `;

    const content = (
        <>
            {/* Purple ambient glow */}
            <span
                aria-hidden="true"
                className="
          pointer-events-none absolute
          -bottom-10 left-1/2 -z-10
          h-20 w-24 -translate-x-1/2
          rounded-full bg-violet-600/90
          blur-2xl opacity-80
          transition-all duration-500
          group-hover:scale-150
          group-hover:opacity-100
        "
            />

            {/* Bottom violet gradient */}
            <span
                aria-hidden="true"
                className="
          pointer-events-none absolute inset-0
          rounded-[inherit]
          bg-gradient-to-b
          from-transparent via-transparent
          to-violet-700/20
        "
            />



            {/* Top subtle highlight */}
            <span
                aria-hidden="true"
                className="
          pointer-events-none absolute inset-0
          rounded-[inherit]
          ring-1 ring-inset ring-white/[0.04]
        "
            />
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={label}
                className={className}
            >
                {content}
            </button>
        );
    }

    return (
        <Link to={to} aria-label={label} className={className}>
            {content}
        </Link>
    );
};

export default GlowButton;
