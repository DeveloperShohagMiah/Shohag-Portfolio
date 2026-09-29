import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, Plus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { RichContentEditor } from '../components/RichContentEditor.jsx';
import { MarkdownRenderer } from '../components/MarkdownRenderer.jsx';

import {
  useGetAboutQuery,
  useUpdateAboutMutation,
} from '@/redux/features/aboutApi.js';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

const bioTemplates = [
  {
    title: 'Senior Architect Bio',
    content: `### Senior Full-Stack Engineer & UI Architect

With over **8+ years** of hands-on software engineering experience, I specialize in crafting resilient web architectures, responsive frontends, and performant backend services.

#### Key Highlights
- **Specialization**: React 19, TypeScript, Distributed Cloud Systems
- **Methodology**: Test-Driven Development, Clean Architecture
- **Passion**: Open-source tooling and delightful design systems

> *"Designing scalable solutions where mathematical precision meets intuitive human experiences."*`,
  },
  {
    title: 'Product Engineer Bio',
    content: `Passionate Product Engineer dedicated to building accessible, lightning-fast web applications. Focused on end-to-end craftsmanship—from initial wireframes and interactive prototypes down to production CI/CD pipelines and microservices.`,
  },
];

const DEFAULT_ABOUT = {
  headline: '',
  bio: '',
  image: '',
  experience: 0,
  totalProjects: 0,
  location: '',
  availableForHire: false,
};

