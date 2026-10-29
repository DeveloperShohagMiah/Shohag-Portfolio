import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    FiArrowUpRight,
    FiGithub,
    FiFolder,
    FiRefreshCw,
} from "react-icons/fi";
import {
    AnimatePresence,
    LayoutGroup,
    motion,
    useInView,
    useReducedMotion,
} from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useGetPublicProjectsQuery } from "../redux/features/publicApi";

/* ========================================================================== */
/*  Defaults — override through the `content` prop                            */
/* ========================================================================== */
const DEFAULT_CONTENT = {
    id: "portfolio",
    sectionLabel: "Selected works",
    title: "Work I'm",
    highlight: "proud of.",
    description:
        "Projects where design, engineering, and problem solving come together to create useful digital experiences.",
    featuredLabel: "Featured work",
    builtWithLabel: "Built with",
    liveLabel: "View live site",
    codeLabel: "Source",
    comingSoon: "Coming soon",
    githubCta: "More projects on GitHub",
    emptyTitle: "No projects yet",
    emptyText: "New work is on the way. Check back soon.",
    errorTitle: "Couldn't load projects",
    errorText: "Please check your connection and try again.",
};

const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* ========================================================================== */
/*  Data                                                                      */
/* ========================================================================== */
const isRealUrl = (u) => Boolean(u) && u !== "#";

export function normalizeProject(raw, index) {
    const technologies = Array.isArray(raw.stacks)
        ? raw.stacks.map((s) => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean)
        : Array.isArray(raw.technologies)
            ? raw.technologies
            : [];

    const year =
        raw.year || (raw.createdAt ? new Date(raw.createdAt).getFullYear() : "");

    const live = raw.liveLink || raw.liveUrl || "";
    const code = raw.githubLink || raw.githubUrl || "";

    return {
        id: raw._id || raw.id || raw.slug || `project-${index}`,
        title: raw.title || "Untitled project",
        year: year ? String(year) : "",
        description: raw.description || "",
        category: raw.category || "Project",
        technologies,
        image: raw.image || raw.coverImage || raw.thumbnail || "",
        liveUrl: isRealUrl(live) ? live : "",
        githubUrl: isRealUrl(code) ? code : "",
        featured: Boolean(raw.isFeatured ?? raw.featured),
        order: raw.order ?? index,
    };
}

function hostOf(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
}

