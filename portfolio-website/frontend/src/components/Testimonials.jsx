import { useMemo, useState } from "react";

/* -------------------------------------------------------------------------
   Data — replace with your real reviews (or fetch them from your API).
   The first three are taken from your screenshot; the rest are placeholders.
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
        className={`h-[18px] w-[18px] ${filled ? "text-amber-400" : "text-amber-400/25"}`}
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L10 15.1l-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" />
    </svg>
);

const QuoteIcon = () => (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="currentColor" aria-hidden="true">
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
------------------------------------------------------------------------- */
function ReviewCard({ review }) {
    const { message, location, rating, product, date, name } = review;

    return (
        <article className="relative rounded-md border border-border/80 bg-card/60 p-6 text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
            {/* decorative quote mark */}
            <span className="pointer-events-none absolute right-5 top-5 text-primary/20">
                <QuoteIcon />
            </span>

            {/* rating + product */}
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <StarIcon key={n} filled={n <= rating} />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">
                        {rating.toFixed(1)} / 5.0
                    </span>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/50 transition">
                    <span className="text-primary">
                        <TagIcon />
                    </span>
                    {product}
                </span>
            </div>

            {/* text */}
            <p className="relative mt-5 text-sm font-normal italic leading-relaxed text-foreground/90 sm:text-md">
                “{message}”
            </p>

            <hr className="my-6 border-border/30" />

            {/* author */}
            <footer className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-primary/20 to-primary/80 text-lg font-bold text-white shadow-md shadow-primary/30">
                        {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{name}</p>
                        <p className="truncate text-sm text-muted-foreground">{location}</p>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckIcon />
                        Verified
                    </span>
                    <time className="font-code text-xs text-muted-foreground">{date}</time>
                </div>
            </footer>
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
export default function TestimonialSection({ reviews = REVIEWS }) {
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
        `inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold transition-colors duration-200 ${active
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-muted-foreground hover:text-foreground"
        }`;

    return (
        <section id="testimonial" className="relative w-full overflow-hidden bg-background py-12 sm:py-16">
            {/* component-scoped keyframes */}
            <style>{`
        @keyframes tm-slide-up   { from { transform: translateY(0) }    to { transform: translateY(-50%) } }
        @keyframes tm-slide-down { from { transform: translateY(-50%) }  to { transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          .tm-track { animation: none !important; }
          .tm-viewport { overflow-y: auto !important; }
        }
      `}</style>

            <div className="container max-w-7xl">
                {/* toolbar */}
                <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-border/70">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            </span>
                            Live Verified Feedback ({reviews.length})
                        </span>
                        {!isGrid && (
                            <span className="text-xs text-slate-500 hidden sm:inline">
                                Hover or tap any review to pause
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Pause / Play */}
                        <button
                            type="button"
                            onClick={() => setUserPaused((p) => !p)}
                            disabled={isGrid}
                            aria-pressed={userPaused}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border shadow-2xs transition cursor-pointer"
                        >
                            <span className={`${userPaused ? 'text-emerald-600' : "text-primary"}`}>{userPaused ? <PlayIcon /> : <PauseIcon />}</span>
                            {userPaused ? "Resume" : "Pause"}
                        </button>

                        {/* Mode switch */}
                        <div
                            role="group"
                            aria-label="Layout"
                            className="inline-flex gap-1 rounded-md border border-border bg-card p-1 shadow-sm"
                        >
                            <button
                                type="button"
                                onClick={() => setMode("sliding")}
                                aria-pressed={!isGrid}
                                className={segment(!isGrid)}
                            >
                                <SlideIcon />
                                Sliding
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("grid")}
                                aria-pressed={isGrid}
                                className={segment(isGrid)}
                            >
                                <GridIcon />
                                Grid
                            </button>
                        </div>
                    </div>
                </div>

                {/* content */}
                {isGrid ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {reviews.map((r) => (
                            <ReviewCard key={r.id} review={r} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="tm-viewport mt-15 h-[680px] overflow-hidden sm:h-[720px]"
                        style={{
                            maskImage:
                                "linear-gradient(to bottom, transparent 0, #000 9%, #000 91%, transparent 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, transparent 0, #000 9%, #000 91%, transparent 100%)",
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