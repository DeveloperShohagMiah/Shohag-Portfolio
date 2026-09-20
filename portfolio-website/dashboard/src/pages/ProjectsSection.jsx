import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Layers,
  X,
  FolderGit2
} from 'lucide-react';
import toast from 'react-hot-toast';

export function ProjectsSection() {
  const { projects, addProject, updateProject, deleteProject, searchQuery } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [stackInput, setStackInput] = useState('');
  const [filterFeatured, setFilterFeatured] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      image: '',
      githubLink: '',
      liveLink: '',
      order: 1,
      isFeatured: false,
      isActive: true
    }
  });

  const previewImage = watch('image');

  const openCreateModal = () => {
    setEditingProject(null);
    setStacks([]);
    reset({
      title: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
      githubLink: 'https://github.com/shohagmiah/',
      liveLink: 'https://demo.app',
      order: projects.length + 1,
      isFeatured: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setStacks(proj.stacks || []);
    reset({
      title: proj.title,
      description: proj.description,
      image: proj.image,
      githubLink: proj.githubLink,
      liveLink: proj.liveLink,
      order: proj.order,
      isFeatured: proj.isFeatured,
      isActive: proj.isActive
    });
    setIsModalOpen(true);
  };

  const handleAddStack = (e) => {
    if (e) e.preventDefault();
    const val = stackInput.trim();
    if (!val) return;
    if (stacks.includes(val)) {
      toast.error('Technology stack already added');
      return;
    }
    setStacks([...stacks, val]);
    setStackInput('');
  };

  const handleRemoveStack = (item) => {
    setStacks(stacks.filter((s) => s !== item));
  };

  const onSubmit = async (data) => {
    if (editingProject) {
      updateProject(editingProject.id, {
        title: data.title,
        description: data.description,
        image: data.image,
        stacks: stacks,
        githubLink: data.githubLink,
        liveLink: data.liveLink,
        order: Number(data.order),
        isFeatured: data.isFeatured,
        isActive: data.isActive
      });
    } else {
      addProject({
        title: data.title,
        description: data.description,
        image: data.image,
        stacks: stacks,
        githubLink: data.githubLink,
        liveLink: data.liveLink,
        order: Number(data.order),
        isFeatured: data.isFeatured,
        isActive: data.isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredProjects = projects
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((project) => {
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.stacks.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFeatured = filterFeatured ? project.isFeatured : true;
      return matchesSearch && matchesFeatured;
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Projects Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Image, title, description, stacks, GitHub link, live demo, display order, featured status, and active visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="filter-featured-projects-btn"
            type="button"
            onClick={() => setFilterFeatured(!filterFeatured)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
              filterFeatured
                ? 'bg-amber-500 text-white border-transparent'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {filterFeatured ? '★ Featured Only' : 'All Projects'}
          </button>

          <button
            id="add-new-project-btn"
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
        </div>
      </div>

      {/* Projects List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <FolderGit2 className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No projects found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add your portfolio projects using the button above.
            </p>
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              id={`project-card-${proj.id}`}
              className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Project Image & Overlay badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {proj.isFeatured && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        proj.isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-800/80 text-white backdrop-blur-xs'
                      }`}
                    >
                      {proj.isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-[10px] font-mono text-zinc-200">
                    Order: #{proj.order}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Stacks */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {proj.stacks &&
                      proj.stacks.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Links & Actions footer */}
              <div className="p-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.liveLink && (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateProject(proj.id, { isFeatured: !proj.isFeatured })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      proj.isFeatured
                        ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                    title={proj.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`w-4 h-4 ${proj.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Edit project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${proj.title}"?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Project Form */}
      {isModalOpen && (
        <div
          id="project-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingProject ? 'Edit Project' : 'Add New Project'}
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
              {/* Title & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Project title is required' })}
                    placeholder="e.g. Nova SaaS Analytics Platform"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('order', {
                      required: 'Order is required',
                      valueAsNumber: true
                    })}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Summarize key features, architecture, problems solved, and metrics..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Project Cover Image URL *
                </label>
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.image && (
                  <p className="text-xs text-rose-500 mt-1">{errors.image.message}</p>
                )}

                {previewImage && (
                  <div className="mt-2.5 aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={previewImage}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Stacks */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Technologies / Stacks
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddStack();
                      }
                    }}
                    placeholder="e.g. React, JavaScript, Tailwind CSS, PostgreSQL"
                    className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddStack()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Add Stack
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stacks.map((st) => (
                    <span
                      key={st}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      {st}
                      <button type="button" onClick={() => handleRemoveStack(st)}>
                        <X className="w-3 h-3 text-zinc-400 hover:text-rose-500" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub Link & Live Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    GitHub Link
                  </label>
                  <input
                    type="url"
                    {...register('githubLink')}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    {...register('liveLink')}
                    placeholder="https://myproject.com"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Toggles: isFeatured & isActive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    {...register('isFeatured')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-400"
                  />
                  <div className="text-xs">
                    <span className="font-semibold block text-zinc-900 dark:text-zinc-100">
                      Featured Project
                    </span>
                    <span className="text-zinc-500">Pinned to portfolio top section</span>
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
                      Project is Active
                    </span>
                    <span className="text-zinc-500">Visible on public portfolio</span>
                  </div>
                </label>
              </div>

              {/* Modal Buttons */}
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
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
