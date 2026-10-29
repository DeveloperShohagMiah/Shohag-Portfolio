import React, { useEffect, useId } from "react";
import { Eye, EyeOff, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";

/* ========================================================================== */
/*  AuthKit — liquid-glass building blocks shared by Login and Register       */
/* ========================================================================== */

export const EASE = [0.22, 1, 0.36, 1];
export const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70";

/* Rotating liquid rim + reduced-motion handling. `@property` lets the gradient
   angle itself animate (Chrome, Safari, Firefox 128+); elsewhere it stays static. */
export const PAGE_CSS = `
@property --rg-ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes rg-spin { to { --rg-ang: 360deg; } }
.rg-rim {
  padding: 1px;
  background: conic-gradient(from var(--rg-ang),
    rgba(255,255,255,.6), rgba(255,255,255,0) 18%,
    rgba(167,139,250,.65) 42%, rgba(255,255,255,0) 62%,
    rgba(96,165,250,.55) 82%, rgba(255,255,255,.6));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: rg-spin 10s linear infinite;
}
@media (prefers-reduced-motion: reduce) { .rg-rim { animation: none; } }
`;

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

/* ========================================================================== */
/*  Liquid background — gooey blobs that drift, merge and split               */
/* ========================================================================== */
const BLOBS = [
    { cx: 260, cy: 230, r: 230, fill: "violet", dx: 90, dy: 60, t: 22 },
    { cx: 1190, cy: 200, r: 200, fill: "blue", dx: -80, dy: 90, t: 26 },
    { cx: 780, cy: 770, r: 250, fill: "fuchsia", dx: 70, dy: -70, t: 24 },
    { cx: 1260, cy: 720, r: 150, fill: "violet", dx: -60, dy: -50, t: 20 },
    { cx: 110, cy: 770, r: 140, fill: "blue", dx: 80, dy: -40, t: 23 },
    // small droplets that wander and pinch off the big shapes
    { cx: 520, cy: 330, r: 62, fill: "fuchsia", dx: 260, dy: 150, t: 15 },
    { cx: 980, cy: 480, r: 54, fill: "violet", dx: -240, dy: -180, t: 17 },
    { cx: 700, cy: 120, r: 48, fill: "blue", dx: 180, dy: 260, t: 13 },
];

export function LiquidBackground() {
    const reduced = useReducedMotion();
    const uid = useId().replace(/:/g, "");

    // soft light that trails the cursor
    const mx = useMotionValue(-600);
    const my = useMotionValue(-600);
    const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.8 });
    const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.8 });
    const light = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(139,92,246,0.16), transparent 70%)`;

    useEffect(() => {
        if (reduced) return;
        const onMove = (e) => {
            if (e.pointerType !== "mouse") return;
            mx.set(e.clientX);
            my.set(e.clientY);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [reduced, mx, my]);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <filter id={`${uid}-goo`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="26" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
                        />
                    </filter>
                    <linearGradient id={`${uid}-violet`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#8b5cf6" />
                        <stop offset="1" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id={`${uid}-blue`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#3b82f6" />
                        <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id={`${uid}-fuchsia`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#d946ef" />
                        <stop offset="1" stopColor="#7c3aed" />
                    </linearGradient>
                </defs>

                <g filter={`url(#${uid}-goo)`} opacity="0.55">
                    {BLOBS.map((b, i) => (
                        <motion.circle
                            key={i}
                            cx={b.cx}
                            cy={b.cy}
                            r={b.r}
                            fill={`url(#${uid}-${b.fill})`}
                            animate={
                                reduced
                                    ? undefined
                                    : { x: [0, b.dx, 0, -b.dx * 0.6, 0], y: [0, b.dy, 0, -b.dy * 0.6, 0] }
                            }
                            transition={{ duration: b.t, repeat: Infinity, ease: "easeInOut" }}
                        />
                    ))}
                </g>
            </svg>

            {/* cursor light */}
            {!reduced && <motion.div className="absolute inset-0" style={{ background: light }} />}

            {/* depth + legibility */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(67,56,202,0.10),transparent_60%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05060d]/30 via-transparent to-[#05060d]/85" />
            <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{ backgroundImage: NOISE }}
            />
        </div>
    );
}

/* ========================================================================== */
/*  Glass surfaces                                                            */
/* ========================================================================== */
export const GLASS =
    "border border-white/[0.12] bg-gradient-to-br from-white/[0.10] to-white/[0.03] backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.04),0_24px_60px_-28px_rgba(0,0,0,0.8)]";

