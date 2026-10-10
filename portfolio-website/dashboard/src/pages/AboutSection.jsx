import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Save,
  X,
  Sparkles,
  MapPin,
  Briefcase,
  FolderGit2,
  ImageIcon,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

import { RichContentEditor } from "../components/RichContentEditor.jsx";
import { MarkdownRenderer } from "../components/MarkdownRenderer.jsx";
import { DeleteConfirmation } from "../ui/DeleteConfirmation.jsx";

import {
  useGetAboutQuery,
  useUpdateAboutMutation,
} from "@/redux/features/aboutApi.js";
import { PlaneLoader } from "../ui/Loader.jsx";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

const bioTemplates = [
  {
    title: "Senior Architect Bio",
    content: `### Senior Full-Stack Engineer & UI Architect

With over **8+ years** of hands-on software engineering experience, I specialize in crafting resilient web architectures, responsive frontends, and performant backend services.

#### Key Highlights
- **Specialization**: React 19, TypeScript, Distributed Cloud Systems
- **Methodology**: Test-Driven Development, Clean Architecture
- **Passion**: Open-source tooling and delightful design systems

> *"Designing scalable solutions where mathematical precision meets intuitive human experiences."*`,
  },
  {
    title: "Product Engineer Bio",
    content: `Passionate Product Engineer dedicated to building accessible, lightning-fast web applications. Focused on end-to-end craftsmanship—from initial wireframes and interactive prototypes down to production CI/CD pipelines and microservices.`,
  },
];

const DEFAULT_ABOUT = {
  headline: "",
  bio: "",
  image: "",
  experience: 0,
  totalProjects: 0,
  location: "",
  availableForHire: false,
};

/* Shared input chrome */
const inputBase =
  "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/5";

const labelBase =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400";

const errorBase = "mt-1.5 text-xs font-medium text-rose-500";

/* Card wrapper — used by form sections and preview */
const cardBase =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

