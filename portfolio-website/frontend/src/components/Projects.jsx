import { useCallback, useMemo, useRef, useState } from "react";
import {
    FiArrowUpRight,
    FiGithub,
    FiFolder,
    FiRefreshCw,
} from "react-icons/fi";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
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
    const stackSource = Array.isArray(raw.stacks)
        ? raw.stacks
        : Array.isArray(raw.technologies)
            ? raw.technologies
            : [];

    const technologies = stackSource
        .map((s) => (typeof s === "string" ? s : s?.name ?? ""))
        .filter(Boolean);

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


/* ========================================================================== */
/*  Card                                                                      */
/*  - 1px gradient border that lights up near the cursor                      */
/*  - the static outer element owns hover; only the inner layer lifts, so the */
/*    hover area never moves out from under the pointer (no flicker)          */
/*  - body is `isolate`, spotlight sits at -z-10, so content needs no z-index */
/*    and a title link can be stretched over the whole card                   */
/* ========================================================================== */
function Card({ as: Tag = "div", children, className = "", bodyClassName = "" }) {
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
        <Tag
            ref={ref}
            onPointerMove={onMove}
            className={`group/card relative h-full ${className}`}
        >
            <div className="relative h-full rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-sm)] transition-[transform,box-shadow] duration-500 ease-out group-hover/card:-translate-y-1.5 group-hover/card:shadow-[var(--elev-lg)] motion-reduce:group-hover/card:translate-y-0 has-[[data-stretch]:focus-visible]:ring-2 has-[[data-stretch]:focus-visible]:ring-primary has-[[data-stretch]:focus-visible]:ring-offset-2 has-[[data-stretch]:focus-visible]:ring-offset-background">
                {/* border light that follows the cursor */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{
                        background:
                            "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), var(--primary), transparent 70%)",
                    }}
                />

                <div
                    className={`relative isolate flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] bg-card/95 backdrop-blur-xl ${bodyClassName}`}
                >
                    {/* spotlight */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                        style={{
                            background:
                                "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
                        }}
                    />
                    {/* top highlight */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    />
                    {children}
                </div>
            </div>
        </Tag>
    );
}

/* ========================================================================== */
/*  Small pieces                                                              */
/* ========================================================================== */
function TechList({ items, max, className = "" }) {
    if (!items.length) return null;
    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`}>
            {items.slice(0, max).map((tech) => (
                <li
                    key={tech}
                    className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-code text-[11px] text-muted-foreground transition-colors duration-300 group-hover/card:border-primary/30 group-hover/card:bg-primary/5 group-hover/card:text-primary/90"
                >
                    {tech}
                </li>
            ))}
            {items.length > max && (
                <li className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-code text-[11px] text-muted-foreground">
                    +{items.length - max}
                </li>
            )}
        </ul>
    );
}

/* Glass label that sits on top of images */
function Pill({ children, className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md ${className}`}
        >
            {children}
        </span>
    );
}

