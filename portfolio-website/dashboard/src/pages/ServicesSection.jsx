
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DynamicIcon } from "../components/DynamicIcon.jsx";
import DeleteConfirmation from "../ui/DeleteConfirmation.jsx";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Layers,
  Check,
  Search,
  ArrowUpRight,
  Power,
  BriefcaseBusiness,
  CircleCheck,
  CircleDashed,
  Command,
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

const inputBase =
  "w-full rounded-xl border border-zinc-200/90 bg-white px-3.5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/[0.09] dark:bg-[#131316] dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:hover:border-white/[0.15] dark:focus:border-violet-400 dark:focus:ring-violet-400/10";

const labelBase =
  "mb-2 block text-[11px] font-semibold tracking-wide text-zinc-700 dark:text-zinc-300";

const errorBase = "mt-1.5 text-xs font-medium text-rose-500";

const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white shadow-sm shadow-violet-600/15 transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-500 dark:hover:bg-violet-400";

const btnSecondary =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.09] dark:bg-[#18181b] dark:text-zinc-300 dark:hover:bg-white/[0.05]";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function getServiceArray(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  if (Array.isArray(response?.services)) return response.services;
  if (Array.isArray(response)) return response;
  return [];
}

function getErrorMessage(error, fallback) {
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.message ||
    fallback
  );
}

function SectionEyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700 dark:border-violet-400/15 dark:bg-violet-400/[0.07] dark:text-violet-300">
      {children}
    </div>
  );
}

