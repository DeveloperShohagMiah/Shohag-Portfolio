import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FiAlertCircle,
    FiArrowLeft,
    FiArrowRight,
    FiBookmark,
    FiCalendar,
    FiCheck,
    FiChevronRight,
    FiClock,
    FiCompass,
    FiCopy,
    FiEye,
    FiHash,
    FiList,
    FiRefreshCw,
    FiShare2,
} from "react-icons/fi";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import Button from "../components/Button";
import { MarkdownRenderer } from "../components/MarkDownRenderer";
import {
    useGetBlogByIdQuery,
    useGetPublicBlogsQuery,
} from "../redux/features/publicApi";
import { normalizePost } from "../components/Blogs";

/* ========================================================================== */
/*  Helpers                                                                   */
/* ========================================================================== */
const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(date);
};

const getPlainText = (value = "") =>
    String(value)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

// unicode-aware, so Bengali (and any other) headings get usable anchors too
const slugify = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "") || "section";

const getAuthor = (author, blog = {}) => {
    const obj = author && typeof author === "object" ? author : {};
    const name =
        obj.name ||
        obj.username ||
        blog.authorName ||
        (typeof author === "string" ? author : "") ||
        "Anonymous";

    return {
        name: String(name),
        avatar: obj.avatar || obj.profileImage || obj.image || blog.authorAvatar || "",
        role: obj.role || blog.authorRole || "Author",
    };
};

/** Returns null when the payload is not a real article (e.g. an error object). */
const normalizeBlog = (blog) => {
    if (!blog || typeof blog !== "object") return null;

    const sections = Array.isArray(blog.sections)
        ? blog.sections.filter((s) => s && (s.title || s.content))
        : [];
    const content = blog.content ?? blog.body ?? blog.articleContent ?? "";

    if (!blog.title && !String(content).trim() && sections.length === 0) return null;

    const rawCategory = blog.category;
    const category =
        rawCategory && typeof rawCategory === "object"
            ? rawCategory.name || rawCategory.title || "General"
            : rawCategory || "General";

    const rawDate = blog.publishedAt || blog.createdAt || blog.updatedAt || "";

    // Reading time counts the sections too (it used to only count `content`)
    const words = getPlainText([content, ...sections.map((s) => s.content || "")].join(" "))
        .split(/\s+/)
        .filter(Boolean).length;

    return {
        title: blog.title || "Untitled article",
        excerpt: blog.excerpt || blog.summary || blog.shortDescription || "",
        content: typeof content === "string" ? content : "",
        sections,
        category: String(category),
        author: getAuthor(blog.author, blog),
        coverImage: blog.coverImage || blog.thumbnail || blog.image || blog.featuredImage || "",
        date: formatDate(rawDate),
        dateISO: rawDate && !Number.isNaN(new Date(rawDate).getTime()) ? new Date(rawDate).toISOString() : "",
        readingTime: blog.readTime || blog.readingTime || `${Math.max(1, Math.ceil(words / 200))} min read`,
        views: Number(blog.views ?? blog.viewsCount ?? 0) || 0,
        tags: Array.isArray(blog.tags)
            ? blog.tags.map((t) => (typeof t === "string" ? t : t?.name ?? "")).filter(Boolean)
            : [],
    };
};

