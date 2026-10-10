import React, { useState } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/redux/features/projectApi.js";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";

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

export function ProjectsSection({ searchQuery = "" }) {
  const {
    data: projectsResponse,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useGetAllProjectsQuery();

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [stackInput, setStackInput] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const previewImage = watch("image");
  const isSaving = isCreating || isUpdating || isSubmitting;

  const projects = projectsResponse?.data?.projects || [];

  const openCreateModal = () => {
    setEditingProject(null);
    setStacks([]);
    setStackInput("");
    reset({ ...DEFAULT_VALUES, order: projects.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setStacks(proj.stacks || []);
    setStackInput("");
    reset({
      title: proj.title,
      description: proj.description,
      image: proj.image,
      githubLink: proj.githubLink || "",
      liveLink: proj.liveLink || "",
      order: proj.order,
      isFeatured: proj.isFeatured,
      isActive: proj.isActive,
    });
    setIsModalOpen(true);
  };

  const handleAddStack = (e) => {
    if (e) e.preventDefault();
    const val = stackInput.trim();
    if (!val) return;

    if (stacks.some((s) => s.toLowerCase() === val.toLowerCase())) {
      toast.error("Technology stack already added");
      return;
    }

    setStacks([...stacks, val]);
    setStackInput("");
  };

  const handleRemoveStack = (item) => {
    setStacks(stacks.filter((s) => s !== item));
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      image: data.image.trim(),
      stacks,
      githubLink: data.githubLink?.trim() || "",
      liveLink: data.liveLink?.trim() || "",
      order: Number(data.order),
      isFeatured: data.isFeatured,
      isActive: data.isActive,
    };

    try {
      if (editingProject) {
        await updateProject({ id: editingProject._id, ...payload }).unwrap();
        toast.success("Project updated successfully!");
      } else {
        await createProject(payload).unwrap();
        toast.success("Project created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to save project."
      );
    }
  };

  const handleToggleFeatured = async (proj) => {
    try {
      await updateProject({
        id: proj._id,
        isFeatured: !proj.isFeatured,
      }).unwrap();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update featured status."
      );
    }
  };

  const handleDelete = async (proj) => {
    if (!window.confirm(`Delete "${proj.title}"?`)) return;
    try {
      await deleteProject(proj._id).unwrap();
      toast.success("Project deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete project.");
    }
  };

  if (isLoadingProjects) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorProjects) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load projects
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            Refresh the page to try again.
          </p>
        </div>
      </div>
    );
  }

  const filteredProjects = projects
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((project) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        (project.stacks || []).some((st) => st.toLowerCase().includes(q));

      const matchesFeatured = filterFeatured ? project.isFeatured : true;
      return matchesSearch && matchesFeatured;
    });

  const featuredCount = projects.filter((p) => p.isFeatured).length;
  const activeCount = projects.filter((p) => p.isActive).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Projects
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Portfolio showcase
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Image, description, stacks, GitHub and live links, order, featured
            status, and public visibility — everything shown on your portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterFeatured((v) => !v)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-semibold transition-all active:scale-[0.98] ${filterFeatured
                ? "border-amber-500/40 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${filterFeatured ? "fill-current" : ""
                }`}
            />
            {filterFeatured ? "Featured only" : "All projects"}
          </button>

          <button type="button" onClick={openCreateModal} className={btnPrimary}>
            <Plus className="h-4 w-4" />
            Add project
          </button>
        </div>
      </div>

      {/* ============================================================
          Stats strip
          ============================================================ */}
      {projects.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {projects.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Active
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {activeCount}
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
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Shown
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {filteredProjects.length}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          Projects grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {searchQuery || filterFeatured ? (
                <Search className="h-5 w-5" />
              ) : (
                <FolderGit2 className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery || filterFeatured
                ? "No matching projects"
                : "No projects yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {searchQuery || filterFeatured
                ? "Try a different search or clear filters."
                : "Add your first portfolio project to display it here."}
            </p>
            {!searchQuery && !filterFeatured && (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Add project
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <article
              key={proj._id}
              id={`project-card-${proj._id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={proj.image}
                  alt={proj.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Overlay gradient for badge legibility */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
                />

                {/* Order badge — bottom-left */}
                <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 backdrop-blur-md">
                  <Hash className="h-2.5 w-2.5 text-white/70" />
                  <span className="font-mono text-[10px] font-medium text-white/90">
                    {String(proj.order).padStart(2, "0")}
                  </span>
                </div>

                {/* Status badges — top-right */}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
                  {proj.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur-sm ${proj.isActive
                        ? "bg-emerald-500/95 text-white"
                        : "bg-zinc-900/80 text-white/90"
                      }`}
                  >
                    {proj.isActive ? "Active" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {proj.title}
                </h3>

                <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {proj.description}
                </p>

                {/* Stacks */}
                {proj.stacks && proj.stacks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {proj.stacks.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.stacks.length > 4 && (
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                        +{proj.stacks.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
                {/* External links */}
                <div className="flex items-center gap-1">
                  {proj.githubLink ? (
                    <a
                      href={proj.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      title="GitHub repository"
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="rounded-lg p-2 text-zinc-300 dark:text-zinc-700">
                      <Github className="h-3.5 w-3.5" />
                    </span>
                  )}

                  {proj.liveLink ? (
                    <a
                      href={proj.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      title="Live demo"
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="rounded-lg p-2 text-zinc-300 dark:text-zinc-700">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(proj)}
                    title={
                      proj.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                    className={`rounded-lg p-2 transition-colors ${proj.isFeatured
                        ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${proj.isFeatured ? "fill-current" : ""
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    title="Edit project"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(proj)}
                    title="Delete project"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
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
          Modal
          ============================================================ */}
      {isModalOpen && (
        <div
          id="project-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <FolderGit2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {editingProject ? "Edit project" : "New project"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingProject
                      ? "Update the project details"
                      : "Add a new project to your portfolio"}
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
              <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
                {/* Title + Order */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className={labelBase}>
                      Project title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g. Nova SaaS Analytics Platform"
                      {...register("title", {
                        required: "Project title is required",
                      })}
                      className={inputBase}
                    />
                    {errors.title && (
                      <p className={errorBase}>{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="order" className={labelBase}>
                      Display order <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="order"
                      type="number"
                      min="1"
                      {...register("order", {
                        required: "Order is required",
                        valueAsNumber: true,
                      })}
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={labelBase}>
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Summarize key features, architecture, problems solved, and impact…"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`${inputBase} resize-none leading-relaxed`}
                  />
                  {errors.description && (
                    <p className={errorBase}>{errors.description.message}</p>
                  )}
                </div>

                {/* Image URL + preview */}
                <div>
                  <label htmlFor="image" className={labelBase}>
                    Cover image URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="image"
                    type="url"
                    placeholder="https://images.unsplash.com/…"
                    {...register("image", { required: "Image URL is required" })}
                    className={inputBase}
                  />
                  {errors.image && (
                    <p className={errorBase}>{errors.image.message}</p>
                  )}

                  {previewImage && (
                    <div className="mt-3 aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <img
                        src={previewImage}
                        alt="Project preview"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Stacks */}
                <div>
                  <label className={labelBase}>Technologies & stacks</label>
                  <div className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStack();
                        }
                      }}
                      placeholder="e.g. React, Tailwind CSS, PostgreSQL"
                      className={`${inputBase} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleAddStack}
                      className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {stacks.length === 0 ? (
                      <p className="text-xs italic text-zinc-400">
                        No technologies added yet.
                      </p>
                    ) : (
                      stacks.map((st) => (
                        <span
                          key={st}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                        >
                          {st}
                          <button
                            type="button"
                            onClick={() => handleRemoveStack(st)}
                            className="text-zinc-400 transition-colors hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="githubLink" className={labelBase}>
                      GitHub link
                    </label>
                    <input
                      id="githubLink"
                      type="url"
                      placeholder="https://github.com/…"
                      {...register("githubLink")}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label htmlFor="liveLink" className={labelBase}>
                      Live demo link
                    </label>
                    <input
                      id="liveLink"
                      type="url"
                      placeholder="https://myproject.com"
                      {...register("liveLink")}
                      className={inputBase}
                    />
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
                        Featured project
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Pinned to portfolio top section
                      </p>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 transition-colors hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-950/10">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Project is active
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Visible on public portfolio
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  {editingProject
                    ? "Changes are saved to your portfolio instantly."
                    : "Your project will appear on the portfolio immediately."}
                </p>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={btnGhost}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={btnPrimary}
                  >
                    {isSaving
                      ? "Saving…"
                      : editingProject
                        ? "Update project"
                        : "Create project"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}