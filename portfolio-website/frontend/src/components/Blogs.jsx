import React, { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiArrowUpRight,
    FiCalendar,
    FiClock,
    FiEye,
    FiShare2,
    FiCheck,
    FiBookOpen,
    FiSearch,
} from "react-icons/fi";
import { motion, useReducedMotion, useInView } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { useGetPublicBlogsQuery } from "../redux/features/publicApi";

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

function ScrollReveal({
    children,
    delay = 0,
    className = "",
    amount = 0.15,
    as: Tag = motion.div,
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
  group relative clip-polygon flex flex-col overflow-hidden
  border border-border/60 bg-card/40 backdrop-blur-md
  transition-[border-color,background-color,box-shadow,transform] duration-500 ease-out
  shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
  hover:-translate-y-1
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
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function MetaPill({ icon: Icon, children }) {
    return (
        <span className="inline-flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Icon size={12} aria-hidden="true" />
            {children}
        </span>
    );
}

function formatDate(input) {
    if (!input) return "";
    try {
        const d = new Date(input);
        if (Number.isNaN(d.getTime())) return String(input);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    } catch {
        return String(input);
    }
}

function normalizePost(raw, index) {
    const tags = Array.isArray(raw.tags)
        ? raw.tags
            .map((t) => (typeof t === "string" ? t : t?.name ?? ""))
            .filter(Boolean)
        : [];

    const date =
        raw.date || raw.publishedAt || raw.createdAt || raw.updatedAt || "";

    const readTime =
        raw.readTime ||
        raw.readingTime ||
        (raw.content
            ? `${Math.max(
                1,
                Math.ceil(String(raw.content).split(/\s+/).length / 200)
            )} min read`
            : "3 min read");

    return {
        id: raw._id || raw.id || raw.slug || `post-${index}`,
        number: raw.number || String(index + 1).padStart(2, "0"),
        title: raw.title || "Untitled post",
        excerpt: raw.excerpt || raw.description || raw.summary || "",
        category: raw.category || "General",
        date: formatDate(date),
        readTime,
        views: raw.views ?? raw.viewsCount ?? 0,
        tags,
        image: raw.image || raw.coverImage || raw.thumbnail || "",
        slug: raw.slug || raw._id || "#",
        featured: Boolean(raw.featured ?? raw.isFeatured),
        published: raw.published ?? raw.isActive ?? true,
    };
}

/* ------------------------------------------------------------------ */
/*  Share button                                                       */
/* ------------------------------------------------------------------ */
function ShareButton({ post }) {
    const [copied, setCopied] = useState(false);
    const reduced = useReducedMotion();

    const handleShare = async () => {
        const shareData = {
            title: post.title,
            text: post.excerpt,
            url:
                post.slug && post.slug !== "#"
                    ? window.location.origin + "/blogs/" + post.slug
                    : window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* cancelled */
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${post.title}`}
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
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
        </motion.button>
    );
}

/* ------------------------------------------------------------------ */
/*  Featured post                                                      */
/* ------------------------------------------------------------------ */
function FeaturedPost({ post }) {
    return (
        <ScrollReveal
            as={motion.article}
            className={`${cardChrome} p-5 sm:p-7 lg:p-9`}
        >
            <CardAmbientGlow />
            <CardAccents inset="inset-x-5 sm:inset-x-7 lg:inset-x-9" />

            {/* Number badge */}
            <div className="absolute right-5 top-5 z-20 font-code text-xs text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary/70 sm:right-7 sm:top-7">
                {post.number}
            </div>

            <div className="relative z-10 grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-10">
                {/* Image */}
                <Link
                    to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
                    className="group/image relative block overflow-hidden rounded-md bg-muted lg:col-span-7"
                >
                    <div className="aspect-[16/10]">
                        <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.03]"
                        />
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-black/10"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                    <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-5 opacity-0 transition-opacity duration-500 group-hover/image:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur-sm">
                            Read article
                            <FiArrowUpRight size={13} aria-hidden="true" />
                        </span>
                    </div>
                </Link>

                {/* Copy */}
                <div className="lg:col-span-5">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-primary" aria-hidden="true" />
                        <span className="font-code text-[11px] uppercase tracking-[0.18em] text-primary">
                            Latest post
                        </span>
                    </div>

                    {post.category && (
                        <div className="mt-5">
                            <span className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90">
                                {post.category}
                            </span>
                        </div>
                    )}

                    <h3 className="mt-5 font-display text-2xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                        <Link
                            to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
                            className="transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                        >
                            {post.title}
                        </Link>
                    </h3>

                    {post.excerpt && (
                        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground line-clamp-3">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {post.date && <MetaPill icon={FiCalendar}>{post.date}</MetaPill>}
                        {post.readTime && (
                            <>
                                <span aria-hidden="true" className="text-border">
                                    ·
                                </span>
                                <MetaPill icon={FiClock}>{post.readTime}</MetaPill>
                            </>
                        )}
                        {post.views > 0 && (
                            <>
                                <span aria-hidden="true" className="text-border">
                                    ·
                                </span>
                                <MetaPill icon={FiEye}>{post.views} views</MetaPill>
                            </>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                            {post.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="border border-border/60 bg-background/50 px-2.5 py-1 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                                >
                                    {tag}
                                </span>
                            ))}
                            {post.tags.length > 4 && (
                                <span className="border border-border/60 bg-background/50 px-2.5 py-1 font-code text-[10px] text-muted-foreground">
                                    +{post.tags.length - 4}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-7 flex items-center gap-6">
                        <Link
                            to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
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
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Regular post card                                                  */
/* ------------------------------------------------------------------ */
function PostCard({ post, index }) {
    return (
        <ScrollReveal
            as={motion.article}
            delay={index * 0.08}
            className={cardChrome}
        >
            <CardAmbientGlow />
            <CardAccents inset="inset-x-0" />

            {/* Image */}
            <Link
                to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
                className="group/image relative z-10 block overflow-hidden border-b border-border/60"
            >
                <div className="aspect-[16/10]">
                    <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.03]"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Number */}
                <span className="absolute left-4 top-4 border border-white/10 bg-black/50 px-2.5 py-1 font-code text-[10px] text-white/80 backdrop-blur-md">
                    {post.number}
                </span>

                {/* Category */}
                {post.category && (
                    <span className="absolute bottom-4 left-4 border border-white/10 bg-black/50 px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                        {post.category}
                    </span>
                )}

                {/* Hover CTA */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-500 group-hover/image:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-neutral-900 shadow-sm backdrop-blur-sm">
                        Read
                        <FiArrowUpRight size={12} aria-hidden="true" />
                    </span>
                </div>
            </Link>

            {/* Body */}
            <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                    <Link
                        to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
                        className="line-clamp-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                        {post.title}
                    </Link>
                </h3>

                {post.excerpt && (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {post.excerpt}
                    </p>
                )}

                {/* Meta row */}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                    {post.date && <MetaPill icon={FiCalendar}>{post.date}</MetaPill>}
                    {post.readTime && (
                        <>
                            <span aria-hidden="true" className="text-border">
                                ·
                            </span>
                            <MetaPill icon={FiClock}>{post.readTime}</MetaPill>
                        </>
                    )}
                    {post.views > 0 && (
                        <>
                            <span aria-hidden="true" className="text-border">
                                ·
                            </span>
                            <MetaPill icon={FiEye}>{post.views}</MetaPill>
                        </>
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="border border-border/60 bg-background/50 px-2.5 py-1 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="border border-border/60 bg-background/50 px-2.5 py-1 font-code text-[10px] text-muted-foreground">
                                +{post.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    <Link
                        to={post.slug === "#" ? "#" : `/blogs/${post.slug}`}
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
        </ScrollReveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Skeleton + Error + Empty                                          */
/* ------------------------------------------------------------------ */
function BlogSkeleton() {
    return (
        <div className="mt-16 animate-pulse lg:mt-20">
            <div className={`${cardChrome} p-9`}>
                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="aspect-[16/10] rounded-md bg-muted/30 lg:col-span-7" />
                    <div className="space-y-4 lg:col-span-5">
                        <div className="h-3 w-24 rounded bg-muted/40" />
                        <div className="h-6 w-3/4 rounded bg-muted/40" />
                        <div className="h-3 w-full rounded bg-muted/30" />
                        <div className="h-3 w-5/6 rounded bg-muted/30" />
                    </div>
                </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`${cardChrome} h-80`} />
                ))}
            </div>
        </div>
    );
}

function EmptyBlogs() {
    return (
        <div className="mt-16 rounded-md border border-dashed border-border/60 bg-card/20 p-16 text-center lg:mt-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center clip-polygon border border-primary/30 bg-primary/5 text-primary">
                <FiBookOpen size={22} aria-hidden="true" />
            </div>
            <p className="mt-5 font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                No posts yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                New articles are on the way. Check back soon.
            </p>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="mt-16 rounded-md border border-dashed border-rose-500/30 bg-rose-500/5 p-16 text-center lg:mt-20">
            <p className="font-code text-[10px] uppercase tracking-[0.24em] text-rose-500">
                Couldn&apos;t load posts
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
export default function Blog() {
    const { data, isLoading, isError } = useGetPublicBlogsQuery({ limit: 20 });

    const rawList = data?.data?.blogs ?? data?.data ?? data ?? [];

    const posts = useMemo(
        () =>
            Array.isArray(rawList)
                ? rawList
                    .map(normalizePost)
                    .filter((p) => p.published)
                    .sort((a, b) => {
                        if (a.featured !== b.featured) return a.featured ? -1 : 1;
                        return new Date(b.date || 0) - new Date(a.date || 0);
                    })
                : [],
        [rawList]
    );

    const [featuredPost, ...otherPosts] = posts;

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

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Blog" />

                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Thoughts &{" "}
                            <span className="text-gradient">ideas.</span>
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end">
                        <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
                            Notes about development, design, technology, and lessons
                            learned while building digital products.
                        </p>

                        <Link
                            to="/blogs"
                            className="group inline-flex w-fit items-center gap-2 border border-border/70 bg-card/30 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            View all posts
                            <FiArrowUpRight
                                size={15}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>
                </ScrollReveal>

                {/* CONTENT */}
                {isLoading ? (
                    <BlogSkeleton />
                ) : isError ? (
                    <ErrorState />
                ) : posts.length === 0 ? (
                    <EmptyBlogs />
                ) : (
                    <>
                        <div className="mt-16 lg:mt-20">
                            <FeaturedPost post={featuredPost} />
                        </div>

                        {otherPosts.length > 0 && (
                            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {otherPosts.map((post, index) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Bottom divider — moved to the section for correct positioning */}
            </div>

            {/* Bottom divider — correctly placed outside the content container */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
        </section>
    );
}