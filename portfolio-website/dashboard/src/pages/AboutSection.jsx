import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import {
  Save,
  Plus,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Layers,
  Eye,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RichContentEditor } from '../components/RichContentEditor.jsx';

const bioTemplates = [
  {
    title: 'Senior Architect Bio',
    content: `### Senior Full-Stack Engineer & UI Architect

With over **8+ years** of hands-on software engineering experience, I specialize in crafting resilient web architectures, responsive frontends, and performant backend services.

#### Key Highlights
- **Specialization**: React 19, TypeScript, Distributed Cloud Systems
- **Methodology**: Test-Driven Development, Clean Architecture
- **Passion**: Open-source tooling and delightful design systems

> *"Designing scalable solutions where mathematical precision meets intuitive human experiences."*`
  },
  {
    title: 'Product Engineer Bio',
    content: `Passionate Product Engineer dedicated to building accessible, lightning-fast web applications.

Focused on end-to-end craftsmanship—from initial wireframes and interactive prototypes down to production CI/CD pipelines and microservices.`
  }
];

export function AboutSection() {
  const { about, updateAbout } = useData();
  const [coreStack, setCoreStack] = useState(about.coreStack || []);
  const [newStackInput, setNewStackInput] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      headline: about.headline,
      bio: about.bio,
      image: about.image,
      experience: about.experience,
      totalProjects: about.totalProjects,
      location: about.location,
      availableForHire: about.availableForHire
    }
  });

  // Ensure bio is registered in react-hook-form
  useEffect(() => {
    register('bio', {
      required: 'Bio description is required',
      minLength: { value: 20, message: 'Bio should be at least 20 characters' }
    });
  }, [register]);

  const previewImage = watch('image');
  const previewBio = watch('bio');
  const previewHeadline = watch('headline');
  const previewExp = watch('experience');
  const previewProj = watch('totalProjects');

  const handleAddStack = (e) => {
    if (e) e.preventDefault();
    const trimmed = newStackInput.trim();
    if (!trimmed) return;
    if (coreStack.includes(trimmed)) {
      toast.error('Technology stack already added');
      return;
    }
    setCoreStack([...coreStack, trimmed]);
    setNewStackInput('');
  };

  const handleRemoveStack = (tech) => {
    setCoreStack(coreStack.filter(item => item !== tech));
  };

  const onSubmit = async (data) => {
    updateAbout({
      headline: data.headline,
      bio: data.bio,
      coreStack: coreStack,
      image: data.image,
      experience: Number(data.experience),
      totalProjects: Number(data.totalProjects),
      location: data.location,
      availableForHire: data.availableForHire
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            About Section Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Configure your professional biography, core stack, avatar image, experience, and total completed projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showLivePreview ? 'Hide Preview' : 'Live Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className={showLivePreview ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <form
            id="about-form"
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6"
          >
            {/* Headline */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                Headline / Title *
              </label>
              <input
                type="text"
                {...register('headline', { required: 'Headline is required' })}
                placeholder="e.g. Senior Full-Stack Developer & UI Architect"
                className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
              />
              {errors.headline && (
                <p className="text-xs text-rose-500 mt-1">{errors.headline.message}</p>
              )}
            </div>

            {/* Bio with Rich Content Editor */}
            <div id="about-bio-editor-container">
              <RichContentEditor
                label="Bio Description & Professional Summary"
                required={true}
                value={previewBio || ''}
                onChange={(val) => {
                  setValue('bio', val, { shouldValidate: true, shouldDirty: true });
                }}
                placeholder="Write a compelling summary of your journey, technical strengths, and architectural philosophy. Use bolding, bullet points, quotes, and code blocks as desired..."
                minHeight="min-h-[220px]"
                templates={bioTemplates}
                error={errors.bio?.message}
                helperText="Supports rich markdown, headings, bold/italic, lists, quotes, tables, and split live preview."
              />
            </div>

            {/* Experience & Total Projects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  {...register('experience', {
                    required: 'Experience is required',
                    valueAsNumber: true
                  })}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                {errors.experience && (
                  <p className="text-xs text-rose-500 mt-1">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Total Projects Completed *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('totalProjects', {
                    required: 'Total projects is required',
                    valueAsNumber: true
                  })}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                {errors.totalProjects && (
                  <p className="text-xs text-rose-500 mt-1">{errors.totalProjects.message}</p>
                )}
              </div>
            </div>

            {/* Image URL with live thumbnail */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                Profile Image URL *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                <img
                  src={previewImage || about.image}
                  alt="Avatar Preview"
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              {errors.image && (
                <p className="text-xs text-rose-500 mt-1">{errors.image.message}</p>
              )}
            </div>

            {/* Core Stack Builder */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                Core Stack (Technologies)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newStackInput}
                  onChange={(e) => setNewStackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStack();
                    }
                  }}
                  placeholder="e.g. Next.js, GraphQL, PostgreSQL"
                  className="flex-1 px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={handleAddStack}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2">
                {coreStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveStack(tech)}
                      className="hover:text-rose-500 transition-colors"
                      title="Remove technology"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Location & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Base Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer pt-6">
                  <input
                    type="checkbox"
                    {...register('availableForHire')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    Available for Contracts &amp; Roles
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs"
              >
                <Save className="w-4 h-4" />
                Save About Details
              </button>
            </div>
          </form>
        </div>

        {/* Live Portfolio Card Preview */}
        {showLivePreview && (
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Portfolio Card Preview
            </h3>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={previewImage || about.image}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-zinc-100 dark:ring-zinc-800 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {previewHeadline || about.headline}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {about.location}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Bio Preview
                </span>
                <div className="max-h-56 overflow-y-auto text-xs pr-1">
                  <MarkdownRenderer content={previewBio || about.bio} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {previewExp || about.experience}+
                  </span>
                  <p className="text-[10px] text-zinc-500">Years Experience</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {previewProj || about.totalProjects}+
                  </span>
                  <p className="text-[10px] text-zinc-500">Completed Projects</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Core Technologies
                </span>
                <div className="flex flex-wrap gap-1">
                  {coreStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
