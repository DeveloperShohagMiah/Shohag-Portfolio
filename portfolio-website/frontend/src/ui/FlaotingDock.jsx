import React, { useCallback, useEffect, useRef, useState } from "react";
import { Share2, Moon, Sun, ChevronUp, Check } from "lucide-react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";



/* ========================================================================== */
/*  Shared styling                                                            */
/* ========================================================================== */

/* The dock itself: layered INSET shadows give it a milled, glassy edge
     1. bright top edge     2. soft dark bottom edge
     3. faint primary glow just inside the rim      4. the drop shadow outside
   (The old rule used the bare word "primary" as a colour, which is invalid, so the
   browser threw the whole shadow away.) */
const DOCK_SHADOW =
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.2),inset_0_0_16px_-4px_color-mix(in_srgb,var(--primary)_32%,transparent),0_18px_40px_-14px_rgba(0,0,0,0.55)]";

/* Each button gets a "pressed-in" look: a lit inset on hover, a deep inset on press */
const BUTTON =
    "group/btn relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground " +
    "transition-all duration-200 " +
    "hover:bg-primary/10 hover:text-primary " +
    "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_0_12px_-3px_color-mix(in_srgb,var(--primary)_45%,transparent)] " +
    "active:scale-95 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "sm:h-9 sm:w-9";

/* Label bubble: above the dock on phones (it sits at the bottom), to its left on larger screens */
const TOOLTIP =
    "pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-border/70 bg-popover px-2.5 py-1 " +
    "text-[11px] font-medium text-popover-foreground opacity-0 shadow-lg transition-opacity duration-200 " +
    "bottom-full left-1/2 mb-3 -translate-x-1/2 " +
    "sm:bottom-auto sm:left-auto sm:right-full sm:top-1/2 sm:mb-0 sm:mr-3 sm:translate-x-0 sm:-translate-y-1/2 " +
    "group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100";

function DockButton({ label, tip, href, onClick, disabled, className = "", children }) {
    const content = (
        <>
            {children}
            <span role="tooltip" className={TOOLTIP}>
                {tip ?? label}
            </span>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`${BUTTON} ${className}`}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={`${BUTTON} ${className}`}
        >
            {content}
        </button>
    );
}

/* ========================================================================== */
/*  Dock                                                                      */
/* ========================================================================== */
const RING_R = 17;
const RING_C = 2 * Math.PI * RING_R;

