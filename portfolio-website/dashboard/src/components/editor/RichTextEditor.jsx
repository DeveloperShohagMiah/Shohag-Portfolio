import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

import EditorToolbar from "./EditorToolbar";
import EditorContent from "./EditorContent";

export default function RichTextEditor({
    value = "",
    onChange,
    placeholder = "Start writing your content...",
    minHeight = "260px",
    editable = true,
    className = "",
}) {
    const [mode, setMode] = useState("edit");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                link: false,
                underline: false,
            }),

            TextStyle,

            Color.configure({
                types: ["textStyle"],
            }),

            Highlight.configure({
                multicolor: true,
            }),

            Underline,

            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right", "justify"],
            }),

            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https", "mailto"],
                HTMLAttributes: {
                    rel: "noopener noreferrer nofollow",
                    target: "_blank",
                },
            }),
        ],

        content: value || "",

        editable,

        editorProps: {
            attributes: {
                class:
                    "tiptap-content prose prose-sm max-w-none min-h-full break-words outline-none dark:prose-invert sm:prose-base",
                spellcheck: "true",
                "aria-label": "Rich text editor",
            },
        },

        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    // Keep editor content synchronized with external form state.
    useEffect(() => {
        if (!editor) return;

        const currentHtml = editor.getHTML();
        const nextHtml = value || "";

        if (currentHtml !== nextHtml) {
            editor.commands.setContent(nextHtml || "");
        }
    }, [editor, value]);

    useEffect(() => {
        editor?.setEditable(editable);
    }, [editor, editable]);

    if (!editor) {
        return (
            <div className="rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground">
                Loading editor...
            </div>
        );
    }

    return (
        <div
            className={`overflow-visible rounded-xl border border-border bg-background shadow-sm ${className}`}
        >
            {editable && <EditorToolbar editor={editor} />}

            <div
                style={{ minHeight }}
                className="overflow-y-auto rounded-b-xl"
            >
                <EditorContent
                    editor={editor}
                    mode={editable ? mode : "preview"}
                    onModeChange={setMode}
                />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-2">
                <span className="text-xs text-muted-foreground">
                    Rich text editor
                </span>

                <span className="text-xs tabular-nums text-muted-foreground">
                    {editor.getText().trim().length} characters
                </span>
            </div>
        </div>
    );
}