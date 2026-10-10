import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicIcon } from "../components/DynamicIcon.jsx";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Layers,
  Check,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useToggleServiceStatusMutation,
} from "@/redux/features/serviceApi.js";

const AVAILABLE_ICONS = [
  "Code2",
  "Layout",
  "Database",
  "Cloud",
  "Smartphone",
  "Globe",
  "Server",
  "ShieldCheck",
  "Terminal",
  "Cpu",
  "Workflow",
  "Zap",
];

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

export function ServicesSection({ searchQuery = "" }) {
  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useGetAllServicesQuery();

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [toggleServiceStatus] = useToggleServiceStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [stacks, setStacks] = useState([]);
  const [stackInput, setStackInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      icon: "Code2",
      isActive: true,
    },
  });

  const selectedIcon = watch("icon");
  const isSaving = isCreating || isUpdating || isSubmitting;

  const openCreateModal = () => {
    setEditingService(null);
    setStacks([]);
    setStackInput("");
    reset({ title: "", description: "", icon: "Code2", isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setStacks(service.stacks || []);
    setStackInput("");
    reset({
      title: service.title,
      description: service.description,
      icon: service.icon || "Code2",
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleAddStack = (e) => {
    if (e) e.preventDefault();
    const val = stackInput.trim();
    if (!val) return;

    if (stacks.some((s) => s.toLowerCase() === val.toLowerCase())) {
      toast.error("Stack already added");
      return;
    }

    setStacks([...stacks, val]);
    setStackInput("");
  };

  const handleRemoveStack = (item) => {
    setStacks(stacks.filter((s) => s !== item));
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      icon: data.icon,
      stacks,
      isActive: data.isActive,
    };

    try {
      if (editingService) {
        await updateService({ id: editingService._id, ...payload }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createService(payload).unwrap();
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to save service."
      );
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      await toggleServiceStatus(service._id).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete service "${service.title}"?`)) return;
    try {
      await deleteService(service._id).unwrap();
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete service.");
    }
  };

  if (isLoadingServices) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorServices) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-10 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load services.
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            Refresh the page to try again.
          </p>
        </div>
      </div>
    );
  }

  const allServices = servicesResponse?.data || [];

  const filteredServices = allServices.filter((service) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      (service.stacks || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  const activeCount = allServices.filter((s) => s.isActive).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Services
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Manage your offerings
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Icon, title, description, technology stacks, and public visibility
            — everything that appears on your portfolio services section.
          </p>
        </div>

        <button type="button" onClick={openCreateModal} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Add service
        </button>
      </div>

      {/* ============================================================
          Stats strip
          ============================================================ */}
      {allServices.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {allServices.length}
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
              Disabled
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-500">
              {allServices.length - activeCount}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Shown
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {filteredServices.length}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================
          Services grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <Search className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {searchQuery ? "No matching services" : "No services yet"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {searchQuery
                ? "Try a different search term."
                : "Add your first service to display it on your portfolio."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-5`}
              >
                <Plus className="h-4 w-4" />
                Add service
              </button>
            )}
          </div>
        ) : (
          filteredServices.map((service) => (
            <article
              key={service._id}
              id={`service-card-${service._id}`}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Top row: icon + status */}
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-800 ring-1 ring-inset ring-zinc-200/60 dark:from-zinc-800 dark:to-zinc-800/60 dark:text-zinc-200 dark:ring-zinc-700/60">
                  <DynamicIcon name={service.icon} className="h-5 w-5" />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(service)}
                  title={service.isActive ? "Deactivate" : "Activate"}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${service.isActive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${service.isActive ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                  />
                  {service.isActive ? "Active" : "Disabled"}
                </button>
              </div>

              {/* Title + description */}
              <div className="mt-4 flex-1">
                <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {service.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {service.description}
                </p>

                {/* Stacks */}
                {service.stacks && service.stacks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.stacks.slice(0, 4).map((st, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                      >
                        {st}
                      </span>
                    ))}
                    {service.stacks.length > 4 && (
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50">
                        +{service.stacks.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                  {service.stacks?.length || 0} tech
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(service)}
                    title="Edit service"
                    className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service)}
                    title="Delete service"
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
          id="service-modal"
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
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {editingService ? "Edit service" : "New service"}
                  </h2>
                  <p className="text-[11px] text-zinc-500">
                    {editingService
                      ? "Update the offering details"
                      : "Add a new offering to your portfolio"}
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
                {/* Title */}
                <div>
                  <label htmlFor="title" className={labelBase}>
                    Service title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Full-Stack Web Development"
                    {...register("title", { required: "Title is required" })}
                    className={inputBase}
                  />
                  {errors.title && (
                    <p className={errorBase}>{errors.title.message}</p>
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

                  <div className="grid grid-cols-6 gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    {AVAILABLE_ICONS.map((iconKey) => {
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

                {/* Description */}
                <div>
                  <label htmlFor="description" className={labelBase}>
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your methodology, deliverables, and architecture…"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className={`${inputBase} resize-none leading-relaxed`}
                  />
                  {errors.description && (
                    <p className={errorBase}>{errors.description.message}</p>
                  )}
                </div>

                {/* Stack */}
                <div>
                  <label className={labelBase}>Technologies & stacks</label>
                  <div className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStack();
                        }
                      }}
                      placeholder="e.g. React, Next.js, Node.js"
                      className={`${inputBase} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleAddStack}
                      className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {stacks.length === 0 ? (
                      <p className="text-xs italic text-zinc-400">
                        No technologies added yet.
                      </p>
                    ) : (
                      stacks.map((st) => (
                        <span
                          key={st}
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
                        >
                          {st}
                          <button
                            type="button"
                            onClick={() => handleRemoveStack(st)}
                            className="text-zinc-400 transition-colors hover:text-rose-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
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
                      Visible on your public portfolio
                    </p>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <p className="hidden text-[11px] text-zinc-500 sm:block">
                  {editingService
                    ? "Changes are saved to your portfolio instantly."
                    : "Your service will appear on the portfolio immediately."}
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
                      : editingService
                        ? "Update service"
                        : "Create service"}
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