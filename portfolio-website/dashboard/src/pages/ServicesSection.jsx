import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import { DynamicIcon } from '../components/DynamicIcon.jsx';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const AVAILABLE_ICONS = [
  'Code2',
  'Layout',
  'Database',
  'Cloud',
  'Smartphone',
  'Globe',
  'Server',
  'ShieldCheck',
  'Terminal',
  'Cpu',
  'Workflow',
  'Zap'
];

export function ServicesSection() {
  const { services, addService, updateService, deleteService, searchQuery } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [stackInput, setStackInput] = useState('');

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
      description: '',
      icon: 'Code2',
      isActive: true
    }
  });

  const selectedIcon = watch('icon');

  const openCreateModal = () => {
    setEditingService(null);
    setStacks([]);
    reset({
      title: '',
      description: '',
      icon: 'Code2',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setStacks(service.stacks || []);
    reset({
      title: service.title,
      description: service.description,
      icon: service.icon || 'Code2',
      isActive: service.isActive
    });
    setIsModalOpen(true);
  };

  const handleAddStack = (e) => {
    if (e) e.preventDefault();
    const val = stackInput.trim();
    if (!val) return;
    if (stacks.includes(val)) {
      toast.error('Stack already added');
      return;
    }
    setStacks([...stacks, val]);
    setStackInput('');
  };

  const handleRemoveStack = (item) => {
    setStacks(stacks.filter((s) => s !== item));
  };

  const onSubmit = async (data) => {
    if (editingService) {
      updateService(editingService.id, {
        title: data.title,
        description: data.description,
        icon: data.icon,
        stacks: stacks,
        isActive: data.isActive
      });
    } else {
      addService({
        title: data.title,
        description: data.description,
        icon: data.icon,
        stacks: stacks,
        isActive: data.isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredServices = services.filter((service) => {
    return (
      !searchQuery ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.stacks.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Icon, title/name, description, technology stacks, and active toggle.
          </p>
        </div>

        <button
          id="add-new-service-btn"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No services found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add your engineering and consulting offerings using the button above.
            </p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100">
                    <DynamicIcon name={service.icon} className="w-5 h-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      service.isActive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-4">
                  {service.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Stacks */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.stacks &&
                    service.stacks.map((st, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {st}
                      </span>
                    ))}
                </div>
              </div>

              {/* Actions footer */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateService(service.id, { isActive: !service.isActive })}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {service.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Edit service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete service "${service.title}"?`)) {
                        deleteService(service.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Service Form */}
      {isModalOpen && (
        <div
          id="service-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingService ? 'Edit Service' : 'Add New Service'}
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
              {/* Service Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Service Title / Name *
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Select Suitable Icon: {selectedIcon}
                </label>
                <div className="grid grid-cols-6 gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  {AVAILABLE_ICONS.map((iconKey) => (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setValue('icon', iconKey)}
                      className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
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

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Description *
                </label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Describe your methodology, deliverables, and architecture..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Technology Stacks */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Technologies &amp; Stacks
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
                    placeholder="e.g. React, Next.js, Node.js"
                    className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddStack}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {stacks.map((st) => (
                    <span
                      key={st}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      {st}
                      <button
                        type="button"
                        onClick={() => handleRemoveStack(st)}
                        className="text-zinc-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
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
                    Active (Visible on public portfolio)
                  </span>
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
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
