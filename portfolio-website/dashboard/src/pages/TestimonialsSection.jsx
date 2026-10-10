import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  MessageSquareQuote,
  X,
  Sparkles,
  Search,
  Building2,
  Briefcase,
  Quote,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useToggleTestimonialStatusMutation,
} from "@/redux/features/testimonialsApi.js";

const DEFAULT_VALUES = {
  name: "",
  role: "",
  company: "",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  message: "",
  rating: 5,
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

/* Initials fallback for avatar */
function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({ searchQuery = "" }) {
  const {
    data: testimonialsResponse,
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials,
  } = useGetAllTestimonialsQuery();

  const [createTestimonial, { isLoading: isCreating }] =
    useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] =
    useUpdateTestimonialMutation();
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
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: DEFAULT_VALUES });

  const selectedRating = watch("rating");
  const isSaving = isCreating || isUpdating || isSubmitting;

  const testimonials = testimonialsResponse?.data || [];

  const openCreateModal = () => {
    setEditingTestimonial(null);
    reset(DEFAULT_VALUES);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingTestimonial(item);
    reset({
      name: item.name,
      role: item.role || "",
      company: item.company || "",
      avatar: item.avatar || DEFAULT_VALUES.avatar,
      message: item.message,
      rating: item.rating,
      isActive: item.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      role: data.role?.trim() || "",
      company: data.company?.trim() || "",
      avatar: data.avatar || DEFAULT_VALUES.avatar,
      message: data.message.trim(),
      rating: Number(data.rating),
      isActive: data.isActive,
    };

    try {
      if (editingTestimonial) {
        await updateTestimonial({
          id: editingTestimonial._id,
          ...payload,
        }).unwrap();
        toast.success("Testimonial updated successfully!");
      } else {
        await createTestimonial(payload).unwrap();
        toast.success("Testimonial added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to save testimonial."
      );
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await toggleTestimonialStatus(item._id).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete review from "${item.name}"?`)) return;
    try {
      await deleteTestimonial(item._id).unwrap();
      toast.success("Testimonial deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete testimonial.");
    }
  };

  /* ============================ LOADING ============================ */
  if (isLoadingTestimonials) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ============================ ERROR ============================ */
  if (isErrorTestimonials) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load testimonials
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            Refresh the page to try again.
          </p>
        </div>
      </div>
    );
  }

  const filteredTestimonials = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.company || "").toLowerCase().includes(q) ||
      (t.role || "").toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q)
    );
  });

  const activeCount = testimonials.filter((t) => t.isActive).length;
  const avgRating = testimonials.length
    ? (
      testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
      testimonials.length
    ).toFixed(1)
    : "0.0";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Testimonials
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Client testimonials
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Client name, role, company, avatar, quote, star rating, and
            public visibility.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Add testimonial
        </button>
      </div>

      {/* ============================================================
          Stats strip
          ============================================================ */}
      {testimonials.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {testimonials.length}
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
              {testimonials.length - activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Avg rating
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
              {avgRating}
              <Star className="h-3.5 w-3.5 fill-current" />
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          Grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredTestimonials.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {searchQuery ? (
                <Search className="h-5 w-5" />
              ) : (
                <MessageSquareQuote className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery
                ? "No matching testimonials"
                : "No testimonials yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {searchQuery
                ? "Try a different search term."
                : "Add your first client testimonial to display it on your portfolio."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Add testimonial
              </button>
            )}
          </div>
        ) : (
          filteredTestimonials.map((item) => (
            <article
              key={item._id}
              id={`testimonial-card-${item._id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Quote watermark */}
              <Quote
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-zinc-100/80 dark:text-zinc-800/60"
              />

              {/* Header row: avatar + info + status */}
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 ring-2 ring-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-800">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                      <span
                        className={
                          item.avatar
                            ? "hidden"
                            : "flex h-full w-full items-center justify-center"
                        }
                      >
                        {getInitials(item.name)}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {item.role}
                      {item.role && item.company ? " · " : ""}
                      {item.company && (
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {item.company}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  title={
                    item.isActive
                      ? "Hide from portfolio"
                      : "Show on portfolio"
                  }
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${item.isActive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                  />
                  {item.isActive ? "Active" : "Hidden"}
                </button>
              </div>

              {/* Rating */}
              <div className="relative mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < item.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 dark:text-zinc-700"
                      }`}
                  />
                ))}
                <span className="ml-1.5 font-code text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {item.rating}.0
                </span>
              </div>

              {/* Quote */}
              <p className="relative mt-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                <span className="text-zinc-400 dark:text-zinc-500">
                  &ldquo;
                </span>
                {item.message}
                <span className="text-zinc-400 dark:text-zinc-500">
                  &rdquo;
                </span>
              </p>

              {/* Footer actions */}
              <div className="relative mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <p className="font-code text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                  {new Date().getFullYear()}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    title="Edit testimonial"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    title="Delete testimonial"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* ============================================================
          Modal
          ============================================================ */}
      {isModalOpen && (
        <div
          id="testimonial-modal"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="relative my-8 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <MessageSquareQuote className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {editingTestimonial
                      ? "Edit testimonial"
                      : "New testimonial"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingTestimonial
                      ? "Update the client testimonial"
                      : "Add a new client testimonial"}
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
                    Client name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    {...register("name", {
                      required: "Client name is required",
                    })}
                    className={inputBase}
                  />
                  {errors.name && (
                    <p className={errorBase}>{errors.name.message}</p>
                  )}
                </div>

                {/* Role + Company */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="role" className={labelBase}>
                      Role / position
                    </label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="role"
                        type="text"
                        placeholder="e.g. VP of Engineering"
                        {...register("role")}
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className={labelBase}>
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                      <input
                        id="company"
                        type="text"
                        placeholder="e.g. Apex Tech"
                        {...register("company")}
                        className={`${inputBase} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <label htmlFor="avatar" className={labelBase}>
                    Avatar image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="avatar"
                      type="url"
                      placeholder="https://images.unsplash.com/…"
                      {...register("avatar")}
                      className={`${inputBase} flex-1`}
                    />
                    <img
                      src={watch("avatar") || DEFAULT_VALUES.avatar}
                      alt="Avatar preview"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_VALUES.avatar;
                      }}
                      className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelBase}>
                    Feedback / quote <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Shohag delivered our core dashboard weeks ahead of schedule with remarkable craftsmanship…"
                    {...register("message", {
                      required: "Feedback is required",
                      minLength: {
                        value: 10,
                        message: "Feedback must be at least 10 characters",
                      },
                    })}
                    className={`${inputBase} resize-none leading-relaxed`}
                  />
                  {errors.message && (
                    <p className={errorBase}>{errors.message.message}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className={labelBase}>Rating</label>
                    <span className="font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                      {selectedRating} {selectedRating === 1 ? "star" : "stars"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValue("rating", star)}
                        aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                        className="rounded-md p-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${star <= selectedRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300 dark:text-zinc-600"
                            }`}
                        />
                      </button>
                    ))}
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
                      Rendered on your portfolio's testimonials section
                    </p>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  {editingTestimonial
                    ? "Changes are saved to your portfolio instantly."
                    : "Your testimonial will appear on the portfolio immediately."}
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
                      : editingTestimonial
                        ? "Update testimonial"
                        : "Save testimonial"}
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