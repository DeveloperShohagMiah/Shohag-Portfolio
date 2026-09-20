import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

function CodeBlock({ children }) {
    const [copied, setCopied] = useState(false);
    const text = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span>code snippet</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-3.5 font-mono text-xs overflow-x-auto text-zinc-100 leading-relaxed">
                <code>{text}</code>
            </pre>
        </div>
    );
}

export function MarkdownRenderer({ content, emptyText = 'Nothing to preview yet. Start typing to see formatted content...' }) {
    if (!content || !content.trim()) {
        return (
            <div className="p-6 text-center text-xs text-zinc-400 italic">
                {emptyText}
            </div>
        );
    }

    return (
        <div className="markdown-container text-zinc-800 dark:text-zinc-200">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-4 mb-2 pb-1.5 border-b border-zinc-200 dark:border-zinc-800" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-3.5 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-3 mb-1.5" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-2 mb-1" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3 last:mb-0" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="leading-relaxed pl-1" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-3 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 px-3.5 py-2 my-3 rounded-r-lg italic text-xs sm:text-sm text-zinc-700 dark:text-zinc-300" {...props} />
                    ),
                    code: ({ node, inline, children, ...props }) => {
                        if (inline) {
                            return (
                                <code className="px-1.5 py-0.5 text-[11px] sm:text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return <CodeBlock>{children}</CodeBlock>;
                    },
                    pre: ({ children }) => <>{children}</>,
                    a: ({ node, ...props }) => (
                        <a
                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium break-words"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                    img: ({ node, alt, ...props }) => (
                        <img
                            alt={alt || 'Image'}
                            className="rounded-xl my-3 max-h-80 w-full object-cover border border-zinc-200 dark:border-zinc-800"
                            {...props}
                        />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <table className="w-full text-xs text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="px-3 py-2 text-xs font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr className="my-4 border-zinc-200 dark:border-zinc-800" {...props} />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
