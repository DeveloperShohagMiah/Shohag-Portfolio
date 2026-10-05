import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
    {
        id: "project-one",
        title: "Project One",
        year: "2026",
        description:
            "A full-stack web application focused on delivering a fast, intuitive, and scalable user experience.",
        category: "Full-Stack Application",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-two",
        title: "Project Two",
        year: "2026",
        description:
            "A product interface built with responsive layouts, reusable components, and seamless interactions.",
        category: "Frontend Development",
        technologies: ["React", "JavaScript", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-three",
        title: "Project Three",
        year: "2025",
        description:
            "A data-driven application combining a clean dashboard experience with a reliable backend architecture.",
        category: "Dashboard / SaaS",
        technologies: ["React", "Node.js", "PostgreSQL"],
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-four",
        title: "Project Four",
        year: "2025",
        description:
            "An e-commerce experience designed around conversion, accessibility, and a frictionless shopping journey.",
        category: "E-Commerce",
        technologies: ["Next.js", "Stripe", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
];

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook (dependency-free, respects reduced motion)  */
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
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options }
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
/*  Shared card chrome — matches the Services section language        */
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

/* ------------------------------------------------------------------ */
/*  Ambient glow overlay — same behavior as Services cards            */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Card top hover line + corner accents (identical to Services)      */
/* ------------------------------------------------------------------ */
function CardAccents({ inset = "inset-x-7" }) {
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
/*  Featured project — Services-styled card, asymmetric layout        */
/* ------------------------------------------------------------------ */
function FeaturedProject({ project }) {
    return (
        <Reveal as="article" className={`${cardChrome} p-6 sm:p-8 lg:p-10`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-6 sm:inset-x-8 lg:inset-x-10" />

            {/* Number */}
            <div className="absolute right-6 top-6 z-20 font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/70 sm:right-8 sm:top-8">
                01
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                {/* Image */}
                <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block overflow-hidden rounded-md bg-muted lg:col-span-7 xl:col-span-8"
                >
                    <div className="aspect-[16/10]">
                        <img
                            src={project.image}
                            alt={`${project.title} preview`}
                            loading="lazy"
                            className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                        />
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/10"
                    />

                    <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-neutral-900 backdrop-blur-sm">
                            View project
                            <FiArrowUpRight size={13} aria-hidden="true" />
                        </span>
                    </div>
                </a>

                {/* Copy */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-primary" aria-hidden="true" />
                        <span className="font-code text-[11px] uppercase tracking-[0.18em] text-primary">
                            Featured
                        </span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            {project.title}
                        </a>
                    </h3>

                    <p className="mt-2 font-code text-xs text-muted-foreground">
                        {project.category} · {project.year}
                    </p>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
                        {project.description}
                    </p>

                    <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-code text-[11px] text-muted-foreground">
                        {project.technologies.map((tech, i) => (
                            <li key={tech} className="flex items-center gap-3">
                                {i > 0 && (
                                    <span aria-hidden="true" className="text-border">
                                        ·
                                    </span>
                                )}
                                <span>{tech}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex items-center gap-5">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/cta inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            View live site
                            <FiArrowUpRight
                                size={15}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                            />
                        </a>
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.title} source code on GitHub`}
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            <FiGithub size={14} aria-hidden="true" />
                            Source
                        </a>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Regular project card — image top, Services-styled card body       */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index }) {
    return (
        <Reveal as="article" delay={index * 80} className={cardChrome}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-0" />

            {/* Image */}
            <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 block overflow-hidden border-b border-border/60"
            >
                <div className="aspect-[16/10]">
                    <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/35 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-neutral-900 backdrop-blur-sm">
                        View project
                        <FiArrowUpRight size={12} aria-hidden="true" />
                    </span>
                </div>
            </a>

            {/* Body */}
            <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7">
                {/* Number (matches Services) */}
                <div className="absolute right-6 top-6 font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/70 sm:right-7 sm:top-7">
                    {String(index + 2).padStart(2, "0")}
                </div>

                <div className="flex items-baseline justify-between gap-4 pr-10">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            {project.title}
                        </a>
                    </h3>
                </div>

                <p className="mt-2 font-code text-[11px] text-muted-foreground">
                    {project.category} · {project.year}
                </p>

                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                    {project.description}
                </p>

                {/* Tags — same style as Services */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Footer links */}
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Live demo
                        <FiArrowUpRight size={13} aria-hidden="true" />
                    </a>

                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} source code on GitHub`}
                        className="inline-flex items-center gap-1.5 border border-border/70 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <FiGithub size={13} aria-hidden="true" />
                        Code
                    </a>
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function Projects() {
    const [featured, ...rest] = PROJECTS;

    return (
        <section
            id="portfolio"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glows — same as Services */}
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Heading */}
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Selected Works" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Work I&apos;m proud of.
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        Projects where design, engineering, and problem solving come
                        together to create useful digital experiences.
                    </p>
                </Reveal>

                {/* Featured project */}
                <div className="mt-16 lg:mt-24">
                    <FeaturedProject project={featured} />
                </div>

                {/* Remaining projects */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>

                {/* GitHub link */}
                <Reveal className="mt-20 border-t border-border/60 pt-8">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                        More projects on GitHub
                        <FiArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </Reveal>

                {/* Bottom divider */}
                <div className="absolute -bottom-28 h-px w-full bg-linear-to-r from-transparent via-border to-transparent sm:-bottom-36" />
            </div>
        </section>
    );
}