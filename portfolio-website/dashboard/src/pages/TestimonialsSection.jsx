import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Star, MessageSquareQuote, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetAllTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useToggleTestimonialStatusMutation,
} from '@/redux/features/testimonialsApi.js';

const DEFAULT_VALUES = {
  name: '',
  role: '',
  company: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  message: '',
  rating: 5,
  isActive: true,
};

export function TestimonialsSection({ searchQuery = '' }) {
  const { data: testimonialsResponse, isLoading: isLoadingTestimonials, isError: isErrorTestimonials } = useGetAllTestimonialsQuery();
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [toggleTestimonialStatus] = useToggleTestimonialStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const selectedRating = watch('rating');
  const isSaving = isCreating || isUpdating || isSubmitting;

  const testimonials = testimonialsResponse?.data || [];

  const openCreateModal = () => {
    setEditingTestimonial(null);
    reset({ ...DEFAULT_VALUES, role: 'Head of Engineering' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingTestimonial(item);
    reset({
      name: item.name,
      role: item.role,
      company: item.company,
      avatar: item.avatar,
      message: item.message,
      rating: item.rating,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      role: data.role,
      company: data.company,
      avatar: data.avatar,
      message: data.message,
      rating: Number(data.rating),
      isActive: data.isActive
    };

    try {
      if (editingTestimonial) {
        await updateTestimonial({ id: editingTestimonial._id, ...payload }).unwrap();
        toast.success('Testimonial updated successfully!');
      } else {
        await createTestimonial(payload).unwrap();
        toast.success('Testimonial added successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to save testimonial.');
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await toggleTestimonialStatus(item._id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete review from "${item.name}"?`)) return;
    try {
      await deleteTestimonial(item._id).unwrap();
      toast.success('Testimonial deleted successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete testimonial.');
    }
  };

  if (isLoadingTestimonials) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-sm text-zinc-500">
        Loading testimonials...
      </div>
    );
  }

  if (isErrorTestimonials) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-sm text-rose-500">
        Failed to load testimonials. Please refresh the page.
      </div>
    );
  }

  const filteredTestimonials = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.company || '').toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Client Testimonials Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Client name, role, company, avatar, feedback quote, 5-star rating, and active toggle.
          </p>
        </div>

        <button
          id="add-new-testimonial-btn"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTestimonials.length === 0 ? (
          <div className="md:col-span-2 p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <MessageSquareQuote className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No testimonials found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add social proof and quotes from colleagues or clients.
            </p>
          </div>
        ) : (
          filteredTestimonials.map((item) => (
            <div
              key={item._id}
              id={`testimonial-card-${item._id}`}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.role}{item.company ? ` at ` : ''}
                        {item.company && (
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {item.company}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${item.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                  >
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                  "{item.message}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Testimonial Form */}
      {isModalOpen && (
        <div
          id="testimonial-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Client name is required' })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    {...register('avatar')}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    {...register('role')}
                    placeholder="e.g. VP of Engineering"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="e.g. Apex Tech"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Feedback / Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  {...register('message', {
                    required: 'Feedback is required',
                    minLength: { value: 10, message: 'Feedback must be at least 10 characters' }
                  })}
                  placeholder="Shohag delivered our core dashboard weeks ahead of schedule with remarkable craftsmanship..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 resize-y"
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Rating: {selectedRating} Stars
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue('rating', star)}
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= selectedRating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Active (Rendered on portfolio testimonials slider)
                  </span>
                </label>
              </div>

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
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}