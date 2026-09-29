// BlogsSection.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  Star,
  X,
  Eye,
  Loader2,
  RefreshCw,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MarkdownRenderer } from '../components/MarkDownRenderer.jsx';
import { RichContentEditor } from '../components/RichContentEditor.jsx';
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation
} from '@/redux/features/blogsApi.js';



function cleanSnippet(text) {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/>\s+/gm, '')
    .trim();
}

const DEFAULT_VALUES = {
  title: '',
  category: 'Web Development',
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
  content: '',
  readTimeMinutes: 5,
  isFeatured: false,
  isPublished: true,
};

export function BlogsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [readingModal, setReadingModal] = useState(null);

  const {
    data: blogsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllBlogsQuery();

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // Backend nests the paginated result inside ApiResponse: { data: { blogs, pagination } }
  const blogs = useMemo(() => {
    return blogsResponse?.data?.blogs || [];
  }, [blogsResponse]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const previewImage = watch('coverImage');
  const previewContent = watch('content');
  const readTimeMinutes = watch('readTimeMinutes');

  useEffect(() => {
    register('content', {
      required: 'Article content is required',
      minLength: { value: 20, message: 'Content must be at least 20 characters' }
    });
  }, [register]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTags([]);
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTags(blog.tags || []);
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
    if (tags.includes(val)) {
      toast.error('Tag already added');
      return;
    }
    setTags([...tags, val]);
    setTagInput('');
  };

  const handleRemoveTag = (item) => {
    setTags(tags.filter((t) => t !== item));
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      category: data.category,
      coverImage: data.coverImage,
      content: data.content,
      readTimeMinutes: Number(data.readTimeMinutes),
      tags,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
    };

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, ...payload }).unwrap();
        toast.success('Article updated successfully');
      } else {
        await createBlog(payload).unwrap();
        toast.success('Article published successfully');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message ||
        err?.message ||
        `Failed to ${editingBlog ? 'update' : 'publish'} article`
      );
    }
  };

  const handleToggleFeatured = async (blog) => {
    try {
      await updateBlog({ id: blog._id, isFeatured: !blog.isFeatured }).unwrap();
      toast.success(!blog.isFeatured ? 'Marked as featured' : 'Removed from featured');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update featured status');
    }
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;
    try {
      await deleteBlog(blog._id).unwrap();
      toast.success('Article deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete article');
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Blogs &amp; Articles Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Image, title, content, category, tags, featured flag, and publish status.
          </p>
        </div>

        <button
          id="add-new-blog-btn"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Write New Blog
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, category, tag, or content..."
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      {/* Loading / Error / Empty / Grid */}
      {isLoading ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <Loader2 className="w-8 h-8 text-zinc-400 mx-auto mb-3 animate-spin" />
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Loading articles...
          </p>
        </div>
      ) : isError ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">
            Failed to load articles
          </p>
          <p className="text-xs text-zinc-500 mb-4">
            {error?.data?.message || error?.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBlogs.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {searchQuery ? 'No blogs match your search' : 'No blogs found'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {searchQuery
                  ? 'Try a different search term.'
                  : 'Start writing your technical publications using the form.'}
              </p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                id={`blog-card-${blog._id}`}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      {blog.isFeatured && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${blog.isPublished
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-800/80 text-white backdrop-blur-xs'
                          }`}
                      >
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-[11px] font-medium text-white">
                      {blog.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published yet'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTimeMinutes ? `${blog.readTimeMinutes} min read` : '5 min read'}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {cleanSnippet(blog.content)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {blog.tags &&
                        blog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setReadingModal(blog)}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Read Full Article
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(blog)}
                      disabled={isMutating}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${blog.isFeatured
                        ? 'text-amber-500'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                      title="Toggle featured"
                    >
                      <Star className={`w-4 h-4 ${blog.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      disabled={isMutating}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                      title="Edit blog"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      disabled={isMutating}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 disabled:opacity-50"
                      title="Delete blog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for Add / Edit Blog */}
      {isModalOpen && (
        <div
          id="blog-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingBlog ? 'Edit Blog Article' : 'Write New Blog Article'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Blog title is required' })}
                  placeholder="e.g. Mastering React 19 Actions and Concurrent Transitions"
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    {...register('category', { required: 'Category is required' })}
                    placeholder="e.g. Frontend Engineering"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                  {errors.category && (
                    <p className="text-xs text-rose-500 mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Estimated Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('readTimeMinutes', { valueAsNumber: true, min: 1 })}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  {...register('coverImage', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                {errors.coverImage && (
                  <p className="text-xs text-rose-500 mt-1">{errors.coverImage.message}</p>
                )}

                {previewImage && (
                  <div className="mt-2.5 aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={previewImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div id="blog-content-editor-container">
                <RichContentEditor
                  label="Article Content & Markdown"
                  required={true}
                  value={previewContent || ''}
                  onChange={(val) => {
                    setValue('content', val, { shouldValidate: true, shouldDirty: true });
                    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
                    const mins = Math.max(1, Math.ceil(words / 200));
                    setValue('readTimeMinutes', mins);
                  }}
                  placeholder="Write your comprehensive technical article, tutorial, or architecture post. Leverage Markdown syntax, headings, code blocks with syntax highlighting, bullet lists, and live preview..."
                  minHeight="min-h-[280px]"
                  error={errors.content?.message}
                  helperText={`Full Markdown editor with live preview. Estimated read time: ${readTimeMinutes || 1} min.`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Article Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="e.g. React 19, JavaScript, Performance"
                    className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      #{t}
                      <button type="button" onClick={() => handleRemoveTag(t)}>
                        <X className="w-3 h-3 text-zinc-400 hover:text-rose-500" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-400"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                      Featured Article
                    </span>
                    <span className="text-zinc-500">Highlighted on homepage</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    {...register('isPublished')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                      Publish Immediately
                    </span>
                    <span className="text-zinc-500">Visible to portfolio readers</span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting || isMutating}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isMutating}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {(isSubmitting || isMutating) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal */}
      {readingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-3xl w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {readingModal.category}
              </span>
              <button
                onClick={() => setReadingModal(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <img
                src={readingModal.coverImage}
                alt={readingModal.title}
                className="w-full aspect-video rounded-xl object-cover mb-4 shadow-xs"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
                {readingModal.title}
              </h2>
              <div className="text-xs text-zinc-400 mb-5 flex items-center gap-3">
                <span>
                  Published: {readingModal.publishedAt ? new Date(readingModal.publishedAt).toLocaleDateString() : 'Not published yet'}
                </span>
                <span>•</span>
                <span>{readingModal.readTimeMinutes} min read</span>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <MarkdownRenderer content={readingModal.content} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}