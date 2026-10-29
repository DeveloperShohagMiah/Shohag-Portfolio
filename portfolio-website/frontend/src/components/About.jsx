import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    FiArrowUpRight,
    FiMapPin,
    FiTerminal,
    FiCircle,
    FiAward,
    FiCode,
    FiTrendingUp,
    FiRefreshCw,
    FiHeart,
    FiCompass,
} from "react-icons/fi";
import {
    motion,
    animate,
    useInView,
    useReducedMotion,
} from "framer-motion";
import SectionHeader from "./SectionHeader";
import fallbackaboutImage from "../assets/about.png";
import Button from "./Button";
import { useGetPublicAboutDataQuery } from "../redux/features/publicApi";
import { MarkdownRenderer } from "./MarkDownRenderer";

/* ========================================================================== */
/*  Defaults — override any of these through props / API data                 */
/* ========================================================================== */
const FALLBACK_ABOUT = {
    name: "Your Name",
    role: "Full-stack developer",
    location: "Remote · Worldwide",
    avatar: "",
    bio: [
        "I'm a full-stack developer focused on building modern web applications that are simple to use, fast to load, and enjoyable to interact with.",
        "I enjoy working from the first idea all the way through development and deployment — combining thoughtful UI with solid backend architecture.",
    ].join("\n\n"),
    // Replaced coreStack with hobbies
    hobbies: ["Open Source", "Mechanical Keyboards", "Rock Climbing", "Espresso", "Sci-Fi", "Design Systems"],
    stats: [
        { value: "06+", label: "Years building" },
        { value: "40+", label: "Projects shipped" },
        { value: "∞", label: "Still learning" },
    ],
    ctaText: "Say Hello",
    ctaUrl: "#contact",
    isAvailable: true,
    availabilityText: "Available",
    developerTag: "DEV / 001",
    roleLabel: "A little story of mine",
    // Renamed label
    interestLabel: "Hobbies & Interests",
};

const DEFAULT_CONTENT = {
    id: "about",
    sectionLabel: "About me",
    title: "I turn ideas into",
    highlight: "web experiences.",
    description: "",
    ctaEyebrow: "",
    ctaText: "If something here resonated,I would love to hear from you.",
    errorTitle: "Couldn't load about data",
    errorText: "Please check your connection and try again.",
};

// Updated icons for hobbies
const STAT_ICONS = [FiAward, FiCode, FiTrendingUp];

