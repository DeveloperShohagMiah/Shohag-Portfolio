import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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
import { useGetPublicBlogsQuery } from "../redux/features/publicApi";

/* ========================================================================== */
/*  Defaults — override through the `content` prop                            */
/* ========================================================================== */
const DEFAULT_CONTENT = {
    id: "blog",
    sectionLabel: "Blog",
    title: "Thoughts &",
    highlight: "ideas.",
    description:
        "Notes about development, design, technology, and lessons learned while building digital products.",
    viewAllLabel: "View all posts",
    readLabel: "Read article",
    emptyTitle: "No posts yet",
    emptyText: "New articles are on the way. Check back soon.",
    errorTitle: "Couldn't load posts",
    errorText: "Please check your connection and try again.",
};

const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* ========================================================================== */
/*  Data helpers                                                              */
/* ========================================================================== */
function formatDate(input) {
    if (!input) return "";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return String(input);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function normalizePost(raw, index) {
    const tags = Array.isArray(raw.tags)
        ? raw.tags.map((t) => (typeof t === "string" ? t : t?.name ?? "")).filter(Boolean)
        : [];

    const rawDate = raw.date || raw.publishedAt || raw.createdAt || raw.updatedAt || "";
    const timestamp = rawDate ? new Date(rawDate).getTime() || 0 : 0;

    const readTime =
        raw.readTime ||
        raw.readingTime ||
        (raw.content
            ? `${Math.max(1, Math.ceil(String(raw.content).split(/\s+/).length / 200))} min read`
            : "3 min read");

    return {
        id: raw._id || raw.id || raw.slug || `post-${index}`,
        title: raw.title || "Untitled post",
        excerpt: raw.excerpt || raw.description || raw.summary || "",
        category: raw.category || "General",
        date: formatDate(rawDate),
        timestamp,
        readTime,
        views: raw.views ?? raw.viewsCount ?? 0,
        tags,
        image: raw.image || raw.coverImage || raw.thumbnail || "",
        slug: raw.slug || raw._id || "#",
        published: raw.published ?? raw.isActive ?? true,
    };
}

/* ========================================================================== */
/*  Motion helpers                                                            */
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

    const mask = "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)";

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

            {children}
        </Tag>
    );
}

/* ========================================================================== */
/*  Small pieces                                                              */
/* ========================================================================== */
function MetaRow({ post }) {
    const items = [
        post.date && { icon: FiCalendar, text: post.date },
        post.readTime && { icon: FiClock, text: post.readTime },
        post.views > 0 && { icon: FiEye, text: post.views },
    ].filter(Boolean);

    return (
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {items.map(({ icon: Icon, text }, i) => (
                <li
                    key={i}
                    className="inline-flex items-center gap-3 font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                >
                    {i > 0 && <span aria-hidden="true" className="text-border">·</span>}
                    <span className="inline-flex items-center gap-1.5">
                        <Icon size={12} aria-hidden="true" />
                        {text}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function TagList({ tags, max }) {
    if (!tags.length) return null;
    return (
        <ul className="flex flex-wrap gap-1.5">
            {tags.slice(0, max).map((tag) => (
                <li
                    key={tag}
                    className="border border-border/60 bg-muted/40 rounded-full px-2.5 py-1 font-code text-[10px] text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90"
                >
                    {tag}
                </li>
            ))}
            {tags.length > max && (
                <li className="border border-border/60 bg-muted/40 rounded-full px-2.5 py-1 font-code text-[10px] text-muted-foreground">
                    +{tags.length - max}
                </li>
            )}
        </ul>
    );
}

/* Cover image with a designed fallback (missing URL or load error) */
function Cover({ post }) {
    const [failed, setFailed] = useState(false);
    const showImage = post.image && !failed;

    return showImage ? (
        <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/image:scale-[1.04]"
        />
    ) : (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted/40">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 text-foreground/[0.08] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:28px_28px]"
            />
            <FiBookOpen size={30} aria-hidden="true" className="relative text-primary/70" />
        </div>
    );
}

function ShareButton({ post, basePath }) {
    const [copied, setCopied] = useState(false);
    const reduced = useReducedMotion();
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const handleShare = async () => {
        const url =
            post.slug && post.slug !== "#"
                ? `${window.location.origin}${basePath}/${post.slug}`
                : window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, text: post.excerpt, url });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                clearTimeout(timer.current);
                timer.current = setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            /* share sheet dismissed */
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${post.title}`}
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={`group/share relative z-10 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-primary ${FOCUS}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={copied ? "ok" : "share"}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="inline-flex"
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
                </motion.span>
            </AnimatePresence>
            <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
        </motion.button>
    );
}

const postHref = (post, basePath) => (post.slug === "#" ? "#" : `${basePath}/${post.slug}`);

/* ========================================================================== */
/*  Regular post card                                                         */
/* ========================================================================== */
function PostCard({ post, index, content, basePath }) {
    console.log(post)
    const href = postHref(post, basePath);

    return (
        <Card as="article" inset="inset-x-0">
            <Link
                to={href}
                aria-label={post.title}
                className={`group/image relative z-10 block overflow-hidden border-b border-border/60 ${FOCUS}`}
            >
                <div className="aspect-[16/10]">
                    <Cover post={post} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 border border-white/10 bg-black/50 px-2.5 py-1 font-code text-[10px] text-white/80 backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                </span>
                {post.category && (
                    <span className="absolute rounded-full bottom-4 left-4 border border-white/10 bg-black/50 px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                        {post.category}
                    </span>
                )}


            </Link>

            <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-5">
                    <MetaRow post={post} />
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                    <Link to={href} className={`line-clamp-2 ${FOCUS}`}>
                        {post.title}
                    </Link>
                </h3>

                {post.excerpt && (
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {post.content}
                    </p>
                )}


                <div className="mt-5">
                    <TagList tags={post.tags} max={3} />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-5">
                    <Link
                        to={href}
                        className={`group/cta inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary ${FOCUS}`}
                    >
                        {content.readLabel}
                        <FiArrowRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/cta:translate-x-1"
                        />
                    </Link>
                    <ShareButton post={post} basePath={basePath} />
                </div>
            </div>
        </Card>
    );
}

/* ========================================================================== */
/*  States                                                                    */
/* ========================================================================== */
function BlogSkeleton() {
    const block = "animate-pulse rounded-xl border border-border/50 bg-card/40";
    return (
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`${block} h-80`} />
            ))}
        </div>
    );
}

