import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft, ArrowUpRight, Bookmark, Check, ChevronRight,
    Clock3, Copy, Share2, AlertCircle, LoaderCircle,
    Hash, Quote, Sparkles, Eye,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useGetBlogByIdQuery } from "../redux/features/publicApi";
import { MarkdownRenderer } from "../components/MarkDownRenderer";

const cx = (...c) => c.filter(Boolean).join(" ");

/* ------------------------------ Utilities ------------------------------ */

const formatDate = (v) => {
    if (!v) return "Recently published";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return new Intl.DateTimeFormat("en", {
        month: "short", day: "numeric", year: "numeric",
    }).format(d);
};

const getPlainText = (v = "") =>
    String(v)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const estimateReadingTime = (content) => {
    const words = getPlainText(content).split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const getAuthor = (author, blog) => {
    if (author && typeof author === "object") {
        return {
            name: author.name || author.username || "Anonymous",
            avatar: author.avatar || author.profileImage || author.image || "",
            role: author.role || "Author",
        };
    }
    return {
        name: blog.authorName || (typeof author === "string" ? author : "") || "Anonymous",
        avatar: blog.authorAvatar || "",
        role: blog.authorRole || "Author",
    };
};

const normalizeBlog = (blog) => {
    if (!blog || typeof blog !== "object") return null;
    const content = blog.content ?? blog.body ?? blog.articleContent ?? "";
    const rawCat = blog.category;
    const category = rawCat && typeof rawCat === "object"
        ? rawCat.name || rawCat.title || "General"
        : rawCat || "General";

    return {
        ...blog,
        title: blog.title || "Untitled article",
        slug: blog.slug || "",
        excerpt: blog.excerpt || blog.summary || blog.shortDescription || "",
        content,
        category,
        author: getAuthor(blog.author, blog),
        coverImage: blog.coverImage || blog.thumbnail || blog.image || blog.featuredImage || "",
        publishedAt: formatDate(blog.publishedAt || blog.createdAt || blog.updatedAt),
        readingTime: blog.readTime || estimateReadingTime(content),
        tags: Array.isArray(blog.tags) ? blog.tags.filter((t) => typeof t === "string") : [],
        sections: Array.isArray(blog.sections) ? blog.sections : [],
    };
};

/* ------------------------------ Shared Bits ------------------------------ */

/** Ambient gradient mesh background — subtle, premium */
function Aurora() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(120,120,255,0.18),transparent)] blur-3xl dark:bg-[radial-gradient(closest-side,rgba(120,120,255,0.28),transparent)]" />
            <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(255,120,200,0.12),transparent)] blur-3xl dark:bg-[radial-gradient(closest-side,rgba(255,120,200,0.18),transparent)]" />
            <div className="absolute -left-40 top-2/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(120,220,255,0.12),transparent)] blur-3xl dark:bg-[radial-gradient(closest-side,rgba(120,220,255,0.16),transparent)]" />
            {/* fine grain */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
        </div>
    );
}

/** Frosted glass surface */
const glass =
    "backdrop-blur-xl bg-white/60 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_20px_60px_-30px_rgba(0,0,0,0.25)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_60px_-30px_rgba(0,0,0,0.8)]";

/** Primary gradient CTA */
const ctaBase =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight text-white transition-all duration-300 active:scale-[0.98]";
const ctaGradient =
    "bg-[linear-gradient(135deg,#0f0f10_0%,#2a2a2e_100%)] hover:bg-[linear-gradient(135deg,#000_0%,#1a1a1f_100%)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

/* ------------------------------ States ------------------------------ */

function LoadingState() {
    return (
        <main className="relative min-h-screen text-neutral-900 dark:text-neutral-100">
            <Aurora />
            <div className="mx-auto max-w-3xl px-6 py-32">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                    <LoaderCircle size={14} className="animate-spin" />
                    Preparing your reading experience
                </div>
                <div className="mt-10 space-y-4">
                    <div className="h-2 w-24 animate-pulse rounded-full bg-neutral-900/10 dark:bg-white/10" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-neutral-900/[0.06] dark:bg-white/[0.05]" />
                    <div className="h-14 w-3/4 animate-pulse rounded-xl bg-neutral-900/[0.06] dark:bg-white/[0.05]" />
                    <div className="mt-10 h-3 w-full animate-pulse rounded-full bg-neutral-900/10 dark:bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded-full bg-neutral-900/10 dark:bg-white/10" />
                    <div className="mt-12 aspect-[16/9] animate-pulse rounded-3xl bg-neutral-900/[0.06] dark:bg-white/[0.05]" />
                </div>
            </div>
        </main>
    );
}

