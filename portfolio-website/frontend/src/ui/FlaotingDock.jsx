
import React, { useCallback, useEffect, useState } from "react";
import {
    Send,
    Share2,
    Moon,
    Sun,
    ChevronUp,
    GitBranch,
    Check,
} from "lucide-react";

const FloatingDock = ({
    xUrl = "https://x.com/yourusername",
    telegramUrl = "https://t.me/yourusername",
    githubUrl = "https://github.com/yourusername",
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

    // Keep the dock's theme icon synchronized with the document.
    useEffect(() => {
        const root = document.documentElement;

        const syncTheme = () => {
            setIsLight(root.classList.contains("light"));
        };

        syncTheme();

        const observer = new MutationObserver(syncTheme);

        observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Calculate scroll progress and dock visibility.
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

    // Share portfolio or copy its URL.
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
            setIsCopied(true);
            window.setTimeout(() => setIsCopied(false), 1800);
        } catch (error) {
            if (error.name === "AbortError") return;

            try {
                await navigator.clipboard.writeText(shareData.url);
                setIsCopied(true);
                window.setTimeout(() => setIsCopied(false), 1800);
            } catch {
                // Clipboard access may be unavailable in some environments.
            }
        }
    }, []);

    // Toggle the theme.
    const handleThemeToggle = useCallback(() => {
        if (onToggleTheme) {
            onToggleTheme();
            return;
        }

        const root = document.documentElement;
        const nextIsLight = !root.classList.contains("light");

        root.classList.toggle("light", nextIsLight);
        setIsLight(nextIsLight);
    }, [onToggleTheme]);

    // Scroll back to the top.
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    const iconButton =
        "group relative flex h-10 w-10 shrink-0 items-center justify-center " +
        "rounded-full text-muted-foreground " +
        "transition-colors duration-200 " +
        "hover:bg-primary/10 hover:text-primary " +
        "active:bg-primary/15 " +
        "focus-visible:outline-none focus-visible:ring-2 " +
        "focus-visible:ring-primary focus-visible:ring-offset-2 " +
        "focus-visible:ring-offset-background " +
        "sm:h-11 sm:w-11";

    return (
        <aside
            aria-label="Floating portfolio tools"
            className={`
    fixed z-50
    bottom-[max(1rem,env(safe-area-inset-bottom))]
    left-1/2 -translate-x-1/2
    flex flex-row items-center
    rounded-full border border-border/70
    bg-background/30 p-1.5
    shadow-[0_8px_35px_rgba(0,0,0,0.14)]
    backdrop-blur-2xl
    transition-[opacity,transform] duration-300 ease-out gap-0.5
    sm:left-auto sm:right-5 sm:bottom-5
    sm:translate-x-0
    sm:flex-col sm:gap-1 sm:p-2

    lg:right-7 lg:bottom-7

    ${isVisible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-4 opacity-0"
                }
  `}
        >
            {/* X Profile */}
            <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my X profile"
                title="X profile"
                className={iconButton}
            >
                <span className="text-lg font-medium" aria-hidden="true">
                    𝕏
                </span>
            </a>

            {/* Telegram */}
            <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact me on Telegram"
                title="Telegram"
                className={iconButton}
            >
                <Send size={18} strokeWidth={1.7} aria-hidden="true" />
            </a>

            {/* GitHub */}
            <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my GitHub profile"
                title="GitHub"
                className={iconButton}
            >
                <GitBranch size={18} strokeWidth={1.7} aria-hidden="true" />
            </a>

            {/* Share */}
            <button
                type="button"
                onClick={handleShare}
                aria-label={isCopied ? "Portfolio link copied" : "Share portfolio"}
                title={isCopied ? "Link copied" : "Share portfolio"}
                className={iconButton}
            >
                {isCopied ? (
                    <Check
                        size={18}
                        strokeWidth={1.8}
                        className="text-emerald-500"
                        aria-hidden="true"
                    />
                ) : (
                    <Share2 size={18} strokeWidth={1.7} aria-hidden="true" />
                )}
            </button>

            {/* Divider */}
            <div className="my-1 h-5 md:h-px w-px md:w-6 bg-border" />

            {/* Theme Toggle */}
            <button
                type="button"
                onClick={handleThemeToggle}
                aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
                title={`Switch to ${isLight ? "dark" : "light"} theme`}
                className={iconButton}
            >
                {isLight ? (
                    <Sun size={18} strokeWidth={1.7} aria-hidden="true" />
                ) : (
                    <Moon size={18} strokeWidth={1.7} aria-hidden="true" />
                )}
            </button>

            {/* Scroll Progress */}
            <div
                className="flex h-8 w-10 items-center justify-center sm:w-11"
                role="progressbar"
                aria-label="Page scroll progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scrollProgress}
                title={`${scrollProgress}% of page scrolled`}
            >
                <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {scrollProgress}%
                </span>
            </div>

            {/* Back to Top */}
            <button
                type="button"
                onClick={scrollToTop}
                disabled={scrollProgress === 0}
                aria-label="Back to top"
                title="Back to top"
                className={`${iconButton} ${scrollProgress === 0
                    ? "cursor-not-allowed opacity-40"
                    : ""
                    }`}
            >
                <ChevronUp size={19} strokeWidth={1.8} aria-hidden="true" />
            </button>
        </aside>
    );
};

export default FloatingDock;
