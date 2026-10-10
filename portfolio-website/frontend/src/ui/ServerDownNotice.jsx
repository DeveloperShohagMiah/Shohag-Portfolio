import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiMail, FiRefreshCw } from "react-icons/fi";
import { describeServerError } from "./serverStatus";

const RETRY_DELAYS = [5, 10, 20, 30, 30]; // seconds between automatic retries

/* ------------------------------------------------------------------ */
/*  Recovery logic: online/offline awareness + backoff auto-retry      */
/* ------------------------------------------------------------------ */
function useRecovery({ enabled, onRetry, isRetrying }) {
    const retryRef = useRef(onRetry);
    useEffect(() => {
        retryRef.current = onRetry;
    }, [onRetry]);

    const [offline, setOffline] = useState(
        () => typeof navigator !== "undefined" && navigator.onLine === false
    );
    const [attempt, setAttempt] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(RETRY_DELAYS[0]);

    const exhausted = attempt >= RETRY_DELAYS.length;
    const windowSize = RETRY_DELAYS[Math.min(attempt, RETRY_DELAYS.length - 1)];

    // Retry the moment the browser regains connectivity
    useEffect(() => {
        const goOffline = () => setOffline(true);
        const goOnline = () => {
            setOffline(false);
            retryRef.current?.();
        };
        window.addEventListener("offline", goOffline);
        window.addEventListener("online", goOnline);
        return () => {
            window.removeEventListener("offline", goOffline);
            window.removeEventListener("online", goOnline);
        };
    }, []);

    // Countdown, paused while a request is in flight
    useEffect(() => {
        if (!enabled || exhausted || isRetrying) return undefined;

        if (secondsLeft <= 0) {
            retryRef.current?.();
            const next = attempt + 1;
            setAttempt(next);
            setSecondsLeft(RETRY_DELAYS[Math.min(next, RETRY_DELAYS.length - 1)]);
            return undefined;
        }

        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [enabled, exhausted, isRetrying, secondsLeft, attempt]);

    // A manual retry restarts the whole cycle, including after auto-retry gave up
    const retryNow = () => {
        retryRef.current?.();
        setAttempt(0);
        setSecondsLeft(RETRY_DELAYS[0]);
    };

    return { offline, exhausted, secondsLeft, windowSize, retryNow };
}

/* ------------------------------------------------------------------ */
/*  Illustration: client -- link -- (x) -- dead link -- server         */
/* ------------------------------------------------------------------ */
function BrokenLink() {
    const reduced = useReducedMotion();

    return (
        <svg
            viewBox="0 0 240 48"
            fill="none"
            aria-hidden="true"
            className="h-auto w-full max-w-[15rem]"
        >
            {/* client */}
            <rect x="6" y="8" width="32" height="32" rx="5" strokeWidth="1.5" className="stroke-muted-foreground/60" />
            <path d="M14 19h16M14 25h16M14 31h9" strokeWidth="1.5" strokeLinecap="round" className="stroke-muted-foreground/60" />

            {/* live half of the link - the one moving element */}
            <motion.line
                x1="46"
                y1="24"
                x2="104"
                y2="24"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="stroke-primary/70"
                animate={reduced ? undefined : { strokeDashoffset: [0, -8] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />

            {/* break */}
            <path d="M113 17l14 14M127 17l-14 14" strokeWidth="2" strokeLinecap="round" className="stroke-amber-400" />

            {/* dead half of the link */}
            <line x1="136" y1="24" x2="194" y2="24" strokeWidth="1.5" strokeDasharray="2 6" strokeLinecap="round" className="stroke-muted-foreground/30" />

            {/* server */}
            <rect x="202" y="8" width="32" height="32" rx="5" strokeWidth="1.5" className="stroke-muted-foreground/60" />
            <rect x="210" y="15" width="16" height="6" rx="1.5" strokeWidth="1.5" className="stroke-muted-foreground/60" />
            <rect x="210" y="27" width="16" height="6" rx="1.5" strokeWidth="1.5" className="stroke-muted-foreground/60" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Notice                                                            */
/* ------------------------------------------------------------------ */
/**
 * Message shown when the backend can't be reached.
 *
 * @param variant       "card"   - full panel for a page or a major section
 *                      "inline" - single compact row for one section among many
 * @param error         the RTK Query `error` (used for the diagnostics line)
 * @param onRetry       usually the query's `refetch`
 * @param isRetrying    usually the query's `isFetching`
 * @param autoRetry     retry in the background with backoff (default true)
 * @param fallbackEmail optional - shows an "email me instead" action, useful
 *                      because the contact form is down too
 */
const ServerDownNotice = ({
    variant = "card",
    title,
    error,
    onRetry,
    isRetrying = false,
    autoRetry = true,
    fallbackEmail,
    className = "",
}) => {
    const reduced = useReducedMotion();
    const { offline, exhausted, secondsLeft, windowSize, retryNow } = useRecovery({
        enabled: autoRetry,
        onRetry,
        isRetrying,
    });

    const heading =
        title ??
        (offline
            ? "You're offline"
            : variant === "inline"
                ? "Couldn't load this section"
                : "Can't reach the server");

    const retryLine = isRetrying
        ? "Retrying…"
        : !autoRetry
            ? "Waiting for manual retry"
            : exhausted
                ? "Auto-retry paused · try again manually"
                : `Retrying in ${secondsLeft}s`;

    /* ---------- inline: one quiet row ---------- */
    if (variant === "inline") {
        return (
            <div
                role="alert"
                className={`flex flex-col gap-3 border border-border/60 bg-card/30 px-4 py-3.5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
            >
                <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                    <div>
                        <p className="text-sm font-medium text-foreground">{heading}</p>
                        <p aria-hidden="true" className="mt-0.5 font-code text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {offline ? "No internet connection" : describeServerError(error)} · {retryLine}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={retryNow}
                    disabled={isRetrying}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 clip-polygon border border-border/70 px-4 text-xs font-medium text-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:opacity-60"
                >
                    <FiRefreshCw size={13} aria-hidden="true" className={isRetrying ? "animate-spin" : ""} />
                    Retry
                </button>
            </div>
        );
    }

    /* ---------- card: full panel ---------- */
    const gridLine = "rgba(167, 139, 250, 0.07)";
    const fade = "radial-gradient(ellipse 70% 80% at 50% 40%, black 30%, transparent 80%)";

    return (
        <motion.section
            role="alert"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden border border-border/60 bg-card/30 p-6 text-center backdrop-blur-sm sm:p-10 ${className}`}
        >
            {/* faint grid, same language as the hero */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                    backgroundPosition: "50% 0",
                    maskImage: fade,
                    WebkitMaskImage: fade,
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
            />

            <div className="relative mx-auto flex max-w-md flex-col items-center">
                <BrokenLink />

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-code text-[10px] uppercase tracking-[0.14em] text-amber-600 dark:text-amber-300">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {offline ? "Offline" : "Server unreachable"}
                </div>

                <h3 className="mt-4 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {heading}
                </h3>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {offline
                        ? "Check your internet connection. The content will load by itself as soon as you're back online."
                        : "The server may be restarting or temporarily down. This page keeps retrying in the background and will fill in on its own once it's back."}
                </p>

                {/* diagnostics */}
                <div
                    aria-hidden="true"
                    className="mt-6 w-full border border-border/60 bg-background/60 px-4 py-3 text-left font-code text-[11px] leading-6 text-muted-foreground"
                >
                    <p>
                        <span className="text-amber-500">✕</span>{" "}
                        {offline ? "navigator.onLine · false" : describeServerError(error)}
                    </p>
                    <p>
                        <span className="text-primary">↻</span> {retryLine}
                    </p>

                    {autoRetry && (
                        <div className="mt-2 h-px w-full overflow-hidden bg-border/60">
                            <div
                                className={`h-full origin-left bg-primary/70 ${isRetrying ? "animate-pulse" : "transition-transform duration-1000 ease-linear"
                                    }`}
                                style={{
                                    transform: `scaleX(${isRetrying ? 1 : exhausted ? 0 : secondsLeft / windowSize})`,
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* actions */}
                <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={retryNow}
                        disabled={isRetrying}
                        className="inline-flex h-11 items-center justify-center gap-2 clip-polygon bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
                    >
                        <FiRefreshCw size={15} aria-hidden="true" className={isRetrying ? "animate-spin" : ""} />
                        {isRetrying ? "Retrying…" : "Retry now"}
                    </button>

                    {fallbackEmail && (
                        <a
                            href={`mailto:${fallbackEmail}`}
                            className="inline-flex h-11 items-center justify-center gap-2 clip-polygon border border-border/70 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        >
                            <FiMail size={15} aria-hidden="true" />
                            Email me instead
                        </a>
                    )}
                </div>
            </div>
        </motion.section>
    );
};

export default ServerDownNotice;