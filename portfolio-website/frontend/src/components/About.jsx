import React, { useEffect, useRef, useState } from "react";
import {
    FiArrowUpRight,
    FiMapPin,
    FiTerminal,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import profileImage from "../assets/about.png";
import Button from "./Button";

const STACK = [
    "React",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "Express",
];

const STATS = [
    ["06+", "Years learning & building"],
    ["40+", "Projects & experiments"],
    ["∞", "Things still to learn"],
];

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook                                             */
/* ------------------------------------------------------------------ */
function useReveal(options = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px", ...options }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [options]);

    return [ref, visible];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
    const [ref, visible] = useReveal();

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${className}`}
        >
            {children}
        </Tag>
    );
}

/* ------------------------------------------------------------------ */
/*  Card chrome — matches Services / Projects / Blog / Skills / FAQ   */
/* ------------------------------------------------------------------ */
const cardChrome = `
  group relative clip-polygon flex flex-col overflow-hidden
  border border-border/60 bg-card/40 backdrop-blur
  transition-all duration-500 ease-out
  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
  hover:-translate-y-1.5
  hover:border-primary/40
  hover:bg-card/70
  hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]
`;

function CardAmbientGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/25),transparent_70%)] blur-2xl animate-[pulseGlow_4s_ease-in-out_infinite]" />
            <div className="absolute -inset-1/2 animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/20)_60deg,transparent_120deg,theme(colors.primary/10)_240deg,transparent_360deg)] opacity-40" />
        </div>
    );
}

function CardAccents({ inset = "inset-x-6" }) {
    return (
        <>
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Profile panel (left)                                              */
/* ------------------------------------------------------------------ */
function ProfilePanel() {
    return (
        <Reveal className={`${cardChrome} min-h-[560px]`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-8 sm:inset-x-10" />

            {/* Technical grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
            />

            {/* Developer mark */}
            <div className="absolute left-8 top-8 z-20 font-code text-xs text-muted-foreground">
                DEV / 001
            </div>

            {/* Decorative dot */}
            <div className="absolute right-8 top-8 z-20 h-2 w-2 bg-primary shadow-lg shadow-primary/50" />

            <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-between p-8 sm:p-10">
                {/* Profile image */}
                <div className="flex flex-1 items-center justify-center py-12">
                    <div className="relative">
                        {/* Outer orbit */}
                        <div className="absolute -inset-8 border border-border/60" />

                        {/* Second orbit */}
                        <div className="absolute -inset-16 border border-border/25" />

                        {/* Glow */}
                        <div className="absolute inset-0 -z-10 bg-primary/20 blur-[80px] transition-colors duration-700 group-hover:bg-primary/30" />

                        {/* Photo frame */}
                        <div className="relative h-72 w-72 overflow-hidden border border-border/70 bg-muted/30 p-2 shadow-2xl shadow-primary/10 sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]">
                            <img
                                src={profileImage}
                                alt="Shohag"
                                className="h-full w-full object-cover brightness-[0.72] contrast-[1.08] saturate-[0.85] transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlays */}
                            <div className="pointer-events-none absolute inset-2 bg-muted/20" />
                            <div className="pointer-events-none absolute inset-2 bg-gradient-to-t from-muted/35 via-transparent to-transparent" />
                        </div>

                        {/* Orbit dots */}
                        <div className="absolute -right-5 top-16 h-3 w-3 bg-primary shadow-lg shadow-primary/50" />
                        <div className="absolute -bottom-2 left-12 h-2 w-2 bg-primary/60" />
                    </div>
                </div>

                {/* Profile info */}
                <div className="relative border-t border-border/70 pt-6">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
                                Shohag
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <FiMapPin size={14} aria-hidden="true" />
                                <span>Remote · Worldwide</span>
                            </div>
                        </div>

                        <FiTerminal
                            size={24}
                            aria-hidden="true"
                            className="text-muted-foreground/40"
                        />
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Content panel (right)                                             */
/* ------------------------------------------------------------------ */
function ContentPanel() {
    return (
        <Reveal delay={100} className={`${cardChrome} p-7 sm:p-10 lg:p-12`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-7 sm:inset-x-10 lg:inset-x-12" />

            {/* Intro label */}
            <p className="relative z-10 font-code text-sm font-medium uppercase tracking-[0.2em] text-primary">
                A little story of mine
            </p>

            {/* Story */}
            <div className="relative z-10 mt-8 max-w-2xl space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                    I&apos;m a full-stack developer focused on building modern web
                    applications that are simple to use, fast to load, and enjoyable to
                    interact with.
                </p>

                <p>
                    I enjoy working from the first idea all the way through development
                    and deployment — combining thoughtful UI with solid backend
                    architecture.
                </p>
            </div>

            {/* Stack */}
            <div className="relative z-10 mt-10 border-t border-border/60 pt-8">
                <div className="flex items-center justify-between gap-4">
                    <p className="font-code text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Core stack
                    </p>

                    <span className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                        {String(STACK.length).padStart(2, "0")} technologies
                    </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {STACK.map((item) => (
                        <span
                            key={item}
                            className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary/90"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-10 grid grid-cols-3 border-y border-border/60">
                {STATS.map(([value, label], index) => (
                    <div
                        key={label}
                        className={`py-6 ${index !== 0 ? "border-l border-border/60 pl-4 sm:pl-6" : ""
                            }`}
                    >
                        <p className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            {value}
                        </p>

                        <p className="mt-2 max-w-[110px] font-code text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-10">
                <Button
                    to="#contact"
                    className="group/cta inline-flex items-center gap-2 clip-polygon bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_30px_-6px_theme(colors.primary/60)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Let&apos;s work together
                    <FiArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                    />
                </Button>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function About() {
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
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="About Me" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            I turn ideas into{" "}
                            <span className="text-gradient">web experiences.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        A full-stack developer building fast, accessible products — from
                        first sketch to production launch.
                    </p>
                </Reveal>

                {/* MAIN GRID */}
                <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
                    <ProfilePanel />
                    <ContentPanel />
                </div>

                {/* Bottom divider */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36"
                />
            </div>
        </section>
    );
}