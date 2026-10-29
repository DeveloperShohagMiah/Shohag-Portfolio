// components/MarkDownRenderer.jsx
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import { Link2, ExternalLink } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

/* ========================================================================== */
/*  Custom renderers — map Markdown nodes to the premium prose styles        */
/* ========================================================================== */

const H2 = ({ id, children, ...props }) => (
    <h2
        id={id}
        className="group mt-12 mb-5 scroll-mt-32 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        {...props}
    >
        <a
            href={`#${id}`}
            className="inline-flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
        >
            <Link2 size={18} className="text-muted-foreground/50" />
        </a>
        {children}
    </h2>
);

const H3 = ({ id, children, ...props }) => (
    <h3
        id={id}
        className="group mt-10 mb-4 scroll-mt-32 text-xl font-semibold text-foreground"
        {...props}
    >
        <a
            href={`#${id}`}
            className="inline-flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
        >
            <Link2 size={16} className="text-muted-foreground/50" />
        </a>
        {children}
    </h3>
);

const A = ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-baseline gap-0.5 font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
            {...props}
        >
            {children}
            {isExternal && <ExternalLink size={12} className="ml-0.5 shrink-0 translate-y-[-1px] opacity-60" />}
        </a>
    );
};

const Img = ({ src, alt, title }) => (
    <figure className="my-10">
        <img
            src={src}
            alt={alt || ""}
            loading="lazy"
            className="w-full rounded-2xl border border-border/40 shadow-xl"
        />
        {(alt || title) && (
            <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                {title || alt}
            </figcaption>
        )}
    </figure>
);

const Code = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match?.[1];

    if (inline) {
        return (
            <code
                className="rounded-md border border-border/40 bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
                {...props}
            >
                {children}
            </code>
        );
    }

    return (
        <div className="group relative my-8 overflow-hidden rounded-2xl border border-border/60 bg-[#0d0d12] shadow-lg">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                </div>
                {lang && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                        {lang}
                    </span>
                )}
            </div>
            <pre className="overflow-x-auto p-6 text-sm leading-7 text-gray-300">
                <code className={className} {...props}>
                    {children}
                </code>
            </pre>
        </div>
    );
};

const Blockquote = ({ children }) => (
    <blockquote className="my-8 border-l-[3px] border-primary/40 bg-muted/30 py-2 pl-6 pr-4 text-lg italic leading-relaxed text-foreground/90">
        {children}
    </blockquote>
);

const Table = ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full border-collapse text-sm">{children}</table>
    </div>
);

const Th = ({ children }) => (
    <th className="border-b border-border/60 bg-muted/40 px-4 py-3 text-left font-semibold text-foreground">
        {children}
    </th>
);

const Td = ({ children }) => (
    <td className="border-b border-border/30 px-4 py-3 text-muted-foreground">
        {children}
    </td>
);

const Hr = () => <hr className="my-12 border-border/60" />;

const Ul = ({ children, ...props }) => (
    <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-primary/60" {...props}>
        {children}
    </ul>
);

const Ol = ({ children, ...props }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-5 marker:text-primary/60" {...props}>
        {children}
    </ol>
);

const Li = ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
        {children}
    </li>
);

const P = ({ children, ...props }) => (
    <p className="mb-6 leading-[1.8] text-foreground/80" {...props}>
        {children}
    </p>
);

const Strong = ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
);

const Em = ({ children }) => (
    <em className="italic text-foreground/90">{children}</em>
);

/* ========================================================================== */
/*  Component map                                                            */
/* ========================================================================== */
const components = {
    h1: H2, // demote h1 to h2 for consistency
    h2: H2,
    h3: H3,
    a: A,
    img: Img,
    code: Code,
    blockquote: Blockquote,
    table: Table,
    th: Th,
    td: Td,
    hr: Hr,
    ul: Ul,
    ol: Ol,
    li: Li,
    p: P,
    strong: Strong,
    em: Em,
};

/* ========================================================================== */
/*  MarkdownRenderer                                                         */
/* ========================================================================== */
export const MarkdownRenderer = memo(function MarkdownRenderer({
    content,
    className = "",
    allowHtml = true,
}) {
    if (!content || typeof content !== "string") return null;

    return (
        <div className={cx("markdown-body", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    ...(allowHtml ? [rehypeRaw] : []),
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ]}
                components={components}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

export default MarkdownRenderer;