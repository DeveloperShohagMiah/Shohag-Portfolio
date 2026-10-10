import React, { useRef } from "react";
import {
    FiArrowUpRight,
    FiMapPin,
    FiTerminal,
    FiCircle,
    FiAward,
    FiCode,
    FiTrendingUp,
} from "react-icons/fi";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import fallbackaboutImage from "../assets/about.png";
import Button from "./Button";
import { useGetPublicAboutDataQuery } from "../redux/features/publicApi";
import { MarkdownRenderer } from "./MarkDownRenderer";

/* ------------------------------------------------------------------ */
/*  Fallback data                                                      */
/* ------------------------------------------------------------------ */
const FALLBACK_ABOUT = {
    name: "Your Name",
    role: "Full-stack developer",
    location: "Remote · Worldwide",
    avatar: "",
    bio: [
        "I'm a full-stack developer focused on building modern web applications that are simple to use, fast to load, and enjoyable to interact with.",
        "I enjoy working from the first idea all the way through development and deployment — combining thoughtful UI with solid backend architecture.",
    ].join("\n\n"),
    coreStack: [
        "React",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Express",
    ],
    stats: [
        { value: "06+", label: "Years building" },
        { value: "40+", label: "Projects shipped" },
        { value: "∞", label: "Still learning" },
    ],
    ctaText: "Let's work together",
    ctaUrl: "#contact",
    isAvailable: true,
    availabilityText: "Available",
    developerTag: "DEV / 001",
    roleLabel: "A little story of mine",
    stackLabel: "Core stack",
};

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
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
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

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
  border border-border/50 bg-card/40 backdrop-blur-md
  transition-[border-color,background-color,box-shadow,transform] duration-500 ease-out
  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
  hover:border-primary/40
  hover:bg-card/70
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]
`;

function CardAmbientGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/25),transparent_70%)] blur-2xl animate-[pulseGlow_4s_ease-in-out_infinite] motion-reduce:animate-none" />
            <div className="absolute -inset-1/2 animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/20)_60deg,transparent_120deg,theme(colors.primary/10)_240deg,transparent_360deg)] opacity-40 motion-reduce:animate-none" />
        </div>
    );
}

function CardAccents({ inset = "inset-x-6" }) {
    return (
        <>
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100`}
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
/*  Sticky Profile Card                                                */
/* ------------------------------------------------------------------ */
function ProfileCard({ about }) {
    const {
        name,
        role,
        location,
        avatar,
        isAvailable,
        developerTag,
        availabilityText,
    } = about;
    const reduced = useReducedMotion();

    return (
        <ScrollReveal className={`${cardChrome} lg:sticky lg:top-24`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-6 sm:inset-x-8" />

            {/* Technical grid backdrop */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
                style={{
                    "--grid-color": "color-mix(in srgb, currentColor 6%, transparent)",
                }}
            />

            {/* Top meta strip */}
            <div className="relative z-10 flex items-center justify-between border-b border-border/50 px-6 py-4">
                {developerTag && (
                    <div className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                        <FiCircle size={6} className="fill-primary text-primary" />
                        <span>{developerTag}</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {isAvailable && availabilityText && (
                        <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                            {availabilityText}
                        </span>
                    )}
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary/60)]" />
                    </span>
                </div>
            </div>

            {/* Avatar block */}
            <div className="relative z-10 flex flex-col items-center px-6 pt-10">
                <motion.div
                    className="group/avatar relative"
                    initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.15 }}
                >
                    <div className="absolute -inset-6 rounded-full border border-border/40 transition-all duration-700 group-hover/card:-inset-8 group-hover/card:border-primary/30" />
                    <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-[80px] transition-all duration-700 group-hover/card:bg-primary/35" />

                    <div className="relative h-52 w-52 overflow-hidden rounded-full border border-border/60 bg-muted/20 p-1.5 shadow-2xl shadow-primary/20 sm:h-60 sm:w-60">
                        <div className="h-full w-full overflow-hidden rounded-full">
                            <img
                                src={avatar || fallbackaboutImage}
                                alt={name}
                                className="h-full w-full object-cover brightness-[0.78] contrast-[1.08] saturate-[0.9] transition-transform duration-1000 group-hover/card:scale-105"
                                onError={(e) => {
                                    e.currentTarget.currentSrc = fallbackaboutImage;
                                }}
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-muted/40 via-transparent to-transparent" />
                    </div>

                    <div className="absolute -right-4 top-12 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary/60)]" />
                    <div className="absolute -bottom-1 left-8 h-2 w-2 rounded-full bg-primary/60" />
                </motion.div>
            </div>

            {/* Name & role & location */}
            <div className="relative z-10 px-6 pb-6 pt-7 text-center">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
                    {name}
                </h3>

                {role && (
                    <p className="mt-2 font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                        {role}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-2 font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <FiMapPin size={11} aria-hidden="true" />
                    <span>{location}</span>
                </div>
            </div>

            {/* Terminal strip */}
            <div className="relative z-10 flex items-center justify-between border-t border-border/50 px-6 py-3">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                    <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                </div>
                <FiTerminal
                    size={14}
                    aria-hidden="true"
                    className="text-muted-foreground/40"
                />
            </div>
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */
function StatCard({ stat, index, icon: Icon }) {
    return (
        <motion.div
            variants={fadeUp}
            className="group/stat relative flex flex-col gap-3 rounded-lg border border-border/50 bg-card/30 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/60"
        >
            {/* Icon chip */}
            <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-primary transition-colors duration-300 group-hover/stat:border-primary/40 group-hover/stat:bg-primary/10">
                    <Icon size={14} aria-hidden="true" />
                </div>
                <span className="font-code text-[10px] tabular-nums text-muted-foreground/40">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <div>
                <p className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                </p>
                <p className="mt-1 font-code text-[10px] uppercase leading-5 tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                </p>
            </div>

            {/* Bottom hover accent */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/stat:opacity-100"
            />
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  Editorial Content Column                                           */
/* ------------------------------------------------------------------ */
function ContentPanel({ about }) {
    const {
        role,
        bio,
        coreStack,
        stats,
        ctaText,
        ctaUrl,
        roleLabel,
        stackLabel,
    } = about;

    const statIcons = [FiAward, FiCode, FiTrendingUp];

    return (
        <div className="space-y-6">
            {/* --- Bio card --- */}
            <ScrollReveal className={cardChrome}>
                <CardAmbientGlow />
                <CardAccents inset="inset-x-7 sm:inset-x-10" />

                <div className="relative z-10 p-7 sm:p-10">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-px w-8 bg-primary/60" />
                        <p className="font-code text-[11px] font-medium uppercase tracking-[0.24em] text-primary">
                            {roleLabel || role}
                        </p>
                    </div>

                    {/* Markdown content */}
                    <div className={`mt-8 max-w-2xl ${markdownStyles}`}>
                        <MarkdownRenderer content={bio} />
                    </div>
                </div>
            </ScrollReveal>

            {/* --- Stats row --- */}
            {stats?.length > 0 && (
                <motion.div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {stats.slice(0, 3).map((stat, index) => (
                        <StatCard
                            key={stat.label || index}
                            stat={stat}
                            index={index}
                            icon={statIcons[index] || FiAward}
                        />
                    ))}
                </motion.div>
            )}

            {/* --- Stack + CTA combined card --- */}
            <ScrollReveal delay={0.12} className={cardChrome}>
                <CardAmbientGlow />
                <CardAccents inset="inset-x-7 sm:inset-x-10" />

                <div className="relative z-10 p-7 sm:p-10">
                    {/* Stack */}
                    {coreStack?.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between gap-4">
                                <p className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    {stackLabel}
                                </p>
                                <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {String(coreStack.length).padStart(2, "0")} technologies
                                </span>
                            </div>

                            <motion.div
                                className="mt-5 flex flex-wrap gap-2"
                                variants={stagger}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {coreStack.map((item) => (
                                    <motion.span
                                        key={item}
                                        variants={fadeUp}
                                        className="group/tag inline-flex items-center gap-1.5 border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary/90"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="h-1 w-1 rounded-full bg-primary/40 transition-colors duration-300 group-hover/tag:bg-primary"
                                        />
                                        {item}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* CTA */}
                    {ctaText && ctaUrl && (
                        <motion.div
                            className="mt-8 flex flex-col items-start gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between"
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                        >
                            <div>
                                <p className="font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                                    Ready to build?
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Let&apos;s turn your idea into something real.
                                </p>
                            </div>

                            <Button
                                to={ctaUrl}
                                className="group/cta inline-flex items-center gap-2 clip-polygon bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_30px_-6px_theme(colors.primary/60)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                {ctaText}
                                <FiArrowUpRight
                                    size={17}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                                />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Skeleton + Error                                                   */
/* ------------------------------------------------------------------ */
function AboutSkeleton() {
    return (
        <div className="mt-16 grid items-start gap-8 lg:mt-20 lg:grid-cols-[360px_1fr]">
            <div className={`${cardChrome} h-[600px] animate-pulse`} />
            <div className="space-y-6">
                <div className={`${cardChrome} h-72 animate-pulse`} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-28 animate-pulse rounded-lg border border-border/50 bg-card/30"
                        />
                    ))}
                </div>
                <div className={`${cardChrome} h-40 animate-pulse`} />
            </div>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="mt-16 rounded-md border border-dashed border-rose-500/30 bg-rose-500/5 p-16 text-center lg:mt-20">
            <p className="font-code text-[10px] uppercase tracking-[0.24em] text-rose-500">
                Couldn&apos;t load about data
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                Please try refreshing the page.
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function About() {
    const { data, isLoading, isError } = useGetPublicAboutDataQuery();

    const about = { ...FALLBACK_ABOUT, ...(data?.data ?? data ?? {}) };

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
                        <SectionHeader label="About me" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            I turn ideas into{" "}
                            <span className="text-gradient">web experiences.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        {about.role}
                    </p>
                </ScrollReveal>

                {/* MAIN GRID — sticky sidebar + editorial column */}
                {isLoading ? (
                    <AboutSkeleton />
                ) : isError ? (
                    <ErrorState />
                ) : (
                    <div className="mt-16 grid items-start gap-8 lg:mt-20 lg:grid-cols-[360px_1fr]">
                        <ProfileCard about={about} />
                        <ContentPanel about={about} />
                    </div>
                )}
            </div>

            {/* Bottom divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
        </section>
    );
}