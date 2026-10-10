import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicIcon } from "../components/DynamicIcon.jsx";
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

/* Color accents per category — used on the card progress bar */
const CATEGORY_ACCENT = {
  Frontend: {
    bar: "bg-gradient-to-r from-blue-500 to-blue-400",
    chip: "border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  Backend: {
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    chip: "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  Database: {
    bar: "bg-gradient-to-r from-amber-500 to-amber-400",
    chip: "border-amber-500/20 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  "DevOps & Cloud": {
    bar: "bg-gradient-to-r from-purple-500 to-purple-400",
    chip: "border-purple-500/20 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  },
  Tools: {
    bar: "bg-gradient-to-r from-zinc-600 to-zinc-400",
    chip: "border-zinc-500/20 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
};

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
  const [deleteSkill] = useDeleteSkillMutation();
  const [toggleSkillStatus] = useToggleSkillStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const selectedIcon = watch("icon");
  const proficiencyVal = watch("proficiency");
  const isSaving = isCreating || isUpdating || isSubmitting;

  const openCreateModal = () => {
    setEditingSkill(null);
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      shortDescription: skill.shortDescription,
      category: skill.category,
      icon: skill.icon || "Atom",
      proficiency: skill.proficiency ?? 90,
      isActive: skill.isActive,
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
        await updateSkill({ id: editingSkill._id, ...payload }).unwrap();
        toast.success("Skill updated successfully!");
      } else {
        await createSkill(payload).unwrap();
        toast.success("Skill created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to save skill.");
    }
  };

  const handleToggleStatus = async (skill) => {
    try {
      await toggleSkillStatus(skill._id).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    try {
      await deleteSkill(skill._id).unwrap();
      toast.success("Skill deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete skill.");
    }
  };

  if (isLoadingSkills) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorSkills) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load skills
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            {error?.data?.message || error?.message || "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className={`${btnPrimary} mt-5`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const skills = skillsResponse?.data || [];

  const filteredSkills = skills.filter((skill) => {
    const q = searchQuery.toLowerCase();
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch =
      !q ||
      skill.name.toLowerCase().includes(q) ||
      skill.shortDescription?.toLowerCase().includes(q) ||
      skill.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const activeCount = skills.filter((s) => s.isActive).length;
  const avgProficiency = skills.length
    ? Math.round(
      skills.reduce((sum, s) => sum + (s.proficiency || 0), 0) / skills.length
    )
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Skills
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Technical proficiencies
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Icon, name, category, proficiency level, and public visibility —
            everything shown on your portfolio's skills section.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Add skill
        </button>
      </div>

      {/* ============================================================
          Stats strip
          ============================================================ */}
      {skills.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {skills.length}
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
              Hidden
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-500">
              {skills.length - activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Avg proficiency
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {avgProficiency}%
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          Category filter bar
          ============================================================ */}
      <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-900">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? skills.length
                : skills.filter((s) => s.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${isSelected
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
              >
                {cat}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${isSelected
                      ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
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

      {/* ============================================================
          Grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <Search className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery || selectedCategory !== "All"
                ? "No matching skills"
                : "No skills yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {searchQuery || selectedCategory !== "All"
                ? "Try a different search or category."
                : "Add your first technical skill to display it on your portfolio."}
            </p>
            {!searchQuery && selectedCategory === "All" && (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Add skill
              </button>
            )}
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const accent =
              CATEGORY_ACCENT[skill.category] || CATEGORY_ACCENT.Tools;

            return (
              <article
                key={skill._id}
                id={`skill-card-${skill._id}`}
                className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {/* Icon + status */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-800 ring-1 ring-inset ring-zinc-200/60 dark:from-zinc-800 dark:to-zinc-800/60 dark:text-zinc-200 dark:ring-zinc-700/60">
                    <DynamicIcon name={skill.icon} className="h-5 w-5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(skill)}
                    title={skill.isActive ? "Hide from site" : "Show on site"}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${skill.isActive
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${skill.isActive ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                    />
                    {skill.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Name + category + description */}
                <div className="mt-4 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      {skill.name}
                    </h3>
                  </div>

                  <span
                    className={`mt-1.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${accent.chip}`}
                  >
                    {skill.category}
                  </span>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {skill.shortDescription}
                  </p>
                </div>

                {/* Proficiency bar */}
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Proficiency
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {skill.proficiency}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${accent.bar}`}
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(skill)}
                    className="text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {skill.isActive ? "Hide on site" : "Show on site"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(skill)}
                      title="Edit skill"
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(skill)}
                      title="Delete skill"
                      className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* ============================================================
          Modal
          ============================================================ */}
      {isModalOpen && (
        <div
          id="skill-modal"
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
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {editingSkill ? "Edit skill" : "New skill"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingSkill
                      ? "Update this proficiency"
                      : "Add a new technical skill"}
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
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelBase}>
                    Skill name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. React & React Native"
                    {...register("name", {
                      required: "Skill name is required",
                    })}
                    className={inputBase}
                  />
                  {errors.name && (
                    <p className={errorBase}>{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className={labelBase}>
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className={inputBase}
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="shortDescription" className={labelBase}>
                    Short description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="shortDescription"
                    rows={2}
                    placeholder="e.g. Modern hooks, concurrent features, component lifecycles…"
                    {...register("shortDescription", {
                      required: "Short description is required",
                      maxLength: {
                        value: 200,
                        message: "Keep it under 200 characters",
                      },
                    })}
                    className={`${inputBase} resize-none leading-relaxed`}
                  />
                  {errors.shortDescription && (
                    <p className={errorBase}>
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>

                {/* Icon picker */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className={labelBase}>Choose icon</label>
                    <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                      {selectedIcon}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    {AVAILABLE_SKILL_ICONS.map((iconKey) => {
                      const isSelected = selectedIcon === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setValue("icon", iconKey)}
                          title={iconKey}
                          className={`relative flex aspect-square items-center justify-center rounded-lg transition-all ${isSelected
                              ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                              : "text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:bg-zinc-700/60"
                            }`}
                        >
                          <DynamicIcon name={iconKey} className="h-4 w-4" />
                          {isSelected && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500">
                              <Check className="h-2 w-2 text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proficiency */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="proficiency" className={labelBase}>
                      Proficiency level
                    </label>
                    <span className="text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">
                      {proficiencyVal}%
                    </span>
                  </div>

                  <input
                    id="proficiency"
                    type="range"
                    min="20"
                    max="100"
                    {...register("proficiency", { valueAsNumber: true })}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-100 accent-zinc-900 dark:bg-zinc-800 dark:accent-zinc-100"
                  />

                  <div className="mt-1.5 flex justify-between text-[10px] text-zinc-400">
                    <span>20%</span>
                    <span>60%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Active toggle */}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3.5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Active
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      Rendered on your portfolio's skills section
                    </p>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  {editingSkill
                    ? "Changes are saved to your portfolio instantly."
                    : "Your skill will appear on the portfolio immediately."}
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
                      : editingSkill
                        ? "Update skill"
                        : "Add skill"}
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