const ghostBtn = `mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`;

function EmptyState({ title, text }) {
    return (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/20 p-12 text-center sm:p-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary">
                <FiBookOpen size={22} aria-hidden="true" />
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
            className="mt-16 rounded-xl border border-dashed border-rose-500/30 bg-rose-500/5 p-12 text-center sm:p-16 lg:mt-20"
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
/*  Reusable section — no API coupling                                        */
/*                                                                            */
/*  <BlogSection                                                              */
/*      posts={apiPosts}            // raw objects; normalised internally     */
/*      basePath="/blogs"           // post URL = `${basePath}/${slug}`        */
/*      viewAllHref="/blogs"        // set to null to hide the button         */
/*      content={{ title: "Writing", highlight: "notes." }}                   */
/*  />                                                                        */
/* ========================================================================== */
export function BlogSection({
    posts: rawPosts = [],
    isLoading = false,
    isError = false,
    onRetry,
    content: contentOverride,
    basePath = "/blogs",
    viewAllHref = "/blogs",
    className = "",
}) {
    const reduced = useReducedMotion();
    const content = { ...DEFAULT_CONTENT, ...(contentOverride ?? {}) };

    const posts = useMemo(
        () =>
            (Array.isArray(rawPosts) ? rawPosts : [])
                .map(normalizePost)
                .filter((p) => p.published)
                .sort((a, b) => b.timestamp - a.timestamp),
        [rawPosts]
    );
    console.log(posts)

    let body;
    if (isLoading) {
        body = <BlogSkeleton />;
    } else if (isError) {
        body = <ErrorState content={content} onRetry={onRetry} />;
    } else if (posts.length === 0) {
        body = (
            <div className="mt-16 lg:mt-20">
                <EmptyState title={content.emptyTitle} text={content.emptyText} />
            </div>
        );
    } else {
        body = (
            <LayoutGroup>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key="posts"
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:mt-20"
                    >
                        {posts.map((post, i) => (
                            <Reveal key={post.id} delay={Math.min(i * 0.08, 0.4)} className="h-full">
                                <PostCard post={post} index={i} content={content} basePath={basePath} />
                            </Reveal>
                        ))}
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
export default function Blog(props) {
    const { data, isLoading, isError, refetch } = useGetPublicBlogsQuery({ limit: 20 });

    // Memoised on `data` so the fallback isn't a new array every render.
    const posts = useMemo(() => {
        const list = data?.data?.blogs ?? [];
        return Array.isArray(list) ? list : [];
    }, [data]);

    return (
        <BlogSection
            posts={posts}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
            {...props}
        />
    );
}