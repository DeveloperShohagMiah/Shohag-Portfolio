import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------
   Data — replace with your real reviews (or fetch them from your API).
------------------------------------------------------------------------- */
const REVIEWS = [
    {
        id: 1,
        name: "Alex Morgan",
        location: "London, United Kingdom",
        rating: 5,
        date: "12 Oct 2026",
        product: "Portfolio Website",
        message:
            "Excellent work from start to finish. The website looks modern, loads quickly, and works beautifully across different devices.",
        verified: true,
    },
    {
        id: 2,
        name: "Sarah Ahmed",
        location: "Dhaka, Bangladesh",
        rating: 5,
        date: "08 Oct 2026",
        product: "Web Development",
        message:
            "Very professional and attentive to detail. Communication was clear throughout the project, and the final result exceeded my expectations.",
        verified: true,
    },
    {
        id: 3,
        name: "James Wilson",
        location: "Manchester, United Kingdom",
        rating: 5,
        date: "02 Oct 2026",
        product: "React Application",
        message:
            "The application is responsive, easy to use, and thoughtfully designed. I especially appreciated the attention to performance.",
        verified: true,
    },
    {
        id: 4,
        name: "Nusrat Jahan",
        location: "Chattogram, Bangladesh",
        rating: 5,
        date: "25 Sep 2026",
        product: "UI/UX Development",
        message:
            "A smooth experience with a clean design and great attention to detail. The layout feels professional on both mobile and desktop.",
        verified: true,
    },
    {
        id: 5,
        name: "Daniel Smith",
        location: "Birmingham, United Kingdom",
        rating: 5,
        date: "18 Sep 2026",
        product: "Full-Stack Development",
        message:
            "The project was delivered with a well-structured interface and a clear focus on usability. I would gladly work together again.",
        verified: true,
    },
    {
        id: 6,
        name: "Fatima Rahman",
        location: "Sylhet, Bangladesh",
        rating: 5,
        date: "10 Sep 2026",
        product: "Website Redesign",
        message:
            "The redesign made the website feel much more polished and easier to navigate. The responsive layout works very well.",
        verified: true,
    },
];

/* -------------------------------------------------------------------------
   Small inline icons (no extra dependency)
------------------------------------------------------------------------- */
const StarIcon = ({ filled }) => (
    <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 ${filled ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]" : "text-amber-400/20"}`}
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1l-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
    </svg>
);

const QuoteIcon = () => (
    <svg viewBox="0 0 48 48" className="h-14 w-14" fill="currentColor" aria-hidden="true">
        <path d="M6 28c0-9 5-16 14-19l2 4c-5 2-7 5-7 8h5c2 0 4 2 4 4v8c0 2-2 4-4 4H10c-2 0-4-2-4-4v-5zm22 0c0-9 5-16 14-19l2 4c-5 2-7 5-7 8h5c2 0 4 2 4 4v8c0 2-2 4-4 4H32c-2 0-4-2-4-4v-5z" />
    </svg>
);

const TagIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden="true">
        <path d="M2 4a2 2 0 012-2h5.2a2 2 0 011.4.6l7 7a2 2 0 010 2.8l-5.2 5.2a2 2 0 01-2.8 0l-7-7A2 2 0 012 9.2V4zm4 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
);

const CheckIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M10 1.8a8.2 8.2 0 100 16.4 8.2 8.2 0 000-16.4zm3.7 6.5l-4.4 4.4a.8.8 0 01-1.1 0L6.3 10.8a.8.8 0 011.1-1.1l1.3 1.3 3.9-3.8a.8.8 0 011.1 1.1z" />
    </svg>
);

const PauseIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <rect x="4" y="3" width="4.2" height="14" rx="1.2" />
        <rect x="11.8" y="3" width="4.2" height="14" rx="1.2" />
    </svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M5 3.4a1 1 0 011.5-.86l9 6.6a1 1 0 010 1.72l-9 6.6A1 1 0 015 16.6V3.4z" />
    </svg>
);

const SlideIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3v14M6 7l4-4 4 4M6 13l4 4 4-4" />
    </svg>
);

