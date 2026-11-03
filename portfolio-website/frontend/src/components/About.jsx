import { useCallback, useEffect, useRef, useState } from "react";
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
} from "react-icons/fi";
import { motion, animate, useInView, useReducedMotion } from "framer-motion";
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
    hobbies: ["Open Source", "Mechanical Keyboards", "Rock Climbing", "Espresso", "Sci-Fi", "Design Systems"],
    stats: [
        { value: "06+", label: "Years building" },
        { value: "40+", label: "Projects shipped" },
        { value: "∞", label: "Still learning" },
    ],
    ctaText: "Say Hello",
    ctaUrl: "#contact",
    isAvailable: true,
    availabilityText: "Available for work",
    developerTag: "DEV / 001",
    roleLabel: "A little story of mine",
    interestLabel: "Hobbies & interests",
};

const DEFAULT_CONTENT = {
    id: "about",
    sectionLabel: "About me",
    title: "I turn ideas into",
    highlight: "web experiences.",
    description: "",
    ctaEyebrow: "Let's talk",
    ctaText: "If something here resonated, I would love to hear from you.",
    errorTitle: "Couldn't load about data",
    errorText: "Please check your connection and try again.",
};

const STAT_ICONS = [FiAward, FiCode, FiTrendingUp];

/** Merge that ignores null / undefined / "" from the API, so a missing field
    falls back to its default instead of overwriting it (and crashing renders). */
const mergeDefined = (base, over) => {
    const out = { ...base };
    for (const [key, value] of Object.entries(over ?? {})) {
        if (value !== undefined && value !== null && value !== "") out[key] = value;
    }
    return out;
};

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
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
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
    const isNumber = Boolean(match);
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!isNumber || !inView) return;
        if (reduced) {
            setN(target);
            return;
        }
        const controls = animate(0, target, {
            duration: 1.6,
            ease: EASE,
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, reduced, target, isNumber]);

    if (!isNumber) return <span ref={ref}>{text}</span>;
    return (
        <span ref={ref}>
            {String(n).padStart(width, "0")}
            {suffix}
        </span>
    );
}

