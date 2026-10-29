
import React, { useEffect, useState } from "react";
import {
    Send,
    Share2,
    Moon,
    Sun,
    Bookmark,
    ChevronUp,
    GitBranch,

} from "lucide-react";

const FloatingDock = ({
    xUrl = "https://x.com/yourusername",
    telegramUrl = "https://t.me/yourusername",
    onToggleTheme,
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLight, setIsLight] = useState(
        () => document.documentElement.classList.contains("light")
    );
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            const scrollableHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const progress =
                scrollableHeight > 0
                    ? (window.scrollY / scrollableHeight) * 100
                    : 0;

            setScrollProgress(
                Math.min(100, Math.max(0, Math.round(progress)))
            );

            // Show dock only after scrolling 100px
            setIsVisible(window.scrollY > 100);
        };

        updateProgress();

        window.addEventListener("scroll", updateProgress, {
            passive: true,
        });
        window.addEventListener("resize", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: document.title,
            text: "Check out my portfolio!",
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                } catch {
                    // Clipboard access may be unavailable in some environments.
                }
            }
        }
    };

    const handleThemeToggle = () => {
        const nextIsLight = !isLight;

        if (onToggleTheme) {
            onToggleTheme();
        } else {
            document.documentElement.classList.toggle("light", nextIsLight);
        }

        setIsLight(nextIsLight);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const iconButton =
        "group relative flex h-8 w-8 shrink-0 items-center justify-center " +
        "rounded-full text-muted-foreground transition-all duration-300 " +
        "hover:bg-primary/10 hover:text-primary active:scale-90";

    return (
        <aside
            aria-label="Floating portfolio tools"
            className={`
        fixed bottom-5 right-5 z-50
        flex flex-col items-center gap-1
        rounded-full border border-border/70
        bg-background/80 p-2
        shadow-[0_8px_35px_rgba(0,0,0,0.12)]
        backdrop-blur-xl
        transition-all duration-500 ease-out
        ${isVisible
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-6 opacity-0"
                }
        sm:bottom-7 sm:right-7
    `}
        >
            {/* X Profile */}
            <a
                href={xUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Visit my X profile"
                title="X profile"
                className={iconButton}
            >
                <span className="text-lg font-medium">𝕏</span>
            </a>

            {/* Telegram */}
            <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Contact me on Telegram"
                title="Telegram"
                className={iconButton}
            >
                <Send size={16} strokeWidth={1.7} />
            </a>

            {/* Bookmark */}
            <a
                href=""
                type="button"
                title="GitHub"
                className={iconButton}
            >
                <GitBranch
                    size={16}
                    strokeWidth={1.7}
                />
            </a>
            {/* Share */}
            <button
                type="button"
                onClick={handleShare}
                aria-label="Share portfolio"
                title="Share portfolio"
                className={iconButton}
            >
                <Share2 size={16} strokeWidth={1.7} />
            </button>

            <div className="my-1 h-px w-6 bg-border" />

            {/* Theme Toggle */}
            <button
                type="button"
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
                title="Toggle theme"
                className={iconButton}
            >
                {isLight ? (
                    <Sun size={16} strokeWidth={1.7} />
                ) : (
                    <Moon size={16} strokeWidth={1.7} />
                )}
            </button>


            {/* Scroll Percentage */}
            <div
                className="flex h-7 items-center justify-center"
                role="progressbar"
                aria-label="Page scroll progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={scrollProgress}
                title={`${scrollProgress}% of page scrolled`}
            >
                <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                    {scrollProgress}%
                </span>
            </div>

            {/* Back to Top */}
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                title="Back to top"
                className={`${iconButton} ${scrollProgress === 0 ? "opacity-50" : ""
                    } `}
            >
                <ChevronUp size={16} strokeWidth={1.8} />
            </button>
        </aside>
    );
};

export default FloatingDock;
