import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiCalendar,
    FiClock,
    FiEye,
    FiShare2,
    FiCheck,
    FiBookOpen,
    FiRefreshCw,
} from "react-icons/fi";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
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

const compact = new Intl.NumberFormat("en", { notation: "compact" });

/** Plain-text preview from markdown content (used when there is no excerpt) */
const stripMarkdown = (s) =>
    String(s)
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

export function normalizePost(raw, index) {
    const tags = Array.isArray(raw.tags)
        ? raw.tags.map((t) => (typeof t === "string" ? t : t?.name ?? "")).filter(Boolean)
        : [];

    const rawDate = raw.date || raw.publishedAt || raw.createdAt || raw.updatedAt || "";
    const timestamp = rawDate ? new Date(rawDate).getTime() || 0 : 0;

    // No invented "3 min read": show nothing when we can't compute it
    const readTime =
        raw.readTime ||
        raw.readingTime ||
        (raw.content
            ? `${Math.max(1, Math.ceil(String(raw.content).split(/\s+/).length / 200))} min read`
            : "");

    return {
        id: raw._id || raw.id || raw.slug || `post-${index}`,
        title: raw.title || "Untitled post",
        excerpt:
            raw.excerpt ||
            raw.description ||
            raw.summary ||
            (raw.content ? stripMarkdown(raw.content).slice(0, 120) + "..." : ""),
        category: raw.category || "General",
        date: formatDate(rawDate),
        timestamp,
        readTime,
        views: Number(raw.views ?? raw.viewsCount ?? 0) || 0,
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



/* ========================================================================== */
/*  Card — 1px gradient border, glass body, cursor spotlight                  */
/*  The inner body is `isolate`, so the spotlight sits at -z-10 (behind the   */
/*  content) and the content needs no z-index — which lets the title link     */
/*  stretch over the whole card.                                              */
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
            className={`group/card relative h-full rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-sm)] transition-all duration-500 ease-out hover:-translate-y-1 hover:from-primary/60 hover:via-primary/20 hover:to-primary/5 hover:shadow-[var(--elev-lg)] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background ${className}`}
        >
            <div
                className={`relative isolate flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] bg-card/90 backdrop-blur-2xl ${bodyClassName}`}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                    style={{
                        background:
                            "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                />
                {children}
            </div>
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
        post.views > 0 && { icon: FiEye, text: `${compact.format(post.views)} views` },
    ].filter(Boolean);

    if (!items.length) return null;

    return (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {items.map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon size={13} aria-hidden="true" className="text-primary/70" />
                    {text}
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
                    className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-code text-[11px] text-muted-foreground transition-colors duration-300 group-hover/card:border-primary/40 group-hover/card:bg-primary/5 group-hover/card:text-primary/90"
                >
                    {tag}
                </li>
            ))}
            {tags.length > max && (
                <li className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-code text-[11px] text-muted-foreground">
                    +{tags.length - max}
                </li>
            )}
        </ul>
    );
}

