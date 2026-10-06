import React, { useRef } from "react";
import {
    FiArrowUpRight,
    FiMapPin,
    FiTerminal,
    FiCircle,
} from "react-icons/fi";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import fallbackProfileImage from "../assets/about.png";
import Button from "./Button";
import { useGetPublicAboutDataQuery } from "../redux/features/publicApi";
import { MarkdownRenderer } from "./MarkDownRenderer";

/* ------------------------------------------------------------------ */
/*  Fallbacks                                                          */
/* ------------------------------------------------------------------ */
const FALLBACK_STACK = [
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Express",
];

const FALLBACK_STATS = [
    { value: "06+", label: "Years building" },
    { value: "40+", label: "Projects shipped" },
    { value: "∞", label: "Still learning" },
];

const FALLBACK_STORY = [
    "I'm a full-stack developer focused on building modern web applications that are simple to use, fast to load, and enjoyable to interact with.",
    "I enjoy working from the first idea all the way through development and deployment — combining thoughtful UI with solid backend architecture.",
];

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE, delay: custom },
    }),
};

const stagger = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

/* Reveal-on-scroll wrapper (viewport-triggered) */
function ScrollReveal({
    children,
    delay = 0,
    className = "",
    as: Tag = motion.div,
    amount = 0.15,
}) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: true, amount });

    return (
        <Tag
            ref={ref}
            initial={reduced ? "show" : "hidden"}
            animate={inView ? "show" : "hidden"}
            variants={fadeUp}
            custom={delay}
            className={className}
        >
            {children}
        </Tag>
    );
}

/* ------------------------------------------------------------------ */
/*  Card chrome                                                        */
/* ------------------------------------------------------------------ */
const cardChrome = `
  group/card relative clip-polygon flex flex-col overflow-hidden
  border border-border/50 bg-card/30 backdrop-blur-md
  transition-all duration-700 ease-out
  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
  hover:-translate-y-1
  hover:border-primary/40
  hover:bg-card/60
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_80px_-16px_theme(colors.primary/40),inset_0_1px_0_0_rgba(255,255,255,0.06)]
`;

function CardAmbientGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
        >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/20),transparent_70%)] blur-3xl" />
            <div className="absolute -inset-1/2 animate-[spin_12s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/15)_60deg,transparent_120deg,theme(colors.primary/8)_240deg,transparent_360deg)] opacity-30" />
        </div>
    );
}

