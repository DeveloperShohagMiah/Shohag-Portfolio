
import React from "react";
import { FiArrowUpRight, FiClock } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const BLOG_POSTS = [
    {
        number: "01",
        title: "Building Modern React Applications",
        excerpt:
            "A practical look at how I structure React projects to keep them scalable, maintainable, and easy to work with.",
        category: "Development",
        date: "Sep 02, 2026",
        readTime: "6 min read",
        image:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1400&q=85",
        slug: "#",
        featured: true,
    },
    {
        number: "02",
        title: "Designing Interfaces That Feel Simple",
        excerpt:
            "Why good interfaces often come down to removing unnecessary complexity and focusing on what matters.",
        category: "UI / UX",
        date: "Aug 24, 2026",
        readTime: "5 min read",
        image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85",
        slug: "#",
    },
    {
        number: "03",
        title: "My Approach to Clean Code",
        excerpt:
            "Some principles I follow when writing code that is easier to understand, extend, and maintain.",
        category: "Engineering",
        date: "Aug 16, 2026",
        readTime: "4 min read",
        image:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
        slug: "#",
    },
    {
        number: "04",
        title: "From Idea to Production",
        excerpt:
            "A look at the process I use to turn an initial idea into a polished and production-ready web experience.",
        category: "Process",
        date: "Aug 08, 2026",
        readTime: "7 min read",
        image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=85",
        slug: "#",
    },
];

export default function Blog() {
    const featuredPost = BLOG_POSTS[0];
    const otherPosts = BLOG_POSTS.slice(1);

    return (
        <section
            id="blog"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
            {/* Ambient glow */}
            <div className="pointer-events-none absolute right-[-200px] top-20 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[150px]" />

            <div className="pointer-events-none absolute bottom-[-200px] left-[-200px] h-[450px] w-[450px] rounded-full bg-primary/[0.04] blur-[140px]" />

            {/* Technical grid */}
            {/* <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:64px_64px]" /> */}

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
                    FEATURED ARTICLE
                ========================== */}

                <div className="mt-16">
                    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card/45">
                        <div className="grid lg:grid-cols-2">

                            {/* Image */}
                            <a
                                href={featuredPost.slug}
                                className="relative min-h-[320px] overflow-hidden bg-muted lg:min-h-[520px]"
                            >
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                                {/* Number */}
                                <span className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-code text-xs text-white/70 backdrop-blur-md">
                                    {featuredPost.number}
                                </span>

                                {/* Featured badge */}
                                <span className="absolute bottom-6 left-6 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-code text-[10px] uppercase tracking-[0.15em] text-primary backdrop-blur-md">
                                    Featured article
                                </span>
                            </a>

                            {/* Content */}
                            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="font-code text-[10px] uppercase tracking-[0.18em] text-primary">
                                        {featuredPost.category}
                                    </span>

                                    <span className="h-1 w-1 rounded-full bg-border" />

                                    <span className="text-xs text-muted-foreground">
                                        {featuredPost.date}
                                    </span>
                                </div>

                                <h3 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                    {featuredPost.title}
                                </h3>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                    {featuredPost.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
                                    <FiClock size={14} />

                                    <span>{featuredPost.readTime}</span>
                                </div>

                                {/* Read button */}
                                <div className="mt-9">
                                    <a
                                        href={featuredPost.slug}
                                        className="group/link inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                    >
                                        Read article

                                        <FiArrowUpRight
                                            size={16}
                                            className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div aria-hidden="true" class="pointer-events-none absolute inset-x-7 left-0 h-px bg-linear-to-r from-transparent via-foreground/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </article>
                </div>

                {/* =========================
                    OTHER POSTS
                ========================== */}

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {otherPosts.map((post) => (
                        <article
                            key={post.number}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card/45"
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

                                <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-code text-[10px] text-white/70 backdrop-blur-md">
                                    {post.number}
                                </span>
                            </a>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-code text-[10px] uppercase tracking-[0.16em] text-primary">
                                        {post.category}
                                    </span>

                                    <span className="text-[10px] text-muted-foreground">
                                        {post.date}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-foreground">
                                    {post.title}
                                </h3>

                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                    {post.excerpt}
                                </p>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                        <FiClock size={13} />
                                        {post.readTime}
                                    </div>

                                    <a
                                        href={post.slug}
                                        aria-label={`Read ${post.title}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <FiArrowUpRight
                                            size={15}
                                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div aria-hidden="true" class="pointer-events-none absolute inset-x-7 bottom-0 h-[2px] bg-linear-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </article>
                    ))}
                </div>

                {/* =========================
                    BOTTOM DIVIDER
                ========================== */}

                <div className="absolute -bottom-28 sm:-bottom-36 w-[100%]  h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
        </section>
    );
}
