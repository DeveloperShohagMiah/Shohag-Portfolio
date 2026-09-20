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
  X
} from 'lucide-react';

export function FaqSection() {
  const { faqs, addFaq, updateFaq, deleteFaq, searchQuery } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

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
      order: faqs.length + 1,
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
    if (editingFaq) {
      updateFaq(editingFaq.id, {
        question: data.question,
        answer: data.answer,
        order: Number(data.order),
        isActive: data.isActive
      });
    } else {
      addFaq({
        question: data.question,
        answer: data.answer,
        order: Number(data.order),
        isActive: data.isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredFaqs = faqs
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
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                id={`faq-item-${faq.id}`}
                className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs transition-all"
              >
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div
                    onClick={() => toggleExpand(faq.id)}
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
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        faq.isActive
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
                      onClick={() => {
                        if (window.confirm('Delete this FAQ?')) {
                          deleteFaq(faq.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(faq.id)}
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

      {/* Modal for FAQ Form */}
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
              {/* Question & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    {...register('question', { required: 'Question is required' })}
                    placeholder="e.g. What is your preferred tech stack and delivery methodology?"
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
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

              {/* Answer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  {...register('answer', { required: 'Answer is required' })}
                  placeholder="Provide a clear, detailed, and professional answer for your clients..."
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100 resize-y"
                />
                {errors.answer && (
                  <p className="text-xs text-rose-500 mt-1">{errors.answer.message}</p>
                )}
              </div>

              {/* IsActive */}
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
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
