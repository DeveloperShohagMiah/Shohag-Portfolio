import React, { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Quote,
    Code,
    FileCode,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Table as TableIcon,
    Undo2,
    Redo2,
    Eye,
    Edit3,
    Columns,
    HelpCircle,
    Sparkles,
    Type,
    X,
    Check
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer.jsx';

export function RichContentEditor({
    value = '',
    onChange,
    placeholder = 'Write your content here using markdown or rich formatting tools...',
    minHeight = 'min-h-[220px]',
    label = 'Content Editor',
    required = false,
    error = null,
    helperText = '',
    templates = []
}) {
    const textareaRef = useRef(null);
    const [viewMode, setViewMode] = useState('write'); // 'write' | 'preview' | 'split'
    const [isMonoFont, setIsMonoFont] = useState(false);
    const [showCheatsheet, setShowCheatsheet] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    // Link & Image modal states
    const [linkText, setLinkText] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Undo / Redo history
    const [history, setHistory] = useState([value]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (!isInternalChange.current) {
            if (history[historyIndex] !== value) {
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(value);
                if (newHistory.length > 50) newHistory.shift();
                setHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);
            }
        }
        isInternalChange.current = false;
    }, [value]);

    const updateValueWithHistory = (newVal) => {
        isInternalChange.current = true;
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newVal);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        if (onChange) {
            onChange(newVal);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIdx = historyIndex - 1;
            setHistoryIndex(newIdx);
            isInternalChange.current = true;
            if (onChange) onChange(history[newIdx]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIdx = historyIndex + 1;
            setHistoryIndex(newIdx);
            isInternalChange.current = true;
            if (onChange) onChange(history[newIdx]);
        }
    };

    // Helper to wrap or insert text at cursor
    const insertFormatting = (prefix, suffix = '', defaultText = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value || '';
        const selectedText = currentText.substring(start, end);
        const textToInsert = selectedText || defaultText;

        const newText =
            currentText.substring(0, start) +
            prefix +
            textToInsert +
            suffix +
            currentText.substring(end);

        updateValueWithHistory(newText);

        // Reposition cursor
        setTimeout(() => {
            textarea.focus();
            if (selectedText) {
                textarea.setSelectionRange(start + prefix.length, end + prefix.length);
            } else {
                const newPos = start + prefix.length + defaultText.length;
                textarea.setSelectionRange(newPos, newPos);
            }
        }, 10);
    };

    // Helper to apply line prefix (e.g. list, heading, quote)
    const applyLinePrefix = (prefix) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value || '';

        // Find the start of the current line
        const lineStart = currentText.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = currentText.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = currentText.length;

        const lines = currentText.substring(lineStart, lineEnd).split('\n');
        const modifiedLines = lines.map((line) => {
            // If line already starts with prefix, remove it (toggle off)
            if (line.startsWith(prefix)) {
                return line.substring(prefix.length);
            }
            return `${prefix}${line}`;
        });

        const replacement = modifiedLines.join('\n');
        const newText =
            currentText.substring(0, lineStart) +
            replacement +
            currentText.substring(lineEnd);

        updateValueWithHistory(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(lineStart, lineStart + replacement.length);
        }, 10);
    };

    // Keyboard shortcut handlers
    const handleKeyDown = (e) => {
        // Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            insertFormatting('  ', '', '');
            return;
        }

        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                insertFormatting('**', '**', 'bold text');
            } else if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                insertFormatting('*', '*', 'italic text');
            } else if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                handleOpenLinkModal();
            } else if (e.key === 'z' || e.key === 'Z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    handleRedo();
                } else {
                    e.preventDefault();
                    handleUndo();
                }
            }
        }
    };

    const handleOpenLinkModal = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const selected = (textarea.value || '').substring(
                textarea.selectionStart,
                textarea.selectionEnd
            );
            setLinkText(selected || '');
        }
        setLinkUrl('');
        setShowLinkModal(true);
    };

    const handleInsertLink = (e) => {
        if (e) e.preventDefault();
        if (!linkUrl.trim()) return;
        const label = linkText.trim() || 'link';
        insertFormatting(`[${label}](${linkUrl.trim()})`, '', '');
        setShowLinkModal(false);
        setLinkText('');
        setLinkUrl('');
    };

    const handleOpenImageModal = () => {
        setImageAlt('');
        setImageUrl('');
        setShowImageModal(true);
    };

    const handleInsertImage = (e) => {
        if (e) e.preventDefault();
        if (!imageUrl.trim()) return;
        const alt = imageAlt.trim() || 'image';
        insertFormatting(`![${alt}](${imageUrl.trim()})\n`, '', '');
        setShowImageModal(false);
        setImageAlt('');
        setImageUrl('');
    };

    // Stats
    const characters = (value || '').length;
    const words = (value || '').trim() ? (value || '').trim().split(/\s+/).length : 0;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    return (
        <div className="w-full space-y-1.5">
            {/* Label and Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>

                {/* View Switcher: Write, Preview, Split */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <button
                        type="button"
                        onClick={() => setViewMode('write')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'write'
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                            }`}
                    >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Write</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('preview')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'preview'
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                            }`}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode('split')}
                        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${viewMode === 'split'
                            ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                            }`}
                        title="Split editor & live preview side-by-side"
                    >
                        <Columns className="w-3.5 h-3.5" />
                        <span>Split</span>
                    </button>
                </div>
            </div>

            {/* Editor Frame */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100 focus-within:border-transparent transition-all">
                {/* Toolbar (available when in Write or Split mode) */}
                {viewMode !== 'preview' && (
                    <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-zinc-50/90 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {/* Action Group 1: Undo/Redo */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={handleUndo}
                                disabled={historyIndex <= 0}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Redo (Ctrl+Shift+Z)"
                            >
                                <Redo2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

                        {/* Action Group 2: Text Styling */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={() => insertFormatting('**', '**', 'bold text')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Bold (Ctrl+B)"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormatting('*', '*', 'italic text')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Italic (Ctrl+I)"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormatting('~~', '~~', 'strikethrough')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Strikethrough"
                            >
                                <Strikethrough className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

                        {/* Action Group 3: Headings */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('# ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-xs flex items-center"
                                title="Heading 1"
                            >
                                <Heading1 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('## ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-xs flex items-center"
                                title="Heading 2"
                            >
                                <Heading2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('### ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 font-semibold text-xs flex items-center"
                                title="Heading 3"
                            >
                                <Heading3 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

                        {/* Action Group 4: Lists & Quotes */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('- ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Bullet List"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('1. ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Numbered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('- [ ] ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Task Checklist"
                            >
                                <CheckSquare className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => applyLinePrefix('> ')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Blockquote"
                            >
                                <Quote className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

                        {/* Action Group 5: Code & Media */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={() => insertFormatting('`', '`', 'code')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Inline Code"
                            >
                                <Code className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormatting('```javascript\n', '\n```', '// Your code here')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Code Block"
                            >
                                <FileCode className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenLinkModal}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Insert Link (Ctrl+K)"
                            >
                                <LinkIcon className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleOpenImageModal}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Insert Image"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormatting('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n', '', '')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Insert Table"
                            >
                                <TableIcon className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormatting('\n---\n', '', '')}
                                className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                title="Horizontal Divider"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right Tools: Font Toggle & Help */}
                        <div className="ml-auto flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setIsMonoFont(!isMonoFont)}
                                className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${isMonoFont
                                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold'
                                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500'
                                    }`}
                                title="Toggle Monospace / Standard Editor Font"
                            >
                                <Type className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCheatsheet(!showCheatsheet)}
                                className={`p-1.5 rounded-lg transition-colors ${showCheatsheet
                                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500'
                                    }`}
                                title="Markdown Formatting Guide"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Markdown Cheatsheet Drawer */}
                {showCheatsheet && (
                    <div className="p-3.5 bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 text-xs animate-in slide-in-from-top-2 duration-150">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 text-[10px]">
                                Markdown Formatting Shortcuts
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowCheatsheet(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-zinc-600 dark:text-zinc-400">
                            <div className="space-y-1">
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono"># Heading 1</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">## Heading 2</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">### Heading 3</code></p>
                            </div>
                            <div className="space-y-1">
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">**bold**</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">*italic*</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">~~strike~~</code></p>
                            </div>
                            <div className="space-y-1">
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">- Bullet item</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">1. Numbered item</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">- [ ] Task checkbox</code></p>
                            </div>
                            <div className="space-y-1">
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">[Link text](url)</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">![Alt text](img-url)</code></p>
                                <p><code className="text-zinc-900 dark:text-zinc-100 font-mono">```code block```</code></p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Insert Templates (optional) */}
                {templates.length > 0 && viewMode !== 'preview' && (
                    <div className="px-3 py-1.5 bg-zinc-100/60 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs">
                        <span className="text-[10px] uppercase font-bold text-zinc-400 shrink-0 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Templates:
                        </span>
                        {templates.map((tpl, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => insertFormatting(tpl.content, '', '')}
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 shrink-0 text-[11px] font-medium"
                            >
                                + {tpl.title}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content Area */}
                <div className="relative">
                    {/* Write Mode */}
                    {viewMode === 'write' && (
                        <textarea
                            ref={textareaRef}
                            value={value || ''}
                            onChange={(e) => updateValueWithHistory(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className={`w-full p-4 text-sm bg-transparent border-0 focus:outline-hidden text-zinc-900 dark:text-zinc-100 resize-y leading-relaxed ${minHeight} ${isMonoFont ? 'font-mono' : 'font-sans'
                                }`}
                        />
                    )}

                    {/* Preview Mode */}
                    {viewMode === 'preview' && (
                        <div className={`p-4 sm:p-6 overflow-y-auto max-h-[500px] ${minHeight}`}>
                            <MarkdownRenderer content={value} />
                        </div>
                    )}

                    {/* Split Mode */}
                    {viewMode === 'split' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
                            <textarea
                                ref={textareaRef}
                                value={value || ''}
                                onChange={(e) => updateValueWithHistory(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className={`w-full p-4 text-sm bg-transparent border-0 focus:outline-hidden text-zinc-900 dark:text-zinc-100 resize-y leading-relaxed ${minHeight} ${isMonoFont ? 'font-mono' : 'font-sans'
                                    }`}
                            />
                            <div className={`p-4 sm:p-6 overflow-y-auto max-h-[500px] bg-zinc-50/40 dark:bg-zinc-950/40 ${minHeight}`}>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                                    Real-time Preview
                                </div>
                                <MarkdownRenderer content={value} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Statistics */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2 bg-zinc-50/80 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-3">
                        <span>{words} words</span>
                        <span>•</span>
                        <span>{characters} characters</span>
                        <span>•</span>
                        <span>~{readTimeMinutes} min read</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Markdown &amp; GFM enabled</span>
                    </div>
                </div>
            </div>

            {/* Error or helper message */}
            {error && (
                <p className="text-xs text-rose-500 mt-1">{error}</p>
            )}
            {!error && helperText && (
                <p className="text-xs text-zinc-400 mt-1">{helperText}</p>
            )}

            {/* Insert Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-emerald-500" />
                                Insert Hyperlink
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowLinkModal(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleInsertLink} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                                    Anchor Display Text
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="e.g. Read full documentation"
                                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                                    Destination URL *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                                />
                            </div>

                            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowLinkModal(false)}
                                    className="px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg"
                                >
                                    Insert Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Insert Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-emerald-500" />
                                Insert Markdown Image
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowImageModal(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleInsertImage} className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                                    Alt Description
                                </label>
                                <input
                                    type="text"
                                    value={imageAlt}
                                    onChange={(e) => setImageAlt(e.target.value)}
                                    placeholder="e.g. Architecture diagram illustration"
                                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-300 mb-1">
                                    Image Source URL *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                                />
                            </div>

                            {/* Sample stock image presets */}
                            <div>
                                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1.5">
                                    Quick stock image presets
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80')}
                                        className="text-[10px] px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300"
                                    >
                                        Coding setup
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80')}
                                        className="text-[10px] px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300"
                                    >
                                        Analytics chart
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80')}
                                        className="text-[10px] px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300"
                                    >
                                        Tech Workspace
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowImageModal(false)}
                                    className="px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg"
                                >
                                    Insert Image
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