/* ========================================================================== */
/*  Motion + background                                                       */
/* ========================================================================== */
function Reveal({ children, delay = 0, className = "", amount = 0.15 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: true, amount });

    return (
        <motion.div
            ref={ref}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function Backdrop() {
    const reduced = useReducedMotion();
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-primary/10 blur-[120px]"
                animate={reduced ? undefined : { x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-primary/10 blur-[120px]"
                animate={reduced ? undefined : { x: [0, -24, 0], y: [0, 24, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}

/* ========================================================================== */
/*  Card — glass surface with a cursor spotlight                              */
/* ========================================================================== */
function Card({ as: Tag = "div", children, className = "", inset = "inset-x-6" }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, []);

    const mask = "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)";

    return (
        <Tag
            ref={ref}
            onPointerMove={onMove}
            className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-20px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_28px_56px_-20px_rgba(0,0,0,0.5)] ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-primary/[0.10] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
            />
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            {children}
        </Tag>
    );
}

/* ========================================================================== */
/*  Small pieces                                                              */
/* ========================================================================== */
function MaybeLink({ href, children, className = "", ...rest }) {
    if (!href) return <div className={className}>{children}</div>;
    return (
        <a href={href} target="_blank" rel="noreferrer" className={className} {...rest}>
            {children}
        </a>
    );
}

function Cover({ project, zoom = "1.04" }) {
    const [failed, setFailed] = useState(false);
    const showImage = project.image && !failed;

    return showImage ? (
        <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            onError={() => setFailed(true)}
            style={{ "--zoom": zoom }}
            className="h-full w-full object-cover object-top transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[var(--zoom)]"
        />
    ) : (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted/40">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10" />
            <div
                aria-hidden="true"
                className="absolute inset-0 text-foreground/[0.08] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <FiFolder size={30} aria-hidden="true" className="relative text-primary/70" />
        </div>
    );
}

function BrowserFrame({ url, children }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background/60 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]">
            <div className="flex h-9 items-center gap-3 border-b border-border/60 bg-card/60 px-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <div className="mx-auto flex h-5 w-full max-w-[16rem] items-center justify-center rounded-md bg-background/70 px-3 font-code text-[10px] text-muted-foreground/70">
                    <span className="truncate">{url || "localhost:3000"}</span>
                </div>
                <span className="w-10" aria-hidden="true" />
            </div>
            {children}
        </div>
    );
}

function TechList({ items, max, className = "" }) {
    if (!items.length) return null;
    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`}>
            {items.slice(0, max).map((tech) => (
                <li
                    key={tech}
                    className="border border-border/60 rounded-full bg-muted/40 px-2.5 py-1 font-code text-[10px] text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                >
                    {tech}
                </li>
            ))}
            {items.length > max && (
                <li className="border rounded-full border-border/60 bg-muted px-2.5 py-1 font-code text-[10px] text-muted-foreground">
                    +{items.length - max}
                </li>
            )}
        </ul>
    );
}

function Pill({ children, className = "" }) {
    return (
        <span
            className={`border border-white/10 bg-black/50 px-2.5 py-1 font-code text-[10px] text-white/80 backdrop-blur-md ${className}`}
        >
            {children}
        </span>
    );
}

function ViewChip({ label, size = "md" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 font-semibold text-neutral-900 shadow-lg backdrop-blur-sm ${size === "md" ? "px-4 py-2 text-[11px]" : "px-3.5 py-1.5 text-[11]"
                }`}
        >
            {label}
            <FiArrowUpRight size={12} aria-hidden="true" />
        </span>
    );
}

