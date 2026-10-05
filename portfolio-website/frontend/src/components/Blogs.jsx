import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiArrowUpRight,
    FiCalendar,
    FiClock,
    FiEye,
    FiShare2,
    FiCheck,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const BLOG_POSTS = [
    {
        number: "01",
        title: "Building Modern React Applications",
        excerpt:
            "Mastering React 19 Actions and Concurrent Transitions. React 19 introduces transformative paradigms for handling async mutations natively without boilerplate state machines.",
        category: "Development",
        date: "Sep 02, 2026",
        readTime: "6 min read",
        views: 1248,
        tags: ["React", "JavaScript", "WebDev"],
        image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=85",
        slug: "#",
        featured: true,
        published: true,
    },
    {
        number: "02",
        title: "Designing Interfaces That Feel Simple",
        excerpt:
            "Why good interfaces often come down to removing unnecessary complexity and focusing on what matters.",
        category: "UI / UX",
        date: "Aug 24, 2026",
        readTime: "5 min read",
        views: 986,
        tags: ["UI/UX", "Design", "Frontend"],
        image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=85",
        slug: "#",
        featured: false,
        published: true,
    },
    {
        number: "03",
        title: "My Approach to Clean Code",
        excerpt:
            "Some principles I follow when writing code that is easier to understand, extend, and maintain.",
        category: "Engineering",
        date: "Aug 16, 2026",
        readTime: "4 min read",
        views: 742,
        tags: ["Clean Code", "JavaScript", "Engineering"],
        image:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
        slug: "#",
        featured: false,
        published: true,
    },
    {
        number: "04",
        title: "From Idea to Production",
        excerpt:
            "A look at the process I use to turn an initial idea into a polished and production-ready web experience.",
        category: "Process",
        date: "Aug 08, 2026",
        readTime: "7 min read",
        views: 531,
        tags: ["Development", "Process", "Production"],
        image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85",
        slug: "#",
        featured: false,
        published: true,
    },
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
/*  Card chrome — same DNA as Services / Projects                     */
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
/*  Meta pill — for views / date / read time                          */
/* ------------------------------------------------------------------ */
function MetaPill({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Icon size={12} aria-hidden="true" />
            {children}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Share button — with copied feedback state                         */
/* ------------------------------------------------------------------ */
function ShareButton({ post }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url:
                post.slug && post.slug !== "#"
                    ? post.slug
                    : window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* cancelled */
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${post.title}`}
            className="group/share inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
            {copied ? (
                <FiCheck size={14} className="text-primary" aria-hidden="true" />
            ) : (
                <FiShare2
                    size={14}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/share:-translate-y-0.5"
                />
            )}
            <span>{copied ? "Copied" : "Share"}</span>
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Featured post — asymmetric hero card                              */
/* ------------------------------------------------------------------ */
function FeaturedPost({ post }) {
    return (
        <Reveal as="article" className={`${cardChrome} p-6 sm:p-8 lg:p-10`}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-6 sm:inset-x-8 lg:inset-x-10" />

            {/* Number */}
            <div className="absolute right-6 top-6 z-20 font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/70 sm:right-8 sm:top-8">
                {post.number}
            </div>

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                {/* Image */}
                <a
                    href={post.slug}
                    className="relative block overflow-hidden rounded-md bg-muted lg:col-span-7 xl:col-span-7"
                >
                    <div className="aspect-[16/10]">
                        <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                        />
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/10"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />

                    <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-neutral-900 backdrop-blur-sm">
                            Read article
                            <FiArrowUpRight size={13} aria-hidden="true" />
                        </span>
                    </div>
                </a>

                {/* Copy */}
                <div className="lg:col-span-5 xl:col-span-5">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-primary" aria-hidden="true" />
                        <span className="font-code text-[11px] uppercase tracking-[0.18em] text-primary">
                            Latest post
                        </span>
                    </div>

                    {/* Category chip */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90">
                            {post.category}
                        </span>
                    </div>

                    <h3 className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl">
                        <a
                            href={post.slug}
                            className="transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            {post.title}
                        </a>
                    </h3>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
                        {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <MetaPill icon={FiCalendar}>{post.date}</MetaPill>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <MetaPill icon={FiClock}>{post.readTime}</MetaPill>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <MetaPill icon={FiEye}>{post.views} views</MetaPill>
                    </div>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center gap-6">
                        <Link
                            to={post.slug === "#" ? "#" : post.slug}
                            className="group/cta inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            Read article
                            <FiArrowRight
                                size={15}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover/cta:translate-x-1"
                            />
                        </Link>

                        <ShareButton post={post} />
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Regular post card                                                 */
/* ------------------------------------------------------------------ */
function PostCard({ post, index }) {
    return (
        <Reveal as="article" delay={index * 80} className={cardChrome}>
            <CardAmbientGlow />
            <CardAccents inset="inset-x-0" />

            {/* Image */}
            <a
                href={post.slug}
                className="relative z-10 block overflow-hidden border-b border-border/60"
            >
                <div className="aspect-[16/10]">
                    <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Number */}
                <span className="absolute left-5 top-5 border border-white/10 bg-black/40 px-3 py-1.5 font-code text-[10px] text-white/70 backdrop-blur-md">
                    {post.number}
                </span>

                {/* Category */}
                <span className="absolute bottom-4 left-4 border border-white/10 bg-black/40 px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                    {post.category}
                </span>

                {/* Hover CTA */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-neutral-900 backdrop-blur-sm">
                        Read
                        <FiArrowUpRight size={12} aria-hidden="true" />
                    </span>
                </div>
            </a>

            {/* Body */}
            <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    <a
                        href={post.slug}
                        className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                        {post.title}
                    </a>
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {post.excerpt}
                </p>

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <MetaPill icon={FiCalendar}>{post.date}</MetaPill>
                    <span aria-hidden="true" className="text-border">
                        ·
                    </span>
                    <MetaPill icon={FiClock}>{post.readTime}</MetaPill>
                    <span aria-hidden="true" className="text-border">
                        ·
                    </span>
                    <MetaPill icon={FiEye}>{post.views}</MetaPill>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    <Link
                        to={post.slug === "#" ? "#" : post.slug}
                        className="group/cta inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Read article
                        <FiArrowRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/cta:translate-x-1"
                        />
                    </Link>

                    <ShareButton post={post} />
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function Blog() {
    const [featuredPost, ...otherPosts] = BLOG_POSTS;

    return (
        <section
            id="blog"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glows — same as Services / Projects */}
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <Reveal className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                        <SectionHeader label="Blog" />

                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Thoughts &{" "}
                            <span className="text-gradient">ideas.</span>
                        </h2>

                        <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Notes about development, design, technology, and lessons
                            learned while building digital products.
                        </p>
                    </div>

                    {/* View all */}
                    <a
                        href="#"
                        className="group inline-flex w-fit items-center gap-2 border border-border/70 bg-card/30 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        View all posts
                        <FiArrowUpRight
                            size={15}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </Reveal>

                {/* FEATURED POST */}
                <div className="mt-16 lg:mt-20">
                    <FeaturedPost post={featuredPost} />
                </div>

                {/* OTHER POSTS */}
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post, index) => (
                        <PostCard key={post.number} post={post} index={index} />
                    ))}
                </div>

                {/* Bottom divider */}
                <div className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36" />
            </div>
        </section>
    );
}