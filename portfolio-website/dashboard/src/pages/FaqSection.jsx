import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle
} from 'lucide-react';
import {
  useAddFaqMutation,
  useDeleteFaqMutation,
  useGetAllFaqsQuery,
  useUpdateFaqMutation
} from '@/redux/features/faqApi.js';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Delete Modal Component
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
}) => {
  const [confirmText, setConfirmText] = useState("");

  React.useEffect(() => {
    if (!isOpen) {
      setConfirmText("");
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  const isMatch = confirmText.trim() === itemName;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isLoading ? onClose : undefined}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-zinc-900 dark:text-zinc-100 z-10 antialiased overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-150 disabled:opacity-50"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertTriangle size={22} />
              </div>

              <div className="space-y-3 flex-1 pt-0.5">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {title}
                </h2>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {description}
                </p>

                {itemName && (
                  <div className="space-y-3 pt-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs font-mono text-zinc-800 dark:text-zinc-300 max-w-full truncate">
                      <Trash2 size={13} className="text-zinc-500 flex-shrink-0" />
                      <span className="truncate select-all">{itemName}</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        To confirm, type <span className="text-zinc-900 dark:text-zinc-100 font-semibold select-all">{itemName}</span> below:
                      </label>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        disabled={isLoading}
                        placeholder={itemName}
                        className="w-full px-3.5 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all duration-150 disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-medium transition-all duration-150 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={!isMatch || isLoading}
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all duration-150 active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:hover:bg-red-600 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function FaqSection() {
  const { searchQuery } = useData();
  const [addFaq, { isLoading: isadding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const { data: faqData, isLoading, isError } = useGetAllFaqsQuery();
  const [deleteFaq, { isLoading: isFaqDeleting }] = useDeleteFaqMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Delete modal state
  const [deletingFaq, setDeletingFaq] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      question: '',
      answer: '',
      order: 1,
      isActive: true
    }
  });

  const openCreateModal = () => {
    setEditingFaq(null);
    reset({
      question: '',
      answer: '',
      order: (faqData?.data?.length || 0) + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    reset({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive
    });
    setIsModalOpen(true);
  };

  const toggleExpand = (id) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const onSubmit = async (data) => {
    const payload = {
      question: data.question,
      answer: data.answer,
      order: Number(data.order),
      isActive: data.isActive
    };

    try {
      if (editingFaq) {
        await updateFaq({ id: editingFaq._id, ...payload }).unwrap();
        toast.success("FAQ updated successfully!");
      } else {
        await addFaq(payload).unwrap();
        toast.success('FAQ added successfully!');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save FAQ.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingFaq) return;
    try {
      await deleteFaq(deletingFaq._id).unwrap();
      toast.success('FAQ deleted successfully!');
      setDeletingFaq(null);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete FAQ.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-sm text-zinc-500">
        Loading FAQS...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-sm text-rose-500">
        Failed to load FAQS. Please refresh the page.
      </div>
    );
  }

  const filteredFaqs = (faqData?.data || [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((faq) => {
      return (
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Question, answer, display order, and active visibility state.
          </p>
        </div>

        <button
          id="add-new-faq-btn"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add FAQ Item
        </button>
      </div>

      {/* FAQ Items Accordion / List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
            <HelpCircle className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              No FAQ items found
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Add commonly asked client or employer questions.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const faqId = faq._id || faq.id;
            const isExpanded = expandedFaqId === faqId;
            return (
              <div
                key={faqId}
                id={`faq-item-${faqId}`}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs transition-all"
              >
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div
                    onClick={() => toggleExpand(faqId)}
                    className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                      #{faq.order}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {faq.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${faq.isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                    >
                      {faq.isActive ? 'Active' : 'Draft'}
                    </span>

                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingFaq(faq)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(faqId)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FAQ Form Modal */}
      {isModalOpen && (
        <div
          id="faq-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingFaq ? 'Edit FAQ Item' : 'Add FAQ Item'}
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    {...register('question', { required: 'Question is required' })}
                    placeholder="e.g. What is your preferred tech stack?"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                  />
                  {errors.question && (
                    <p className="text-xs text-rose-500 mt-1">{errors.question.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Order *
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('order', { required: 'Order is required', valueAsNumber: true })}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  {...register('answer', { required: 'Answer is required' })}
                  placeholder="Provide a clear and professional answer..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100 resize-y"
                />
                {errors.answer && (
                  <p className="text-xs text-rose-500 mt-1">{errors.answer.message}</p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Active (Visible on portfolio FAQ accordion)
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
                  disabled={isSubmitting || isadding || isUpdating}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
                >
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingFaq)}
        onClose={() => setDeletingFaq(null)}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ Item"
        description="Are you sure you want to delete this FAQ? This action cannot be undone and will immediately remove it from your API response."
        itemName={deletingFaq?.question}
        isLoading={isFaqDeleting}
      />
    </div>
  );
}