function ErrorState({ onRetry }) {
    return (
        <main className="relative grid min-h-screen place-items-center px-6 text-neutral-900 dark:text-neutral-100">
            <Aurora />
            <div className={cx(glass, "w-full max-w-md rounded-3xl p-10 text-center")}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
                    <AlertCircle size={26} strokeWidth={1.5} />
                </div>
                <h1 className="mt-6 text-2xl font-semibold tracking-tight">
                    Something interrupted the read
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    We couldn't retrieve this story. It may have moved, or the server is catching its breath.
                </p>
                <div className="mt-8 flex justify-center gap-2">
                    <button onClick={onRetry} className={cx(ctaBase, ctaGradient)}>
                        Try again
                    </button>
                    <Link
                        to="/"
                        className={cx(
                            "inline-flex items-center rounded-full border border-neutral-900/10 px-6 py-3.5 text-sm font-medium transition hover:bg-neutral-900/[0.03] dark:border-white/15 dark:hover:bg-white/[0.04]"
                        )}
                    >
                        Browse articles
                    </Link>
                </div>
            </div>
        </main>
    );
}

function EmptyState() {
    return (
        <main className="relative grid min-h-screen place-items-center px-6 text-neutral-900 dark:text-neutral-100">
            <Aurora />
            <div className="max-w-md text-center">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500">
                    404 · Not Found
                </p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight">
                    This page<br />
                    <span className="bg-gradient-to-r from-neutral-400 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-500 dark:to-neutral-300">
                        doesn't exist.
                    </span>
                </h1>
                <p className="mt-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    The page you're looking for may have been moved, renamed, or never existed at all.
                </p>
                <Link to="/" className={cx(ctaBase, ctaGradient, "mt-8")}>
                    <ArrowLeft size={16} />
                    Back to home
                </Link>
            </div>
        </main>
    );
}

/* ------------------------------ Article ------------------------------ */

function ArticleContent({ content, sections }) {
    if (Array.isArray(sections) && sections.length > 0) {
        return (
            <div className="space-y-20">
                {sections.map((section, index) => (
                    <section
                        key={section._id || section.id || index}
                        id={section.id || `section-${index + 1}`}
                        className="scroll-mt-32"
                    >
                        <div className="mb-8 flex items-center gap-4">
                            <span className="font-mono text-[11px] tracking-widest text-neutral-400 dark:text-neutral-500">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-neutral-900/15 to-transparent dark:from-white/15" />
                        </div>
                        <h2 className="mb-8 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {section.title || `Section ${index + 1}`}
                        </h2>
                        {section.content && <MarkdownRenderer content={section.content} />}
                    </section>
                ))}
            </div>
        );
    }
    if (typeof content === "string" && content.trim()) {
        return <MarkdownRenderer content={content} />;
    }
    return null;
}

/* ------------------------------ Main ------------------------------ */