const FloatingDock = ({
    xUrl = "https://x.com/yourusername",
    linkedinUrl = "https://www.linkedin.com/in/developershohagmiah/",
    githubUrl = "https://github.com/DeveloperShohagMiah",
    onToggleTheme,
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isLight, setIsLight] = useState(() =>
        typeof document !== "undefined"
            ? document.documentElement.classList.contains("light")
            : false
    );
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const copyTimer = useRef(null);

    useEffect(() => () => clearTimeout(copyTimer.current), []);

    // Keep the dock's theme icon synchronized with the document.
    useEffect(() => {
        const root = document.documentElement;
        const syncTheme = () => setIsLight(root.classList.contains("light"));

        syncTheme();
        const observer = new MutationObserver(syncTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    // Scroll progress + dock visibility (throttled to one update per frame).
    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const scrollableHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress =
                scrollableHeight > 0
                    ? Math.round((window.scrollY / scrollableHeight) * 100)
                    : 0;

            setScrollProgress(Math.min(100, Math.max(0, progress)));
            setIsVisible(window.scrollY > 100);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        };

        updateProgress();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    const flashCopied = useCallback(() => {
        setIsCopied(true);
        clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setIsCopied(false), 1600);
    }, []);

    // Share the portfolio, or copy its URL when the share sheet isn't available.
    const handleShare = useCallback(async () => {
        const shareData = {
            title: document.title,
            text: "Check out my portfolio!",
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }
            await navigator.clipboard.writeText(shareData.url);
            flashCopied();
        } catch (error) {
            if (error.name === "AbortError") return;
            try {
                await navigator.clipboard.writeText(shareData.url);
                flashCopied();
            } catch {
                // Clipboard access may be unavailable in some environments.
            }
        }
    }, [flashCopied]);

    // Toggle the theme. Also saves the choice, like the navbar does, so a refresh keeps it.
    const handleThemeToggle = useCallback(() => {
        if (onToggleTheme) {
            onToggleTheme();
            return;
        }

        const root = document.documentElement;
        const nextIsLight = !root.classList.contains("light");

        root.classList.toggle("light", nextIsLight);
        root.style.colorScheme = nextIsLight ? "light" : "dark";
        try {
            localStorage.setItem("theme", nextIsLight ? "light" : "dark");
        } catch {
            /* storage can be blocked (private mode) — the toggle still works */
        }
        setIsLight(nextIsLight);
    }, [onToggleTheme]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const atTop = scrollProgress === 0;

    return (
        <aside
            aria-label="Floating portfolio tools"
            className={`
        fixed z-50 flex max-w-[calc(100vw-1.5rem)] flex-row items-center gap-0.5
        rounded-full border border-border/70 bg-background/40 px-2 py-1.5
        backdrop-blur-2xl backdrop-saturate-150 ${DOCK_SHADOW}
        bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2
        transition-[opacity,transform,visibility] duration-300 ease-out
        sm:bottom-5 sm:left-auto sm:right-5 sm:translate-x-0 sm:flex-col sm:gap-1 sm:px-1.5 sm:py-2
        lg:bottom-7 lg:right-7
        ${isVisible
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible translate-y-4 opacity-0"
                }
      `}
        >
            {/* soft sheen across the top of the glass */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.10] to-transparent"
            />

            <DockButton href={xUrl} label="Visit my X profile" tip="X (Twitter)">
                <FaXTwitter className="h-[15px] w-[15px]" />
            </DockButton>

            <DockButton href={linkedinUrl} label="Contact me on LinkedIn" tip="LinkedIn">
                <FaLinkedinIn size={16} strokeWidth={1.7} aria-hidden="true" />
            </DockButton>

            <DockButton href={githubUrl} label="Visit my GitHub profile" tip="GitHub">
                <FaGithub className="h-[17px] w-[17px]" />
            </DockButton>

            <DockButton
                onClick={handleShare}
                label={isCopied ? "Portfolio link copied" : "Share portfolio"}
                tip={isCopied ? "Link copied" : "Share"}
            >
                {isCopied ? (
                    <Check size={16} strokeWidth={2} className="text-emerald-500" aria-hidden="true" />
                ) : (
                    <Share2 size={16} strokeWidth={1.7} aria-hidden="true" />
                )}
            </DockButton>

            {/* divider turns 90° with the layout */}
            <span
                aria-hidden="true"
                className="mx-1 h-5 w-px bg-border sm:mx-0 sm:my-1 sm:h-px sm:w-5"
            />

            <DockButton
                onClick={handleThemeToggle}
                label={`Switch to ${isLight ? "dark" : "light"} theme`}
                tip={isLight ? "Dark mode" : "Light mode"}
            >
                {/* the two icons rotate and cross-fade into each other */}
                <Sun
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className={`absolute transition-all duration-500 ${isLight ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                        }`}
                />
                <Moon
                    size={16}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className={`absolute transition-all duration-500 ${isLight ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                        }`}
                />
            </DockButton>

            {/* back to top, wrapped in a ring that fills as you scroll */}
            <DockButton
                onClick={scrollToTop}
                disabled={atTop}
                label={`Back to top, ${scrollProgress}% of the page scrolled`}
                tip={atTop ? "Top of page" : `Back to top · ${scrollProgress}%`}
                className={atTop ? "cursor-not-allowed opacity-50" : "text-foreground"}
            >
                <svg
                    viewBox="0 0 40 40"
                    className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle cx="20" cy="20" r={RING_R} strokeWidth="2" stroke="currentColor" className="text-border" />
                    <circle
                        cx="20"
                        cy="20"
                        r={RING_R}
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        stroke="currentColor"
                        className="text-primary transition-[stroke-dashoffset] duration-200 ease-out"
                        strokeDasharray={RING_C}
                        strokeDashoffset={RING_C * (1 - scrollProgress / 100)}
                    />
                </svg>
                <ChevronUp size={17} strokeWidth={2} aria-hidden="true" className="relative" />
            </DockButton>
        </aside>
    );
};

export default FloatingDock;