const GridIcon = () => (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <rect x="2.5" y="2.5" width="6" height="6" rx="1.4" />
        <rect x="11.5" y="2.5" width="6" height="6" rx="1.4" />
        <rect x="2.5" y="11.5" width="6" height="6" rx="1.4" />
        <rect x="11.5" y="11.5" width="6" height="6" rx="1.4" />
    </svg>
);

/* -------------------------------------------------------------------------
   Review card
   - 1px gradient border that lights up with the primary colour on hover
   - cursor-following spotlight (CSS vars --mx / --my)
------------------------------------------------------------------------- */
function ReviewCard({ review }) {
    const { message, location, rating, product, date, name } = review;

    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    return (
        <article
            onMouseMove={handleMove}
            className="group relative rounded-3xl bg-linear-to-b from-border via-border/40 to-border/10 p-px transition-all duration-500 hover:from-primary/70 hover:via-primary/20 hover:to-primary/5 hover:shadow-[0_20px_60px_-20px] hover:shadow-primary/40"
        >
            <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-card/90 p-6 text-card-foreground backdrop-blur-xl sm:p-8">
                {/* top highlight */}
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                {/* cursor spotlight */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background:
                            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)",
                    }}
                />

                {/* decorative quote mark */}
                <span className="pointer-events-none absolute -right-1 -top-1 text-primary/10 transition-colors duration-500 group-hover:text-primary/20">
                    <QuoteIcon />
                </span>

                {/* rating + product */}
                <div className="relative mb-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <StarIcon key={n} filled={n <= rating} />
                            ))}
                        </div>
                        <span className="font-code text-xs font-medium text-muted-foreground">
                            {rating.toFixed(1)}
                        </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                        <TagIcon />
                        {product}
                    </span>
                </div>

                {/* message */}
                <p className="relative text-[15px] leading-7 text-foreground/90 sm:text-base">
                    “{message}”
                </p>

                <div className="relative my-6 h-px bg-linear-to-r from-transparent via-border to-transparent" />

                {/* author */}
                <footer className="relative flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3.5">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1 rounded-full bg-linear-to-br from-primary/60 to-primary/0 opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="relative grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-primary/60 to-primary text-lg font-bold text-white ring-2 ring-card">
                                {name.charAt(0)}
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-semibold tracking-tight text-foreground">{name}</p>
                            <p className="truncate text-sm text-muted-foreground">{location}</p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckIcon />
                            Verified
                        </span>
                        <time className="font-code text-[11px] text-muted-foreground">{date}</time>
                    </div>
                </footer>
            </div>
        </article>
    );
}

