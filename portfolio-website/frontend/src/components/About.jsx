
import React from "react";
import {
    FiArrowUpRight,
    FiMapPin,
    FiTerminal,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import profileImage from "../assets/about.png";

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

export default function About() {
    return (
        <section
            id="about"
            className="relative overflow-hidden bg-background py-24 sm:py-32"
        >
            {/* Top border */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />

            <div className="pointer-events-none absolute -right-40 bottom-10 h-[320px] w-[320px] rounded-full bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* HEADER */}
                <div className="max-w-4xl">
                    <SectionHeader label="About Me" />

                    <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        I turn{" "}
                        <span className="text-gradient">
                            ideas into web experiences.
                        </span>
                    </h2>
                </div>

                {/* MAIN GRID */}
                <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

                    {/* ==========================================
                        LEFT — PROFILE / VISUAL
                    ========================================== */}
                    <div className="group relative min-h-[520px] overflow-hidden rounded-3xl border border-border bg-card">

                        {/* Technical grid */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_35%,transparent_85%)]"
                        />

                        {/* Center glow */}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px] transition-all duration-700 group-hover:bg-primary/15" />

                        {/* Decorative dot */}
                        <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />

                        {/* Developer mark */}
                        <div className="absolute left-8 top-8 font-code text-xs text-muted-foreground">
                            DEV / 001
                        </div>

                        <div className="relative flex h-full min-h-[520px] flex-col justify-between p-8 sm:p-10">


                            {/* PROFILE IMAGE */}
                            <div className="flex flex-1 items-center justify-center py-12">
                                <div className="relative">

                                    {/* Outer orbit */}
                                    <div className="absolute -inset-8 rounded-full border border-border/60" />

                                    {/* Second orbit */}
                                    <div className="absolute -inset-16 rounded-full border border-border/25" />

                                    {/* Glow */}
                                    <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-[80px]" />

                                    {/* Large photo */}
                                    <div className="relative h-72 w-72 overflow-hidden rounded-full border border-border/70 bg-muted/30 p-2 shadow-2xl shadow-primary/10 sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]">
                                        <img src={profileImage} alt="Shohag" className="h-full w-full rounded-full object-cover brightness-[0.72] contrast-[1.08] saturate-[0.85] transition-transform duration-700 group-hover:scale-105" />

                                        {/* Dark overlay */}
                                        <div className="pointer-events-none absolute inset-2 rounded-full bg-muted/20" />

                                        {/* Subtle gradient */} <div className="pointer-events-none absolute inset-2 rounded-full bg-gradient-to-t from-muted/35 via-transparent to-transparent" />
                                    </div>

                                    {/* Orbit dot */}
                                    <div className="absolute -right-5 top-16 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50" />

                                    {/* Small orbit dot */}
                                    <div className="absolute -bottom-2 left-12 h-2 w-2 rounded-full bg-primary/60" />
                                </div>
                            </div>



                            {/* PROFILE INFO */}
                            <div className="relative border-t border-border/70 pt-6">
                                <div className="flex items-end justify-between gap-4">

                                    <div>
                                        <p className="text-2xl font-semibold tracking-tight text-foreground">
                                            Shohag
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <FiMapPin size={14} />
                                            <span>Remote · Worldwide</span>
                                        </div>
                                    </div>

                                    <FiTerminal
                                        size={24}
                                        className="text-muted-foreground/40"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==========================================
                        RIGHT — CONTENT
                    ========================================== */}
                    <div className="rounded-3xl border border-border bg-card p-7 sm:p-10 lg:p-12">

                        {/* Intro label */}
                        <p className="font-code text-sm font-medium uppercase tracking-[0.2em] text-primary">
                            A little story of mine
                        </p>

                        {/* Story */}
                        <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-muted-foreground">
                            <p>
                                I&apos;m a full-stack developer focused on
                                building modern web applications that are
                                simple to use, fast to load, and enjoyable to
                                interact with.
                            </p>

                            <p>
                                I enjoy working from the first idea all the way
                                through development and deployment — combining
                                thoughtful UI with solid backend architecture.
                            </p>
                        </div>

                        {/* ======================================
                            STACK
                        ====================================== */}
                        <div className="mt-10 border-t border-border pt-8">

                            <div className="flex items-center justify-between gap-4">
                                <p className="font-code text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                    Core stack
                                </p>

                                <span className="font-code text-[10px] text-muted-foreground/50">
                                    06 technologies
                                </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {STACK.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-border bg-background/50 px-4 py-2 text-[10px] font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ======================================
                            STATS
                        ====================================== */}
                        <div className="mt-10 grid grid-cols-3 border-y border-border">

                            {STATS.map(([value, label], index) => (
                                <div
                                    key={label}
                                    className={`py-6 ${index !== 0
                                        ? "border-l border-border pl-4 sm:pl-6"
                                        : ""
                                        }`}
                                >
                                    <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                        {value}
                                    </p>

                                    <p className="mt-2 max-w-[110px] text-[11px] leading-5 text-muted-foreground">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* ======================================
                            CTA
                        ====================================== */}
                        <div className="mt-10">
                            <a
                                href="#contact"
                                className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/20"
                            >
                                Let&apos;s work together

                                <FiArrowUpRight
                                    size={17}
                                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="mt-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
        </section>
    );
}