/* Cover fills its (relative) parent; designed fallback for missing/broken URLs */
function Cover({ post }) {
    const [failed, setFailed] = useState(false);
    const showImage = post.image && !failed;

    return showImage ? (
        <img
            src={post.image}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05]"
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
            <FiBookOpen size={32} aria-hidden="true" className="relative text-primary/70" />
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
            /* share sheet dismissed or clipboard unavailable */
        }
    };

    return (
        // relative z-20 → stays clickable above the card's stretched link
        <motion.button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${post.title}`}
            whileHover={reduced ? undefined : { y: -1 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE }}
            className={`group/share relative z-20 inline-flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-border hover:bg-foreground/[0.04] hover:text-primary ${FOCUS}`}
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
/*  Post card — the whole card is one link (title link stretched over it),    */
/*  so there is a single tab stop per post instead of three.                  */
/* ========================================================================== */
function PostCard({ post, content, basePath, featured = false }) {
    const href = postHref(post, basePath);

    return (
        <Card as="article" bodyClassName={featured ? "md:flex-row" : ""}>
            {/* cover */}
            <div
                className={`relative shrink-0 overflow-hidden border-b border-border/60 ${featured
                    ? "aspect-[16/10] md:aspect-auto md:min-h-[340px] md:w-[46%] md:border-b-0 md:border-r"
                    : "aspect-[16/10]"
                    }`}
            >
                <Cover post={post} />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />

                {featured && (
                    <span className="absolute left-4 top-4 rounded-full border border-primary/40 bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 backdrop-blur-md">
                        Latest post
                    </span>
                )}
                {post.category && (
                    <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                        {post.category}
                    </span>
                )}
            </div>

            {/* content */}
            <div
                className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "md:justify-center md:p-10" : ""}`}
            >
                <MetaRow post={post} />

                <h3
                    className={`mt-4 font-display font-semibold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover/card:text-primary ${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                        }`}
                >
                    <Link
                        to={href}
                        className="line-clamp-2 block focus-visible:outline-none after:absolute after:inset-0"
                    >
                        {post.title}
                    </Link>
                </h3>

                {post.excerpt && (
                    <p
                        className={`mt-3 text-sm leading-7 text-muted-foreground ${featured ? "line-clamp-4 md:text-base md:leading-8" : "line-clamp-3 flex-1"
                            }`}
                    >
                        {post.excerpt}
                    </p>
                )}

                {post.tags.length > 0 && (
                    <div className="mt-5">
                        <TagList tags={post.tags} max={featured ? 5 : 3} />
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                    <span
                        aria-hidden="true"
                        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors duration-300 group-hover/card:text-primary"
                    >
                        {content.readLabel}
                        <FiArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover/card:translate-x-1"
                        />
                    </span>
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
    const block = "animate-pulse rounded-[28px] border border-border/50 bg-card/40";
    return (
        <div
            role="status"
            aria-busy="true"
            className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
            <span className="sr-only">Loading posts…</span>
            <div className={`${block} h-80 md:col-span-2 lg:col-span-3`} />
            {[1, 2, 3].map((i) => (
                <div key={i} className={`${block} h-96`} />
            ))}
        </div>
    );
}

function EmptyState({ title, text }) {
    return (
        <div className="rounded-[28px] border border-dashed border-border/60 bg-card/20 p-12 text-center sm:p-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5 text-primary">
                <FiBookOpen size={22} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
        </div>
    );
}

function ErrorState({ content, onRetry }) {
    return (
        <div
            role="alert"
            className="mt-16 rounded-[28px] border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center sm:p-16 lg:mt-20"
        >
            <p className="text-sm font-semibold text-destructive">{content.errorTitle}</p>
            <p className="mt-2 text-sm text-muted-foreground">{content.errorText}</p>
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
/*  Reusable section — no API coupling                                        */
/*                                                                            */
/*  <BlogSection                                                              */
/*      posts={apiPosts}            // raw objects; normalised internally     */
/*      basePath="/blogs"           // post URL = `${basePath}/${slug}`        */
/*      viewAllHref="/blogs"        // set to null to hide the button         */
/*      maxPosts={7}                // newest post is featured, rest in grid  */
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
    maxPosts = 7,
    className = "",
}) {
    const content = { ...DEFAULT_CONTENT, ...(contentOverride ?? {}) };

    const allPosts = useMemo(
        () =>
            (Array.isArray(rawPosts) ? rawPosts : [])
                .map(normalizePost)
                .filter((p) => p.published)
                .sort((a, b) => b.timestamp - a.timestamp),
        [rawPosts]
    );
    const posts = useMemo(() => allPosts.slice(0, maxPosts), [allPosts, maxPosts]);

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
            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
                {posts.map((post, i) => (
                    <Reveal
                        key={post.id}
                        delay={Math.min((i % 3) * 0.08, 0.24)}
                        className={`h-full ${i === 0 ? "md:col-span-2 lg:col-span-3" : ""}`}
                    >
                        <PostCard post={post} content={content} basePath={basePath} featured={i === 0} />
                    </Reveal>
                ))}
            </div>
        );
    }

    const showViewAll = Boolean(viewAllHref) && !isLoading && !isError && posts.length > 0;

    return (
        <section
            id={content.id}
            className={`relative overflow-hidden bg-background py-28 sm:py-36 ${className}`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />


            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header — description and the "View all" button were unused before */}
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

                    {showViewAll && (
                        <div className="lg:col-span-5 lg:justify-self-end">
                            <Button to={viewAllHref} variant="outline">
                                {content.viewAllLabel}
                                <FiArrowRight
                                    size={16}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Button>
                        </div>
                    )}
                </Reveal>

                {body}
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