/* ========================================================================== */
/*  Featured project                                                          */
/* ========================================================================== */
function FeaturedProject({ project, content }) {
    const live = Boolean(project.liveUrl);
    const code = Boolean(project.githubUrl);

    return (
        <Card as="article" inset="inset-x-6 sm:inset-x-8 lg:inset-x-10">
            {/* Meta strip */}
            <div className="relative z-10 flex items-center justify-between border-b border-border/60 px-6 py-4 sm:px-8 lg:px-10">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                        {content.featuredLabel}
                    </span>
                </div>
                <div className="flex items-center gap-3 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    {project.year && (
                        <>
                            <span>{project.year}</span>
                            <span aria-hidden="true" className="h-3 w-px bg-border/60" />
                        </>
                    )}
                    <span>{project.category}</span>
                </div>
            </div>

            <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
                {/* Screenshot */}
                <div className="lg:col-span-7">
                    <MaybeLink
                        href={project.liveUrl}
                        aria-label={live ? `View ${project.title} live site` : project.title}
                        className={`group/image relative block ${FOCUS}`}
                    >
                        <BrowserFrame url={live ? hostOf(project.liveUrl) : ""}>
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Cover project={project} zoom="1.04" />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover/image:opacity-90"
                                />
                                {live && (
                                    <>
                                        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 backdrop-blur-md">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                            <span className="font-code text-[10px] uppercase tracking-[0.16em] text-white/90">
                                                Live
                                            </span>
                                        </div>
                                        <div className="pointer-events-none absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover/image:translate-y-0 group-hover/image:opacity-100">
                                            <ViewChip label="View live" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </BrowserFrame>
                    </MaybeLink>
                </div>

                {/* Copy */}
                <div className="flex flex-col justify-center lg:col-span-5">
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-px w-6 bg-primary/60" />
                        <span className="font-code text-[10px] uppercase tracking-[0.24em] text-primary/90">
                            {project.category}
                        </span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[2.5rem]">
                        {live ? (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`transition-colors duration-300 hover:text-primary ${FOCUS}`}
                            >
                                {project.title}
                            </a>
                        ) : (
                            project.title
                        )}
                    </h3>

                    {project.description && (
                        <p className="mt-6 max-w-lg text-[15px] leading-7 text-muted-foreground">
                            {project.description}
                        </p>
                    )}

                    {project.technologies.length > 0 && (
                        <div className="mt-7">
                            <p className="mb-3 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                                {content.builtWithLabel}
                            </p>
                            <TechList items={project.technologies} max={8} className="gap-2" />
                        </div>
                    )}

                    {(live || code) && (
                        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-border/60 pt-6">
                            {live && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`group/cta inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 ${FOCUS}`}
                                >
                                    {content.liveLabel}
                                    <FiArrowUpRight
                                        size={15}
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                                    />
                                </a>
                            )}
                            {code && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${project.title} source code on GitHub`}
                                    className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
                                >
                                    <FiGithub size={14} aria-hidden="true" />
                                    {content.codeLabel}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

/* ========================================================================== */
/*  Regular project card                                                      */
/* ========================================================================== */
function ProjectCard({ project, index, content }) {
    const live = Boolean(project.liveUrl);
    const code = Boolean(project.githubUrl);

    return (
        <Card as="article" inset="inset-x-0">
            <MaybeLink
                href={project.liveUrl}
                aria-label={live ? `View ${project.title}` : project.title}
                className={`group/image relative z-10 block overflow-hidden border-b border-border/60 ${FOCUS}`}
            >
                <div className="aspect-[16/10]">
                    <Cover project={project} zoom="1.03" />
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <Pill className="absolute left-4 top-4">{String(index + 2).padStart(2, "0")}</Pill>
                {project.category && (
                    <Pill className="absolute bottom-4 left-4 uppercase tracking-[0.14em]">
                        {project.category}
                    </Pill>
                )}

                {live && (
                    <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-500 group-hover/image:opacity-100">
                        <ViewChip label="View project" size="sm" />
                    </div>
                )}
            </MaybeLink>

            <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    {live ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={`line-clamp-2 ${FOCUS}`}>
                            {project.title}
                        </a>
                    ) : (
                        <span className="line-clamp-2">{project.title}</span>
                    )}
                </h3>

                <p className="mt-2 font-code text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {[project.category, project.year].filter(Boolean).join(" · ")}
                </p>

                {project.description && (
                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {project.description}
                    </p>
                )}

                <TechList items={project.technologies} max={4} className="mt-5" />

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                    {live ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all duration-300 hover:brightness-110 ${FOCUS}`}
                        >
                            Live demo
                            <FiArrowUpRight size={13} aria-hidden="true" />
                        </a>
                    ) : (
                        <span className="inline-flex items-center rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                            {content.comingSoon}
                        </span>
                    )}

                    {code && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.title} source code on GitHub`}
                            className={`inline-flex items-center gap-1.5 rounded-xl border border-border/70 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary ${FOCUS}`}
                        >
                            <FiGithub size={13} aria-hidden="true" />
                            Code
                        </a>
                    )}
                </div>
            </div>
        </Card>
    );
}

/* ========================================================================== */
/*  States                                                                    */
/* ========================================================================== */
function ProjectsSkeleton() {
    const block = "animate-pulse rounded-xl border border-border/50 bg-card/40";
    return (
        <div className="mt-16 lg:mt-24" aria-busy="true">
            <div className={`${block} p-10`}>
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="aspect-[16/10] rounded-xl bg-muted/40 lg:col-span-7" />
                    <div className="space-y-4 lg:col-span-5">
                        <div className="h-3 w-24 rounded bg-muted/40" />
                        <div className="h-7 w-3/4 rounded bg-muted/40" />
                        <div className="h-3 w-full rounded bg-muted/40" />
                        <div className="h-3 w-5/6 rounded bg-muted/40" />
                    </div>
                </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${block} h-96`} />
                ))}
            </div>
        </div>
    );
}

