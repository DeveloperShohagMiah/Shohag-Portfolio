import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // or any theme

/**
 * Extended sanitize schema:
 * - allows className on code/pre (for syntax highlighting)
 * - allows id anchors, tables, etc.
 */
const schema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code || []), ["className"]],
        pre: [...(defaultSchema.attributes?.pre || []), ["className"]],
        span: [...(defaultSchema.attributes?.span || []), ["className"]],
        a: [...(defaultSchema.attributes?.a || []), "target", "rel"],
    },
    tagNames: [
        ...(defaultSchema.tagNames || []),
        "h1", "h2", "h3", "h4", "h5", "h6",
        "table", "thead", "tbody", "tr", "th", "td",
        "hr", "br", "del", "mark", "sub", "sup",
    ],
};

export function RichText({
    content,
    className = "",
    prose = true,
    proseSize = "prose-lg",
}) {
    if (!content) return null;

    // Detect: is it HTML or markdown?
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);

    return (
        <div
            className={[
                prose && `prose ${proseSize} dark:prose-invert max-w-none`,
                "prose-headings:font-display prose-headings:tracking-tight",
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                "prose-code:font-code prose-code:text-[0.9em]",
                "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800",
                "prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:not-italic",
                "prose-img:rounded-lg prose-img:shadow-lg",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    // 👇 only allow raw HTML if you trust the source; if storing HTML use rehype-raw
                    ...(looksLikeHtml ? [rehypeRaw] : []),
                    [rehypeSanitize, schema],
                    [rehypeHighlight, { detect: true, ignoreMissing: true }],
                ]}
                components={{
                    // Open external links in new tab
                    a: ({ node, ...props }) => {
                        const isExternal = props.href?.startsWith("http");
                        return (
                            <a
                                {...props}
                                {...(isExternal
                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                    : {})}
                            />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}