/* Main liquid-glass card: rotating rim light, specular sheen, cursor highlight */
export function LiquidCard({ children, className = "" }) {
    const onMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    return (
        <div
            onPointerMove={onMove}
            className={`group/card relative overflow-hidden rounded-[32px] ${GLASS} ${className}`}
        >
            {/* rotating rim */}
            <div aria-hidden="true" className="rg-rim pointer-events-none absolute inset-0 rounded-[inherit]" />
            {/* specular sheen from the top-left */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_28%,transparent_55%)]"
            />
            {/* cursor highlight */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{
                    background:
                        "radial-gradient(420px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,0.10), transparent 65%)",
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}

/* ========================================================================== */
/*  Form pieces                                                               */
/* ========================================================================== */
export const fieldIn = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Floating-label input. `inputProps` takes the react-hook-form register() spread. */
export const Field = React.forwardRef(function Field(
    { id, label, icon: Icon, error, hint, right, ...inputProps },
    ref
) {
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
        <motion.div variants={fieldIn}>
            <div className="group relative">
                <Icon
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within:text-violet-200"
                />

                <input
                    ref={ref}
                    id={id}
                    placeholder=" "
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`peer h-14 w-full rounded-2xl border bg-white/[0.05] pb-1 pl-11 pt-5 text-sm text-white outline-none backdrop-blur-md transition-all duration-300 placeholder:text-transparent hover:bg-white/[0.07] focus:bg-white/[0.09] focus:ring-4 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgba(24,20,48,0.95)] ${right ? "pr-12" : "pr-4"
                        } ${error
                            ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/10"
                            : "border-white/[0.10] focus:border-violet-300/60 focus:ring-violet-400/10"
                        }`}
                    {...inputProps}
                />

                <label
                    htmlFor={id}
                    className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition-all duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-violet-200 peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                    {label}
                </label>

                {right}
            </div>

            <AnimatePresence initial={false} mode="wait">
                {error ? (
                    <motion.p
                        key="error"
                        id={`${id}-error`}
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-1 pt-1.5 text-xs text-rose-300"
                    >
                        {error}
                    </motion.p>
                ) : hint ? (
                    <motion.div
                        key="hint"
                        id={`${id}-hint`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {hint}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </motion.div>
    );
});

export function VisibilityToggle({ shown, onToggle, label }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`${shown ? "Hide" : "Show"} ${label}`}
            aria-pressed={shown}
            className={`absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white ${FOCUS}`}
        >
            {shown ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
    );
}

export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } };

export function FeatureRow({ feature, index, reduced }) {
    const Icon = feature.icon;

    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.35 + index * 0.1 }}
            whileHover={reduced ? undefined : { x: 4 }}
            className={`group flex items-center gap-4 rounded-2xl p-3.5 transition-colors duration-300 hover:border-white/20 sm:gap-5 sm:p-4 ${GLASS}`}
        >
            <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] sm:size-12 ${feature.tint}`}
            >
                <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
                <h2 className="text-sm font-medium text-white sm:text-[15px]">{feature.title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">{feature.description}</p>
            </div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Page chrome                                                               */
/* ========================================================================== */
export function AuthHeader({ children }) {
    return (
        <header className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-14 xl:px-20">
            <Link
                to="/"
                aria-label="Go to portfolio homepage"
                className={`group inline-flex items-center gap-3 rounded-2xl ${FOCUS}`}
            >
                <span className={`flex size-11 items-center justify-center rounded-2xl ${GLASS}`}>
                    <Code2
                        size={22}
                        strokeWidth={2.2}
                        className="text-violet-200 transition-transform duration-300 group-hover:scale-110"
                    />
                </span>
                <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    Portfolio<span className="text-violet-300"> CMS</span>
                </span>
            </Link>
            {children}
        </header>
    );
}

export function AuthFooter() {
    return (
        <footer className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-2 px-5 pb-6 text-xs text-slate-500 sm:flex-row sm:px-8 lg:px-14 xl:px-20">
            <p>© {new Date().getFullYear()} Shohag Miah. All rights reserved.</p>
            <p className="flex items-center gap-2">
                <span>Create</span>
                <span className="text-violet-400">·</span>
                <span>Manage</span>
                <span className="text-violet-400">·</span>
                <span>Grow</span>
            </p>
        </footer>
    );
}

/* Glossy gradient submit button with shine sweep + loading spinner */
export function SubmitButton({ isLoading, loadingText, children }) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className={`group relative mt-1 flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_-12px_rgba(99,102,241,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_20px_50px_-12px_rgba(99,102,241,0.95)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${FOCUS}`}
        >
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(120%_140%_at_25%_-10%,rgba(255,255,255,0.4),transparent_55%)]"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover:translate-x-[420%] group-hover:opacity-100"
            />
            {isLoading ? (
                <>
                    <span
                        aria-hidden="true"
                        className="relative size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    />
                    <span className="relative">{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}