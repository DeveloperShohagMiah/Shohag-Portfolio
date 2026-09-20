import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import { DynamicIcon } from '../components/DynamicIcon.jsx';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Filter
} from 'lucide-react';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'DevOps & Cloud', 'Tools'];

const AVAILABLE_SKILL_ICONS = [
  'Atom',
  'FileCode',
  'Palette',
  'Server',
  'Database',
  'Terminal',
  'Workflow',
  'Globe',
  'Cpu',
  'Cloud',
  'ShieldCheck',
  'Zap',
  'Layers',
  'Box'
];

export function SkillsSection() {
  const { skills, addSkill, updateSkill, deleteSkill, searchQuery } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      skillName: '',
      shortDescription: '',
      category: 'Frontend',
      icon: 'Atom',
      proficiency: 90,
      isActive: true
    }
  });

  const selectedIcon = watch('icon');
  const proficiencyVal = watch('proficiency');

  const openCreateModal = () => {
    setEditingSkill(null);
    reset({
      skillName: '',
      shortDescription: '',
      category: 'Frontend',
      icon: 'Atom',
      proficiency: 90,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    reset({
      skillName: skill.skillName,
      shortDescription: skill.shortDescription,
      category: skill.category,
      icon: skill.icon || 'Atom',
      proficiency: skill.proficiency || 90,
      isActive: skill.isActive
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (editingSkill) {
      updateSkill(editingSkill.id, {
        skillName: data.skillName,
        shortDescription: data.shortDescription,
        category: data.category,
        icon: data.icon,
        proficiency: Number(data.proficiency),
        isActive: data.isActive
      });
    } else {
      addSkill({
        skillName: data.skillName,
        shortDescription: data.shortDescription,
        category: data.category,
        icon: data.icon,
        proficiency: Number(data.proficiency),
        isActive: data.isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Skills &amp; Technologies
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Icon, skill name, short description, category, and active status.
          </p>
        </div>

        <button
          id="add-new-skill-btn"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No skills found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add your technical competencies using the button above.
            </p>
          </div>
        ) : (
          filteredSkills.map((skill) => (
            <div
              key={skill.id}
              id={`skill-card-${skill.id}`}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                      <DynamicIcon name={skill.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {skill.skillName}
                      </h3>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      skill.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {skill.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                  {skill.shortDescription}
                </p>

                {/* Proficiency bar */}
                {skill.proficiency !== undefined && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-zinc-400 font-medium mb-1">
                      <span>Proficiency</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateSkill(skill.id, { isActive: !skill.isActive })}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {skill.isActive ? 'Hide on site' : 'Show on site'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Edit skill"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete skill "${skill.skillName}"?`)) {
                        deleteSkill(skill.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Skill Form */}
      {isModalOpen && (
        <div
          id="skill-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
              {/* Skill Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Skill / Technology Name *
                </label>
                <input
                  type="text"
                  {...register('skillName', { required: 'Skill name is required' })}
                  placeholder="e.g. React & React Native"
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.skillName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.skillName.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  {...register('shortDescription', { required: 'Short description is required' })}
                  placeholder="e.g. Modern hooks, concurrent features, component lifecycles..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.shortDescription && (
                  <p className="text-xs text-rose-500 mt-1">{errors.shortDescription.message}</p>
                )}
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Select Suitable Icon: {selectedIcon}
                </label>
                <div className="grid grid-cols-7 gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {AVAILABLE_SKILL_ICONS.map((iconKey) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setValue('icon', iconKey)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        selectedIcon === iconKey
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                      title={iconKey}
                    >
                      <DynamicIcon name={iconKey} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Proficiency Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  <span>Proficiency Level</span>
                  <span>{proficiencyVal}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  {...register('proficiency', { valueAsNumber: true })}
                  className="w-full accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                />
              </div>

              {/* isActive Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Active (Rendered on portfolio skills section)
                  </span>
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
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
