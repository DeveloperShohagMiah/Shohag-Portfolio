import React, { useMemo } from "react";
import {
    FiArrowUpRight,
    FiGithub,
    FiFolder,
} from "react-icons/fi";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";
import { useGetPublicProjectsQuery } from "../redux/features/publicApi";

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

function ScrollReveal({ children, delay = 0, className = "", amount = 0.15, as: Tag = motion.div }) {
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
/*  Data normalization                                                 */
/* ------------------------------------------------------------------ */
function normalizeProject(raw, index) {
    const technologies = Array.isArray(raw.stacks)
        ? raw.stacks.map((s) => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean)
        : Array.isArray(raw.technologies)
            ? raw.technologies
            : [];

    const year =
        raw.year ||
        (raw.createdAt ? new Date(raw.createdAt).getFullYear() : new Date().getFullYear());

    return {
        id: raw._id || raw.id || raw.slug || `project-${index}`,
        title: raw.title || "Untitled project",
        year: String(year),
        description: raw.description || "",
        category: raw.category || "Project",
        technologies,
        image: raw.image || raw.coverImage || raw.thumbnail || "",
        liveUrl: raw.liveLink || raw.liveUrl || "#",
        githubUrl: raw.githubLink || raw.githubUrl || "",
        featured: Boolean(raw.isFeatured ?? raw.featured),
        order: raw.order ?? index,
    };
}

/* ------------------------------------------------------------------ */
/*  Featured project — premium                                        */
/* ------------------------------------------------------------------ */
function FeaturedProject({ project }) {
    return (
        <ScrollReveal
            as={motion.article}
            className="
        group relative clip-polygon overflow-hidden
        border border-border/60 bg-card/30 backdrop-blur-md
        transition-[border-color,box-shadow] duration-700 ease-out
        hover:border-primary/40
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_32px_64px_-24px_rgba(0,0,0,0.5),0_0_100px_-20px_theme(colors.primary/40)]
      "
        >
            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            >
                <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/20),transparent_70%)] blur-3xl" />
                <div className="absolute -inset-1/2 animate-[spin_20s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/10)_90deg,transparent_180deg,theme(colors.primary/5)_270deg,transparent_360deg)] opacity-40" />
            </div>

            {/* Corner brackets */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-10 w-10 border-l border-t border-primary/20 transition-all duration-700 group-hover:h-16 group-hover:w-16 group-hover:border-primary/60" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-10 w-10 border-b border-r border-primary/20 transition-all duration-700 group-hover:h-16 group-hover:w-16 group-hover:border-primary/60" />

            {/* Top meta strip */}
            <div className="relative z-10 flex items-center justify-between border-b border-border/50 px-6 py-4 sm:px-8 lg:px-10">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary/60)]" />
                    </span>
                    <span className="font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                        Featured Work
                    </span>
                </div>

                <div className="flex items-center gap-4 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    <span>{project.year}</span>
                    <span className="h-3 w-px bg-border/60" />
                    <span className="hidden sm:inline">{project.category}</span>
                    <span className="font-code text-[10px] text-muted-foreground/40 sm:hidden">01</span>
                </div>
            </div>

            <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
                {/* Image */}
                <div className="lg:col-span-7">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} live site`}
                        className="group/image relative block overflow-hidden rounded-lg border border-border/60 bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                        <div className="aspect-[16/10]">
                            <img
                                src={project.image}
                                alt={`${project.title} preview`}
                                loading="lazy"
                                className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.04]"
                            />
                        </div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/20"
                        />

                        <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover/image:opacity-90" />

                        {/* Live chip */}
                        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_theme(colors.emerald.400)]" />
                            <span className="font-code text-[10px] uppercase tracking-[0.16em] text-white/90">
                                Live
                            </span>
                        </div>

                        {/* View pill */}
                        <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover/image:translate-y-0 group-hover/image:opacity-100">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-4 py-2 text-[11px] font-semibold text-neutral-900 backdrop-blur-sm shadow-lg">
                                View live
                                <FiArrowUpRight size={12} aria-hidden="true" />
                            </span>
                        </div>
                    </a>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center lg:col-span-5">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-primary/60" aria-hidden="true" />
                        <span className="font-code text-[10px] uppercase tracking-[0.24em] text-primary/90">
                            {project.category}
                        </span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[2.75rem]">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            {project.title}
                        </a>
                    </h3>

                    <div className="mt-4 flex items-center gap-3">
                        <span className="font-code text-xs text-muted-foreground">
                            {project.year}
                        </span>
                        <span className="h-px w-8 bg-border/60" aria-hidden="true" />
                    </div>

                    {project.description && (
                        <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground">
                            {project.description}
                        </p>
                    )}

                    {project.technologies.length > 0 && (
                        <div className="mt-7">
                            <p className="mb-3 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                                Built with
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary/90"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-5 pt-6 border-t border-border/50">
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

                        {project.githubUrl && project.githubUrl !== "#" && (
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
                        )}
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Regular project card                                               */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, index }) {
    return (
        <ScrollReveal
            as={motion.article}
            delay={index * 0.06}
            className="
        group relative clip-polygon flex flex-col overflow-hidden
        border border-border/60 bg-card/40 backdrop-blur-md
        transition-[border-color,background-color,box-shadow] duration-500 ease-out
        hover:border-primary/40 hover:bg-card/70
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]
      "
        >
            {/* Image */}
            <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group/image relative z-10 block overflow-hidden border-b border-border/60"
            >
                <div className="aspect-[16/10]">
                    <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.03]"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/35 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover/image:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-neutral-900 backdrop-blur-sm">
                        View project
                        <FiArrowUpRight size={12} aria-hidden="true" />
                    </span>
                </div>
            </a>

            {/* Body */}
            <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7">
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

                {project.description && (
                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                        {project.description}
                    </p>
                )}

                {project.technologies.length > 0 && (
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
                )}

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

                    {project.githubUrl && project.githubUrl !== "#" && (
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
                    )}
                </div>
            </div>

            {/* Hover bottom accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-7 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            {/* Corner accents */}
            <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Skeleton + Empty                                                   */
/* ------------------------------------------------------------------ */
function ProjectsSkeleton() {
    return (
        <div className="mt-16 lg:mt-24 animate-pulse">
            <div className="clip-polygon border border-border/60 bg-card/30 p-10">
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="aspect-[16/10] bg-muted/30 rounded-lg lg:col-span-7" />
                    <div className="space-y-4 lg:col-span-5">
                        <div className="h-3 w-24 bg-muted/40 rounded" />
                        <div className="h-7 w-3/4 bg-muted/40 rounded" />
                        <div className="h-3 w-full bg-muted/30 rounded" />
                        <div className="h-3 w-5/6 bg-muted/30 rounded" />
                    </div>
                </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="clip-polygon border border-border/60 bg-card/30 h-96" />
                ))}
            </div>
        </div>
    );
}

function EmptyProjects() {
    return (
        <div className="mt-16 lg:mt-24 border border-dashed border-border/60 bg-card/20 p-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center clip-polygon border border-primary/30 bg-primary/5 text-primary">
                <FiFolder size={22} />
            </div>
            <p className="mt-5 font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                No projects yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                New work is on the way. Check back soon.
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function Projects() {
    const { data, isLoading, isError } = useGetPublicProjectsQuery({ limit: 20 });

    const rawList = data?.data?.projects ?? data?.data ?? data ?? [];
    const projects = useMemo(
        () =>
            Array.isArray(rawList)
                ? rawList
                    .map(normalizeProject)
                    .sort((a, b) => {
                        if (a.featured !== b.featured) return a.featured ? -1 : 1;
                        return (a.order ?? 0) - (b.order ?? 0);
                    })
                : [],
        [rawList]
    );

    const [featured, ...rest] = projects;

    return (
        <section
            id="portfolio"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
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
                </ScrollReveal>

                {/* CONTENT */}
                {isLoading ? (
                    <ProjectsSkeleton />
                ) : isError ? (
                    <div className="mt-16 text-center text-sm text-muted-foreground">
                        Failed to load projects. Please try again later.
                    </div>
                ) : projects.length === 0 ? (
                    <EmptyProjects />
                ) : (
                    <>
                        <div className="mt-16 lg:mt-24">
                            <FeaturedProject project={featured} />
                        </div>

                        {rest.length > 0 && (
                            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {rest.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* GitHub link */}
                <ScrollReveal
                    delay={0.1}
                    className="mt-20 border-t border-border/60 pt-8"
                >
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
                </ScrollReveal>

                <div className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36" />
            </div>
        </section>
    );
}