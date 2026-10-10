import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  Star,
  X,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  FileText,
  Hash,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { MarkdownRenderer } from "../components/MarkDownRenderer.jsx";
import { RichContentEditor } from "../components/RichContentEditor.jsx";
import { DeleteConfirmation } from "../ui/DeleteConfirmation.jsx";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/features/blogsApi.js";

function cleanSnippet(text) {
  if (!text) return "";
  return text
    .replace(/^#+\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/>\s+/gm, "")
    .trim();
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80";

const DEFAULT_VALUES = {
  title: "",
  category: "Web Development",
  coverImage: FALLBACK_IMAGE,
  content: "",
  readTimeMinutes: 5,
  isFeatured: false,
  isPublished: true,
};

/* ---------- Shared styles ---------- */
const inputBase =
  "w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/5";

const labelBase =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400";

const errorBase = "mt-1.5 text-xs font-medium text-rose-500";

const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200";

const btnGhost =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800";

export function BlogsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [readingModal, setReadingModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: blogsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllBlogsQuery();

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blogs = useMemo(
    () => blogsResponse?.data?.blogs || [],
    [blogsResponse]
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const previewImage = watch("coverImage");
  const previewContent = watch("content");
  const readTimeMinutes = watch("readTimeMinutes");

  useEffect(() => {
    register("content", {
      required: "Article content is required",
      minLength: {
        value: 20,
        message: "Content must be at least 20 characters",
      },
    });
  }, [register]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTags([]);
    setTagInput("");
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTags(blog.tags || []);
    setTagInput("");
    reset({
      title: blog.title,
      category: blog.category,
      coverImage: blog.coverImage,
      content: blog.content,
      readTimeMinutes: blog.readTimeMinutes || 5,
      isFeatured: blog.isFeatured,
      isPublished: blog.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    const val = tagInput.trim();
    if (!val) return;

    if (tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
      toast.error("Tag already added");
      return;
    }

    setTags([...tags, val]);
    setTagInput("");
  };

  const handleRemoveTag = (item) => {
    setTags(tags.filter((t) => t !== item));
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      category: data.category.trim(),
      coverImage: data.coverImage.trim(),
      content: data.content,
      readTimeMinutes: Number(data.readTimeMinutes),
      tags,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
    };

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, ...payload }).unwrap();
        toast.success("Article updated successfully");
      } else {
        await createBlog(payload).unwrap();
        toast.success("Article published successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message ||
        err?.message ||
        `Failed to ${editingBlog ? "update" : "publish"} article`
      );
    }
  };

  const handleToggleFeatured = async (blog) => {
    try {
      await updateBlog({
        id: blog._id,
        isFeatured: !blog.isFeatured,
      }).unwrap();
      toast.success(
        !blog.isFeatured ? "Marked as featured" : "Removed from featured"
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update featured status");
    }
  };

  // Opens the confirmation dialog
  const requestDelete = (blog) => {
    setDeleteTarget(blog);
  };

  // Called by the confirmation dialog
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlog(deleteTarget._id).unwrap();
      toast.success("Article deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete article");
    }
  };

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((blog) => {
      return (
        blog.title?.toLowerCase().includes(q) ||
        blog.category?.toLowerCase().includes(q) ||
        (blog.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        blog.content?.toLowerCase().includes(q)
      );
    });
  }, [blogs, searchQuery]);

  const isMutating = isCreating || isUpdating || isDeleting;

  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const featuredCount = blogs.filter((b) => b.isFeatured).length;
  const draftCount = blogs.length - publishedCount;

  /* ============================ LOADING ============================ */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ============================ ERROR ============================ */
  if (isError) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load articles
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            {error?.data?.message || error?.message || "Something went wrong"}
          </p>
          <button onClick={() => refetch()} className={`${btnPrimary} mt-5`}>
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Blog
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Articles & writing
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Cover image, title, markdown content, category, tags, featured
            status, and publish visibility.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Write article
        </button>
      </div>

      {/* ============================================================
          Stats strip
          ============================================================ */}
      {blogs.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {blogs.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Published
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Drafts
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-500">
              {draftCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Featured
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {featuredCount}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          Search
          ============================================================ */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, category, tag, or content…"
          className={`${inputBase} pl-10`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ============================================================
          Grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {searchQuery ? (
                <Search className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery ? "No matching articles" : "No articles yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {searchQuery
                ? "Try a different search term."
                : "Start writing your first article to display it here."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Write article
              </button>
            )}
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <article
              key={blog._id}
              id={`blog-card-${blog._id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Cover image */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
                />

                {/* Category badge — bottom-left */}
                <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 backdrop-blur-md">
                  <Hash className="h-2.5 w-2.5 text-white/70" />
                  <span className="text-[10px] font-medium text-white/90">
                    {blog.category}
                  </span>
                </div>

                {/* Status badges — top-right */}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                  {blog.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${blog.isPublished
                      ? "bg-emerald-500/95 text-white"
                      : "bg-zinc-900/80 text-white/90"
                      }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                {/* Meta row */}
                <div className="mb-2.5 flex items-center gap-3 font-code text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )
                      : "Not published"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-zinc-300 dark:text-zinc-700"
                  >
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {blog.readTimeMinutes || 5} min
                  </span>
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
                  {blog.title}
                </h3>

                {/* Snippet */}
                <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {cleanSnippet(blog.content)}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 4 && (
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                        +{blog.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setReadingModal(blog)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Read article
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(blog)}
                    disabled={isMutating}
                    title={
                      blog.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                    className={`rounded-lg p-2 transition-colors disabled:opacity-50 ${blog.isFeatured
                      ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${blog.isFeatured ? "fill-current" : ""
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(blog)}
                    disabled={isMutating}
                    title="Edit article"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => requestDelete(blog)}
                    disabled={isMutating}
                    title="Delete article"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* ============================================================
          Editor Modal
          ============================================================ */}
      {isModalOpen && (
        <div
          id="blog-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative my-8 w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {editingBlog ? "Edit article" : "Write article"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingBlog
                      ? "Update the article content and settings"
                      : "Compose a new article for your portfolio blog"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-5">
                {/* Title */}
                <div>
                  <label htmlFor="title" className={labelBase}>
                    Article title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Mastering React 19 Actions and Concurrent Transitions"
                    {...register("title", {
                      required: "Blog title is required",
                    })}
                    className={inputBase}
                  />
                  {errors.title && (
                    <p className={errorBase}>{errors.title.message}</p>
                  )}
                </div>

                {/* Category + read time */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className={labelBase}>
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="category"
                      type="text"
                      placeholder="e.g. Frontend Engineering"
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className={inputBase}
                    />
                    {errors.category && (
                      <p className={errorBase}>{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="readTimeMinutes" className={labelBase}>
                      Estimated read time (minutes)
                    </label>
                    <input
                      id="readTimeMinutes"
                      type="number"
                      min="1"
                      {...register("readTimeMinutes", {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Cover image */}
                <div>
                  <label htmlFor="coverImage" className={labelBase}>
                    Cover image URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="coverImage"
                    type="url"
                    placeholder="https://images.unsplash.com/…"
                    {...register("coverImage", {
                      required: "Image URL is required",
                    })}
                    className={inputBase}
                  />
                  {errors.coverImage && (
                    <p className={errorBase}>{errors.coverImage.message}</p>
                  )}

                  {previewImage && (
                    <div className="mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <img
                        src={previewImage}
                        alt="Cover preview"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Content editor */}
                <div id="blog-content-editor-container">
                  <RichContentEditor
                    label="Article content & markdown"
                    required={true}
                    value={previewContent || ""}
                    onChange={(val) => {
                      setValue("content", val, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      const words = val.trim()
                        ? val.trim().split(/\s+/).length
                        : 0;
                      const mins = Math.max(1, Math.ceil(words / 200));
                      setValue("readTimeMinutes", mins);
                    }}
                    placeholder="Write your comprehensive technical article, tutorial, or architecture post. Use Markdown — headings, code blocks, lists, quotes — with live preview."
                    minHeight="min-h-[280px]"
                    error={errors.content?.message}
                    helperText={`Full Markdown editor with live preview. Estimated read time: ${readTimeMinutes || 1
                      } min.`}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className={labelBase}>Article tags</label>
                  <div className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="e.g. React 19, JavaScript, Performance"
                      className={`${inputBase} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.length === 0 ? (
                      <p className="text-xs italic text-zinc-400">
                        No tags added yet.
                      </p>
                    ) : (
                      tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-zinc-400 transition-colors hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 transition-colors hover:border-amber-500/40 hover:bg-amber-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-500/30 dark:hover:bg-amber-950/10">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-amber-500 focus:ring-amber-500/30 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Featured article
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Highlighted on the homepage
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 transition-colors hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-950/10">
                    <input
                      type="checkbox"
                      {...register("isPublished")}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Publish immediately
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Visible to portfolio readers
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  {editingBlog
                    ? "Changes are saved to your portfolio instantly."
                    : "Your article will appear on the portfolio immediately."}
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting || isMutating}
                    className={btnGhost}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isMutating}
                    className={btnPrimary}
                  >
                    {(isSubmitting || isMutating) && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {editingBlog ? "Update article" : "Publish article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          Reader Modal
          ============================================================ */}
      {readingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReadingModal(null);
          }}
        >
          <div className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {readingModal.category}
                </span>

                {readingModal.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    Featured
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setReadingModal(null)}
                aria-label="Close reader"
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={readingModal.coverImage}
                  alt={readingModal.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
                {readingModal.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-code text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {readingModal.publishedAt
                    ? new Date(readingModal.publishedAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )
                    : "Not published"}
                </span>
                <span
                  aria-hidden="true"
                  className="text-zinc-300 dark:text-zinc-700"
                >
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {readingModal.readTimeMinutes} min read
                </span>
                {readingModal.tags && readingModal.tags.length > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="text-zinc-300 dark:text-zinc-700"
                    >
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="h-3 w-3" />
                      {readingModal.tags.length} tags
                    </span>
                  </>
                )}
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <MarkdownRenderer content={readingModal.content} />
              </div>

              {readingModal.tags && readingModal.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  {readingModal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          Delete confirmation
          ============================================================ */}
      <DeleteConfirmation
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete article?"
        description="This will permanently remove the article, its cover image reference, and all associated tags from your portfolio. This action cannot be undone."
        itemName={deleteTarget?.title}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default BlogsSection;