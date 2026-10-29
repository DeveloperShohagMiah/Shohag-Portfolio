import { useState } from "react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Quote,
    Code,
    Undo2,
    Redo2,
    Palette,
    Highlighter,
    Link as LinkIcon,
    RemoveFormatting,
} from "lucide-react";

const buttonClass = (active = false) =>
    `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${active
        ? "border-primary/30 bg-primary/10 text-primary"
        : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
    }`;

const colors = [
    { name: "Default", value: "" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Green", value: "#22c55e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
];

const highlights = [
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Purple", value: "#e9d5ff" },
];

function ToolbarButton({
    icon: Icon,
    title,
    active = false,
    disabled = false,
    onClick,
}) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClick}
            className={`${buttonClass(active)} ${disabled ? "cursor-not-allowed opacity-40" : ""
                }`}
        >
            <Icon size={17} strokeWidth={1.8} />
        </button>
    );
}

export default function EditorToolbar({ editor }) {
    const [showColors, setShowColors] = useState(false);
    const [showHighlights, setShowHighlights] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter link URL", previousUrl);

        if (url === null) return;

        if (!url.trim()) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        try {
            const parsedUrl = new URL(url);

            if (!["http:", "https:", "mailto:"].includes(parsedUrl.protocol)) {
                window.alert("Please enter a valid HTTP, HTTPS, or mailto URL.");
                return;
            }
        } catch {
            window.alert("Please enter a valid URL, including https:// when needed.");
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    };

    const groups = [
        [
            {
                icon: Bold,
                title: "Bold",
                active: editor.isActive("bold"),
                action: () => editor.chain().focus().toggleBold().run(),
            },
            {
                icon: Italic,
                title: "Italic",
                active: editor.isActive("italic"),
                action: () => editor.chain().focus().toggleItalic().run(),
            },
            {
                icon: Underline,
                title: "Underline",
                active: editor.isActive("underline"),
                action: () => editor.chain().focus().toggleUnderline().run(),
            },
            {
                icon: Strikethrough,
                title: "Strikethrough",
                active: editor.isActive("strike"),
                action: () => editor.chain().focus().toggleStrike().run(),
            },
        ],
        [
            {
                icon: Heading1,
                title: "Heading 1",
                active: editor.isActive("heading", { level: 1 }),
                action: () =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
                icon: Heading2,
                title: "Heading 2",
                active: editor.isActive("heading", { level: 2 }),
                action: () =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
                icon: Heading3,
                title: "Heading 3",
                active: editor.isActive("heading", { level: 3 }),
                action: () =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run(),
            },
        ],
        [
            {
                icon: List,
                title: "Bullet list",
                active: editor.isActive("bulletList"),
                action: () => editor.chain().focus().toggleBulletList().run(),
            },
            {
                icon: ListOrdered,
                title: "Numbered list",
                active: editor.isActive("orderedList"),
                action: () => editor.chain().focus().toggleOrderedList().run(),
            },
            {
                icon: Quote,
                title: "Blockquote",
                active: editor.isActive("blockquote"),
                action: () => editor.chain().focus().toggleBlockquote().run(),
            },
            {
                icon: Code,
                title: "Inline code",
                active: editor.isActive("code"),
                action: () => editor.chain().focus().toggleCode().run(),
            },
        ],
        [
            {
                icon: AlignLeft,
                title: "Align left",
                active: editor.isActive({ textAlign: "left" }),
                action: () => editor.chain().focus().setTextAlign("left").run(),
            },
            {
                icon: AlignCenter,
                title: "Align center",
                active: editor.isActive({ textAlign: "center" }),
                action: () => editor.chain().focus().setTextAlign("center").run(),
            },
            {
                icon: AlignRight,
                title: "Align right",
                active: editor.isActive({ textAlign: "right" }),
                action: () => editor.chain().focus().setTextAlign("right").run(),
            },
        ],
    ];

    return (
        <div className="relative z-20 border-b border-border bg-background">
            <div className="flex flex-wrap items-center gap-1.5 p-3">
                {groups.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className="flex items-center gap-0.5 border-r border-border pr-2 last:border-r-0"
                    >
                        {group.map((item) => (
                            <ToolbarButton
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                active={item.active}
                                onClick={item.action}
                            />
                        ))}
                    </div>
                ))}

                {/* Text color */}
                <div className="relative">
                    <ToolbarButton
                        icon={Palette}
                        title="Text color"
                        active={showColors}
                        onClick={() => {
                            setShowColors((value) => !value);
                            setShowHighlights(false);
                        }}
                    />

                    {showColors && (
                        <div className="absolute left-0 top-11 z-50 w-52 rounded-xl border border-border bg-background p-3 shadow-xl">
                            <p className="mb-3 text-xs font-semibold text-foreground">
                                Text color
                            </p>

                            <div className="grid grid-cols-4 gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        title={color.name}
                                        aria-label={color.name}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => {
                                            if (color.value) {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .setColor(color.value)
                                                    .run();
                                            } else {
                                                editor.chain().focus().unsetColor().run();
                                            }

                                            setShowColors(false);
                                        }}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-transform hover:scale-110"
                                        style={{
                                            backgroundColor: color.value || "var(--background)",
                                        }}
                                    >
                                        {!color.value && (
                                            <RemoveFormatting
                                                size={15}
                                                className="text-muted-foreground"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <label className="mt-3 block text-xs text-muted-foreground">
                                Custom color
                                <input
                                    type="color"
                                    aria-label="Choose custom text color"
                                    defaultValue="#10b981"
                                    onChange={(event) =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setColor(event.target.value)
                                            .run()
                                    }
                                    className="mt-2 h-9 w-full cursor-pointer rounded-md border border-border bg-background p-1"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Text highlight */}
                <div className="relative">
                    <ToolbarButton
                        icon={Highlighter}
                        title="Text highlight"
                        active={showHighlights}
                        onClick={() => {
                            setShowHighlights((value) => !value);
                            setShowColors(false);
                        }}
                    />

                    {showHighlights && (
                        <div className="absolute left-0 top-11 z-50 w-44 rounded-xl border border-border bg-background p-3 shadow-xl">
                            <p className="mb-3 text-xs font-semibold text-foreground">
                                Highlight color
                            </p>

                            <div className="grid grid-cols-3 gap-2">
                                {highlights.map((highlight) => (
                                    <button
                                        key={highlight.name}
                                        type="button"
                                        title={highlight.name}
                                        aria-label={`${highlight.name} highlight`}
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => {
                                            editor
                                                .chain()
                                                .focus()
                                                .toggleHighlight({ color: highlight.value })
                                                .run();

                                            setShowHighlights(false);
                                        }}
                                        style={{ backgroundColor: highlight.value }}
                                        className="h-8 rounded-lg border border-border transition-transform hover:scale-105"
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    editor.chain().focus().unsetHighlight().run();
                                    setShowHighlights(false);
                                }}
                                className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-xs text-foreground hover:bg-muted"
                            >
                                Remove highlight
                            </button>
                        </div>
                    )}
                </div>

                {/* Link */}
                <ToolbarButton
                    icon={LinkIcon}
                    title="Add or edit link"
                    active={editor.isActive("link")}
                    onClick={setLink}
                />

                {/* Undo / Redo */}
                <div className="flex items-center gap-0.5 border-l border-border pl-2">
                    <ToolbarButton
                        icon={Undo2}
                        title="Undo"
                        disabled={!editor.can().undo()}
                        onClick={() => editor.chain().focus().undo().run()}
                    />

                    <ToolbarButton
                        icon={Redo2}
                        title="Redo"
                        disabled={!editor.can().redo()}
                        onClick={() => editor.chain().focus().redo().run()}
                    />
                </div>

                <button
                    type="button"
                    title="Clear formatting"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                        editor.chain().focus().unsetAllMarks().clearNodes().run();
                    }}
                    className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <RemoveFormatting size={17} />
                </button>
            </div>
        </div>
    );
}