/* Reading styles for the markdown output */
const proseStyles = `
  [&_p]:mb-6 [&_p]:text-base [&_p]:leading-[1.95] [&_p]:text-muted-foreground sm:[&_p]:text-[17px]
  [&_strong]:font-semibold [&_strong]:text-foreground
  [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/30 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-primary
  [&_h2]:mb-5 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground sm:[&_h2]:text-3xl
  [&_h3]:mb-4 [&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-foreground
  [&_h4]:mb-3 [&_h4]:mt-8 [&_h4]:font-semibold [&_h4]:text-foreground
  [&_blockquote]:my-9 [&_blockquote]:rounded-r-2xl [&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.06] [&_blockquote]:px-6 [&_blockquote]:py-5 [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:leading-8 [&_blockquote]:text-foreground
  [&_blockquote_p]:mb-0 [&_blockquote_p]:text-foreground
  [&_code]:rounded-md [&_code]:border [&_code]:border-border/70 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-code [&_code]:text-[0.88em] [&_code]:text-foreground
  [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border/70 [&_pre]:bg-zinc-950 [&_pre]:p-5 [&_pre]:text-[13px] [&_pre]:leading-7 [&_pre]:text-zinc-100 [&_pre]:shadow-[var(--elev-md)] sm:[&_pre]:p-6
  [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
  [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-7 [&_ol]:list-decimal [&_ol]:pl-6
  [&_li]:mb-2.5 [&_li]:pl-1 [&_li]:leading-8 [&_li]:text-muted-foreground [&_li]:marker:text-primary
  [&_hr]:my-12 [&_hr]:border-border
  [&_img]:my-9 [&_img]:rounded-2xl [&_img]:border [&_img]:border-border/60 [&_img]:shadow-[var(--elev-md)]
  [&_table]:my-8 [&_table]:w-full [&_table]:text-sm [&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-foreground [&_td]:border-b [&_td]:border-border/60 [&_td]:px-3 [&_td]:py-2 [&_td]:text-muted-foreground
`;

/* ========================================================================== */
/*  Small building blocks                                                     */
/* ========================================================================== */
/* 1px gradient border + solid body (same card language as the other sections) */
function Frame({ children, className = "", bodyClassName = "" }) {
    return (
        <div
            className={`rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-md)] ${className}`}
        >
            <div className={`relative h-full overflow-hidden rounded-[calc(1.75rem-1px)] bg-card ${bodyClassName}`}>
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
                />
                {children}
            </div>
        </div>
    );
}