/* ========================================================================== */
/*  Motion helpers                                                            */
/* ========================================================================== */
const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE, delay },
    }),
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function ScrollReveal({ children, delay = 0, className = "", amount = 0.15 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: true, amount });

    return (
        <motion.div
            ref={ref}
            initial={reduced ? "show" : "hidden"}
            animate={inView ? "show" : "hidden"}
            variants={fadeUp}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* Count-up that understands "06+", "40+", "100%" and leaves "∞" alone */
function Counter({ value }) {
    const text = String(value);
    const match = /^(\d+)(.*)$/.exec(text);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduced = useReducedMotion();
    const target = match ? Number(match[1]) : 0;
    const width = match ? match[1].length : 0;
    const suffix = match ? match[2] : "";
    const [n, setN] = useState(match ? 0 : null);

    useEffect(() => {
        if (!match || !inView) return;
        if (reduced) return setN(target);
        const controls = animate(0, target, {
            duration: 1.6,
            ease: EASE,
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, reduced, target]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!match) return <span ref={ref}>{text}</span>;
    return (
        <span ref={ref}>
            {String(n ?? 0).padStart(width, "0")}
            {suffix}
        </span>
    );
}

/* ========================================================================== */
/*  Card — glass surface with a cursor spotlight                              */
/* ========================================================================== */
function Card({ children, className = "", inset = "inset-x-7 sm:inset-x-10" }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, []);

    const mask =
        "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)";

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            className={`group/card relative flex h-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card/60 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow] duration-500  ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-primary/[0.10] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
            />
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-40 transition-opacity duration-500 group-hover/card:opacity-100`}
            />
            {children}
        </div>
    );
}

/* ========================================================================== */
/*  Markdown styles (unchanged behaviour)                                     */
/* ========================================================================== */
const markdownStyles = `
  [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:tracking-tight
  [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight
  [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:tracking-tight
  [&_h4]:mt-6 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground
  [&_p]:mt-4 [&_p]:leading-8 [&_p]:text-muted-foreground
  [&_p:first-child]:mt-0
  [&_strong]:text-foreground [&_strong]:font-semibold
  [&_em]:italic
  [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:text-muted-foreground
  [&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:text-muted-foreground
  [&_li]:leading-7 [&_li]:marker:text-primary/60
  [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/60 [&_blockquote]:bg-primary/5 [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
  [&_blockquote_p]:mt-0
  [&_code]:font-code [&_code]:text-[0.85em] [&_code]:bg-muted/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
  [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:text-sm
  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-80
  [&_hr]:my-8 [&_hr]:border-border/60
  [&_img]:mt-6 [&_img]:rounded-lg [&_img]:shadow-lg
`;

/* ========================================================================== */
/*  Profile card                                                              */
/* ========================================================================== */
function ProfileCard({ about }) {
    const { headline, role, location, avatar, isAvailable, developerTag, availabilityText } = about;
    const reduced = useReducedMotion();

    return (
        <Card inset="inset-x-6 sm:inset-x-8">
            {/* faint technical grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 text-foreground/6 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
            />

            {/* Meta strip */}
            <div className="relative z-10 flex items-center justify-between border-b border-border/50 px-6 py-4">
                {developerTag && (
                    <div className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                        <FiCircle size={6} className="fill-primary text-primary" aria-hidden="true" />
                        <span>{developerTag}</span>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    {isAvailable && availabilityText && (
                        <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                            {availabilityText}
                        </span>
                    )}
                    {isAvailable && (
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                    )}
                </div>
            </div>

            {/* Avatar */}
            <div className="relative z-10 flex flex-col items-center px-6 pt-12">
                <motion.div
                    className="relative"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                >
                    {/* orbiting dashed ring + satellite dot */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute -inset-6 rounded-full border border-dashed border-primary/25"
                        animate={reduced ? undefined : { rotate: 360 }}
                        transition={{ duration: 48, ease: "linear", repeat: Infinity }}
                    >
                        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                        <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    </motion.div>

                    {/* static outer ring + glow */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-3 rounded-full border border-border/40 transition-colors duration-700 group-hover/card:border-primary/30"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-[70px] transition-colors duration-700 group-hover/card:bg-primary/35"
                    />

                    <div className="relative h-48 w-48 overflow-hidden rounded-full border border-border/60 bg-muted/20 p-1.5 sm:h-56 sm:w-56">
                        <div className="h-full w-full overflow-hidden rounded-full">
                            <img
                                src={avatar || fallbackaboutImage}
                                alt={headline}
                                loading="lazy"
                                className="h-full w-full object-cover brightness-90 contrast-105 saturate-90 transition-all duration-1000 group-hover/card:scale-105 group-hover/card:brightness-100"
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // prevent loops
                                    e.currentTarget.src = fallbackaboutImage;
                                }}
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                    </div>
                </motion.div>
            </div>

            {/* Identity */}
            <div className="relative z-10 flex-1 px-6 pb-8 pt-9 text-center">
                <h3 className="font-display  text-2xl font-bold tracking-widest uppercase text-foreground sm:text-[1.65rem]">
                    {headline}
                </h3>
                {role && (
                    <p className="mt-2 font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                        {role}
                    </p>
                )}
                {location && (
                    <div className="mt-4 flex items-center justify-center gap-2 font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        <FiMapPin size={11} aria-hidden="true" />
                        <span>{location}</span>
                    </div>
                )}
            </div>

            {/* Terminal strip */}
            <div className="relative z-10 flex items-center justify-between border-t border-border/50 px-6 py-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex items-center gap-2 font-code text-[10px] text-muted-foreground/60">
                    <span aria-hidden="true">~ $ whoami</span>
                    <span
                        aria-hidden="true"
                        className="h-3 w-1.5 animate-pulse bg-primary/70 motion-reduce:animate-none"
                    />
                    <FiTerminal size={13} aria-hidden="true" className="ml-1 text-muted-foreground/40" />
                </div>
            </div>
        </Card>
    );
}

/* ========================================================================== */
/*  Content column                                                            */
/* ========================================================================== */
function ContentPanel({ about, content }) {
    const { role, bio, hobbies, stats, ctaText, ctaUrl, roleLabel, interestLabel } = about;

    return (
        <div className="space-y-6">
            {/* Bio */}
            <ScrollReveal>
                <Card>
                    <div className="relative z-10 p-7 sm:p-10">
                        <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="h-px w-8 bg-primary/60" />
                            <p className="font-code text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                                {roleLabel || role}
                            </p>
                        </div>

                        <div className={`mt-8 max-w-2xl text-sm ${markdownStyles}`}>
                            <MarkdownRenderer content={bio} />
                        </div>
                    </div>
                </Card>
            </ScrollReveal>

            {/* Interests + CTA */}
            <ScrollReveal delay={0.12}>
                <Card>
                    <div className="relative z-10 p-7 sm:p-10">
                        {hobbies?.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <FiHeart size={14} className="text-primary" />
                                        <p className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                            {interestLabel}
                                        </p>
                                    </div>
                                    <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                                        {String(hobbies.length).padStart(2, "0")} passions
                                    </span>
                                </div>

                                <motion.ul
                                    className="mt-5 flex flex-wrap gap-2"
                                    variants={stagger}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {hobbies.map((item) => (
                                        <motion.li
                                            key={item}
                                            variants={fadeUp}
                                            whileHover={{ y: -2 }}
                                            className="group/tag inline-flex rounded-full items-center gap-1.5 border border-border/60 bg-muted/40 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                        >

                                            {item}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        )}

                        {ctaText && ctaUrl && (
                            <motion.div
                                className="mt-8 flex flex-col items-start gap-5 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                            >
                                <div>
                                    <p className="font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                                        {content.ctaEyebrow}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {content.ctaText}
                                    </p>
                                </div>

                                <Button to={ctaUrl}>
                                    <span className="relative">{ctaText}</span>
                                    <FiArrowUpRight
                                        size={17}
                                        aria-hidden="true"
                                        className="relative transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                                    />
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </Card>
            </ScrollReveal>
        </div>
    );
}

/* ========================================================================== */
/*  Skeleton + error                                                          */
/* ========================================================================== */
function AboutSkeleton() {
    const shimmer = "animate-pulse rounded-lg border border-border/50 bg-card/40";
    return (
        <div className="mt-16 grid items-start gap-8 lg:mt-20 lg:grid-cols-[360px_1fr]" aria-busy="true">
            <div className={`${shimmer} h-[600px]`} />
            <div className="space-y-6">
                <div className={`${shimmer} h-72`} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`${shimmer} h-32`} />
                    ))}
                </div>
                <div className={`${shimmer} h-44`} />
            </div>
        </div>
    );
}

function ErrorState({ content, onRetry }) {
    return (
        <div
            role="alert"
            className="mt-16 rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 p-12 text-center lg:mt-20 lg:p-16"
        >
            <p className="font-code text-[10px] uppercase tracking-[0.24em] text-rose-500">
                {content.errorTitle}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{content.errorText}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className={`mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`}
                >
                    <FiRefreshCw size={14} aria-hidden="true" />
                    Try again
                </button>
            )}
        </div>
    );
}

/* ========================================================================== */
/*  Background — slow drifting glows (no heavy conic/spin layers)             */
/* ========================================================================== */
function Backdrop() {
    const reduced = useReducedMotion();
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]"
                animate={reduced ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -right-40 bottom-10 h-[320px] w-[320px] rounded-full bg-primary/10 blur-[120px]"
                animate={reduced ? undefined : { x: [0, -30, 0], y: [0, 30, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

/* ========================================================================== */
/*  Reusable section — no API coupling                                        */
/* ========================================================================== */
export function AboutSection({
    about: aboutOverride,
    content: contentOverride,
    isLoading = false,
    isError = false,
    onRetry,
    className = "",
}) {
    const about = { ...FALLBACK_ABOUT, ...(aboutOverride ?? {}) };
    const content = { ...DEFAULT_CONTENT, ...(contentOverride ?? {}) };

    return (
        <section
            id={content.id}
            className={`relative overflow-hidden bg-background py-20 sm:py-36 ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <Backdrop />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label={"About me"} title={content.title} highlight={content.highlight}>

                        </SectionHeader>
                    </div>

                </ScrollReveal>

                {isLoading ? (
                    <AboutSkeleton />
                ) : isError ? (
                    <ErrorState content={content} onRetry={onRetry} />
                ) : (
                    <div className="mt-16 grid items-start gap-8 lg:mt-20 lg:grid-cols-[360px_1fr]">
                        <ScrollReveal className="lg:sticky lg:top-24">
                            <ProfileCard about={about} />
                        </ScrollReveal>
                        <ContentPanel about={about} content={content} />
                    </div>
                )}
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
        </section>
    );
}

/* ========================================================================== */
/*  Default export — wired to your RTK Query hook                             */
/* ========================================================================== */
export default function About(props) {
    const { data, isLoading, isError, refetch } = useGetPublicAboutDataQuery();
    const about = data?.data ?? data ?? {};

    return (
        <AboutSection
            about={about}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            {...props}
        />
    );
}