export function AboutSection() {
  const [coreStack, setCoreStack] = useState([]);
  const [newStackInput, setNewStackInput] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);

  const {
    data: aboutResponse,
    isLoading: isLoadingAbout,
    isError: isErrorAbout,
    error: aboutError,
  } = useGetAboutQuery();

  const [updateAbout, { isLoading: isSaving }] =
    useUpdateAboutMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: DEFAULT_ABOUT,
  });

  /*
   * API response can be either:
   *
   * {
   *   success: true,
   *   data: {...}
   * }
   *
   * OR:
   *
   * {
   *   headline: "...",
   *   bio: "..."
   * }
   */
  const aboutData = aboutResponse?.data || aboutResponse;

  /*
   * Register the custom bio field because RichContentEditor
   * does not use register() directly.
   */
  useEffect(() => {
    register('bio', {
      required: 'Bio description is required',
      validate: (value) => {
        const plainText = value
          ?.replace(/[#*_>`~-]/g, '')
          ?.trim();

        if (!plainText || plainText.length < 20) {
          return 'Bio should be at least 20 characters long';
        }

        return true;
      },
    });
  }, [register]);

  /*
   * Populate form when About data is received.
   */
  useEffect(() => {
    if (!aboutData) return;

    reset({
      headline: aboutData.headline || '',
      bio: aboutData.bio || '',
      image: aboutData.image || '',
      experience: aboutData.experience ?? 0,
      totalProjects: aboutData.totalProjects ?? 0,
      location: aboutData.location || '',
      availableForHire: Boolean(aboutData.availableForHire),
    });

    setCoreStack(
      Array.isArray(aboutData.coreStack)
        ? aboutData.coreStack
        : []
    );
  }, [aboutData, reset]);

  /*
   * Watched values for live preview.
   */
  const previewImage = watch('image');
  const previewBio = watch('bio');
  const previewHeadline = watch('headline');
  const previewExperience = watch('experience');
  const previewProjects = watch('totalProjects');
  const previewLocation = watch('location');
  const previewAvailableForHire = watch('availableForHire');

  /*
   * Add technology to Core Stack.
   */
  const handleAddStack = (event) => {
    event?.preventDefault();

    const trimmedValue = newStackInput.trim();

    if (!trimmedValue) {
      toast.error('Please enter a technology name.');
      return;
    }

    const alreadyExists = coreStack.some(
      (tech) =>
        tech.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (alreadyExists) {
      toast.error('Technology stack already added.');
      return;
    }

    setCoreStack((previous) => [
      ...previous,
      trimmedValue,
    ]);

    setNewStackInput('');
  };

  /*
   * Remove technology from Core Stack.
   */
  const handleRemoveStack = (technology) => {
    setCoreStack((previous) =>
      previous.filter((item) => item !== technology)
    );
  };

  /*
   * Submit form.
   */
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

      toast.success(
        'About section updated successfully!'
      );
    } catch (error) {
      console.error(
        'Failed to update About section:',
        error
      );

      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        'Failed to update About section. Please try again.';

      toast.error(errorMessage);
    }
  };

  /*
   * Loading state.
   */
  if (isLoadingAbout) {
    return (
      <div className="max-w-5xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 animate-spin" />

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading About section...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (isErrorAbout) {
    return (
      <div className="max-w-5xl mx-auto py-16">
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-6 text-center">
          <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load About section
          </h2>

          <p className="mt-1 text-xs text-rose-500/80 dark:text-rose-400/70">
            {aboutError?.data?.message ||
              'Please refresh the page and try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            About Section Management
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
            Manage your professional biography, core technologies,
            profile image, experience, projects, location and
            availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowLivePreview((previous) => !previous)
          }
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />

          {showLivePreview
            ? 'Hide Preview'
            : 'Live Preview'}
        </button>
      </div>

      {/* =========================================================
          MAIN GRID
      ========================================================== */}
      <div
        className={`grid grid-cols-1 ${showLivePreview
            ? 'lg:grid-cols-3'
            : 'lg:grid-cols-1'
          } gap-6`}
      >
        {/* =======================================================
            FORM
        ======================================================== */}
        <div
          className={
            showLivePreview
              ? 'lg:col-span-2'
              : 'lg:col-span-1'
          }
        >
          <form
            id="about-form"
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-5 sm:p-7 space-y-7"
          >
            {/* ===================================================
                HEADLINE
            ==================================================== */}
            <div>
              <label
                htmlFor="headline"
                className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
              >
                Headline / Title
                <span className="text-rose-500 ml-1">*</span>
              </label>

              <input
                id="headline"
                type="text"
                placeholder="e.g. Full-Stack Developer & UI Architect"
                {...register('headline', {
                  required: 'Headline is required',
                  maxLength: {
                    value: 150,
                    message:
                      'Headline cannot exceed 150 characters.',
                  },
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-400 dark:focus:border-zinc-500 transition"
              />

              {errors.headline && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.headline.message}
                </p>
              )}
            </div>

            {/* ===================================================
                BIO
            ==================================================== */}
            <div>
              <RichContentEditor
                label="Bio Description & Professional Summary"
                value={previewBio || ''}
                onChange={(value) => {
                  setValue('bio', value, {
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

            {/* ===================================================
                EXPERIENCE + PROJECTS
            ==================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Experience (Years)
                  <span className="text-rose-500 ml-1">*</span>
                </label>

                <input
                  id="experience"
                  type="number"
                  min="0"
                  max="60"
                  {...register('experience', {
                    required:
                      'Experience is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        'Experience cannot be negative.',
                    },
                    max: {
                      value: 60,
                      message:
                        'Experience cannot exceed 60 years.',
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                />

                {errors.experience && (
                  <p className="mt-1.5 text-xs text-rose-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Projects */}
              <div>
                <label
                  htmlFor="totalProjects"
                  className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Total Projects
                  <span className="text-rose-500 ml-1">*</span>
                </label>

                <input
                  id="totalProjects"
                  type="number"
                  min="0"
                  {...register('totalProjects', {
                    required:
                      'Total projects is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        'Projects cannot be negative.',
                    },
                  })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                />

                {errors.totalProjects && (
                  <p className="mt-1.5 text-xs text-rose-500">
                    {errors.totalProjects.message}
                  </p>
                )}
              </div>
            </div>

            {/* ===================================================
                IMAGE
            ==================================================== */}
            <div>
              <label
                htmlFor="image"
                className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
              >
                Profile Image URL
                <span className="text-rose-500 ml-1">*</span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  id="image"
                  type="url"
                  placeholder="https://example.com/profile.jpg"
                  {...register('image', {
                    required:
                      'Profile image URL is required',
                    pattern: {
                      value:
                        /^https?:\/\/.+/i,
                      message:
                        'Please enter a valid image URL.',
                    },
                  })}
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                />

                <img
                  src={previewImage || FALLBACK_IMAGE}
                  alt="Profile preview"
                  className="w-12 h-12 shrink-0 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                  onError={(event) => {
                    event.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />
              </div>

              {errors.image && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* ===================================================
                CORE STACK
            ==================================================== */}
            <div>
              <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Core Stack
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newStackInput}
                  onChange={(event) =>
                    setNewStackInput(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddStack();
                    }
                  }}
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                />

                <button
                  type="button"
                  onClick={handleAddStack}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Stack Items */}
              <div className="flex flex-wrap gap-2 mt-3">
                {coreStack.length > 0 ? (
                  coreStack.map((technology) => (
                    <span
                      key={technology}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700"
                    >
                      {technology}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveStack(
                            technology
                          )
                        }
                        title={`Remove ${technology}`}
                        className="text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400">
                    No technologies added yet.
                  </p>
                )}
              </div>
            </div>

            {/* ===================================================
                LOCATION + AVAILABILITY
            ==================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Base Location
                </label>

                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Nicosia, Cyprus"
                  {...register('location')}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10"
                />
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register(
                      'availableForHire'
                    )}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />

                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Available for Hire
                    </p>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Show availability on portfolio
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ===================================================
                SUBMIT
            ==================================================== */}
            <div className="flex justify-end pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="submit"
                disabled={isSubmitting || isSaving}
                className="inline-flex items-center justify-center gap-2 min-w-[170px] px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />

                {isSubmitting || isSaving
                  ? 'Saving...'
                  : 'Save About Details'}
              </button>
            </div>
          </form>
        </div>

        {/* =======================================================
            LIVE PREVIEW
        ======================================================== */}
        {showLivePreview && (
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Live Portfolio Preview
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Preview updates as you edit the form.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {/* Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      previewImage ||
                      FALLBACK_IMAGE
                    }
                    alt="Profile"
                    className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shrink-0"
                    onError={(event) => {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {previewHeadline ||
                        'Your Headline'}
                    </h4>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                      {previewLocation ||
                        'Your Location'}
                    </p>

                    {previewAvailableForHire && (
                      <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Available for Hire
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Bio
                  </span>

                  <div className="max-h-56 overflow-y-auto pr-1 text-xs text-zinc-600 dark:text-zinc-300">
                    {previewBio ? (
                      <MarkdownRenderer
                        content={previewBio}
                      />
                    ) : (
                      <p className="text-zinc-400 italic">
                        No biography content
                        provided yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {Number(
                        previewExperience
                      ) || 0}
                      +
                    </span>

                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      Years Experience
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <span className="block text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {Number(
                        previewProjects
                      ) || 0}
                      +
                    </span>

                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      Completed Projects
                    </p>
                  </div>
                </div>

                {/* Core Stack */}
                <div className="mt-5">
                  <span className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Core Technologies
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {coreStack.length > 0 ? (
                      coreStack.map((technology) => (
                        <span
                          key={technology}
                          className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium"
                        >
                          {technology}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-400 italic">
                        No technologies added
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}