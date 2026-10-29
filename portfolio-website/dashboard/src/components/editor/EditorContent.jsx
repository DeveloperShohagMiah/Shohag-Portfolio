import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { Eye, Pencil } from "lucide-react";

export default function EditorContent({
    editor,
    mode = "edit",
    onModeChange,
}) {
    if (!editor) return null;

    return (
        <div className="min-w-0">
            {/* View controls */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                    {mode === "preview" ? "Content preview" : "Editor canvas"}
                </span>

                <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
                    <button
                        type="button"
                        onClick={() => onModeChange("edit")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "edit"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        <Pencil size={14} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onModeChange("preview")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium ${mode === "preview"
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                </div>
            </div>

            {/* Editor */}
            {mode === "edit" ? (
                <div className="min-h-64 px-5 py-4">
                    <TiptapEditorContent editor={editor} />
                </div>
            ) : (
                <article
                    className="prose prose-sm max-w-none break-words px-5 py-4 dark:prose-invert sm:prose-base"
                    dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
            )}
        </div>
    );
}