/* "View project" call-out that fades in over an image */
function ViewChip({ label, size = "md" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 font-semibold text-neutral-900 shadow-lg backdrop-blur-sm ${size === "md" ? "px-4 py-2 text-xs" : "px-3.5 py-1.5 text-[11px]"
                }`}
        >
            {label}
            <FiArrowUpRight size={12} aria-hidden="true" />
        </span>
    );
}

/* Fills its (relative) parent; designed fallback for a missing/broken image */
function Cover({ project, zoom = 1.04 }) {
    const [failed, setFailed] = useState(false);
    const showImage = project.image && !failed;

    return showImage ? (
        <img
            src={project.image}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            style={{ "--zoom": zoom }}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-(--zoom)"
        />
    ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-muted/40">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-br from-primary/25 via-transparent to-primary/10"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 text-foreground/[0.08] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <FiFolder size={32} aria-hidden="true" className="relative text-primary/70" />
        </div>
    );
}

function BrowserFrame({ url, children }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/60 shadow-[var(--elev-md)]">
            <div className="flex h-9 items-center gap-3 border-b border-border/60 bg-card/70 px-3.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <div className="mx-auto flex h-5 w-full max-w-[16rem] items-center justify-center rounded-full bg-background/70 px-3 font-code text-[10px] text-muted-foreground/70">
                    <span className="truncate">{url || "localhost:3000"}</span>
                </div>
                <span className="w-10" aria-hidden="true" />
            </div>
            {children}
        </div>
    );
}

/* ========================================================================== */
/*  Featured project                                                          */
/*  One tab stop for the whole card: the title is the link (stretched over    */
/*  the card). The Live / Source buttons sit above it with `z-20`.            */
/* ========================================================================== */
function FeaturedProject({ project, content }) {
    const live = Boolean(project.liveUrl);
    const code = Boolean(project.githubUrl);
    const meta = [project.year, project.category].filter(Boolean).join(" · ");

    return (
        <Card as="article">
            {/* Meta strip */}
            <div className="flex items-center justify-between gap-4 border-b border-border/50 px-6 py-4 sm:px-8 lg:px-10">
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-sm font-medium text-primary">{content.featuredLabel}</span>
                </div>
                {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
            </div>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
                {/* Screenshot */}
                <div className="relative lg:col-span-7">
                    {/* a blurred copy of the screenshot glows behind the frame */}
                    {project.image && (
                        <img
                            src={project.image}
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-6 -bottom-4 top-8 -z-10 h-[calc(100%-2rem)] w-[calc(100%-3rem)] rounded-3xl object-cover opacity-50 blur-3xl saturate-150 transition-opacity duration-700 group-hover/card:opacity-80"
                        />
                    )}

                    <BrowserFrame url={live ? hostOf(project.liveUrl) : ""}>
                        <div className="relative aspect-[16/10] overflow-hidden">
                            <Cover project={project} zoom={1.04} />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover/card:opacity-90"
                            />
                            {live && (
                                <>
                                    <Pill className="absolute bottom-4 left-4">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        Live
                                    </Pill>
                                    <div className="pointer-events-none absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                                        <ViewChip label="View live" />
                                    </div>
                                </>
                            )}
                        </div>
                    </BrowserFrame>
                </div>

                {/* Copy */}
                <div className="flex flex-col justify-center lg:col-span-5">
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-px w-8 bg-linear-to-r from-primary to-transparent" />
                        <span className="text-sm font-medium text-primary/90">{project.category}</span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground transition-colors duration-300 group-hover/card:text-primary sm:text-4xl lg:text-[2.5rem]">
                        {live ? (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-stretch
                                className="focus-visible:outline-none after:absolute after:inset-0"
                            >
                                {project.title}
                            </a>
                        ) : (
                            project.title
                        )}
                    </h3>

                    {project.description && (
                        <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground">
                            {project.description}
                        </p>
                    )}

                    {project.technologies.length > 0 && (
                        <div className="mt-7">
                            <p className="mb-3 text-xs font-medium text-muted-foreground/80">
                                {content.builtWithLabel}
                            </p>
                            <TechList items={project.technologies} max={8} className="gap-2" />
                        </div>
                    )}

                    {(live || code) && (
                        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/50 pt-6">
                            {live && (
                                <Button to={project.liveUrl} className="z-20">
                                    {content.liveLabel}
                                    <FiArrowUpRight
                                        size={15}
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Button>
                            )}
                            {code && (
                                <Button
                                    to={project.githubUrl}
                                    variant="outline"
                                    className="z-20"
                                    aria-label={`${project.title} source code on GitHub`}
                                >
                                    <FiGithub size={15} aria-hidden="true" />
                                    {content.codeLabel}
                                </Button>
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
/*  With a live URL the whole card is clickable through ONE stretched title   */
/*  link; the Source button sits above it with `z-20`.                        */
/* ========================================================================== */
function ProjectCard({ project, content }) {
    const live = Boolean(project.liveUrl);
    const code = Boolean(project.githubUrl);
    const meta = [project.category, project.year].filter(Boolean).join(" · ");

    return (
        <Card as="article">
            {/* Cover */}
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-border/50">
                <Cover project={project} zoom={1.05} />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent"
                />

                {project.category && <Pill className="absolute bottom-4 left-4">{project.category}</Pill>}

                {live && (
                    <div className="pointer-events-none absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
                        <ViewChip label="View project" size="sm" />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover/card:text-primary sm:text-2xl">
                    {live ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-stretch
                            className="line-clamp-2 block focus-visible:outline-none after:absolute after:inset-0"
                        >
                            {project.title}
                        </a>
                    ) : (
                        <span className="line-clamp-2">{project.title}</span>
                    )}
                </h3>

                {meta && <p className="mt-1.5 text-xs text-muted-foreground">{meta}</p>}

                {project.description && (
                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {project.description}
                    </p>
                )}

                <TechList items={project.technologies} max={4} className="mt-5" />

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/50 pt-5">
                    {live ? (
                        <span
                            aria-hidden="true"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors duration-300 group-hover/card:text-primary"
                        >
                            Live demo
                            <FiArrowUpRight
                                size={14}
                                className="transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                            />
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                            {content.comingSoon}
                        </span>
                    )}

                    {code && (
                        <Button
                            to={project.githubUrl}
                            variant="outline"
                            size="sm"
                            className="z-20"
                            aria-label={`${project.title} source code on GitHub`}
                        >
                            <FiGithub size={13} aria-hidden="true" />
                            Code
                        </Button>
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
    const block = "animate-pulse rounded-[28px] border border-border/50 bg-card/40";
    return (
        <div role="status" aria-busy="true" className="mt-16 lg:mt-24">
            <span className="sr-only">Loading projects…</span>
            <div className={`${block} p-6 sm:p-10`}>
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="aspect-[16/10] rounded-2xl bg-muted/40 lg:col-span-7" />
                    <div className="space-y-4 lg:col-span-5">
                        <div className="h-3 w-24 rounded-full bg-muted/40" />
                        <div className="h-8 w-3/4 rounded-xl bg-muted/40" />
                        <div className="h-3 w-full rounded-full bg-muted/40" />
                        <div className="h-3 w-5/6 rounded-full bg-muted/40" />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${block} h-96`} />
                ))}
            </div>
        </div>
    );
}

