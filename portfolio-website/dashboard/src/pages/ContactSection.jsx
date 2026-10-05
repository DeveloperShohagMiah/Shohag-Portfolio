import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Mail, Phone, MapPin, Github, Linkedin, Twitter, Globe, Save,
  MessageSquare, Trash2, Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetAllMessagesQuery,
  useUpdateMessageStatusMutation,
  useReplyToMessageMutation,
  useDeleteMessageMutation,
} from '@/redux/features/contactMessageApi.js';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/features/profileApi.js';

export function ContactSection({ searchQuery = '' }) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // --- Inbox data ---
  const { data: messagesResponse, isLoading: isLoadingMessages, isError: isErrorMessages } = useGetAllMessagesQuery();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();
  const [replyToMessage, { isLoading: isReplying }] = useReplyToMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const messages = messagesResponse?.data || [];

  // --- Public contact info reuses Profile — no separate contactInfo singleton ---
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSavingInfo }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
      availableForFreelance: true,
    }
  });

  // Populate the info form once Profile data arrives
  useEffect(() => {
    if (profile) {
      reset({
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.address || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        website: profile.socialLinks?.website || '',
        availableForFreelance: profile.isAvailable !== undefined ? profile.isAvailable : true,
      });
    }
  }, [profile, reset]);

  const onSubmitInfo = async (data) => {
    // Merge into the existing profile rather than overwriting fields this form doesn't manage
    // (name, role, bio, avatar, etc. live on the Profile section, not here).
    const payload = {
      name: profile?.name,
      email: data.email,
      role: profile?.role,
      phone: data.phone,
      address: data.location,
      timezone: profile?.timezone,
      isAvailable: Boolean(data.availableForFreelance),
      availabilityNotice: profile?.availabilityNotice,
      bio: profile?.bio,
      avatar: profile?.avatar,
      socialLinks: {
        ...profile?.socialLinks,
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        website: data.website,
      },
    };

    try {
      await updateProfile(payload).unwrap();
      toast.success('Public contact info updated!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update contact info.');
    }
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await updateMessageStatus({ id: msg._id, status: 'read' }).unwrap();
      } catch {
        // non-critical — reading still works even if the status update fails
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error('Please write your reply message');
      return;
    }
    try {
      await replyToMessage({ id: selectedMessage._id, reply: replyText.trim() }).unwrap();
      toast.success(`Reply saved for ${selectedMessage.email}`);
      setReplyText('');
      setSelectedMessage(null);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save reply.');
    }
  };

  const handleToggleReadStatus = async () => {
    if (!selectedMessage) return;
    const nextStatus = selectedMessage.status === 'unread' ? 'read' : 'unread';
    try {
      const result = await updateMessageStatus({ id: selectedMessage._id, status: nextStatus }).unwrap();
      setSelectedMessage(result.data);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Delete message from ${msg.name}?`)) return;
    try {
      await deleteMessage(msg._id).unwrap();
      if (selectedMessage?._id === msg._id) setSelectedMessage(null);
      toast.success('Message deleted.');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete message.');
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

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Contact &amp; Client Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your portfolio contact coordinates, social channels, and respond to incoming inquiries.
          </p>
        </div>

        <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'inbox'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Inquiries Inbox
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'info'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Public Contact Info
          </button>
        </div>
      </div>

      {activeTab === 'inbox' ? (
        isLoadingMessages ? (
          <div className="py-12 text-center text-sm text-zinc-500">Loading messages...</div>
        ) : isErrorMessages ? (
          <div className="py-12 text-center text-sm text-rose-500">Failed to load messages. Please refresh.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                  <Mail className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Inbox is completely clear
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Incoming contact submissions from your website will display here.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    id={`message-row-${msg._id}`}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${selectedMessage?._id === msg._id
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50/90 dark:bg-zinc-800/80 shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${msg.status === 'unread'
                            ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950'
                            : msg.status === 'replied'
                              ? 'bg-blue-500'
                              : 'bg-zinc-300 dark:bg-zinc-700'
                            }`}
                        />
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {msg.name}
                        </span>
                        <span className="text-xs text-zinc-400">({msg.email})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${msg.status === 'unread'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : msg.status === 'replied'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                        >
                          {msg.status}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-2">
                      Subject: {msg.subject}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                      <span>Click to read &amp; draft reply</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(msg);
                        }}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col justify-between">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {selectedMessage.name}
                      </h3>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {new Date(selectedMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Subject
                    </span>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                      Message
                    </span>
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {selectedMessage.reply && (
                    <div>
                      <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider block mb-1">
                        Your Reply
                      </span>
                      <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.reply}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSendReply} className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                      Reply to {selectedMessage.name}
                    </label>
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response here — note: this saves the reply, it does not send an email unless a mail provider is connected."
                      className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={handleToggleReadStatus}
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        Mark as {selectedMessage.status === 'unread' ? 'Read' : 'Unread'}
                      </button>
                      <button
                        type="submit"
                        disabled={isReplying}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {isReplying ? 'Saving...' : 'Save Reply'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Select an inquiry to view</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    You can inspect message contents and compose direct replies.
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      ) : isLoadingProfile ? (
        <div className="py-12 text-center text-sm text-zinc-500">Loading contact info...</div>
      ) : isErrorProfile ? (
        <div className="py-12 text-center text-sm text-rose-500">Failed to load contact info. Please refresh.</div>
      ) : (
        <form
          id="contact-info-form"
          onSubmit={handleSubmit(onSubmitInfo)}
          className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6 max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                Public Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
              Physical / Remote Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. San Francisco, CA & Remote Worldwide"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
              Social Handles &amp; Profiles
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" /> GitHub Profile
                </label>
                <input
                  type="url"
                  {...register('github')}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                </label>
                <input
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5" /> Twitter / X Handle
                </label>
                <input
                  type="url"
                  {...register('twitter')}
                  placeholder="https://twitter.com/..."
                  className="w-full px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Custom Portfolio Domain
                </label>
                <input
                  type="url"
                  {...register('website')}
                  placeholder="https://mysite.com"
                  className="w-full px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('availableForFreelance')}
                className="w-4 h-4 rounded-sm border-zinc-300 dark:border-zinc-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Display "Open to Freelance &amp; Consulting" on contact banner
              </span>
            </label>
            <p className="text-[11px] text-zinc-400 mt-1.5 ml-7">
              This is the same availability flag shown on your Profile and Hero sections.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isSavingInfo}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingInfo ? 'Saving...' : 'Save Public Coordinates'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}