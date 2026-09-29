import React from "react";
import { Link } from "react-router-dom"
import {
    FiArrowRight,
    FiArrowUpRight,
    FiCalendar,
    FiClock,
    FiEye,
    FiShare2,
} from "react-icons/fi";
import { SlCalender } from "react-icons/sl"
import SectionHeader from "./SectionHeader";

const BLOG_POSTS = [
    {
        number: "01",
        title: "Building Modern React Applications",
        excerpt:
            "Mastering React 19 Actions and Concurrent Transitions React 19 introduces transformative paradigms for handling async mutations natively without boilerplate state machines. Key Primitives - useActionState: Declarative pending and error states. - useOptimistic: Instant client-side feedback before server roundtrips. ",
        category: "Development",
        date: "Sep 02, 2026",
        readTime: "6 min read",
        views: 1248,
        tags: ["React", "JavaScript", "WebDev"],
        image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1400&q=85",
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
            "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
        slug: "#",
        featured: true,
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
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
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
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=85",
        slug: "#",
        featured: false,
        published: true,
    },
];

export default function Blog() {
    const featuredPost = BLOG_POSTS[0];
    const otherPosts = BLOG_POSTS.slice(1);

    const handleShare = async (post) => {
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
            }
        } catch (error) {
            // User cancelled the share dialog.
        }
    };

    return (
        <section
            id="blog"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top Divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />


            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* =========================
                    HEADER
                ========================== */}

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                        <SectionHeader label={"Blogs"} />

                        <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Thoughts &
                            <br />
                            <span className="text-gradient">ideas.</span>
                        </h2>

                        <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Notes about development, design, technology, and
                            lessons learned while building digital products.
                        </p>
                    </div>

                    {/* View all */}
                    <a
                        href="#"
                        className="group inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/30 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    >
                        View all posts

                        <FiArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>




                {/* =========================
                    OTHER POSTS
                ========================== */}

                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {otherPosts.map((post) => (
                        <article
                            key={post.number}
                            className="
                                group
                                relative
                                flex
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-border/60
                                bg-card/40
                                backdrop-blur
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:border-border
                                hover:bg-card/45
                            "
                        >
                            {/* Image */}
                            <a
                                href={post.slug}
                                className="relative block aspect-[16/10] overflow-hidden bg-muted"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                                {/* Number */}
                                <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-code text-[10px] text-white/70 backdrop-blur-md">
                                    {post.number}
                                </span>

                                {/* Status badges */}
                                <div className="absolute right-4 top-4 flex items-center gap-2">
                                    {post.featured && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
                                            ★ Featured
                                        </span>
                                    )}

                                    {post.published && (
                                        <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
                                            Published
                                        </span>
                                    )}
                                </div>

                                {/* Category */}
                                <span className="absolute bottom-4 left-4 rounded-md bg-muted/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                                    {post.category}
                                </span>
                            </a>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6">
                                {/* Category + Date */}
                                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 w-fit rounded-full">
                                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                        <FiEye />
                                        <span className="font-code text-[10px] uppercase tracking-[0.16em]">
                                            {post.views} {" "}views
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                        <FiCalendar size={14} />
                                        <span className="font-code text-[10px] uppercase tracking-[0.16em]">
                                            {post.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground">
                                    {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                    {post.excerpt}
                                </p>

                                {/* Tags */}
                                {post.tags?.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-muted/50 px-2.5 py-1 text-[10px] text-muted-foreground"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Bottom Actions */}
                                <div className="mt-auto pt-6">
                                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                                        {/* Views */}
                                        <Link to={post.id} className="flex items-center gap-2 text-xs text-muted-foreground group group-hover:text-primary">
                                            <span>Read article</span>
                                            <FiArrowRight className="group-hover:translate-x-4" />
                                        </Link>

                                        {/* Share */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleShare(post)
                                            }
                                            className="
                                                group/share
                                                inline-flex
                                                items-center
                                                gap-2
                                                text-xs
                                                font-medium
                                                text-muted-foreground
                                                transition-colors
                                                duration-300
                                                hover:text-primary
                                            "
                                        >
                                            <FiShare2
                                                size={14}
                                                className="transition-transform duration-300 group-hover/share:-translate-y-0.5"
                                            />

                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom hover accent */}
                            <div
                                aria-hidden="true"
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-7
                                    bottom-0
                                    h-[2px]
                                    bg-linear-to-r
                                    from-transparent
                                    via-foreground/20
                                    to-transparent
                                    opacity-0
                                    transition-opacity
                                    duration-300
                                    group-hover:opacity-100
                                "
                            />
                        </article>
                    ))}
                </div>

                {/* =========================
                    BOTTOM DIVIDER
                ========================== */}

                <div className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36" />
            </div>
        </section>
    );
}