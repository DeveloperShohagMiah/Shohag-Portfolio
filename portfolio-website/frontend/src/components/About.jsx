
import React from "react";
import {
    FiArrowUpRight,
    FiCode,
    FiMapPin,
    FiTerminal,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";

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
            <div className="absolute inset-x-0 top-0 h-px bg-border" />

            {/* Background glow */}
            <div className="pointer-events-none absolute left-[-180px] top-1/3 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[140px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-3xl">
                        <SectionHeader label={"About Me"} />

                        <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            I turn
                            <span className="text-gradient">ideas into web experiences.</span>
                        </h2>
                    </div>
                </div>

                {/* Main */}
                <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

                    {/* ---------------------------------------------
                        LEFT — VISUAL IDENTITY
                    --------------------------------------------- */}
                    <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-border bg-card">

                        {/* Grid */}


                        <div aria-hidden="true" className="absolute inset-0  bg-[linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_40%,transparent_85%)]"></div>

                        {/* Glow */}
                        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

                        {/* Decorative circles */}
                        <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-primary" />

                        {/* Developer mark */}
                        <div className="absolute left-8 top-8 font-code text-xs text-muted-foreground">
                            DEV / 001
                        </div>

                        <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">

                            {/* Center */}
                            <div className="flex flex-1 items-center justify-center">

                                <div className="relative">

                                    {/* Outer ring */}
                                    <div className="absolute -inset-8 rounded-full border border-border/70" />
                                    <div className="absolute -inset-16 rounded-full border border-border/30" />

                                    {/* Main circle */}
                                    <div className="flex h-44 w-44 items-center justify-center rounded-full border border-primary/30 bg-background shadow-2xl shadow-primary/10 sm:h-52 sm:w-52">

                                        <div className="text-center">
                                            <FiCode
                                                className="mx-auto text-primary"
                                                size={32}
                                            />

                                            <p className="mt-4 font-code text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                                Full Stack
                                            </p>

                                            <p className="mt-1 text-lg font-semibold text-foreground">
                                                Developer
                                            </p>
                                        </div>
                                    </div>

                                    {/* Orbit dot */}
                                    <div className="absolute -right-4 top-8 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
                                </div>
                            </div>

                            {/* Bottom info */}
                            <div className="relative border-t border-border/70 pt-6">
                                <div className="flex items-end justify-between gap-4">

                                    <div>
                                        <p className="text-2xl font-semibold tracking-tight text-foreground">
                                            Shohag
                                        </p>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <FiMapPin size={14} />
                                            Remote · Worldwide
                                        </div>
                                    </div>

                                    <FiTerminal
                                        className="text-muted-foreground/40"
                                        size={24}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------
                        RIGHT — CONTENT
                    --------------------------------------------- */}
                    <div className="rounded-3xl border border-border bg-card p-7 sm:p-10 lg:p-12">

                        <p className="font-code text-sm font-medium uppercase tracking-[0.2em] text-primary">
                            A little story of mine
                        </p>

                        <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-muted-foreground">
                            <p>
                                I&apos;m a full-stack developer focused on building
                                modern web applications that are simple to use,
                                fast to load, and enjoyable to interact with.
                            </p>

                            <p>
                                I enjoy working from the first idea all the way
                                through development and deployment — combining
                                thoughtful UI with solid backend architecture.
                            </p>
                        </div>

                        {/* Stack */}
                        <div className="mt-10 border-t border-border pt-8">

                            <div className="flex items-center justify-between">
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

                        {/* Stats */}
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

                        {/* CTA */}
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
            </div>
        </section>
    );
}
