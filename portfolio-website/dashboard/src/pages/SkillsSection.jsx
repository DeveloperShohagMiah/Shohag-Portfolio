import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicIcon } from "../components/DynamicIcon.jsx";
import DeleteConfirmation from "../ui/DeleteConfirmation.jsx";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Sparkles,
  Search,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetAllSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useToggleSkillStatusMutation,
} from "@/redux/features/skillApi.js";

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "DevOps & Cloud",
  "Tools",
];

const AVAILABLE_SKILL_ICONS = [
  "Atom",
  "FileCode",
  "Palette",
  "Server",
  "Database",
  "Terminal",
  "Workflow",
  "Globe",
  "Cpu",
  "Cloud",
  "ShieldCheck",
  "Zap",
  "Layers",
  "Box",
];

const DEFAULT_VALUES = {
  name: "",
  shortDescription: "",
  category: "Frontend",
  icon: "Atom",
  proficiency: 90,
  isActive: true,
};

const inputBase =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm shadow-zinc-950/[0.02] placeholder:text-zinc-400 outline-none transition-[border-color,box-shadow] focus:border-zinc-400 focus:ring-4 focus:ring-zinc-900/[0.06] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-white/[0.06]";

const labelBase =
  "mb-2 block text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300";

const errorBase = "mt-1.5 text-xs font-medium text-rose-500";

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(9,9,11,0.12)] transition-colors hover:bg-zinc-800 active:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white";

const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800";

const CATEGORY_ACCENT = {
  Frontend: {
    bar: "bg-gradient-to-r from-blue-500 to-sky-400",
    chip: "border-blue-500/15 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  Backend: {
    bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
    chip: "border-emerald-500/15 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  Database: {
    bar: "bg-gradient-to-r from-amber-500 to-orange-400",
    chip: "border-amber-500/15 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  "DevOps & Cloud": {
    bar: "bg-gradient-to-r from-purple-500 to-violet-400",
    chip: "border-purple-500/15 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  },
  Tools: {
    bar: "bg-gradient-to-r from-zinc-500 to-zinc-400",
    chip: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
};

function StatCard({ label, value, detail, accent = "default" }) {
  const valueColor = {
    default: "text-zinc-950 dark:text-zinc-50",
    green: "text-emerald-600 dark:text-emerald-400",
    muted: "text-zinc-500 dark:text-zinc-400",
  }[accent];

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] transition-colors dark:border-zinc-800/90 dark:bg-zinc-900/70 sm:p-6">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-2">
        <p
          className={`text-2xl font-semibold tracking-tight tabular-nums ${valueColor}`}
        >
          {value}
        </p>

        {detail && (
          <span className="pb-1 text-[10px] text-zinc-400">{detail}</span>
        )}
      </div>
    </div>
  );
}