const BlogDetails = () => {
    const { slug } = useParams();
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState("");
    const [mouse, setMouse] = useState({ x: 50, y: 50 });

    const { data, isLoading, isError, refetch } = useGetBlogByIdQuery(slug, { skip: !slug });
    const currentBlog = useMemo(() => normalizeBlog(data?.data), [data]);

    /* scroll progress */
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const total = h.scrollHeight - h.clientHeight;
            setScrollProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* pointer for spotlight on cover */
    useEffect(() => {
        const onMove = (e) => {
            setMouse({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    const toc = useMemo(() => {
        if (!currentBlog) return [];
        if (currentBlog.sections.length) {
            return currentBlog.sections.map((s, i) => ({
                id: s.id || `section-${i + 1}`,
                title: s.title || `Section ${i + 1}`,
            }));
        }
        return [{ id: "article-content", title: "The Article" }];
    }, [currentBlog]);

    /* active section observer */
    useEffect(() => {
        if (!toc.length) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id));
            },
            { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
        );
        toc.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [toc]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt("Copy this article URL:", window.location.href);
        }
    };

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState onRetry={refetch} />;
    if (!currentBlog) return <EmptyState />;

    const shareUrl = encodeURIComponent(window.location.href);
    const shareTitle = encodeURIComponent(currentBlog.title);
    const socials = [
        { label: "X", icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` },
        { label: "LinkedIn", icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
        { label: "Facebook", icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    ];
    const initial = currentBlog.author.name.trim().charAt(0).toUpperCase() || "A";

    return (
        <main className="relative min-h-screen overflow-x-clip text-neutral-900 selection:bg-neutral-900 selection:text-white dark:text-neutral-100 dark:selection:bg-white dark:selection:text-neutral-900">
            <Aurora />

            {/* Progress bar */}
            <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-400 transition-[width] duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Floating top bar */}
            <div className="sticky top-0 z-40">
                <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6">
                    <div
                        className={cx(
                            glass,
                            "flex items-center justify-between rounded-full px-3 py-2 pl-4"
                        )}
                    >
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900/[0.04] ring-1 ring-black/[0.06] transition group-hover:bg-neutral-900 group-hover:text-white dark:bg-white/[0.05] dark:ring-white/10 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
                                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                            </span>
                            <span className="hidden sm:inline">All articles</span>
                        </Link>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setBookmarked(!bookmarked)}
                                aria-label="Bookmark"
                                className={cx(
                                    "flex h-9 w-9 items-center justify-center rounded-full transition",
                                    bookmarked
                                        ? "text-amber-500"
                                        : "text-neutral-500 hover:bg-neutral-900/[0.04] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-100"
                                )}
                            >
                                <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={copyLink}
                                className="flex h-9 items-center gap-2 rounded-full px-4 text-xs font-medium text-neutral-600 transition hover:bg-neutral-900/[0.04] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-100"
                            >
                                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                                {copied ? "Copied" : "Copy link"}
                            </button>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                target="_blank"
                                rel="noreferrer"
                                className={cx(ctaBase, ctaGradient, "!px-5 !py-2.5 text-xs")}
                            >
                                Share
                                <Share2 size={13} className="transition-transform group-hover:rotate-12" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <header className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
                <div className="grid grid-cols-1 gap-12 lg:items-start">
                    <div>
                        {/* Meta strip */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                            <span
                                className={cx(
                                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
                                    "bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 text-indigo-600 ring-1 ring-indigo-500/20",
                                    "dark:from-indigo-400/15 dark:to-fuchsia-400/15 dark:text-indigo-300 dark:ring-indigo-400/20"
                                )}
                            >
                                <Sparkles size={11} />
                                {currentBlog.category}
                            </span>
                            <span className="text-neutral-300 dark:text-neutral-700">·</span>
                            <span>{currentBlog.publishedAt}</span>
                            <span className="text-neutral-300 dark:text-neutral-700">·</span>
                            <span className="inline-flex items-center gap-1">
                                <Clock3 size={11} />
                                {currentBlog.readingTime}
                            </span>
                        </div>

                        <h1 className="mt-8 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
                            {currentBlog.title}
                        </h1>

                        {currentBlog.excerpt && (
                            <div className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 [&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-4 [&_p]:m-0 dark:[&_a]:text-neutral-100">
                                <MarkdownRenderer content={currentBlog.excerpt} />
                            </div>
                        )}
                    </div>


                </div>

                {/* Cover with spotlight */}
                {currentBlog.coverImage && (
                    <div className="relative mt-16">
                        <div className="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/20 to-amber-400/30 opacity-60 blur-2xl" />
                        <div
                            className="group relative overflow-hidden rounded-[2rem] ring-1 ring-black/10 dark:ring-white/10"
                            style={{
                                boxShadow:
                                    "0 40px 80px -40px rgba(0,0,0,0.45), 0 1px 0 0 rgba(255,255,255,0.4) inset",
                            }}
                        >
                            <img
                                src={currentBlog.coverImage}
                                alt={currentBlog.title}
                                className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.01]"
                            />
                            {/* spotlight following cursor */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background: `radial-gradient(600px circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.18), transparent 40%)`,
                                }}
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
                                <Sparkles size={11} />
                                Featured
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Content + Sidebar */}
            <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
                    {/* Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <div className={cx(glass, "rounded-2xl p-5")}>
                                <p className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                    On this page
                                </p>
                                <nav>
                                    <ul className="space-y-0.5">
                                        {toc.map((s, i) => {
                                            const active = activeSection === s.id;
                                            return (
                                                <li key={s.id}>
                                                    <a
                                                        href={`#${s.id}`}
                                                        className={cx(
                                                            "group flex items-center gap-3 rounded-xl px-2 py-2 text-[13px] leading-snug transition",
                                                            active
                                                                ? "bg-neutral-900/[0.04] font-medium text-neutral-900 dark:bg-white/[0.06] dark:text-neutral-100"
                                                                : "text-neutral-500 hover:bg-neutral-900/[0.03] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.04] dark:hover:text-neutral-100"
                                                        )}
                                                    >
                                                        <span
                                                            className={cx(
                                                                "h-1 w-1 rounded-full transition",
                                                                active
                                                                    ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                                                                    : "bg-neutral-300 group-hover:bg-neutral-500 dark:bg-neutral-700 dark:group-hover:bg-neutral-500"
                                                            )}
                                                        />
                                                        <span className="truncate">{s.title}</span>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>
                            </div>

                            <div className={cx(glass, "rounded-2xl p-5")}>
                                <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                                    Share
                                </p>
                                <div className="flex gap-1.5">
                                    {socials.map(({ label, icon: Icon, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Share on ${label}`}
                                            className="flex h-9 flex-1 items-center justify-center rounded-xl border border-black/[0.06] text-neutral-500 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/10 dark:text-neutral-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
                                        >
                                            <Icon size={13} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setBookmarked(!bookmarked)}
                                className={cx(
                                    "flex w-full items-center justify-center gap-2 rounded-2xl border p-4 text-sm font-medium transition",
                                    bookmarked
                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                        : cx(glass, "hover:bg-neutral-900/[0.04] dark:hover:bg-white/[0.06]")
                                )}
                            >
                                {bookmarked ? <Check size={15} /> : <Bookmark size={15} />}
                                {bookmarked ? "Saved" : "Save for later"}
                            </button>
                        </div>
                    </aside>

                    {/* Article */}
                    <article className="min-w-0">
                        <div
                            id="article-content"
                            className="scroll-mt-32 [&_p]:mb-6 [&_p]:text-[17px] [&_p]:leading-[1.8] [&_p]:text-neutral-700 [&_p]:dark:text-neutral-300 [&_a]:font-medium [&_a]:text-neutral-900 [&_a]:underline [&_a]:decoration-neutral-300 [&_a]:underline-offset-4 [&_a]:transition hover:[&_a]:decoration-neutral-900 [&_a]:dark:text-neutral-100 [&_a]:dark:decoration-neutral-700 [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_blockquote]:my-10 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-900 [&_blockquote]:bg-neutral-900/[0.03] [&_blockquote]:py-5 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-neutral-700 [&_blockquote]:dark:border-white [&_blockquote]:dark:bg-white/[0.04] [&_blockquote]:dark:text-neutral-300 [&_code]:rounded-md [&_code]:bg-neutral-900/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-neutral-800 [&_code]:dark:bg-white/[0.08] [&_code]:dark:text-neutral-200 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-[#0d0d10] [&_pre]:p-6 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_pre]:text-neutral-200 [&_pre]:shadow-2xl [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_li]:text-[17px] [&_li]:leading-relaxed [&_li]:text-neutral-700 [&_li]:dark:text-neutral-300 [&_li::marker]:text-neutral-400"
                        >
                            <ArticleContent
                                content={currentBlog.content}
                                sections={currentBlog.sections}
                            />
                        </div>

                        {/* Tags */}
                        {currentBlog.tags.length > 0 && (
                            <div className="mt-16">
                                <p className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                                    <Hash size={11} /> Filed under
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentBlog.tags.map((tag, i) => (
                                        <span
                                            key={`${tag}-${i}`}
                                            className="rounded-full border border-black/[0.08] bg-white/60 px-3.5 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur transition hover:border-neutral-900 hover:text-neutral-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white dark:hover:text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author block */}
                        <div className={cx(glass, "mt-14 flex flex-col gap-6 rounded-3xl p-7 sm:flex-row sm:items-start")}>
                            {currentBlog.author.avatar ? (
                                <img
                                    src={currentBlog.author.avatar}
                                    alt={currentBlog.author.name}
                                    className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-black/10 dark:ring-white/15"
                                />
                            ) : (
                                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xl font-semibold text-white">
                                    {initial}
                                </span>
                            )}
                            <div className="flex-1">
                                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                                    Written by
                                </p>
                                <h3 className="mt-1.5 text-lg font-semibold">{currentBlog.author.name}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                    {currentBlog.author.role}. Sharing ideas, lessons, and practical insights from the world of development.
                                </p>
                            </div>
                            <Link
                                to="/about"
                                className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-black/[0.08] px-4 py-2 text-xs font-semibold transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-white/15 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
                            >
                                Read more <ArrowUpRight size={13} />
                            </Link>
                        </div>
                    </article>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0c] p-10 text-white ring-1 ring-white/10 sm:p-16">
                    <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(120,120,255,0.35),transparent)] blur-3xl" />
                    <div className="absolute -bottom-40 right-0 h-[400px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(255,120,200,0.25),transparent)] blur-3xl" />
                    <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
                        <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                                Continue exploring
                            </p>
                            <h2 className="mt-3 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                                More stories worth your time.
                            </h2>
                        </div>
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                        >
                            Browse all articles
                            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-black/[0.06] py-10 dark:border-white/[0.06]">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6">
                    <Link to="/" className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                        BlogPedia<span className="text-indigo-500">.</span>
                    </Link>
                    <p className="font-mono uppercase tracking-[0.15em] text-[10px]">
                        Thoughts · Ideas · Stories
                    </p>
                    <p>© {new Date().getFullYear()} BlogPedia</p>
                </div>
            </footer>
        </main>
    );
};

export default BlogDetails;