function Avatar({ author, className = "h-11 w-11 text-base" }) {
    const initial = author.name.trim().charAt(0).toUpperCase() || "A";
    return (
        <span
            className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-primary/60 to-primary font-semibold text-primary-foreground ring-2 ring-card ${className}`}
        >
            {author.avatar ? (
                <img src={author.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
                initial
            )}
        </span>
    );
}

function ShareRow({ title, url, copyState, onCopy }) {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    const links = [
        { label: "X", icon: FaXTwitter, href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
        { label: "LinkedIn", icon: FaLinkedinIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
        { label: "Facebook", icon: FaFacebookF, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
        { label: "WhatsApp", icon: FaWhatsapp, href: `https://wa.me/?text=${t}%20${u}` },
    ];

    const item =
        "grid h-10 flex-1 cursor-pointer place-items-center rounded-xl border border-border/70 bg-background/50 text-muted-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground";

    return (
        <div className="flex gap-2">
            {links.map(({ label, icon: Icon, href }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${label}`}
                    className={`${item} ${FOCUS}`}
                >
                    <Icon size={14} />
                </a>
            ))}
            <button
                type="button"
                onClick={onCopy}
                aria-label="Copy link"
                className={`${item} ${FOCUS}`}
            >
                {copyState === "copied" ? <FiCheck size={14} /> : <FiCopy size={14} />}
            </button>
        </div>
    );
}

function TocList({ headings, activeId }) {
    return (
        <ul className="border-l border-border/70">
            {headings.map((h) => {
                const active = h.id === activeId;
                return (
                    <li key={h.id}>
                        <a
                            href={`#${h.id}`}
                            aria-current={active ? "location" : undefined}
                            className={`-ml-px block border-l-2 py-1.5 pr-2 text-[13px] leading-5 transition-colors duration-300 ${h.level === 3 ? "pl-7" : "pl-4"
                                } ${active
                                    ? "border-primary font-medium text-primary"
                                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                                } ${FOCUS}`}
                        >
                            {h.text}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

/* ========================================================================== */
/*  Page-level states                                                         */
/* ========================================================================== */
function StateShell({ children }) {
    return (
        <main className="grid min-h-screen place-items-center bg-background px-5 py-24 text-foreground">
            {children}
        </main>
    );
}

function LoadingState() {
    const bar = "animate-pulse rounded-full bg-muted";
    return (
        <main className="min-h-screen bg-background text-foreground" role="status" aria-busy="true">
            <span className="sr-only">Loading article…</span>
            <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
                <div className={`${bar} h-3 w-40`} />
                <div className="mt-8 max-w-4xl space-y-4">
                    <div className={`${bar} h-5 w-64`} />
                    <div className="h-12 w-full animate-pulse rounded-2xl bg-muted sm:h-16" />
                    <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-muted sm:h-16" />
                    <div className={`${bar} mt-6 h-3 w-3/4`} />
                </div>
                <div className="mt-14 aspect-[16/9] animate-pulse rounded-[28px] bg-muted" />
            </div>
        </main>
    );
}

function ErrorState({ onRetry }) {
    return (
        <StateShell>
            <Frame className="w-full max-w-md" bodyClassName="p-8 text-center sm:p-10">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive">
                    <FiAlertCircle size={24} aria-hidden="true" />
                </div>
                <h1 className="mt-6 text-2xl font-semibold tracking-tight">We couldn&apos;t load this story</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    The server may be temporarily unavailable. Please check your connection and try again.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => onRetry()}>
                        <FiRefreshCw size={14} aria-hidden="true" />
                        Try again
                    </Button>
                    <Button to="/" variant="outline">
                        All articles
                    </Button>
                </div>
            </Frame>
        </StateShell>
    );
}

function NotFoundState() {
    return (
        <StateShell>
            <div className="max-w-lg text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/5 text-primary">
                    <FiCompass size={24} aria-hidden="true" />
                </div>
                <p className="mt-6 font-code text-sm text-muted-foreground">404 · Article not found</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Lost in the <span className="text-gradient">pages?</span>
                </h1>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                    This article may have been moved, renamed, or is no longer available.
                </p>
                <div className="mt-8 flex justify-center">
                    <Button to="/">
                        <FiArrowLeft size={15} aria-hidden="true" />
                        Back to articles
                    </Button>
                </div>
            </div>
        </StateShell>
    );
}

/* ========================================================================== */
/*  Article body                                                              */
/* ========================================================================== */
function ArticleContent({ content, sections }) {
    if (sections.length > 0) {
        return (
            <div className="space-y-4">
                {sections.map((section, i) => (
                    <section key={section._id || section.id || i}>
                        {section.title && <h2>{section.title}</h2>}
                        {section.content && <MarkdownRenderer content={section.content} />}
                    </section>
                ))}
            </div>
        );
    }

    if (content.trim()) return <MarkdownRenderer content={content} />;

    return <p className="italic">No article content is available yet.</p>;
}

function RelatedCard({ post }) {
    const href = post.slug === "#" ? "#" : `/blogs/${post.slug}`;
    const [failed, setFailed] = useState(false);

    return (
        <article className="group/rel relative h-full">
            <div className="h-full rounded-[24px] bg-linear-to-b from-border via-border/40 to-border/10 p-px transition-all duration-500 group-hover/rel:-translate-y-1 group-hover/rel:from-primary/50 group-hover/rel:shadow-[var(--elev-md)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background">
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-card">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-border/50 bg-muted/40">
                        {post.image && !failed ? (
                            <img
                                src={post.image}
                                alt=""
                                loading="lazy"
                                onError={() => setFailed(true)}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover/rel:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-linear-to-br from-primary/25 via-transparent to-primary/10" />
                        )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-medium text-primary">{post.category}</p>
                        <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover/rel:text-primary">
                            <Link
                                to={href}
                                className="line-clamp-2 block focus-visible:outline-none after:absolute after:inset-0"
                            >
                                {post.title}
                            </Link>
                        </h3>
                        <p className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
                            {post.date && <span>{post.date}</span>}
                            {post.readTime && <span>{post.readTime}</span>}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

/* ========================================================================== */
/*  Page                                                                      */
/* ========================================================================== */
export default function BlogDetails() {
    const { slug } = useParams();

    const [copyState, setCopyState] = useState("idle"); // idle | copied | failed
    const [bookmarked, setBookmarked] = useState(false);
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [coverFailed, setCoverFailed] = useState(false);

    const articleRef = useRef(null);
    const progressRef = useRef(null);
    const barRef = useRef(null);
    const copyTimer = useRef(null);

    const { data, isLoading, isFetching, isError, error, refetch } = useGetBlogByIdQuery(slug, {
        skip: !slug,
    });
    const { data: listData } = useGetPublicBlogsQuery({ limit: 20 }); // same args as the Blog section → shared cache

    const payload = data?.data?.blog ?? data?.data ?? data?.blog ?? data;
    const blog = useMemo(() => normalizeBlog(payload), [payload]);
    const ready = Boolean(blog);

    const related = useMemo(() => {
        const list = Array.isArray(listData?.data?.blogs) ? listData.data.blogs : [];
        return list
            .map(normalizePost)
            .filter((p) => p.published && p.slug !== slug && p.slug !== "#")
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 3);
    }, [listData, slug]);

    const bookmarkKey = `shohag-bookmark-${slug || "article"}`;
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    /* ----------------------------- page effects ----------------------------- */
    useEffect(() => {
        window.scrollTo({ top: 0 });
        setCoverFailed(false);
    }, [slug]);

    useEffect(() => {
        if (!blog?.title) return undefined;
        const previous = document.title;
        document.title = `${blog.title} — Shohag`;
        return () => {
            document.title = previous;
        };
    }, [blog?.title]);

    useEffect(() => {
        try {
            setBookmarked(localStorage.getItem(bookmarkKey) === "true");
        } catch {
            setBookmarked(false);
        }
    }, [bookmarkKey]);

    useEffect(() => () => clearTimeout(copyTimer.current), []);

    /* Reading progress + sticky-bar title — written straight to the DOM, so the
       (heavy) markdown content never re-renders while scrolling. */
    useEffect(() => {
        if (!ready) return undefined;
        let raf = 0;

        const update = () => {
            raf = 0;
            const y = window.scrollY;
            const article = articleRef.current;
            let p = 0;

            if (article) {
                const r = article.getBoundingClientRect();
                const total = r.height - window.innerHeight * 0.5;
                p = total > 0 ? (window.innerHeight * 0.25 - r.top) / total : 0;
            }
            p = Math.min(1, Math.max(0, p));

            if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
            if (barRef.current) barRef.current.dataset.scrolled = y > 360 ? "true" : "false";
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [ready]);

    /* Table of contents — built from the real rendered headings (h2/h3), so it
       works for markdown content AND for `sections`, with no renderer changes. */
    useEffect(() => {
        if (!ready) return undefined;
        const root = articleRef.current;
        if (!root) return undefined;

        const scan = () => {
            const used = new Set();
            const list = [...root.querySelectorAll("h2, h3")]
                .filter((el) => el.textContent?.trim())
                .map((el) => {
                    const base = el.id || slugify(el.textContent);
                    let id = base;
                    let n = 2;
                    while (used.has(id)) id = `${base}-${n++}`;
                    used.add(id);
                    el.id = id;
                    el.style.scrollMarginTop = "7rem";
                    return { id, text: el.textContent.trim(), level: el.tagName === "H2" ? 2 : 3 };
                });

            setHeadings((prev) => (JSON.stringify(prev) === JSON.stringify(list) ? prev : list));
        };

        scan();
        const raf = requestAnimationFrame(scan); // once more, in case the renderer finished late
        return () => cancelAnimationFrame(raf);
    }, [ready, blog]);

    useEffect(() => {
        if (!headings.length || typeof IntersectionObserver === "undefined") return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible) setActiveId(visible.target.id);
            },
            { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [headings]);

    /* ------------------------------- actions -------------------------------- */
    const toggleBookmark = () => {
        const next = !bookmarked;
        setBookmarked(next);
        try {
            localStorage.setItem(bookmarkKey, String(next));
        } catch {
            /* storage blocked — bookmark still works for this visit */
        }
    };

    const copyLink = async () => {
        clearTimeout(copyTimer.current);
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }
        copyTimer.current = setTimeout(() => setCopyState("idle"), 2200);
    };

    const share = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: getPlainText(blog.excerpt).slice(0, 140),
                    url: window.location.href,
                });
                return;
            } catch (err) {
                if (err?.name === "AbortError") return; // user closed the share sheet
            }
        }
        const u = encodeURIComponent(window.location.href);
        const t = encodeURIComponent(blog.title);
        window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, "_blank", "noopener,noreferrer");
    };

    /* ------------------------------ page states ----------------------------- */
    if (isLoading) return <LoadingState />;
    if (isError && error?.status === 404) return <NotFoundState />;
    if (isError) return <ErrorState onRetry={refetch} />;
    if (!blog) return <NotFoundState />;

    const metaItems = [
        blog.date && { icon: FiCalendar, text: blog.date, time: blog.dateISO },
        blog.readingTime && { icon: FiClock, text: blog.readingTime },
        blog.views > 0 && { icon: FiEye, text: `${compact.format(blog.views)} views` },
    ].filter(Boolean);

    const iconBtn = `grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-foreground/[0.06] hover:text-foreground ${FOCUS}`;

    return (
        <main className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground">
            {/* soft light behind the hero (a single glow — no grid, nothing fixed) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 70% at 50% 0%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)",
                }}
            />

            {/* reading progress */}
            <div
                className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
                role="progressbar"
                aria-label="Reading progress"
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    ref={progressRef}
                    className="h-full origin-left bg-linear-to-r from-primary to-chart-2 shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
                    style={{ transform: "scaleX(0)" }}
                />
            </div>

            {/* floating bar — the title slides in once the hero has scrolled away */}
            <div className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
                <div
                    ref={barRef}
                    data-scrolled="false"
                    className="group/bar mx-auto max-w-6xl rounded-full bg-linear-to-b from-border via-border/50 to-border/20 p-px shadow-[var(--elev-md)]"
                >
                    <div className="flex items-center justify-between gap-3 rounded-full bg-background/80 py-1.5 pl-1.5 pr-2 backdrop-blur-xl sm:pr-3">
                        <Link
                            to="/"
                            className={`group/back flex shrink-0 items-center gap-2.5 rounded-full py-0.5 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
                        >
                            <span className="grid h-9 w-9 place-items-center rounded-full border border-border/70 bg-card text-foreground transition-all duration-300 group-hover/back:border-primary/40 group-hover/back:bg-primary group-hover/back:text-primary-foreground">
                                <FiArrowLeft size={15} aria-hidden="true" />
                            </span>
                            <span className="hidden sm:inline">All articles</span>
                        </Link>

                        <p
                            aria-hidden="true"
                            className="min-w-0 flex-1 translate-y-1 truncate text-center text-sm font-medium text-foreground/90 opacity-0 transition-all duration-500 group-data-[scrolled=true]/bar:translate-y-0 group-data-[scrolled=true]/bar:opacity-100"
                        >
                            {blog.title}
                        </p>

                        <div className="flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                onClick={toggleBookmark}
                                aria-pressed={bookmarked}
                                aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
                                className={`${iconBtn} ${bookmarked ? "text-primary" : ""}`}
                            >
                                <FiBookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                            </button>
                            <button
                                type="button"
                                onClick={copyLink}
                                aria-label="Copy link"
                                className={`${iconBtn} hidden sm:grid`}
                            >
                                {copyState === "copied" ? (
                                    <FiCheck size={16} className="text-primary" />
                                ) : (
                                    <FiCopy size={16} />
                                )}
                            </button>
                            <Button size="sm" onClick={share} className="ml-1">
                                Share
                                <FiShare2 size={13} aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </div>
                <span className="sr-only" role="status" aria-live="polite">
                    {copyState === "copied" ? "Link copied" : copyState === "failed" ? "Couldn't copy the link" : ""}
                </span>
            </div>

            {/* ------------------------------- hero ------------------------------- */}
            <header className="mx-auto max-w-6xl px-5 pb-4 pt-14 sm:px-8 sm:pt-20">
                <nav aria-label="Breadcrumb" className="animate-fade-up">
                    <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <li>
                            <Link to="/" className={`transition-colors hover:text-foreground ${FOCUS}`}>
                                Home
                            </Link>
                        </li>
                        <FiChevronRight size={12} aria-hidden="true" className="text-border" />
                        <li>
                            <Link to="" className={`transition-colors hover:text-foreground ${FOCUS}`}>
                                Blog
                            </Link>
                        </li>
                        <FiChevronRight size={12} aria-hidden="true" className="text-border" />
                        <li className="font-medium text-foreground/80">{blog.category}</li>
                    </ol>
                </nav>

                <div className="mt-8 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 animate-fade-up" style={{ animationDelay: "60ms" }}>
                        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {blog.category}
                        </span>
                        {metaItems.map(({ icon: Icon, text, time }) => (
                            <span key={text} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Icon size={13} aria-hidden="true" className="text-primary/70" />
                                {time ? <time dateTime={time}>{text}</time> : text}
                            </span>
                        ))}
                    </div>

                    <h1
                        className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem] animate-fade-up"
                        style={{ animationDelay: "120ms" }}
                    >
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <div
                            className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg [&_a]:font-medium [&_a]:text-primary [&_p]:m-0 animate-fade-up"
                            style={{ animationDelay: "180ms" }}
                        >
                            <MarkdownRenderer content={blog.excerpt} />
                        </div>
                    )}

                    <div className="mt-8 flex items-center gap-3.5 animate-fade-up" style={{ animationDelay: "240ms" }}>
                        <Avatar author={blog.author} />
                        <div>
                            <p className="text-sm font-semibold text-foreground">{blog.author.name}</p>
                            <p className="text-xs text-muted-foreground">{blog.author.role}</p>
                        </div>
                    </div>
                </div>

                {blog.coverImage && !coverFailed && (
                    <div className="relative mt-12 sm:mt-14 animate-fade-up" style={{ animationDelay: "300ms" }}>
                        {/* blurred copy of the cover glows behind the frame */}
                        <img
                            src={blog.coverImage}
                            alt=""
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-8 -bottom-4 top-8 -z-10 h-[calc(100%-2rem)] w-[calc(100%-4rem)] rounded-3xl object-cover opacity-40 blur-3xl saturate-150"
                        />
                        <div className="rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-lg)]">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-[calc(1.75rem-1px)] bg-muted">
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    fetchPriority="high"
                                    onError={() => setCoverFailed(true)}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ------------------------------ content ----------------------------- */}
            <section className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
                <div className="grid gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
                    {/* sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            {headings.length > 0 && (
                                <Frame bodyClassName="p-5">
                                    <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <FiList size={14} aria-hidden="true" className="text-primary" />
                                        In this article
                                    </p>
                                    <nav aria-label="Article contents">
                                        <TocList headings={headings} activeId={activeId} />
                                    </nav>
                                </Frame>
                            )}

                            <Frame bodyClassName="p-5">
                                <p className="mb-3 text-sm font-semibold text-foreground">Share this story</p>
                                <ShareRow title={blog.title} url={pageUrl} copyState={copyState} onCopy={copyLink} />
                            </Frame>

                            <button
                                type="button"
                                onClick={toggleBookmark}
                                aria-pressed={bookmarked}
                                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-colors duration-300 ${FOCUS} ${bookmarked
                                    ? "border-primary/30 bg-primary/10 text-primary"
                                    : "border-border/70 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                    }`}
                            >
                                {bookmarked ? <FiCheck size={15} /> : <FiBookmark size={15} />}
                                {bookmarked ? "Saved for later" : "Save for later"}
                            </button>
                        </div>
                    </aside>

                    {/* article */}
                    <div className="min-w-0">
                        {headings.length > 0 && (
                            <details className="group mb-10 rounded-2xl border border-border/70 bg-card lg:hidden">
                                <summary className={`flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold ${FOCUS}`}>
                                    <span className="flex items-center gap-2">
                                        <FiList size={14} aria-hidden="true" className="text-primary" />
                                        In this article
                                    </span>
                                    <FiChevronRight
                                        size={15}
                                        aria-hidden="true"
                                        className="text-muted-foreground transition-transform duration-300 group-open:rotate-90"
                                    />
                                </summary>
                                <nav aria-label="Article contents" className="px-4 pb-4">
                                    <TocList headings={headings} activeId={activeId} />
                                </nav>
                            </details>
                        )}

                        <article ref={articleRef} className={`max-w-3xl ${proseStyles}`}>
                            <ArticleContent content={blog.content} sections={blog.sections} />
                        </article>

                        {blog.tags.length > 0 && (
                            <div className="mt-14 max-w-3xl border-t border-border/60 pt-8">
                                <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <FiHash size={14} aria-hidden="true" className="text-primary" />
                                    Topics covered
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag, i) => (
                                        <li
                                            key={`${tag}-${i}`}
                                            className="rounded-full border border-border/70 bg-muted/40 px-3.5 py-1.5 font-code text-xs text-muted-foreground transition-colors duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                                        >
                                            #{tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* share on small screens (the sidebar is desktop-only) */}
                        <div className="mt-10 max-w-3xl lg:hidden">
                            <p className="mb-3 text-sm font-semibold text-foreground">Share this story</p>
                            <ShareRow title={blog.title} url={pageUrl} copyState={copyState} onCopy={copyLink} />
                        </div>

                        {/* author */}
                        <Frame className="mt-12 max-w-3xl" bodyClassName="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
                            <Avatar author={blog.author} className="h-16 w-16 text-xl" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-primary">Written by</p>
                                <h3 className="mt-1 text-lg font-semibold tracking-tight">{blog.author.name}</h3>
                                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                                    {blog.author.role} · Sharing ideas, lessons, and practical insights from the world of
                                    development.
                                </p>
                            </div>
                            <Button to="/about" variant="outline" size="sm" className="self-start sm:self-center">
                                About me
                                <FiArrowRight size={14} aria-hidden="true" />
                            </Button>
                        </Frame>
                    </div>
                </div>
            </section>

            {/* ------------------------------ related ----------------------------- */}
            {related.length > 0 && (
                <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
                    <div className="flex items-end justify-between gap-4 border-t border-border/60 pt-14">
                        <div>
                            <p className="text-sm font-medium text-primary">Keep reading</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                                More articles you might like
                            </h2>
                        </div>
                        <Link
                            to="/"
                            className={`group/all hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:inline-flex ${FOCUS}`}
                        >
                            View all
                            <FiArrowRight
                                size={14}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover/all:translate-x-1"
                            />
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {related.map((post) => (
                            <RelatedCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {/* --------------------------------- CTA ------------------------------ */}
            <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-24">
                <div className="rounded-[28px] bg-linear-to-b from-primary/40 via-border to-border/20 p-px shadow-[var(--elev-md)]">
                    <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-card p-8 sm:p-12">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-[90px]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent"
                        />
                        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="max-w-xl">
                                <p className="text-sm font-semibold text-primary">Have a project in mind?</p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Let&apos;s build <span className="text-gradient">something great.</span>
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                                    If this article was useful, imagine what we could build together.
                                </p>
                            </div>
                            <Button to="/contact" size="lg">
                                Start a conversation
                                <FiArrowRight
                                    size={17}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* If your layout already renders a footer, delete this one */}
            <footer className="border-t border-border/60">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center sm:flex-row sm:px-8 sm:text-left">
                    <Link to="/" className={`text-lg font-semibold tracking-tight text-foreground ${FOCUS}`}>
                        {"<"}
                        <span className="text-primary">shohag</span>
                        {"/>"}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Shohag. All rights reserved.
                    </p>
                </div>
            </footer>

            {isFetching && !isLoading && (
                <div className="sr-only" role="status" aria-live="polite">
                    Updating article…
                </div>
            )}
        </main>
    );
}