export function SkillsSection({ searchQuery = "" }) {
  const {
    data: skillsResponse,
    isLoading: isLoadingSkills,
    isError: isErrorSkills,
    error,
    refetch,
  } = useGetAllSkillsQuery();

  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();

  const [deleteSkill, { isLoading: isDeleting }] =
    useDeleteSkillMutation();

  const [toggleSkillStatus] = useToggleSkillStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Delete confirmation state
  const [skillToDelete, setSkillToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const selectedIcon = watch("icon");
  const proficiencyVal = watch("proficiency");
  const isSaving = isCreating || isUpdating || isSubmitting;

  const openCreateModal = () => {
    setEditingSkill(null);
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const closeFormModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingSkill(null);
    reset(DEFAULT_VALUES);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);

    reset({
      name: skill.name ?? "",
      shortDescription: skill.shortDescription ?? "",
      category: skill.category ?? "Frontend",
      icon: skill.icon || "Atom",
      proficiency: skill.proficiency ?? 90,
      isActive: skill.isActive ?? true,
    });

    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      shortDescription: data.shortDescription.trim(),
      category: data.category,
      icon: data.icon,
      proficiency: Number(data.proficiency),
      isActive: data.isActive,
    };

    try {
      if (editingSkill) {
        await updateSkill({
          id: editingSkill._id,
          ...payload,
        }).unwrap();

        toast.success("Skill updated successfully!");
      } else {
        await createSkill(payload).unwrap();
        toast.success("Skill created successfully!");
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      reset(DEFAULT_VALUES);
    } catch (err) {
      toast.error(
        err?.data?.message ||
        err?.message ||
        "Failed to save skill."
      );
    }
  };

  const handleToggleStatus = async (skill) => {
    try {
      await toggleSkillStatus(skill._id).unwrap();

      toast.success(
        skill.isActive
          ? "Skill hidden from portfolio."
          : "Skill visible on portfolio."
      );
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update skill status."
      );
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete || isDeleting) return;

    try {
      await deleteSkill(skillToDelete._id).unwrap();

      toast.success("Skill deleted successfully!");
      setSkillToDelete(null);
    } catch (err) {
      toast.error(
        err?.data?.message ||
        err?.message ||
        "Failed to delete skill."
      );

      // Keep the confirmation open so the user can retry or cancel.
    }
  };

  if (isLoadingSkills) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorSkills) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center dark:border-rose-900/50 dark:bg-zinc-900 sm:p-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <RefreshCw className="h-5 w-5" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Failed to load skills
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            {error?.data?.message ||
              error?.message ||
              "Something went wrong while loading your skills."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className={`${btnPrimary} mt-5`}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(skillsResponse?.data)
    ? skillsResponse.data
    : [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSkills = skills.filter((skill) => {
    const name = (skill.name ?? "").toLowerCase();
    const description = (skill.shortDescription ?? "").toLowerCase();
    const category = (skill.category ?? "").toLowerCase();

    const matchesCategory =
      selectedCategory === "All" ||
      skill.category === selectedCategory;

    const matchesSearch =
      !normalizedQuery ||
      name.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      category.includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const activeCount = skills.filter((skill) => skill.isActive).length;

  const averageProficiency = skills.length
    ? Math.round(
      skills.reduce(
        (total, skill) => total + (Number(skill.proficiency) || 0),
        0
      ) / skills.length
    )
    : 0;

  const hasActiveFilters =
    Boolean(normalizedQuery) || selectedCategory !== "All";

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">
      {/* Header */}
      <header className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-white to-zinc-50/80 p-5 shadow-sm shadow-zinc-950/[0.02] dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/70 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
            <Sparkles className="h-3.5 w-3.5" />
            Portfolio management
          </div>

          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            Technical skills
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-[15px] sm:leading-7">
            Manage your technical proficiencies, organize them by category,
            and control which skills appear on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className={`${btnPrimary} shrink-0`}
        >
          <Plus className="h-4 w-4" />
          Add skill
        </button>
      </header>

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total skills" value={skills.length} />

        <StatCard
          label="Active skills"
          value={activeCount}
          detail={skills.length ? `${Math.round((activeCount / skills.length) * 100)}% of total` : "No skills"}
          accent="green"
        />

        <StatCard
          label="Hidden skills"
          value={skills.length - activeCount}
          detail="Not displayed publicly"
          accent="muted"
        />

        <StatCard
          label="Average proficiency"
          value={`${averageProficiency}%`}
          detail="Across all skills"
        />
      </section>

      {/* Category filters */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Categories
          </h2>

          <span className="text-xs text-zinc-500">
            {filteredSkills.length}{" "}
            {filteredSkills.length === 1 ? "result" : "results"}
          </span>
        </div>

        <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;

              const count =
                category === "All"
                  ? skills.length
                  : skills.filter(
                    (skill) => skill.category === category
                  ).length;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors ${isSelected
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm shadow-zinc-950/10 dark:border-white dark:bg-white dark:text-zinc-950"
                    : "border-zinc-200/80 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                    }`}
                >
                  {category}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] tabular-nums ${isSelected
                      ? "bg-white/15 text-white dark:bg-zinc-900/10 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skill grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <Search className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {hasActiveFilters ? "No matching skills" : "No skills yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {hasActiveFilters
                ? "Try changing your search query or selecting another category."
                : "Add your first technical skill to start building your portfolio."}
            </p>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`${btnGhost} mt-5`}
              >
                Clear category filter
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Add your first skill
              </button>
            )}
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const accent =
              CATEGORY_ACCENT[skill.category] || CATEGORY_ACCENT.Tools;

            const proficiency = Math.min(
              100,
              Math.max(0, Number(skill.proficiency) || 0)
            );

            return (
              <article
                key={skill._id}
                id={`skill-card-${skill._id}`}
                className="group flex min-w-0 flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_3px_16px_rgba(15,23,42,0.025)] transition-[border-color,box-shadow,background-color] hover:border-zinc-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-zinc-800/90 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:p-6"
              >
                {/* Card heading */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-zinc-100/70 text-zinc-800 shadow-sm dark:border-zinc-800 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100">
                    <DynamicIcon
                      name={skill.icon || "Atom"}
                      className="h-5 w-5"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(skill)}
                    title={
                      skill.isActive ? "Hide from site" : "Show on site"
                    }
                    aria-label={
                      skill.isActive
                        ? `Hide ${skill.name} from site`
                        : `Show ${skill.name} on site`
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${skill.isActive
                      ? "border-emerald-200/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70"
                      : "border-zinc-200 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${skill.isActive ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                    />
                    {skill.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Skill details */}
                <div className="mt-5 flex-1">
                  <h3 className="break-words text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {skill.name}
                  </h3>

                  <span
                    className={`mt-2 inline-flex items-center rounded-xl border px-2 py-1 text-[10px] font-semibold ${accent.chip}`}
                  >
                    {skill.category}
                  </span>

                  <p className="mt-3 min-h-10 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {skill.shortDescription || "No description provided."}
                  </p>
                </div>

                {/* Proficiency */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                      Proficiency
                    </span>

                    <span className="text-xs font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">
                      {proficiency}%
                    </span>
                  </div>

                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
                    role="progressbar"
                    aria-label={`${skill.name} proficiency`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={proficiency}
                  >
                    <div
                      className={`h-full rounded-full ${accent.bar}`}
                      style={{ width: `${proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100/90 pt-4 dark:border-zinc-800/90">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(skill)}
                    className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    {skill.isActive ? "Hide on site" : "Show on site"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(skill)}
                      title="Edit skill"
                      aria-label={`Edit ${skill.name}`}
                      className="rounded-xl border border-transparent p-2.5 text-zinc-500 transition-colors hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSkillToDelete(skill)}
                      title="Delete skill"
                      aria-label={`Delete ${skill.name}`}
                      className="rounded-xl border border-transparent p-2.5 text-zinc-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-400 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Create / Edit modal */}
      {isModalOpen && (
        <div
          id="skill-modal"
          className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-zinc-950/65 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFormModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-modal-title"
            className="my-auto flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-100 bg-white/90 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="skill-modal-title"
                    className="text-sm font-semibold text-zinc-950 dark:text-zinc-50"
                  >
                    {editingSkill ? "Edit skill" : "Create a skill"}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {editingSkill
                      ? "Update your skill details and visibility."
                      : "Add a technical skill to your portfolio."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                disabled={isSaving}
                aria-label="Close modal"
                className="shrink-0 rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                {/* Name */}
                <div>
                  <label htmlFor="skill-name" className={labelBase}>
                    Skill name <span className="text-rose-500">*</span>
                  </label>

                  <input
                    id="skill-name"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. React.js"
                    aria-invalid={Boolean(errors.name)}
                    {...register("name", {
                      required: "Skill name is required.",
                      validate: (value) =>
                        Boolean(value.trim()) ||
                        "Skill name cannot be empty.",
                    })}
                    className={inputBase}
                  />

                  {errors.name && (
                    <p className={errorBase}>{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="skill-category" className={labelBase}>
                    Category <span className="text-rose-500">*</span>
                  </label>

                  <select
                    id="skill-category"
                    {...register("category", {
                      required: "Please select a category.",
                    })}
                    className={inputBase}
                  >
                    {CATEGORIES.filter(
                      (category) => category !== "All"
                    ).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  {errors.category && (
                    <p className={errorBase}>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="skill-description"
                      className={`${labelBase} mb-0`}
                    >
                      Short description{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <span className="text-[10px] text-zinc-400">
                      Max 200 characters
                    </span>
                  </div>

                  <textarea
                    id="skill-description"
                    rows={3}
                    maxLength={200}
                    placeholder="Describe your experience with this technology..."
                    aria-invalid={Boolean(errors.shortDescription)}
                    {...register("shortDescription", {
                      required: "Short description is required.",
                      validate: (value) =>
                        Boolean(value.trim()) ||
                        "Description cannot be empty.",
                      maxLength: {
                        value: 200,
                        message: "Keep the description under 200 characters.",
                      },
                    })}
                    className={`${inputBase} resize-y leading-6`}
                  />

                  {errors.shortDescription && (
                    <p className={errorBase}>
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>

                {/* Icon picker */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className={`${labelBase} mb-0`}>
                      Choose an icon
                    </label>

                    <span className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                      {selectedIcon}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-7">
                    {AVAILABLE_SKILL_ICONS.map((iconKey) => {
                      const isSelected = selectedIcon === iconKey;

                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() =>
                            setValue("icon", iconKey, {
                              shouldDirty: true,
                            })
                          }
                          aria-label={`Select ${iconKey} icon`}
                          aria-pressed={isSelected}
                          title={iconKey}
                          className={`relative flex aspect-square items-center justify-center rounded-xl border transition-colors ${isSelected
                            ? "border-zinc-950 bg-zinc-950 text-white shadow-sm shadow-zinc-950/10 dark:border-white dark:bg-white dark:text-zinc-950"
                            : "border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                            }`}
                        >
                          <DynamicIcon
                            name={iconKey}
                            className="h-5 w-5"
                          />

                          {isSelected && (
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-zinc-950">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proficiency */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label htmlFor="skill-proficiency" className={labelBase}>
                      Proficiency level
                    </label>

                    <span className="rounded-xl border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                      {proficiencyVal}%
                    </span>
                  </div>

                  <input
                    id="skill-proficiency"
                    type="range"
                    min="20"
                    max="100"
                    {...register("proficiency", {
                      valueAsNumber: true,
                      min: 20,
                      max: 100,
                    })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-950 dark:bg-zinc-800 dark:accent-zinc-100"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
                    <span>20% · Beginner</span>
                    <span>60% · Intermediate</span>
                    <span>100% · Expert</span>
                  </div>
                </div>

                {/* Visibility */}
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 accent-emerald-600 focus:ring-emerald-500 dark:border-zinc-700"
                  />

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Display on portfolio
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      When enabled, this skill is marked active and can be
                      displayed on your public portfolio.
                    </span>
                  </span>
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-zinc-100 bg-zinc-50/80 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                  <span className="text-rose-500">*</span> Required fields
                </p>

                <div className="flex items-center justify-end gap-2">
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
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingSkill ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}

                        {editingSkill ? "Save changes" : "Create skill"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Reusable delete confirmation */}
      <DeleteConfirmation
        open={Boolean(skillToDelete)}
        onClose={() => {
          if (!isDeleting) setSkillToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete this skill?"
        description="This skill will be permanently removed from your skills collection. This action cannot be undone."
        itemName={skillToDelete?.name || "Untitled skill"}
        confirmLabel="Delete skill"
        cancelLabel="Keep skill"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default SkillsSection;