function CardAccents({ inset = "inset-x-6" }) {
    return (
        <>
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-700 group-hover/card:opacity-100`}
            />
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover/card:h-12 group-hover/card:w-12 group-hover/card:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover/card:h-12 group-hover/card:w-12 group-hover/card:border-primary/50" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Markdown styles                                                    */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Profile Panel                                                      */
/* ------------------------------------------------------------------ */
function ProfilePanel({ profile }) {
    const { name, location, avatar, isAvailable } = profile;
    const reduced = useReducedMotion();

    return (
        <ScrollReveal className={`${cardChrome} min-h-[600px] lg:min-h-[640px]`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-8 sm:inset-x-10" />

            {/* Technical grid — visible in both modes */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
                style={{
                    "--grid-color": "color-mix(in srgb, currentColor 6%, transparent)",
                }}
            />

            {/* Top-left mark */}
            <div className="absolute left-8 top-8 z-20 flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                <FiCircle size={6} className="fill-primary text-primary" />
                <span>DEV / 001</span>
            </div>

            {/* Top-right status */}
            <div className="absolute right-8 top-8 z-20 flex items-center gap-2">
                {isAvailable !== false && (
                    <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                        Available
                    </span>
                )}
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                </span>
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10">
                {/* Avatar */}
                <div className="flex flex-1 items-center justify-center py-12">
                    <motion.div
                        className="group/avatar relative"
                        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                    >
                        {/* Outer orbit rings */}
                        <div className="absolute -inset-8 rounded-full border border-border/50 transition-all duration-700 group-hover/card:-inset-10 group-hover/card:border-primary/30" />
                        <div className="absolute -inset-16 rounded-full border border-border/20" />

                        {/* Glow */}
                        <div className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-[100px] transition-all duration-700 group-hover/card:bg-primary/40" />

                        {/* Photo frame */}
                        <div className="relative h-64 w-64 overflow-hidden rounded-full border border-border/60 bg-muted/20 p-1.5 shadow-2xl shadow-primary/20 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                            <div className="h-full w-full overflow-hidden rounded-full">
                                <img
                                    src={avatar || fallbackProfileImage}
                                    alt={name || "Profile"}
                                    className="h-full w-full object-cover brightness-[0.75] contrast-[1.08] saturate-[0.9] transition-transform duration-1000 group-hover/card:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = fallbackProfileImage;
                                    }}
                                />
                            </div>
                            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-muted/40 via-transparent to-transparent" />
                        </div>

                        {/* Orbit dots */}
                        <div className="absolute -right-6 top-16 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/60" />
                        <div className="absolute -bottom-2 left-12 h-2 w-2 rounded-full bg-primary/60" />
                    </motion.div>
                </div>

                {/* Profile info */}
                <div className="relative border-t border-border/60 pt-6">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {name || "Your Name"}
                            </p>

                            <div className="mt-2.5 flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                <FiMapPin size={12} aria-hidden="true" />
                                <span>{location || "Remote · Worldwide"}</span>
                            </div>
                        </div>

                        <FiTerminal
                            size={22}
                            aria-hidden="true"
                            className="text-muted-foreground/40"
                        />
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Stats strip                                                        */
/* ------------------------------------------------------------------ */
function StatsStrip({ stats }) {
    return (
        <motion.div
            className="grid grid-cols-3 border-y border-border/60"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label || index}
                    variants={fadeUp}
                    className={`group/stat relative py-7 ${index !== 0 ? "border-l border-border/60 pl-5 sm:pl-7" : ""
                        }`}
                >
                    <p className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        {stat.value}
                    </p>
                    <p className="mt-2 max-w-[120px] font-code text-[10px] uppercase leading-5 tracking-[0.14em] text-muted-foreground">
                        {stat.label}
                    </p>

                    {/* Underline hover accent */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-700 group-hover/stat:w-full" />
                </motion.div>
            ))}
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Content Panel                                                      */
/* ------------------------------------------------------------------ */
function ContentPanel({ profile }) {
    const { role, bio, story, stack, stats, ctaText, ctaUrl } = profile;

    // Normalize story/bio into one markdown string
    let markdownContent;
    if (typeof story === "string" && story.trim()) {
        markdownContent = story;
    } else if (Array.isArray(story) && story.length > 0) {
        markdownContent = story.join("\n\n");
    } else if (bio) {
        markdownContent = bio;
    } else {
        markdownContent = FALLBACK_STORY.join("\n\n");
    }

    const stackList =
        Array.isArray(stack) && stack.length > 0 ? stack : FALLBACK_STACK;
    const statsList =
        Array.isArray(stats) && stats.length > 0 ? stats : FALLBACK_STATS;

    return (
        <ScrollReveal
            delay={0.12}
            className={`${cardChrome} p-7 sm:p-10 lg:p-12`}
        >
            <CardAmbientGlow />
            <CardAccents inset="inset-x-7 sm:inset-x-10 lg:inset-x-12" />

            {/* Role label */}
            <div className="relative z-10 flex items-center gap-3">
                <span className="h-px w-8 bg-primary/60" />
                <p className="font-code text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                    {role || "A little story of mine"}
                </p>
            </div>

            {/* Markdown content */}
            <div className={`relative z-10 mt-8 max-w-2xl ${markdownStyles}`}>
                <MarkdownRenderer content={markdownContent} />
            </div>

            {/* Stack */}
            <div className="relative z-10 mt-10 border-t border-border/60 pt-8">
                <div className="flex items-center justify-between gap-4">
                    <p className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Core stack
                    </p>
                    <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                        {String(stackList.length).padStart(2, "0")} technologies
                    </span>
                </div>

                <motion.div
                    className="mt-5 flex flex-wrap gap-2"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {stackList.map((item) => (
                        <motion.span
                            key={item}
                            variants={fadeUp}
                            className="group/tag inline-flex items-center gap-1.5 border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary/90 hover:shadow-[0_4px_12px_-4px_theme(colors.primary/40)]"
                        >
                            <span className="h-1 w-1 rounded-full bg-primary/40 transition-colors duration-300 group-hover/tag:bg-primary" />
                            {item}
                        </motion.span>
                    ))}
                </motion.div>
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-10">
                <StatsStrip stats={statsList} />
            </div>

            {/* CTA */}
            <motion.div
                className="relative z-10 mt-10"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
                <Button
                    to={ctaUrl || "#contact"}
                    className="group/cta inline-flex items-center gap-2 clip-polygon bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_40px_-6px_theme(colors.primary/60)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    {ctaText || "Let's work together"}
                    <FiArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                    />
                </Button>
            </motion.div>
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */
function AboutSkeleton() {
    return (
        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8 animate-pulse">
            <div className={`${cardChrome} min-h-[600px] lg:min-h-[640px]`} />
            <div className={`${cardChrome} min-h-[600px] lg:min-h-[640px] p-12`}>
                <div className="h-3 w-40 bg-muted/40 rounded" />
                <div className="mt-8 space-y-3">
                    <div className="h-3 w-full bg-muted/30 rounded" />
                    <div className="h-3 w-5/6 bg-muted/30 rounded" />
                    <div className="h-3 w-4/6 bg-muted/30 rounded" />
                </div>
                <div className="mt-10 pt-8 border-t border-border/40 flex gap-2">
                    <div className="h-6 w-16 bg-muted/30 rounded" />
                    <div className="h-6 w-20 bg-muted/30 rounded" />
                    <div className="h-6 w-14 bg-muted/30 rounded" />
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function About() {
    const { data, isLoading, isError } = useGetPublicAboutDataQuery();

    const about = data?.data ?? data ?? {};

    const profile = {
        name: about.name || about.fullName || "",
        role: about.role || about.title || "",
        location: about.location || about.address || "",
        avatar: about.avatar || about.profileImage || "",
        bio: about.bio || about.tagline || "",
        story:
            about.story ||
            about.paragraphs ||
            about.bio_parts ||
            about.description ||
            "",
        stack: about.stack || about.skills || about.technologies || [],
        stats: about.stats || about.metrics || [],
        ctaText: about.ctaText || "",
        ctaUrl: about.ctaUrl || "",
        isAvailable: about.isAvailable,
    };

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] bg-primary/10 blur-[140px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-[320px] w-[320px] bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="About Me" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            I turn ideas into{" "}
                            <span className="text-gradient">web experiences.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        {profile.role ||
                            "A full-stack developer building fast, accessible products — from first sketch to production launch."}
                    </p>
                </ScrollReveal>

                {/* MAIN GRID */}
                {isLoading ? (
                    <AboutSkeleton />
                ) : isError ? (
                    <div className="mt-16 text-center text-muted-foreground">
                        Failed to load about data.
                    </div>
                ) : (
                    <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
                        <ProfilePanel profile={profile} />
                        <ContentPanel profile={profile} />
                    </div>
                )}

                {/* Bottom divider */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36"
                />
            </div>
        </section>
    );
}