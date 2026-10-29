import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Star,
  X,
  FolderGit2,
  Sparkles,
  Search,
  Hash,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/redux/features/projectApi.js";

import DeleteConfirmation from "../ui/DeleteConfirmation.jsx";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  image: FALLBACK_IMAGE,
  githubLink: "",
  liveLink: "",
  order: 1,
  isFeatured: false,
  isActive: true,
};

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600";

const labelBase =
  "mb-2 block text-xs font-semibold text-zinc-700 dark:text-zinc-300";

const errorBase = "mt-1.5 text-xs text-rose-500";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200";

const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";

const getErrorMessage = (error, fallback) =>
  error?.data?.message ||
  error?.data?.error ||
  error?.message ||
  fallback;

const getProjectId = (project) => project?._id || project?.id;

export default function ProjectSection({ searchQuery = "" }) {
  const {
    data: projectsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllProjectsQuery();

  const [createProject, { isLoading: isCreating }] =
    useCreateProjectMutation();

  const [updateProject, { isLoading: isUpdating }] =
    useUpdateProjectMutation();

  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [stackInput, setStackInput] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const imageValue = watch("image");
  const isSaving = isCreating || isUpdating;

  const projects = Array.isArray(projectsResponse?.data?.projects)
    ? projectsResponse.data.projects
    : Array.isArray(projectsResponse?.data)
      ? projectsResponse.data
      : Array.isArray(projectsResponse)
        ? projectsResponse
        : [];

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...projects]
      .filter((project) => {
        const matchesSearch =
          !normalizedQuery ||
          project.title?.toLowerCase().includes(normalizedQuery) ||
          project.description?.toLowerCase().includes(normalizedQuery) ||
          (Array.isArray(project.stack) ? project.stack : []).some((item) =>
            item.toLowerCase().includes(normalizedQuery)
          );

        const matchesFeatured =
          !filterFeatured || Boolean(project.isFeatured);

        return matchesSearch && matchesFeatured;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [projects, searchQuery, filterFeatured]);

  const featuredCount = projects.filter(
    (project) => project.isFeatured
  ).length;

  const activeCount = projects.filter(
    (project) => project.isActive
  ).length;

  const openCreateModal = () => {
    setEditingProject(null);
    setStacks([]);
    setStackInput("");
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setStacks(
      Array.isArray(project.stack)
        ? [...project.stack]
        : Array.isArray(project.technologies)
          ? [...project.technologies]
          : []
    );

    setStackInput("");

    reset({
      ...DEFAULT_VALUES,
      ...project,
      title: project.title || "",
      description: project.description || "",
      image: project.image || FALLBACK_IMAGE,
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      order: project.order ?? 1,
      isFeatured: Boolean(project.isFeatured),
      isActive: project.isActive !== false,
    });

    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingProject(null);
    setStacks([]);
    setStackInput("");
    reset(DEFAULT_VALUES);
  };

  const handleAddStack = (event) => {
    event.preventDefault();

    const value = stackInput.trim();

    if (!value) return;

    if (stacks.some((stack) => stack.toLowerCase() === value.toLowerCase())) {
      toast.error("This technology has already been added.");
      return;
    }

    setStacks((currentStacks) => [...currentStacks, value]);
    setStackInput("");
  };

  const handleRemoveStack = (stackToRemove) => {
    setStacks((currentStacks) =>
      currentStacks.filter((stack) => stack !== stackToRemove)
    );
  };

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim() || FALLBACK_IMAGE,
      githubLink: formData.githubLink.trim(),
      liveLink: formData.liveLink.trim(),
      order: Number(formData.order),
      stack: stacks,
      isFeatured: Boolean(formData.isFeatured),
      isActive: Boolean(formData.isActive),
    };

    try {
      if (editingProject) {
        await updateProject({
          id: getProjectId(editingProject),
          ...payload,
        }).unwrap();

        toast.success("Project updated successfully.");
      } else {
        await createProject(payload).unwrap();

        toast.success("Project created successfully.");
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setStacks([]);
      setStackInput("");
      reset(DEFAULT_VALUES);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingProject
            ? "Failed to update project."
            : "Failed to create project."
        )
      );
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      await updateProject({
        id: getProjectId(project),
        isFeatured: !project.isFeatured,
      }).unwrap();

      toast.success(
        project.isFeatured
          ? "Project removed from featured."
          : "Project marked as featured."
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update featured status."));
    }
  };

  // Open the custom confirmation modal instead of window.confirm().
  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteProject.isLoading) return;

    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || deleteProject.isLoading) return;

    try {
      await deleteProject(getProjectId(projectToDelete)).unwrap();

      toast.success("Project deleted successfully.");

      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete project."));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        <span className="ml-3 text-sm text-zinc-500">
          Loading projects...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
          Failed to load projects.
        </p>

        <button
          type="button"
          onClick={refetch}
          className="mt-3 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400">
              <FolderGit2 className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Projects
              </h1>

              <p className="mt-0.5 text-xs text-zinc-500">
                Manage your portfolio projects and technologies.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className={btnPrimary}
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500">
            Total projects
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500">
            Featured projects
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {featuredCount}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500">
            Active projects
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {activeCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
          <Search className="h-4 w-4" />
          {searchQuery.trim()
            ? `Search results for "${searchQuery.trim()}"`
            : "All projects"}
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {filteredProjects.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFilterFeatured((current) => !current)}
          aria-pressed={filterFeatured}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${filterFeatured
            ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${filterFeatured ? "fill-current" : ""
              }`}
          />
          Featured only
        </button>
      </div>

      {/* Project grid */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800">
            <FolderGit2 className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No projects found
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-zinc-500">
            {filterFeatured
              ? "There are no featured projects matching your current filters."
              : "Add a project or adjust your search to see results here."}
          </p>

          {!searchQuery.trim() && !filterFeatured && (
            <button
              type="button"
              onClick={openCreateModal}
              className={`${btnPrimary} mt-5`}
            >
              <Plus className="h-4 w-4" />
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((proj) => (
            <article
              key={getProjectId(proj)}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Project image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={proj.image || FALLBACK_IMAGE}
                  alt={proj.title || "Project preview"}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {proj.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/90 px-2.5 py-1 text-[10px] font-semibold text-amber-950 backdrop-blur">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  )}

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur ${proj.isActive
                      ? "border-emerald-300/30 bg-emerald-400/90 text-emerald-950"
                      : "border-zinc-300/30 bg-zinc-800/80 text-white"
                      }`}
                  >
                    {proj.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-xl border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  <Hash className="h-3 w-3" />
                  Order {proj.order ?? 0}
                </span>
              </div>

              {/* Project details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {proj.title}
                    </h3>

                    <p className="mt-1 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {proj.description || "No description provided."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(proj)}
                    title={
                      proj.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                    aria-label={
                      proj.isFeatured
                        ? `Remove ${proj.title} from featured`
                        : `Feature ${proj.title}`
                    }
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${proj.isFeatured
                      ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                      : "border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-amber-500 dark:border-zinc-800 dark:hover:bg-zinc-800"
                      }`}
                  >
                    <Star
                      className={`h-4 w-4 ${proj.isFeatured ? "fill-current" : ""
                        }`}
                    />
                  </button>
                </div>

                {/* Technologies */}
                {Array.isArray(proj.stack) && proj.stack.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.stack.slice(0, 5).map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                      >
                        {technology}
                      </span>
                    ))}

                    {proj.stack.length > 5 && (
                      <span className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:border-zinc-800">
                        +{proj.stack.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Project links */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {proj.githubLink && (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Github className="h-3.5 w-3.5" />
                      GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {proj.liveLink && (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live demo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <span className="text-[10px] text-zinc-400">
                    Project #{proj.order ?? 0}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(proj)}
                      title="Edit project"
                      aria-label={`Edit ${proj.title}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(proj)}
                      title="Delete project"
                      aria-label={`Delete ${proj.title}`}
                      disabled={deleteProject.isLoading}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-rose-200 px-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFormModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
              <div>
                <h2
                  id="project-modal-title"
                  className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {editingProject ? "Edit project" : "Create project"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  {editingProject
                    ? "Update your project information."
                    : "Add a new project to your portfolio."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={isSaving}
                aria-label="Close project form"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5 sm:p-6">
              {/* Title and order */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
                <div>
                  <label htmlFor="project-title" className={labelBase}>
                    Project title <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="project-title"
                    type="text"
                    placeholder="e.g. Portfolio Dashboard"
                    className={inputBase}
                    {...register("title", {
                      required: "Project title is required.",
                      minLength: {
                        value: 2,
                        message: "Title must be at least 2 characters.",
                      },
                    })}
                  />

                  {errors.title && (
                    <p className={errorBase}>{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="project-order" className={labelBase}>
                    Display order
                  </label>

                  <input
                    id="project-order"
                    type="number"
                    min="0"
                    className={inputBase}
                    {...register("order", {
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Order cannot be negative.",
                      },
                    })}
                  />

                  {errors.order && (
                    <p className={errorBase}>{errors.order.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className={labelBase}>
                  Description <span className="text-rose-500">*</span>
                </label>

                <textarea
                  id="project-description"
                  rows={4}
                  placeholder="Describe what the project does..."
                  className={`${inputBase} resize-y`}
                  {...register("description", {
                    required: "Project description is required.",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters.",
                    },
                  })}
                />

                {errors.description && (
                  <p className={errorBase}>{errors.description.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="project-image" className={labelBase}>
                  Image URL
                </label>

                <input
                  id="project-image"
                  type="url"
                  placeholder="https://example.com/project-image.png"
                  className={inputBase}
                  {...register("image")}
                />

                {imageValue && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={imageValue}
                      alt="Project preview"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                      onLoad={(event) => {
                        event.currentTarget.style.display = "block";
                      }}
                      className="max-h-48 w-full object-cover"
                    />
                  </div>
                )}

                {!imageValue && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 p-4 text-xs text-zinc-500 dark:border-zinc-800">
                    <ImageIcon className="h-4 w-4" />
                    Add an image URL to preview the project image.
                  </div>
                )}
              </div>

              {/* Stack */}
              <div>
                <label htmlFor="project-stack" className={labelBase}>
                  Technologies / stack
                </label>

                <form
                  onSubmit={handleAddStack}
                  className="flex gap-2"
                >
                  <input
                    id="project-stack"
                    type="text"
                    value={stackInput}
                    onChange={(event) => setStackInput(event.target.value)}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className={inputBase}
                  />

                  <button
                    type="submit"
                    className={btnGhost}
                    aria-label="Add technology"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </form>

                {stacks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stacks.map((stack) => (
                      <span
                        key={stack}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-300"
                      >
                        {stack}

                        <button
                          type="button"
                          onClick={() => handleRemoveStack(stack)}
                          aria-label={`Remove ${stack}`}
                          className="rounded p-0.5 transition hover:bg-violet-200 dark:hover:bg-violet-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="project-github" className={labelBase}>
                    GitHub URL
                  </label>

                  <div className="relative">
                    <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="project-github"
                      type="url"
                      placeholder="https://github.com/..."
                      className={`${inputBase} pl-10`}
                      {...register("githubLink")}
                    />
                  </div>

                  {errors.githubLink && (
                    <p className={errorBase}>{errors.githubLink.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="project-live" className={labelBase}>
                    Live demo URL
                  </label>

                  <div className="relative">
                    <ExternalLink className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="project-live"
                      type="url"
                      placeholder="https://example.com"
                      className={`${inputBase} pl-10`}
                      {...register("liveLink")}
                    />
                  </div>

                  {errors.liveLink && (
                    <p className={errorBase}>{errors.liveLink.message}</p>
                  )}
                </div>
              </div>

              {/* Project options */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-3.5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-violet-600"
                    {...register("isFeatured")}
                  />

                  <span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      Featured project
                    </span>

                    <span className="mt-1 block text-[11px] leading-4 text-zinc-500">
                      Highlight this project in your portfolio.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-3.5 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-emerald-600"
                    {...register("isActive")}
                  />

                  <span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                      Active project
                    </span>

                    <span className="mt-1 block text-[11px] leading-4 text-zinc-500">
                      Mark this project as active.
                    </span>
                  </span>
                </label>
              </div>

              {/* Form actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSaving}
                  className={btnGhost}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className={btnPrimary}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingProject ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  {isSaving
                    ? "Saving..."
                    : editingProject
                      ? "Save changes"
                      : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom delete confirmation modal */}
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete project?"
        description="This project will be permanently removed from your portfolio. This action cannot be undone."
        itemName={projectToDelete?.title || "Untitled project"}
        confirmLabel="Delete project"
        cancelLabel="Keep project"
        isLoading={deleteProject.isLoading}
      />
    </div>
  );
}