/* -------------------------------------------------------------------------
   One vertically sliding column (content is duplicated for a seamless loop)
------------------------------------------------------------------------- */
function SlidingColumn({ items, direction = "up", duration, paused, className = "" }) {
    return (
        <div className={className}>
            <div
                className="tm-track flex flex-col gap-6 pb-6 will-change-transform"
                style={{
                    animation: `${direction === "up" ? "tm-slide-up" : "tm-slide-down"} ${duration}s linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {items.map((r) => (
                    <ReviewCard key={`a-${r.id}`} review={r} />
                ))}
                {items.map((r) => (
                    <div key={`b-${r.id}`} aria-hidden="true">
                        <ReviewCard review={r} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------
   Section
------------------------------------------------------------------------- */
export default function TestimonialSection({ reviews = REVIEWS, title, subtitle }) {
    const [mode, setMode] = useState("sliding"); // "sliding" | "grid"
    const [userPaused, setUserPaused] = useState(false); // Pause button
    const [holding, setHolding] = useState(false); // hover / tap on a review

    const isGrid = mode === "grid";
    const isPaused = userPaused || holding;

    // Split reviews across two columns
    const [left, right] = useMemo(() => {
        const l = [];
        const r = [];
        reviews.forEach((rev, i) => (i % 2 === 0 ? l : r).push(rev));
        return [l, r];
    }, [reviews]);

    // ~14s per card keeps the motion calm and readable
    const duration = Math.max(left.length, right.length) * 14;

    // Hover pauses with a mouse; a tap toggles the hold on touch devices
    const viewportHandlers = {
        onPointerEnter: (e) => e.pointerType === "mouse" && setHolding(true),
        onPointerLeave: (e) => e.pointerType === "mouse" && setHolding(false),
        onClick: (e) => e.nativeEvent.pointerType !== "mouse" && setHolding((h) => !h),
    };

    const segment = (active) =>
        `relative z-10 inline-flex w-24 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors duration-300 ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`;

    return (
        <section
            id="testimonial"
            className="relative isolate w-full overflow-hidden bg-background py-16 sm:py-24"
        >
            {/* component-scoped keyframes */}
            <style>{`
        @keyframes tm-slide-up   { from { transform: translateY(0) }    to { transform: translateY(-50%) } }
        @keyframes tm-slide-down { from { transform: translateY(-50%) }  to { transform: translateY(0) } }
        @keyframes tm-rise       { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          .tm-track { animation: none !important; }
          .tm-viewport { overflow-y: auto !important; }
        }
      `}</style>

            {/* ambient background */}


            <div className="container max-w-7xl">
                {/* optional heading */}
                {(title || subtitle) && (
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        {title && <h2 className="text-gradient">{title}</h2>}
                        {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
                    </div>
                )}

                {/* toolbar */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            Live Verified Feedback ({reviews.length})
                        </span>

                        {!isGrid && (
                            <span
                                className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex"
                                aria-live="polite"
                            >
                                {isPaused ? (
                                    <>
                                        <span className="text-primary">
                                            <PauseIcon />
                                        </span>
                                        Paused
                                    </>
                                ) : (
                                    "Hover or tap any review to pause"
                                )}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Pause / Resume */}
                        <button
                            type="button"
                            onClick={() => setUserPaused((p) => !p)}
                            disabled={isGrid}
                            aria-pressed={userPaused}
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md transition-all duration-300 not-disabled:cursor-pointer not-disabled:hover:border-primary/50 not-disabled:hover:shadow-md not-disabled:hover:shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <span className={userPaused ? "text-emerald-500" : "text-primary"}>
                                {userPaused ? <PlayIcon /> : <PauseIcon />}
                            </span>
                            {userPaused ? "Resume" : "Pause"}
                        </button>

                        {/* Mode switch with sliding thumb */}
                        <div
                            role="group"
                            aria-label="Layout"
                            className="relative inline-flex rounded-xl border border-border bg-card/70 p-1 shadow-sm backdrop-blur-md"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-1 left-1 w-24 rounded-lg bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/30 transition-transform duration-500 ease-premium"
                                style={{ transform: isGrid ? "translateX(100%)" : "translateX(0)" }}
                            />
                            <button
                                type="button"
                                onClick={() => setMode("sliding")}
                                aria-pressed={!isGrid}
                                className={`${segment(!isGrid)} cursor-pointer`}
                            >
                                <SlideIcon />
                                Sliding
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("grid")}
                                aria-pressed={isGrid}
                                className={`${segment(isGrid)} cursor-pointer`}
                            >
                                <GridIcon />
                                Grid
                            </button>
                        </div>
                    </div>
                </div>

                {/* content */}
                {isGrid ? (
                    <div key="grid" className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {reviews.map((r, i) => (
                            <div
                                key={r.id}
                                style={{ animation: `tm-rise 600ms var(--ease-premium) ${i * 70}ms backwards` }}
                            >
                                <ReviewCard review={r} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        key="sliding"
                        className="tm-viewport h-[680px] overflow-hidden animate-fade-in sm:h-[720px]"
                        style={{
                            maskImage:
                                "linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, transparent 0, #000 10%, #000 90%, transparent 100%)",
                        }}
                        {...viewportHandlers}
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <SlidingColumn items={left} direction="up" duration={duration} paused={isPaused} />
                            <SlidingColumn
                                items={right.length ? right : left}
                                direction="down"
                                duration={duration}
                                paused={isPaused}
                                className="hidden md:block"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}