function StatCard({ label, value, description, icon: Icon, accent }) {
  const accents = {
    violet:
      "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
    zinc: "bg-zinc-100 text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300",
  };

  return (
    <div className="group rounded-2xl border border-zinc-200/80 bg-white p-4 transition-colors hover:border-zinc-300 sm:p-5 dark:border-white/[0.07] dark:bg-[#111113] dark:hover:border-white/[0.13]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 tabular-nums dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            accents[accent] || accents.zinc,
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function ServiceStatus({ active }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        active
          ? "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/[0.08] dark:text-emerald-300"
          : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-zinc-400",
        )}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState({ searching, onCreate }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/60 px-6 py-16 text-center dark:border-white/[0.12] dark:bg-white/[0.015]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 shadow-sm dark:border-white/[0.08] dark:bg-[#18181b] dark:text-zinc-400">
        {searching ? (
          <Search className="h-6 w-6" strokeWidth={1.6} />
        ) : (
          <Layers className="h-6 w-6" strokeWidth={1.6} />
        )}
      </div>

      <h3 className="mt-5 text-sm font-semibold text-zinc-900 dark:text-white">
        {searching ? "No matching services" : "Your services start here"}
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-6 text-zinc-500 dark:text-zinc-400">
        {searching
          ? "Try another keyword or search by a technology stack."
          : "Showcase your expertise by adding the services you offer to your portfolio."}
      </p>

      {!searching && (
        <button
          type="button"
          onClick={onCreate}
          className={`${btnPrimary} mt-5`}
        >
          <Plus className="h-4 w-4" />
          Create your first service
        </button>
      )}
    </div>
  );
}

function ServiceCard({ service, onEdit, onDelete, onToggle, togglingId }) {
  const stacks = Array.isArray(service.stacks) ? service.stacks : [];
  const isToggling = togglingId === service._id;

  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl",
        "border border-zinc-200/80 bg-white transition-colors duration-200",
        "hover:border-violet-300/80 dark:border-white/[0.07]",
        "dark:bg-[#111113] dark:hover:border-violet-400/30",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-700 dark:border-violet-400/15 dark:from-violet-400/[0.12] dark:to-indigo-400/[0.07] dark:text-violet-300">
          <DynamicIcon
            name={service.icon || "Code2"}
            className="h-[21px] w-[21px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <ServiceStatus active={Boolean(service.isActive)} />

          <button
            type="button"
            onClick={() => onToggle(service)}
            disabled={isToggling}
            title={service.isActive ? "Deactivate service" : "Activate service"}
            aria-label={service.isActive ? "Deactivate service" : "Activate service"}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50 dark:border-white/[0.08] dark:text-zinc-400 dark:hover:border-violet-400/20 dark:hover:bg-violet-400/[0.08] dark:hover:text-violet-300"
          >
            {isToggling ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
            ) : (
              <Power className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="break-words text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {service.title || "Untitled service"}
        </h3>

        <p className="mt-2 min-h-[60px] whitespace-pre-line break-words text-xs leading-6 text-zinc-500 dark:text-zinc-400">
          {service.description || "No description provided."}
        </p>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
              Technology stack
            </span>
            <span className="text-[10px] tabular-nums text-zinc-400">
              {stacks.length} {stacks.length === 1 ? "item" : "items"}
            </span>
          </div>

          {stacks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {stacks.slice(0, 4).map((stack, index) => (
                <span
                  key={`${stack}-${index}`}
                  className="inline-flex max-w-full items-center rounded-xl border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 dark:border-white/[0.07] dark:bg-white/[0.025] dark:text-zinc-300"
                >
                  <span className="truncate">{stack}</span>
                </span>
              ))}

              {stacks.length > 4 && (
                <span className="inline-flex items-center rounded-xl border border-violet-200/70 bg-violet-50 px-2 py-1.5 text-[10px] font-semibold text-violet-700 dark:border-violet-400/15 dark:bg-violet-400/[0.07] dark:text-violet-300">
                  +{stacks.length - 4}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              No technologies added
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/60 px-5 py-3.5 dark:border-white/[0.06] dark:bg-white/[0.015]">
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {service.isActive ? "Visible on portfolio" : "Hidden from portfolio"}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-2.5 text-[10px] font-semibold text-zinc-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 dark:border-white/[0.08] dark:bg-[#18181b] dark:text-zinc-300 dark:hover:border-violet-400/20 dark:hover:bg-violet-400/[0.07] dark:hover:text-violet-300"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            aria-label={`Delete ${service.title || "service"}`}
            title="Delete service"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20 dark:hover:border-rose-400/15 dark:hover:bg-rose-400/[0.07] dark:hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ServiceModal({ editingService, onClose, onSubmit, isSaving }) {
  const [stacks, setStacks] = useState(
    Array.isArray(editingService?.stacks) ? editingService.stacks : [],
  );
  const [stackInput, setStackInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: editingService?.title || "",
      description: editingService?.description || "",
      icon: editingService?.icon || "Code2",
      isActive: editingService?.isActive ?? true,
    },
  });

  const selectedIcon = watch("icon");

  const addStack = (event) => {
    event?.preventDefault();

    const value = stackInput.trim();
    if (!value) return;

    if (stacks.some((stack) => stack.toLowerCase() === value.toLowerCase())) {
      toast.error("This technology has already been added.");
      return;
    }

    setStacks((previous) => [...previous, value]);
    setStackInput("");
  };

  const removeStack = (item) => {
    setStacks((previous) => previous.filter((stack) => stack !== item));
  };

  const submit = async (data) => {
    await onSubmit({
      title: data.title.trim(),
      description: data.description.trim(),
      icon: data.icon,
      stacks,
      isActive: data.isActive,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/55 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        className="my-auto flex max-h-[92dvh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-black/10 dark:border-white/[0.09] dark:bg-[#111113] dark:shadow-black/40"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6 dark:border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-400/15 dark:bg-violet-400/[0.08] dark:text-violet-300">
              {editingService ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>

            <div>
              <h2
                id="service-modal-title"
                className="text-sm font-semibold text-zinc-900 dark:text-white"
              >
                {editingService ? "Edit service" : "Create a service"}
              </h2>
              <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                Configure your portfolio offering.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <div>
              <label htmlFor="service-title" className={labelBase}>
                Service name <span className="text-rose-500">*</span>
              </label>
              <input
                id="service-title"
                autoFocus
                placeholder="e.g. Full-stack web development"
                {...register("title", {
                  required: "Service name is required.",
                  validate: (value) =>
                    Boolean(value.trim()) || "Service name is required.",
                })}
                className={inputBase}
              />
              {errors.title && (
                <p className={errorBase}>{errors.title.message}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className={cn(labelBase, "mb-0")}>Service icon</label>
                <span className="rounded-xl bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400">
                  {selectedIcon}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3 sm:grid-cols-6 dark:border-white/[0.07] dark:bg-white/[0.015]">
                {AVAILABLE_ICONS.map((iconName) => {
                  const selected = selectedIcon === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() =>
                        setValue("icon", iconName, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      aria-label={`Select ${iconName} icon`}
                      aria-pressed={selected}
                      title={iconName}
                      className={cn(
                        "relative flex aspect-square min-h-11 items-center justify-center rounded-xl border transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                        selected
                          ? "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/[0.1] dark:text-violet-300"
                          : "border-transparent bg-white text-zinc-500 hover:border-zinc-200 hover:bg-zinc-100 dark:bg-[#18181b] dark:text-zinc-400 dark:hover:border-white/[0.1] dark:hover:bg-white/[0.05]",
                      )}
                    >
                      <DynamicIcon
                        name={iconName}
                        className="h-[18px] w-[18px]"
                      />
                      {selected && (
                        <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-600 text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="service-description" className={labelBase}>
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="service-description"
                rows={4}
                placeholder="Describe the service, deliverables, and value you provide..."
                {...register("description", {
                  required: "Description is required.",
                  validate: (value) =>
                    Boolean(value.trim()) || "Description is required.",
                })}
                className={`${inputBase} resize-y leading-6`}
              />
              {errors.description && (
                <p className={errorBase}>{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="service-stack-input" className={labelBase}>
                Technologies and tools
              </label>

              <div className="flex gap-2">
                <input
                  id="service-stack-input"
                  value={stackInput}
                  onChange={(event) => setStackInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addStack();
                    }
                  }}
                  placeholder="Add a technology..."
                  className={`${inputBase} min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={addStack}
                  className={btnSecondary}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              <div className="mt-3 flex min-h-8 flex-wrap gap-2">
                {stacks.length ? (
                  stacks.map((stack) => (
                    <span
                      key={stack}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl border border-violet-200/70 bg-violet-50/80 px-2.5 py-1.5 text-[11px] font-medium text-violet-800 dark:border-violet-400/15 dark:bg-violet-400/[0.06] dark:text-violet-300"
                    >
                      <span className="max-w-[180px] truncate">{stack}</span>
                      <button
                        type="button"
                        onClick={() => removeStack(stack)}
                        aria-label={`Remove ${stack}`}
                        className="text-violet-500 transition-colors hover:text-rose-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="py-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    Add the technologies used to deliver this service.
                  </p>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/80 p-3.5 transition-colors hover:bg-zinc-50 dark:border-white/[0.08] dark:hover:bg-white/[0.025]">
              <input
                type="checkbox"
                {...register("isActive")}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 accent-violet-600 focus:ring-violet-500 dark:border-white/[0.2]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Publish this service
                </span>
                <span className="mt-1 block text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                  Enable this service for display on your public portfolio.
                </span>
              </span>
              <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            </label>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-zinc-100 bg-zinc-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/[0.07] dark:bg-white/[0.015]">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              <span className="text-rose-500">*</span> Required fields
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className={btnSecondary}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={btnPrimary}
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-violet-900/30 dark:border-t-violet-900" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {editingService ? "Save changes" : "Create service"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export function ServicesSection({ searchQuery = "" }) {
  const {
    data: servicesResponse,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    refetch,
  } = useGetAllServicesQuery();

  const [createService, { isLoading: isCreating }] =
    useCreateServiceMutation();

  const [updateService, { isLoading: isUpdating }] =
    useUpdateServiceMutation();

  const [deleteService, { isLoading: isDeleting }] =
    useDeleteServiceMutation();

  const [toggleServiceStatus] = useToggleServiceStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Existing reusable DeleteConfirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const isSaving = isCreating || isUpdating;
  const allServices = getServiceArray(servicesResponse);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredServices = allServices.filter((service) => {
    if (!normalizedQuery) return true;

    const title = String(service?.title || "").toLowerCase();
    const description = String(service?.description || "").toLowerCase();
    const stacks = Array.isArray(service?.stacks) ? service.stacks : [];

    return (
      title.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      stacks.some((stack) =>
        String(stack).toLowerCase().includes(normalizedQuery),
      )
    );
  });

  const activeCount = allServices.filter(
    (service) => service?.isActive,
  ).length;

  const openCreateModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingService(null);
  };

  const onSubmit = async (payload) => {
    try {
      if (editingService) {
        await updateService({
          id: editingService._id,
          ...payload,
        }).unwrap();

        toast.success("Service updated successfully.");
      } else {
        await createService(payload).unwrap();
        toast.success("Service created successfully.");
      }

      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save service."));
    }
  };

  const handleToggleStatus = async (service) => {
    if (!service?._id) return;

    setTogglingId(service._id);

    try {
      await toggleServiceStatus(service._id).unwrap();

      toast.success(
        service.isActive ? "Service deactivated." : "Service activated.",
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update service status."),
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open the reusable confirmation modal instead of window.confirm().
  const handleDelete = (service) => {
    if (!service?._id || isDeleting) return;

    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete?._id || isDeleting) return;

    try {
      await deleteService(serviceToDelete._id).unwrap();

      toast.success("Service deleted successfully.");

      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete service."));
    }
  };

  if (isLoadingServices) {
    return (
      <div className="mx-auto max-w-[1440px] space-y-7">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-64 max-w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-96 max-w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/70" />
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.07] dark:bg-[#111113]"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-white/[0.07] dark:bg-[#111113]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isErrorServices) {
    return (
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col items-center rounded-2xl border border-rose-200/80 bg-white px-6 py-14 text-center dark:border-rose-400/15 dark:bg-[#111113]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-400/[0.08] dark:text-rose-400">
            <CircleDashed className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">
            Unable to load services
          </h2>

          <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            We could not retrieve your services. Try requesting the data again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className={`${btnPrimary} mt-5`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-7 pb-8">
      {/* Page header */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/[0.07] dark:bg-[#111113]">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.07] blur-3xl dark:bg-violet-500/[0.1]" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 h-48 w-48 rounded-full bg-indigo-500/[0.04] blur-3xl dark:bg-indigo-500/[0.06]" />

        <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="min-w-0">
            <SectionEyebrow>
              <Sparkles className="h-3.5 w-3.5" />
              Portfolio management
            </SectionEyebrow>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              Your services<span className="text-violet-500">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-6 text-zinc-500 sm:text-sm dark:text-zinc-400">
              Manage your offerings, highlight your technical expertise, and
              control what visitors see on your portfolio.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                <Layers className="h-3.5 w-3.5" />
                {allServices.length} total offerings
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/70 bg-emerald-50/70 px-2.5 py-1.5 text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/[0.05] dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {activeCount} published
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className={`${btnPrimary} h-11 shrink-0 px-5`}
          >
            <Plus className="h-4 w-4" />
            Add new service
            <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-70" />
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section
        aria-label="Service statistics"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        <StatCard
          label="Total services"
          value={allServices.length}
          description="All offerings in your CMS"
          icon={BriefcaseBusiness}
          accent="violet"
        />

        <StatCard
          label="Published"
          value={activeCount}
          description="Currently marked as active"
          icon={CircleCheck}
          accent="emerald"
        />

        <StatCard
          label="Inactive"
          value={allServices.length - activeCount}
          description="Currently marked as inactive"
          icon={Power}
          accent="amber"
        />

        <StatCard
          label="Search results"
          value={filteredServices.length}
          description={
            normalizedQuery
              ? "Services matching your search"
              : "All services currently displayed"
          }
          icon={Search}
          accent="zinc"
        />
      </section>

      {/* Service list */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                All services
              </h2>

              <span className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-zinc-400">
                {filteredServices.length}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              Edit service details or change their visibility.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start text-[10px] text-zinc-400 dark:text-zinc-500 sm:self-auto">
            <Command className="h-3.5 w-3.5" />
            Global search
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <EmptyState
            searching={Boolean(normalizedQuery)}
            onCreate={openCreateModal}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggle={handleToggleStatus}
                togglingId={togglingId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create / edit modal */}
      {isModalOpen && (
        <ServiceModal
          key={editingService?._id || "new-service"}
          editingService={editingService}
          onClose={closeModal}
          onSubmit={onSubmit}
          isSaving={isSaving}
        />
      )}

      {/* Existing reusable delete confirmation modal */}
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete service?"
        description="This service will be permanently removed from your portfolio. This action cannot be undone."
        itemName={serviceToDelete?.title || "Untitled service"}
        confirmLabel="Delete service"
        cancelLabel="Keep service"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ServicesSection;
