import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Save,
  MessageSquare,
  Trash2,
  Send,
  Sparkles,
  Search,
  Check,
  CheckCheck,
  CornerUpLeft,
  Inbox,
  Circle,
  Link as LinkIcon,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetAllMessagesQuery,
  useUpdateMessageStatusMutation,
  useReplyToMessageMutation,
  useDeleteMessageMutation,
} from "@/redux/features/contactMessageApi.js";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profileApi.js";

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

/* Status styling */
const STATUS_STYLES = {
  unread: {
    dot: "bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950",
    chip: "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  replied: {
    dot: "bg-blue-500 ring-2 ring-blue-100 dark:ring-blue-950",
    chip: "border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  read: {
    dot: "bg-zinc-300 dark:bg-zinc-700",
    chip: "border-zinc-300/40 bg-zinc-100 text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/60 dark:text-zinc-400",
  },
};

export function ContactSection({ searchQuery = "" }) {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  /* ---------- Inbox ---------- */
  const {
    data: messagesResponse,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
  } = useGetAllMessagesQuery();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const [replyToMessage, { isLoading: isReplying }] =
    useReplyToMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const messages = messagesResponse?.data || [];

  /* ---------- Public contact info ---------- */
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSavingInfo }] =
    useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
      availableForFreelance: true,
    },
  });

  useEffect(() => {
    if (profile) {
      const p = profile.data ?? profile;
      reset({
        email: p.email || "",
        phone: p.phone || "",
        location: p.address || "",
        github: p.socialLinks?.github || "",
        linkedin: p.socialLinks?.linkedin || "",
        twitter: p.socialLinks?.twitter || "",
        website: p.socialLinks?.website || "",
        availableForFreelance:
          p.isAvailable !== undefined ? p.isAvailable : true,
      });
    }
  }, [profile, reset]);

  const onSubmitInfo = async (data) => {
    const p = profile?.data ?? profile;

    const payload = {
      name: p?.name,
      email: data.email?.trim() || "",
      role: p?.role,
      phone: data.phone?.trim() || "",
      address: data.location?.trim() || "",
      timezone: p?.timezone,
      isAvailable: Boolean(data.availableForFreelance),
      availabilityNotice: p?.availabilityNotice,
      bio: p?.bio,
      avatar: p?.avatar,
      socialLinks: {
        ...p?.socialLinks,
        github: data.github?.trim() || "",
        linkedin: data.linkedin?.trim() || "",
        twitter: data.twitter?.trim() || "",
        website: data.website?.trim() || "",
      },
    };

    try {
      await updateProfile(payload).unwrap();
      toast.success("Public contact info updated!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update contact info.");
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      try {
        await updateMessageStatus({ id: msg._id, status: "read" }).unwrap();
      } catch {
        /* non-critical */
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error("Please write your reply message");
      return;
    }
    try {
      await replyToMessage({
        id: selectedMessage._id,
        reply: replyText.trim(),
      }).unwrap();
      toast.success(`Reply saved for ${selectedMessage.email}`);
      setReplyText("");
      setSelectedMessage(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save reply.");
    }
  };

  const handleToggleReadStatus = async () => {
    if (!selectedMessage) return;
    const nextStatus =
      selectedMessage.status === "unread" ? "read" : "unread";
    try {
      const result = await updateMessageStatus({
        id: selectedMessage._id,
        status: nextStatus,
      }).unwrap();
      setSelectedMessage(result.data);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Delete message from ${msg.name}?`)) return;
    try {
      await deleteMessage(msg._id).unwrap();
      if (selectedMessage?._id === msg._id) setSelectedMessage(null);
      toast.success("Message deleted.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete message.");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <Sparkles className="h-3 w-3" />
            Contact
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Inquiries & contact info
          </h1>

          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Respond to client inquiries and manage the contact coordinates
            shown on your portfolio.
          </p>
        </div>

        {/* Tab bar */}
        <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab("inbox")}
            className={`relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${activeTab === "inbox"
                ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            Inbox
            {unreadCount > 0 && (
              <span
                className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums ${activeTab === "inbox"
                    ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                    : "bg-emerald-500 text-white"
                  }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${activeTab === "info"
                ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
          >
            <Globe className="h-3.5 w-3.5" />
            Public info
          </button>
        </div>
      </div>

      {/* ============================================================
          INBOX TAB
          ============================================================ */}
      {activeTab === "inbox" ? (
        isLoadingMessages ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60"
                />
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
            </div>
          </div>
        ) : isErrorMessages ? (
          <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Failed to load messages
            </p>
            <p className="mt-1.5 text-xs text-zinc-500">
              Refresh the page to try again.
            </p>
          </div>
        ) : (
          <>
            {/* Stats strip */}
            {messages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {messages.length}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Unread
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                    {unreadCount}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Replied
                  </p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                    {repliedCount}
                  </p>
                </div>
              </div>
            )}

            {/* Two-panel layout */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              {/* List */}
              <div className="space-y-2 lg:col-span-3">
                {filteredMessages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {searchQuery ? (
                        <Search className="h-5 w-5" />
                      ) : (
                        <Inbox className="h-5 w-5" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {searchQuery ? "No matching messages" : "Inbox is empty"}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {searchQuery
                        ? "Try a different search term."
                        : "Incoming contact submissions will appear here."}
                    </p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => {
                    const style =
                      STATUS_STYLES[msg.status] || STATUS_STYLES.read;
                    const isSelected = selectedMessage?._id === msg._id;

                    return (
                      <button
                        key={msg._id}
                        id={`message-row-${msg._id}`}
                        type="button"
                        onClick={() => handleSelectMessage(msg)}
                        className={`group block w-full rounded-xl border p-4 text-left transition-all ${isSelected
                            ? "border-zinc-900 bg-zinc-50/90 shadow-sm dark:border-zinc-100 dark:bg-zinc-800/60"
                            : "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`}
                            />
                            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {msg.name}
                            </span>
                            <span className="hidden truncate font-code text-[11px] text-zinc-400 sm:inline">
                              {msg.email}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline-flex ${style.chip}`}
                            >
                              {msg.status}
                            </span>
                            <span className="font-code text-[10px] tabular-nums text-zinc-400">
                              {new Date(msg.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        </div>

                        <p className="mt-2 truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
                          {msg.subject}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {msg.message}
                        </p>

                        {/* Row actions */}
                        <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
                          <span className="font-code text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                            {isSelected ? "Viewing" : "Click to read"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(msg);
                            }}
                            title="Delete message"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Detail panel */}
              <div className="lg:col-span-2">
                <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white lg:sticky lg:top-20 dark:border-zinc-800 dark:bg-zinc-900">
                  {selectedMessage ? (
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 p-5 dark:border-zinc-800">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {selectedMessage.name}
                          </h3>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="mt-0.5 block truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={handleToggleReadStatus}
                            title={
                              selectedMessage.status === "unread"
                                ? "Mark as read"
                                : "Mark as unread"
                            }
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                          >
                            {selectedMessage.status === "unread" ? (
                              <CheckCheck className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(selectedMessage)}
                            title="Delete message"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="max-h-[60vh] space-y-4 overflow-y-auto p-5">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-code text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                          <span className="inline-flex items-center gap-1.5">
                            {new Date(
                              selectedMessage.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-zinc-300 dark:text-zinc-700"
                          >
                            ·
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${(
                                  STATUS_STYLES[selectedMessage.status] ||
                                  STATUS_STYLES.read
                                ).dot
                                }`}
                            />
                            {selectedMessage.status}
                          </span>
                        </div>

                        {/* Subject */}
                        <div>
                          <p className="mb-1.5 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            Subject
                          </p>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            {selectedMessage.subject}
                          </p>
                        </div>

                        {/* Message */}
                        <div>
                          <p className="mb-1.5 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            Message
                          </p>
                          <div className="whitespace-pre-wrap rounded-lg border border-zinc-100 bg-zinc-50/60 p-3.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300">
                            {selectedMessage.message}
                          </div>
                        </div>

                        {/* Existing reply */}
                        {selectedMessage.reply && (
                          <div>
                            <p className="mb-1.5 inline-flex items-center gap-1.5 font-code text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                              <CornerUpLeft className="h-3 w-3" />
                              Your reply
                            </p>
                            <div className="whitespace-pre-wrap rounded-lg border border-emerald-500/20 bg-emerald-50/60 p-3.5 text-xs leading-relaxed text-zinc-700 dark:bg-emerald-950/20 dark:text-zinc-300">
                              {selectedMessage.reply}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reply form */}
                      <form
                        onSubmit={handleSendReply}
                        className="border-t border-zinc-100 p-5 dark:border-zinc-800"
                      >
                        <label
                          htmlFor="reply"
                          className={labelBase}
                        >
                          Reply to {selectedMessage.name}
                        </label>
                        <textarea
                          id="reply"
                          rows={4}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Compose your reply. This saves the reply to your record — connect an email provider to actually send."
                          className={`${inputBase} resize-none leading-relaxed`}
                        />
                        <button
                          type="submit"
                          disabled={isReplying}
                          className={`${btnPrimary} mt-3 w-full`}
                        >
                          <Send className="h-3.5 w-3.5" />
                          {isReplying ? "Saving…" : "Save reply"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Select a message
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Pick a message from the list to read it and compose
                        your reply.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )
      ) : isLoadingProfile ? (
        <div className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
      ) : isErrorProfile ? (
        <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Failed to load contact info
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            Refresh the page to try again.
          </p>
        </div>
      ) : (
        /* ============================================================
           INFO TAB
           ============================================================ */
        <form
          id="contact-info-form"
          onSubmit={handleSubmit(onSubmitInfo)}
          className="space-y-5"
          noValidate
        >
          {/* Contact coordinates */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Contact coordinates
                </h2>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Shown on your portfolio contact section
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className={labelBase}>
                  Public email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    className={`${inputBase} pl-10`}
                  />
                </div>
                {errors.email && (
                  <p className={errorBase}>{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelBase}>
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="phone"
                    type="text"
                    placeholder="+1 (555) 349-8291"
                    {...register("phone")}
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="location" className={labelBase}>
                  Physical / remote location
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="location"
                    type="text"
                    placeholder="San Francisco, CA · Remote worldwide"
                    {...register("location")}
                    className={`${inputBase} pl-10`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social handles */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Social handles
                </h2>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Displayed in the portfolio header and footer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  name: "github",
                  label: "GitHub",
                  Icon: Github,
                  placeholder: "https://github.com/username",
                  color: "text-zinc-900 dark:text-zinc-100",
                  bg: "bg-zinc-100 dark:bg-zinc-800",
                },
                {
                  name: "linkedin",
                  label: "LinkedIn",
                  Icon: Linkedin,
                  placeholder: "https://linkedin.com/in/username",
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-50 dark:bg-blue-950/40",
                },
                {
                  name: "twitter",
                  label: "Twitter / X",
                  Icon: Twitter,
                  placeholder: "https://twitter.com/username",
                  color: "text-sky-500",
                  bg: "bg-sky-50 dark:bg-sky-950/40",
                },
                {
                  name: "website",
                  label: "Website",
                  Icon: Globe,
                  placeholder: "https://yoursite.dev",
                  color: "text-emerald-600 dark:text-emerald-400",
                  bg: "bg-emerald-50 dark:bg-emerald-950/40",
                },
              ].map(({ name, label, Icon, placeholder, color, bg }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded ${bg}`}
                    >
                      <Icon className={`h-3 w-3 ${color}`} />
                    </span>
                    {label}
                  </label>
                  <div className="relative">
                    <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                    <input
                      id={name}
                      type="url"
                      placeholder={placeholder}
                      {...register(name)}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("availableForFreelance")}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/30 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Show availability badge on contact banner
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  This is the same availability flag used across your Profile
                  and Hero sections.
                </p>
              </div>
            </label>
          </div>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="hidden text-[11px] text-zinc-500 sm:block">
              Changes are saved to your portfolio instantly.
            </p>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className={btnGhost}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSavingInfo}
                className={btnPrimary}
              >
                <Save className="h-3.5 w-3.5" />
                {isSavingInfo ? "Saving…" : "Save contact info"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}