/* ========================================================================== */
/*  Card — 1px gradient border + glass body + cursor spotlight                */
/* ========================================================================== */
function Card({ children, className = "", inset = "inset-x-8 sm:inset-x-12", bodyClassName = "" }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, []);

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            className={`group/card relative h-full rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-md)] transition-all duration-500 hover:from-primary/50 hover:via-primary/15 hover:to-primary/5 ${className}`}
        >
            <div
                className={`relative flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] bg-card/85 backdrop-blur-2xl ${bodyClassName}`}
            >
                {/* cursor spotlight */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{
                        background:
                            "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
                    }}
                />
                {/* top highlight */}
                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute ${inset} top-0 z-20 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent opacity-40 transition-opacity duration-500 group-hover/card:opacity-100`}
                />
                {children}
            </div>
        </div>
    );
}

/* ========================================================================== */
/*  Markdown styles                                                           */
/* ========================================================================== */
const markdownStyles = `
  [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:tracking-tight
  [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:tracking-tight
  [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:tracking-tight
  [&_h4]:mt-6 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground
  [&_p]:mt-5 [&_p]:leading-8 [&_p]:text-muted-foreground
  [&_p:first-child]:mt-0 [&_p:first-child]:text-lg [&_p:first-child]:leading-9 [&_p:first-child]:text-foreground/90
  [&_strong]:text-foreground [&_strong]:font-semibold
  [&_em]:italic
  [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:text-muted-foreground
  [&_ol]:mt-4 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:text-muted-foreground
  [&_li]:leading-7 [&_li]:marker:text-primary/60
  [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/60 [&_blockquote]:bg-primary/5 [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
  [&_blockquote_p]:mt-0
  [&_code]:font-code [&_code]:text-[0.85em] [&_code]:bg-muted/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
  [&_pre]:mt-4 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:text-sm
  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:opacity-80
  [&_hr]:my-8 [&_hr]:border-border/60
  [&_img]:mt-6 [&_img]:rounded-2xl [&_img]:shadow-lg
`;

/* ========================================================================== */
/*  Profile card                                                              */
/* ========================================================================== */
function ProfileCard({ about }) {
    const { role, location, avatar, isAvailable, developerTag, availabilityText } = about;
    // API may send `headline`; the defaults use `name` — support both
    const headline = about.headline || about.name;
    const reduced = useReducedMotion();

    return (
        <Card inset="inset-x-8 sm:inset-x-10">
            {/* faint technical grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 text-foreground/6 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
            />

            {/* Meta strip */}
            <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
                {developerTag ? (
                    <div className="flex items-center gap-2 font-code text-[11px] text-muted-foreground/80">
                        <FiCircle size={6} className="fill-primary text-primary" aria-hidden="true" />
                        <span>{developerTag}</span>
                    </div>
                ) : (
                    <span />
                )}
                {isAvailable && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        {availabilityText}
                    </span>
                )}
            </div>

            {/* Avatar */}
            <div className="relative z-10 flex flex-col items-center px-6 pt-12">
                <motion.div
                    className="relative"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                >
                    {/* soft glow */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-[70px] transition-colors duration-700 group-hover/card:bg-primary/40"
                    />

                    {/* orbiting dashed ring + satellite dot */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute -inset-7 rounded-full border border-dashed border-primary/25"
                        animate={reduced ? undefined : { rotate: 360 }}
                        transition={{ duration: 48, ease: "linear", repeat: Infinity }}
                    >
                        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_var(--primary)]" />
                        <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-primary/60" />
                    </motion.div>

                    {/* gradient ring */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute -inset-1 rounded-full opacity-90"
                        style={{
                            background:
                                "conic-gradient(from 0deg, var(--primary), var(--chart-2), var(--chart-3), var(--primary))",
                        }}
                        animate={reduced ? undefined : { rotate: 360 }}
                        transition={{ duration: 14, ease: "linear", repeat: Infinity }}
                    />

                    <div className="relative h-48 w-48 rounded-full bg-card p-1.5 sm:h-56 sm:w-56">
                        <div className="h-full w-full overflow-hidden rounded-full">
                            <img
                                src={avatar || fallbackaboutImage}
                                alt={headline || "Profile photo"}
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                                onError={(e) => {
                                    e.currentTarget.onerror = null; // prevent loops
                                    e.currentTarget.src = fallbackaboutImage;
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Identity */}
            <div className="relative z-10 flex-1 px-6 pb-8 pt-10 text-center">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
                    {headline}
                </h3>
                {role && (
                    <p className="mt-2 text-sm font-medium">
                        <span className="text-gradient">{role}</span>
                    </p>
                )}
                {location && (
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
                        <FiMapPin size={12} className="text-primary" aria-hidden="true" />
                        <span>{location}</span>
                    </div>
                )}
            </div>

            {/* Terminal strip */}
            <div className="relative z-10 flex items-center justify-between border-t border-border/50 px-6 py-3" aria-hidden="true">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex items-center gap-2 font-code text-[11px] text-muted-foreground/70">
                    <span>~ $ whoami</span>
                    <span className="h-3 w-1.5 animate-pulse bg-primary/70 motion-reduce:animate-none" />
                    <FiTerminal size={13} className="ml-1 text-muted-foreground/50" />
                </div>
            </div>
        </Card>
    );
}

/* ========================================================================== */
/*  Content column                                                            */
/* ========================================================================== */
function StatCard({ icon: Icon, value, label }) {
    return (
        <Card bodyClassName="p-6" inset="inset-x-6">
            <div className="relative z-10 flex items-start justify-between">
                <p className="text-gradient text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                    <Counter value={value} />
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-primary transition-colors duration-300 group-hover/card:border-primary/40">
                    <Icon size={15} aria-hidden="true" />
                </span>
            </div>
            <p className="relative z-10 mt-3 text-sm text-muted-foreground">{label}</p>
        </Card>
    );
}

function ContentPanel({ about, content }) {
    const { role, hobbies, stats, ctaText, ctaUrl, roleLabel, interestLabel } = about;
    const bio = Array.isArray(about.bio) ? about.bio.join("\n\n") : about.bio;

    return (
        <div className="space-y-6">
            {/* Bio */}
            <ScrollReveal>
                <Card bodyClassName="p-7 sm:p-10">
                    {/* oversized quote watermark */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-6 top-2 z-0 select-none font-display text-[9rem] leading-none text-primary/10"
                    >
                        ”
                    </span>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="h-px w-10 bg-linear-to-r from-primary to-transparent" />
                            <p className="text-sm font-medium text-primary">{roleLabel || role}</p>
                        </div>

                        <div className={`mt-7 max-w-2xl text-[15px] sm:text-base ${markdownStyles}`}>
                            <MarkdownRenderer content={bio} />
                        </div>
                    </div>
                </Card>
            </ScrollReveal>

            {/* Stats */}
            {Array.isArray(stats) && stats.length > 0 && (
                <ScrollReveal delay={0.08}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {stats.map((s, i) => (
                            <StatCard
                                key={`${s.label}-${i}`}
                                icon={STAT_ICONS[i % STAT_ICONS.length]}
                                value={s.value}
                                label={s.label}
                            />
                        ))}
                    </div>
                </ScrollReveal>
            )}

            {/* Interests + CTA */}
            <ScrollReveal delay={0.12}>
                <Card bodyClassName="p-7 sm:p-10">
                    <div className="relative z-10">
                        {Array.isArray(hobbies) && hobbies.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <FiHeart size={14} aria-hidden="true" />
                                        </span>
                                        <p className="text-sm font-medium text-foreground">{interestLabel}</p>
                                    </div>
                                    <span className="font-code text-xs text-muted-foreground">
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
                                            className="inline-flex cursor-default items-center rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                        >
                                            {item}
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
                        )}

                        {ctaText && ctaUrl && (
                            <motion.div
                                className="relative mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-primary/15 via-primary/5 to-transparent p-6 sm:p-7"
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                            >
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
                                />
                                <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        {content.ctaEyebrow && (
                                            <p className="text-sm font-semibold text-primary">{content.ctaEyebrow}</p>
                                        )}
                                        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                                            {content.ctaText}
                                        </p>
                                    </div>

                                    <Button to={ctaUrl}>
                                        <span>{ctaText}</span>
                                        <FiArrowUpRight
                                            size={17}
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Button>
                                </div>
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
    const block = "animate-pulse rounded-[28px] border border-border/50 bg-card/40";
    return (
        <div
            role="status"
            aria-busy="true"
            className="mt-16 grid items-start gap-8 lg:mt-20 lg:grid-cols-[360px_1fr]"
        >
            <span className="sr-only">Loading about section…</span>
            <div className={`${block} h-[600px]`} />
            <div className="space-y-6">
                <div className={`${block} h-72`} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`${block} h-32`} />
                    ))}
                </div>
                <div className={`${block} h-60`} />
            </div>
        </div>
    );
}

function ErrorState({ content, onRetry }) {
    return (
        <div
            role="alert"
            className="mt-16 rounded-[28px] border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center lg:mt-20 lg:p-16"
        >
            <p className="text-sm font-semibold text-destructive">{content.errorTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.errorText}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={() => onRetry()}
                    className={`mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`}
                >
                    <FiRefreshCw size={14} aria-hidden="true" />
                    Try again
                </button>
            )}
        </div>
    );
}

/* ========================================================================== */
/*  Background — slow drifting glows + faded grid                             */
/* ========================================================================== */
function Backdrop() {
    const reduced = useReducedMotion();
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/12 blur-[140px]"
                animate={reduced ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -right-40 bottom-10 h-[320px] w-[320px] rounded-full bg-chart-2/10 blur-[120px]"
                animate={reduced ? undefined : { x: [0, -30, 0], y: [0, 30, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                    maskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, #000 10%, transparent 75%)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 25%, #000 10%, transparent 75%)",
                }}
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
    const about = mergeDefined(FALLBACK_ABOUT, aboutOverride);
    const content = mergeDefined(DEFAULT_CONTENT, contentOverride);

    return (
        <section
            id={content.id}
            className={`relative overflow-hidden bg-background py-20 sm:py-36 ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />
            <Backdrop />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        {/* now uses content.sectionLabel / description instead of hard-coded text */}
                        <SectionHeader
                            label={content.sectionLabel}
                            title={content.title}
                            highlight={content.highlight}
                        >
                            {content.description || undefined}
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
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
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