function EmptyState({ title, text }) {
    return (
        <div className="mt-16 lg:mt-24">
            <div className="rounded-[28px] border border-dashed border-border/60 bg-card/20 p-12 text-center sm:p-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5 text-primary">
                    <FiFolder size={22} aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}

function ErrorState({ title, text, onRetry }) {
    return (
        <div
            role="alert"
            className="mt-16 rounded-[28px] border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center sm:p-16 lg:mt-24"
        >
            <p className="text-sm font-semibold text-destructive">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
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
/*  Reusable section                                                          */
/*                                                                            */
/*  <ProjectsSection                                                          */
/*      projects={apiProjects}      // raw objects; normalised internally     */
/*      githubProfileUrl="https://github.com/you"   // null hides the button  */
/*      content={{ title: "My", highlight: "work." }}                         */
/*  />                                                                        */
/* ========================================================================== */
export function ProjectsSection({
    projects: rawProjects = [],
    isLoading = false,
    isError = false,
    onRetry,
    content: contentOverride,
    githubProfileUrl = "https://github.com/DeveloperShohagMiah",
    className = "",
}) {
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
        body = <ErrorState title={content.errorTitle} text={content.errorText} onRetry={onRetry} />;
    } else if (!featured) {
        body = <EmptyState title={content.emptyTitle} text={content.emptyText} />;
    } else {
        body = (
            <div className="mt-16 lg:mt-24">
                <Reveal>
                    <FeaturedProject project={featured} content={content} />
                </Reveal>

                {rest.length > 0 && (
                    <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {rest.map((project, i) => (
                            <Reveal key={project.id} delay={Math.min((i % 3) * 0.08, 0.24)} className="h-full">
                                <ProjectCard project={project} content={content} />
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <section
            id={content.id}
            className={`relative isolate overflow-hidden bg-background py-28 sm:py-36 ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />


            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header — `description` was unused before; it goes in as children */}
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader
                            label={content.sectionLabel}
                            title={content.title}
                            highlight={content.highlight}
                        >
                            {content.description || undefined}
                        </SectionHeader>
                    </div>
                </Reveal>

                {body}

                {githubProfileUrl && (
                    <Reveal delay={0.1} className="mt-16 flex items-center justify-center">
                        <Button to={githubProfileUrl} variant="outline" size="lg">
                            <FiGithub size={16} aria-hidden="true" />
                            {content.githubCta}
                            <FiArrowUpRight
                                size={16}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Button>
                    </Reveal>
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