const ghostBtn = `mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`;

function EmptyState({ title, text }) {
    return (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center sm:p-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary">
                <FiFolder size={22} aria-hidden="true" />
            </div>
            <p className="mt-5 font-code text-[10px] uppercase tracking-[0.24em] text-primary">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
    );
}

function ErrorState({ content, onRetry }) {
    return (
        <div
            role="alert"
            className="mt-16 rounded-xl border border-dashed border-rose-500/30 bg-rose-500/5 p-12 text-center sm:p-16 lg:mt-24"
        >
            <p className="font-code text-[10px] uppercase tracking-[0.24em] text-rose-500">
                {content.errorTitle}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{content.errorText}</p>
            {onRetry && (
                <button type="button" onClick={onRetry} className={ghostBtn}>
                    <FiRefreshCw size={14} aria-hidden="true" />
                    Try again
                </button>
            )}
        </div>
    );
}

/* ========================================================================== */
/*  Reusable section                                                          */
/* ========================================================================== */
export function ProjectsSection({
    projects: rawProjects = [],
    isLoading = false,
    isError = false,
    onRetry,
    content: contentOverride,
    githubProfileUrl = "https://github.com/",
    className = "",
}) {
    const reduced = useReducedMotion();
    const content = { ...DEFAULT_CONTENT, ...(contentOverride ?? {}) };

    const projects = useMemo(
        () =>
            (Array.isArray(rawProjects) ? rawProjects : [])
                .map(normalizeProject)
                .sort((a, b) =>
                    a.featured !== b.featured ? (a.featured ? -1 : 1) : (a.order ?? 0) - (b.order ?? 0)
                ),
        [rawProjects]
    );

    const [featured, ...rest] = projects;

    let body;
    if (isLoading) {
        body = <ProjectsSkeleton />;
    } else if (isError) {
        body = <ErrorState content={content} onRetry={onRetry} />;
    } else if (projects.length === 0) {
        body = (
            <div className="mt-16 lg:mt-24">
                <EmptyState title={content.emptyTitle} text={content.emptyText} />
            </div>
        );
    } else {
        body = (
            <LayoutGroup>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key="projects"
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="mt-16 lg:mt-24"
                    >
                        <Reveal>
                            <FeaturedProject project={featured} content={content} />
                        </Reveal>

                        {rest.length > 0 && (
                            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {rest.map((project, i) => (
                                    <Reveal key={project.id} delay={Math.min(i * 0.06, 0.4)} className="h-full">
                                        <ProjectCard project={project} index={i} content={content} />
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </LayoutGroup>
        );
    }

    return (
        <section
            id={content.id}
            className={`relative overflow-hidden bg-background py-28 sm:py-36 ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <Backdrop />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label={content.sectionLabel} title={content.title} highlight={content.highlight}></SectionHeader>

                    </div>

                </Reveal>

                {body}

                {/* GitHub */}
                {githubProfileUrl && (
                    <Reveal delay={0.1} className="mt-16 flex items-center justify-center">
                        <a
                            href={githubProfileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`group inline-flex items-center gap-2 text-sm font-medium tracking-widest bg-muted px-8 py-4 rounded-full text-foreground transition-colors hover:text-primary ${FOCUS}`}
                        >
                            <FiGithub size={16} aria-hidden="true" />
                            {content.githubCta}
                            <FiArrowUpRight
                                size={16}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </Reveal>
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
export default function Projects(props) {
    const { data, isLoading, isError, refetch } = useGetPublicProjectsQuery({ limit: 4 });

    const projects = useMemo(() => {
        const list = data?.data?.projects ?? data?.data ?? data ?? [];
        return Array.isArray(list) ? list : [];
    }, [data]);

    return (
        <ProjectsSection
            projects={projects}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            {...props}
        />
    );
}