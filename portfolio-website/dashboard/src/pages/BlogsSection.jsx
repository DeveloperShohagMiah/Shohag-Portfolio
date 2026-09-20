import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Tag,
  X,
  Eye,
  FileText,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MarkdownRenderer } from '../components/MarkDownRenderer.jsx';
import { RichContentEditor } from '../components/RichContentEditor.jsx';

const blogTemplates = [
  {
    title: 'Technical Tutorial',
    content: `# Modern Full-Stack Engineering with React 19

In this comprehensive guide, we examine the newest patterns introduced in React 19 for building responsive user interfaces.

## Why This Matters
Traditional state management often requires intricate state machines and boilerplate code for asynchronous data loading. React 19 fundamentally simplifies this workflow.

### Core Primitives
- **useActionState**: Declarative pending and error states.
- **useOptimistic**: Instantaneous client-side feedback before server reconciliation.
- **Form Actions**: Seamless progressive enhancement.

\`\`\`javascript
// Example: React 19 Optimistic UI update
import { useOptimistic } from 'react';

export function CommentList({ comments, addCommentAction }) {
  const [optimisticList, setOptimistic] = useOptimistic(
    comments,
    (state, newComment) => [...state, { ...newComment, pending: true }]
  );
  // Render list...
}
\`\`\`

> *"True performance is measured by perceived responsiveness as much as raw millisecond benchmarks."*

## Performance Benchmark
| Strategy | Server Roundtrip | Perceived Latency |
| --- | --- | --- |
| Legacy Fetch | 420ms | Noticeable delay |
| React 19 Optimistic | 0ms | Instantaneous |

## Summary
Adopting modern primitives significantly reduces boilerplate and creates smoother web experiences for users worldwide.`
  },
  {
    title: 'Architecture Review',
    content: `# Microservices vs Modular Monolith: Practical Lessons

Deciding between a modular monolith and microservices is one of the most critical decisions for engineering teams.

## The Core Tradeoffs
1. **Developer Velocity**: Monoliths win early on due to unified type systems and single deployment pipelines.
2. **Domain Isolation**: Microservices shine when distinct teams need autonomous delivery cadences.

### Key Evaluation Criteria
- **Traffic Patterns**: Do specific routes experience 100x the load of others?
- **Team Topology**: How many independent squads are pushing code daily?

> *"Do not distribute until you have mastered modularity."*`
  }
];

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

export function BlogsSection() {
  const { blogs, addBlog, updateBlog, deleteBlog, searchQuery } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [readingModal, setReadingModal] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
      content: '',
      readTime: '5 min read',
      publishedAt: new Date().toISOString().split('T')[0],
      isFeatured: false,
      isActive: true
    }
  });

  const previewImage = watch('image');
  const previewContent = watch('content');

  useEffect(() => {
    register('content', {
      required: 'Article content is required',
      minLength: { value: 20, message: 'Content must be at least 20 characters' }
    });
  }, [register]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setTags([]);
    reset({
      title: '',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
      content: '',
      readTime: '5 min read',
      publishedAt: new Date().toISOString().split('T')[0],
      isFeatured: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTags(blog.tags || []);
    reset({
      title: blog.title,
      category: blog.category,
      image: blog.image,
      content: blog.content,
      readTime: blog.readTime || '5 min read',
      publishedAt: blog.publishedAt || new Date().toISOString().split('T')[0],
      isFeatured: blog.isFeatured,
      isActive: blog.isActive
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
    if (editingBlog) {
      updateBlog(editingBlog.id, {
        title: data.title,
        category: data.category,
        image: data.image,
        content: data.content,
        readTime: data.readTime,
        publishedAt: data.publishedAt,
        tags: tags,
        isFeatured: data.isFeatured,
        isActive: data.isActive
      });
    } else {
      addBlog({
        title: data.title,
        category: data.category,
        image: data.image,
        content: data.content,
        readTime: data.readTime,
        publishedAt: data.publishedAt,
        tags: tags,
        isFeatured: data.isFeatured,
        isActive: data.isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredBlogs = blogs.filter((blog) => {
    return (
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Blogs &amp; Articles Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Image, title, content, category, tags, featured flag, and active publish status.
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

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBlogs.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No blogs found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Start writing your technical publications using the form.
            </p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              id={`blog-card-${blog.id}`}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Blog Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={blog.image}
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
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${blog.isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800/80 text-white backdrop-blur-xs'
                        }`}
                    >
                      {blog.isActive ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-[11px] font-medium text-white">
                    {blog.category}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.publishedAt || 'Recent'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {blog.readTime || '5 min'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {cleanSnippet(blog.content)}
                  </p>

                  {/* Tags */}
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

              {/* Actions */}
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
                    onClick={() => updateBlog(blog.id, { isFeatured: !blog.isFeatured })}
                    className={`p-1.5 rounded-lg transition-colors ${blog.isFeatured
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
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Edit blog"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${blog.title}"?`)) {
                        deleteBlog(blog.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
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
              {/* Title */}
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

              {/* Category & Read Time */}
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
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    {...register('readTime')}
                    placeholder="e.g. 6 min read"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Cover Image URL & Preview */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                {errors.image && (
                  <p className="text-xs text-rose-500 mt-1">{errors.image.message}</p>
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

              {/* Content with Rich Content Editor */}
              <div id="blog-content-editor-container">
                <RichContentEditor
                  label="Article Content & Markdown"
                  required={true}
                  value={previewContent || ''}
                  onChange={(val) => {
                    setValue('content', val, { shouldValidate: true, shouldDirty: true });
                    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
                    const mins = Math.max(1, Math.ceil(words / 200));
                    setValue('readTime', `${mins} min read`);
                  }}
                  placeholder="Write your comprehensive technical article, tutorial, or architecture post. Leverage Markdown syntax, headings, code blocks with syntax highlighting, bullet lists, and live preview..."
                  minHeight="min-h-[280px]"
                  templates={blogTemplates}
                  error={errors.content?.message}
                  helperText="Full Markdown editor with toolbar formatting, code snippets, tables, and split live preview."
                />
              </div>

              {/* Tags */}
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

              {/* Toggles */}
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
                    {...register('isActive')}
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

              {/* Buttons */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
                >
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
                src={readingModal.image}
                alt={readingModal.title}
                className="w-full aspect-video rounded-xl object-cover mb-4 shadow-xs"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
                {readingModal.title}
              </h2>
              <div className="text-xs text-zinc-400 mb-5 flex items-center gap-3">
                <span>Published: {readingModal.publishedAt}</span>
                <span>•</span>
                <span>{readingModal.readTime}</span>
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