export function AboutSection() {
  const [coreStack, setCoreStack] = useState([]);
  const [newStackInput, setNewStackInput] = useState("");
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [stackToRemove, setStackToRemove] = useState(null);

  const {
    data: aboutResponse,
    isLoading: isLoadingAbout,
    isError: isErrorAbout,
    error,
    refetch,
  } = useGetAboutQuery();

  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_ABOUT });

  const aboutData = aboutResponse?.data || aboutResponse;

  // Register bio (custom editor doesn't use register directly)
  useEffect(() => {
    register("bio", {
      required: "Bio description is required",
      validate: (value) => {
        const plainText = value?.replace(/[#*_>`~-]/g, "")?.trim();
        if (!plainText || plainText.length < 20) {
          return "Bio should be at least 20 characters long";
        }
        return true;
      },
    });
  }, [register]);

  // Populate form
  useEffect(() => {
    if (!aboutData) return;
    reset({
      headline: aboutData.headline || "",
      bio: aboutData.bio || "",
      image: aboutData.image || "",
      experience: aboutData.experience ?? 0,
      totalProjects: aboutData.totalProjects ?? 0,
      location: aboutData.location || "",
      availableForHire: Boolean(aboutData.availableForHire),
    });
    setCoreStack(
      Array.isArray(aboutData.coreStack) ? aboutData.coreStack : []
    );
  }, [aboutData, reset]);

  const previewImage = watch("image");
  const previewBio = watch("bio");
  const previewHeadline = watch("headline");
  const previewExperience = watch("experience");
  const previewProjects = watch("totalProjects");
  const previewLocation = watch("location");
  const previewAvailableForHire = watch("availableForHire");

  const handleAddStack = (event) => {
    event?.preventDefault();
    const trimmed = newStackInput.trim();

    if (!trimmed) {
      toast.error("Please enter a technology name.");
      return;
    }

    if (coreStack.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Technology stack already added.");
      return;
    }

    setCoreStack((prev) => [...prev, trimmed]);
    setNewStackInput("");
  };

  // Opens the confirmation dialog instead of removing instantly
  const requestRemoveStack = (technology) => {
    setStackToRemove(technology);
  };

  // Called by the confirmation dialog
  const confirmRemoveStack = async () => {
    if (!stackToRemove) return;
    setCoreStack((prev) => prev.filter((t) => t !== stackToRemove));
    toast.success(`Removed "${stackToRemove}" from core stack.`);
    setStackToRemove(null);
  };

  const onSubmit = async (formData) => {
    const payload = {
      headline: formData.headline.trim(),
      bio: formData.bio,
      image: formData.image.trim(),
      experience: Number(formData.experience) || 0,
      totalProjects: Number(formData.totalProjects) || 0,
      location: formData.location.trim(),
      availableForHire: Boolean(formData.availableForHire),
      coreStack,
    };

    try {
      await updateAbout(payload).unwrap();
      toast.success("About section updated successfully!");
    } catch (err) {
      console.error("Failed to update About section:", err);
      toast.error(
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to update About section. Please try again."
      );
    }
  };

  if (isLoadingAbout) {
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

  if (isErrorAbout) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load About section data.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            {error?.data?.message ||
              error?.message ||
              "Something went wrong"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
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
            About section
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Manage your professional story
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Update your biography, core technologies, availability, and the
            details that appear on your portfolio's About section.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLivePreview((prev) => !prev)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {showLivePreview ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
          {showLivePreview ? "Hide preview" : "Live preview"}
        </button>
      </div>

      {/* ============================================================
          Main grid
          ============================================================ */}
      <div
        className={`grid grid-cols-1 gap-6 ${showLivePreview ? "lg:grid-cols-[minmax(0,1fr)_380px]" : ""
          }`}
      >
        {/* ==========================================================
            FORM
            ========================================================== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* --- Section 1: Identity --- */}
          <div className={`${cardBase} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Identity
                </h2>
                <p className="text-[11px] text-zinc-500">
                  How you present yourself
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="headline" className={labelBase}>
                  Headline / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="headline"
                  type="text"
                  placeholder="e.g. Full-Stack Developer & UI Architect"
                  {...register("headline", {
                    required: "Headline is required",
                    maxLength: {
                      value: 150,
                      message: "Headline cannot exceed 150 characters.",
                    },
                  })}
                  className={inputBase}
                />
                {errors.headline && (
                  <p className={errorBase}>{errors.headline.message}</p>
                )}
              </div>

              <div>
                <RichContentEditor
                  label="Bio Description & Professional Summary"
                  value={previewBio || ""}
                  onChange={(value) => {
                    setValue("bio", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  required
                  placeholder="Write a compelling summary of your journey, technical strengths, and professional experience..."
                  minHeight="min-h-[220px]"
                  templates={bioTemplates}
                  error={errors.bio?.message}
                  helperText="Supports rich markdown, headings, bold/italic, lists, quotes, tables, and live preview."
                />
              </div>
            </div>
          </div>

          {/* --- Section 2: Metrics --- */}
          <div className={`${cardBase} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Metrics
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Numbers shown on your portfolio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="experience" className={labelBase}>
                  Experience (years) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="experience"
                    type="number"
                    min="0"
                    max="60"
                    {...register("experience", {
                      required: "Experience is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Experience cannot be negative.",
                      },
                      max: {
                        value: 60,
                        message: "Experience cannot exceed 60 years.",
                      },
                    })}
                    className={`${inputBase} pl-10`}
                  />
                </div>
                {errors.experience && (
                  <p className={errorBase}>{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="totalProjects" className={labelBase}>
                  Total projects <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FolderGit2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="totalProjects"
                    type="number"
                    min="0"
                    {...register("totalProjects", {
                      required: "Total projects is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Projects cannot be negative.",
                      },
                    })}
                    className={`${inputBase} pl-10`}
                  />
                </div>
                {errors.totalProjects && (
                  <p className={errorBase}>{errors.totalProjects.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* --- Section 3: Visual & location --- */}
          <div className={`${cardBase} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Visual & location
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Profile image and base location
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="image" className={labelBase}>
                  Profile image URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="image"
                      type="url"
                      placeholder="https://example.com/profile.jpg"
                      {...register("image", {
                        required: "Profile image URL is required",
                        pattern: {
                          value: /^https?:\/\/.+/i,
                          message: "Please enter a valid image URL.",
                        },
                      })}
                      className={`${inputBase} pl-10`}
                    />
                  </div>

                  <img
                    src={previewImage || FALLBACK_IMAGE}
                    alt="Profile preview"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-11 w-11 shrink-0 rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                </div>
                {errors.image && (
                  <p className={errorBase}>{errors.image.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className={labelBase}>
                    Base location
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Nicosia, Cyprus"
                      {...register("location")}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="group flex w-full cursor-pointer select-none items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50">
                    <input
                      type="checkbox"
                      {...register("availableForHire")}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Available for hire
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        Show availability badge on portfolio
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* --- Section 4: Core stack --- */}
          <div className={`${cardBase} p-5 sm:p-6`}>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Core stack
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Technologies you work with
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={newStackInput}
                onChange={(e) => setNewStackInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStack();
                  }
                }}
                placeholder="e.g. React, Node.js, MongoDB"
                className={`${inputBase} flex-1`}
              />
              <button
                type="button"
                onClick={handleAddStack}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {coreStack.length > 0 ? (
                coreStack.map((tech) => (
                  <span
                    key={tech}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-700"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => requestRemoveStack(tech)}
                      title={`Remove ${tech}`}
                      className="text-zinc-400 transition-colors hover:text-rose-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs italic text-zinc-400">
                  No technologies added yet.
                </p>
              )}
            </div>
          </div>

          {/* --- Sticky save bar --- */}
          <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
            <p className="hidden text-xs text-zinc-500 sm:block">
              Changes are saved to your portfolio instantly.
            </p>
            <button
              type="submit"
              disabled={isSubmitting || isSaving}
              className="ml-auto inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Save className="h-3.5 w-3.5" />
              {isSubmitting || isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>

        {/* ==========================================================
            LIVE PREVIEW
            ========================================================== */}
        {showLivePreview && (
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                Live preview
              </h3>
            </div>

            <div className={`${cardBase} overflow-hidden`}>
              <div className="relative h-24 bg-gradient-to-br from-violet-500/10 via-blue-500/5 to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_60%)]" />
              </div>

              <div className="-mt-10 px-5 pb-5">
                <img
                  src={previewImage || FALLBACK_IMAGE}
                  alt="Profile"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-16 w-16 rounded-xl border-4 border-white bg-zinc-100 object-cover shadow-sm dark:border-zinc-900 dark:bg-zinc-800"
                />

                <div className="mt-3">
                  <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {previewHeadline || "Your headline"}
                  </h4>

                  {previewLocation && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" />
                      {previewLocation}
                    </p>
                  )}

                  {previewAvailableForHire && (
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Available for hire
                    </span>
                  )}
                </div>

                <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Bio
                  </p>
                  <div className="max-h-56 overflow-y-auto pr-1">
                    {previewBio ? (
                      <MarkdownRenderer content={previewBio} />
                    ) : (
                      <p className="text-xs italic text-zinc-400">
                        No biography content yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/30">
                    <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {Number(previewExperience) || 0}
                      <span className="text-zinc-400">+</span>
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Years
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-zinc-50/60 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/30">
                    <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {Number(previewProjects) || 0}
                      <span className="text-zinc-400">+</span>
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      Projects
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Core technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {coreStack.length > 0 ? (
                      coreStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs italic text-zinc-400">
                        None added
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ============================================================
          Delete confirmation for removing a tech
          ============================================================ */}
      <DeleteConfirmation
        open={Boolean(stackToRemove)}
        onClose={() => setStackToRemove(null)}
        onConfirm={confirmRemoveStack}
        title="Remove technology?"
        description="This will remove the technology from your core stack. You can add it back at any time — this only affects the About section preview."
        itemName={stackToRemove}
        confirmLabel="Remove"
      />
    </div>
  );
}

export default AboutSection;