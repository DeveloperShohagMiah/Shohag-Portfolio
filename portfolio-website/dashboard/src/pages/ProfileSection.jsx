import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Clock,
    Globe,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    Youtube,
    Dribbble,
    Upload,
    Camera,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Copy,
    Sparkles,
    Save,
    RotateCcw,
    Briefcase,
    Radio,
    Check,
    MessageSquare,
    Image as ImageIcon,
    Link as LinkIcon,
    AtSign,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from "@/redux/features/profileApi.js";

const avatarPresets = [
    {
        label: "Modern Tech Leader",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Software Engineer",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "UI/UX Architect",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Full-Stack Developer",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Creative Technologist",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    },
    {
        label: "Engineering Manager",
        url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    },
];

const DEFAULT_VALUES = {
    name: "",
    email: "",
    role: "",
    phone: "",
    address: "",
    timezone: "UTC-7 (Pacific Time)",
    isAvailable: true,
    availabilityNotice:
        "Open to full-time engineering roles & high-impact contracts",
    bio: "",
    avatar: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    instagram: "",
    dribbble: "",
    youtube: "",
    discord: "",
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
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800";

const cardBase =
    "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

/* Section header inside cards */
function SectionHeader({ icon: Icon, title, subtitle, right }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-0.5 text-[11px] text-zinc-500">{subtitle}</p>
                    )}
                </div>
            </div>
            {right}
        </div>
    );
}

export function ProfileSection() {
    const {
        data: profile,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
    } = useGetProfileQuery();

    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

    const fileInputRef = useRef(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isDirty, errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    useEffect(() => {
        if (!profile) return;
        const p = profile.data ?? profile;

        reset({
            name: p.name || "",
            email: p.email || "",
            role: p.role || "",
            phone: p.phone || "",
            address: p.address || "",
            timezone: p.timezone || "UTC-7 (Pacific Time)",
            isAvailable: p.isAvailable ?? true,
            availabilityNotice:
                p.availabilityNotice ||
                "Open to full-time engineering roles & high-impact contracts",
            bio: p.bio || "",
            avatar: p.avatar || "",
            github: p.socialLinks?.github || "",
            linkedin: p.socialLinks?.linkedin || "",
            twitter: p.socialLinks?.twitter || "",
            website: p.socialLinks?.website || "",
            instagram: p.socialLinks?.instagram || "",
            dribbble: p.socialLinks?.dribbble || "",
            youtube: p.socialLinks?.youtube || "",
            discord: p.socialLinks?.discord || "",
        });
    }, [profile, reset]);

    const watchedAvatar = watch("avatar");
    const watchedIsAvailable = watch("isAvailable");
    const watchedName = watch("name");
    const watchedRole = watch("role");
    const watchedAddress = watch("address");
    const watchedEmail = watch("email");
    const watchedPhone = watch("phone");
    const watchedAvailabilityNotice = watch("availabilityNotice");
    const watchedGithub = watch("github");
    const watchedLinkedin = watch("linkedin");
    const watchedTwitter = watch("twitter");
    const watchedWebsite = watch("website");
    const watchedInstagram = watch("instagram");
    const watchedDribbble = watch("dribbble");
    const watchedYoutube = watch("youtube");

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file (PNG, JPG, WebP)");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl === "string") {
                setValue("avatar", dataUrl, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                toast.success("Profile photo uploaded");
            }
        };
        reader.readAsDataURL(file);
    };

    const onSelectPreset = (url) => {
        setValue("avatar", url, { shouldDirty: true, shouldValidate: true });
        toast.success("Avatar preset applied");
    };

    const onSubmit = async (data) => {
        const payload = {
            name: data.name.trim(),
            email: data.email.trim(),
            role: data.role.trim(),
            phone: data.phone?.trim() || "",
            address: data.address?.trim() || "",
            timezone: data.timezone?.trim() || "",
            isAvailable: Boolean(data.isAvailable),
            availabilityNotice: data.availabilityNotice?.trim() || "",
            bio: data.bio?.trim() || "",
            avatar: data.avatar,
            socialLinks: {
                github: data.github?.trim() || "",
                linkedin: data.linkedin?.trim() || "",
                twitter: data.twitter?.trim() || "",
                website: data.website?.trim() || "",
                instagram: data.instagram?.trim() || "",
                dribbble: data.dribbble?.trim() || "",
                youtube: data.youtube?.trim() || "",
                discord: data.discord?.trim() || "",
            },
        };

        try {
            await updateProfile(payload).unwrap();
            toast.success("Profile updated successfully!");
            reset(data);
        } catch (error) {
            toast.error(
                error?.data?.message || error?.message || "Failed to save profile."
            );
        }
    };

    const handleCopyProfileCard = () => {
        const summary = `${watchedName} — ${watchedRole}\n📍 ${watchedAddress}\n✉️ ${watchedEmail}\n🌐 ${watchedWebsite || ""}\nStatus: ${watchedIsAvailable ? "Available for work" : "Not available"
            }`;
        navigator.clipboard.writeText(summary);
        setCopiedLink(true);
        toast.success("Profile details copied to clipboard");
        setTimeout(() => setCopiedLink(false), 2000);
    };

    if (isLoadingProfile) {
        return (
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        <div className="h-64 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
                        <div className="h-40 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
                        <div className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="h-96 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-800 dark:bg-zinc-900/60" />
                    </div>
                </div>
            </div>
        );
    }

    if (isErrorProfile) {
        return (
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl border border-dashed border-rose-300/60 bg-rose-50/40 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/10">
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                        Failed to load profile
                    </p>
                    <p className="mt-1.5 text-xs text-zinc-500">
                        Refresh the page to try again.
                    </p>
                </div>
            </div>
        );
    }

    const socials = [
        { name: "github", label: "GitHub", Icon: Github, placeholder: "https://github.com/username", value: watchedGithub, color: "text-zinc-900 dark:text-zinc-100", bg: "bg-zinc-100 dark:bg-zinc-800" },
        { name: "linkedin", label: "LinkedIn", Icon: Linkedin, placeholder: "https://linkedin.com/in/username", value: watchedLinkedin, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
        { name: "twitter", label: "Twitter / X", Icon: Twitter, placeholder: "https://twitter.com/username", value: watchedTwitter, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/40" },
        { name: "website", label: "Website", Icon: Globe, placeholder: "https://yoursite.dev", value: watchedWebsite, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
        { name: "instagram", label: "Instagram", Icon: Instagram, placeholder: "https://instagram.com/username", value: watchedInstagram, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/40" },
        { name: "dribbble", label: "Dribbble", Icon: Dribbble, placeholder: "https://dribbble.com/username", value: watchedDribbble, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/40" },
        { name: "youtube", label: "YouTube", Icon: Youtube, placeholder: "https://youtube.com/@username", value: watchedYoutube, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            {/* ============================================================
          Header
          ============================================================ */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
                <div className="max-w-2xl">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                        <Sparkles className="h-3 w-3" />
                        Profile
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Public profile
                    </h1>

                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Your avatar, availability, personal info, and connected channels —
                        everything that appears on your portfolio.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {isDirty && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                            Unsaved
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={!isDirty || isSubmitting || isSaving}
                        className={btnGhost}
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting || isSaving}
                        className={btnPrimary}
                    >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? "Saving…" : "Save profile"}
                    </button>
                </div>
            </div>

            {/* ============================================================
          Main layout
          ============================================================ */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* =====================================================
              Left column
              ===================================================== */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* --- Avatar --- */}
                        <div className={`${cardBase} p-5 sm:p-6`}>
                            <SectionHeader
                                icon={Camera}
                                title="Profile picture"
                                subtitle="Recommended 1:1 square, at least 400×400px"
                            />

                            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                                {/* Avatar frame */}
                                <div className="relative shrink-0">
                                    <div className="h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-zinc-100 dark:ring-zinc-800">
                                        <img
                                            src={watchedAvatar || avatarPresets[0].url}
                                            alt="Profile preview"
                                            onError={(e) => {
                                                e.currentTarget.src = avatarPresets[0].url;
                                            }}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <span
                                        className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-white dark:ring-zinc-900 ${watchedIsAvailable
                                                ? "bg-emerald-500 text-white"
                                                : "bg-zinc-400 text-zinc-900"
                                            }`}
                                    >
                                        {watchedIsAvailable ? (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                            <XCircle className="h-3.5 w-3.5" />
                                        )}
                                    </span>
                                </div>

                                {/* Upload + URL */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload image
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onSelectPreset(avatarPresets[0].url)}
                                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-xs font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                                        >
                                            Reset to default
                                        </button>
                                    </div>

                                    <div>
                                        <label htmlFor="avatar" className={labelBase}>
                                            Or paste an image URL
                                        </label>
                                        <div className="relative">
                                            <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                            <input
                                                id="avatar"
                                                type="url"
                                                placeholder="https://images.unsplash.com/…"
                                                {...register("avatar", {
                                                    required: "Avatar URL is required",
                                                })}
                                                className={`${inputBase} pl-10`}
                                            />
                                        </div>
                                        {errors.avatar && (
                                            <p className={errorBase}>{errors.avatar.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Presets */}
                            <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                                <div className="mb-3 flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                                        Quick presets
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                                    {avatarPresets.map((preset, idx) => {
                                        const isSelected = watchedAvatar === preset.url;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => onSelectPreset(preset.url)}
                                                title={preset.label}
                                                className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${isSelected
                                                        ? "border-zinc-900 ring-2 ring-zinc-900/20 dark:border-zinc-100 dark:ring-zinc-100/20"
                                                        : "border-transparent opacity-80 hover:border-zinc-300 hover:opacity-100 dark:hover:border-zinc-700"
                                                    }`}
                                            >
                                                <img
                                                    src={preset.url}
                                                    alt={preset.label}
                                                    className="h-full w-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/40">
                                                        <Check className="h-4 w-4 text-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* --- Availability --- */}
                        <div className={`${cardBase} p-5 sm:p-6`}>
                            <SectionHeader
                                icon={Radio}
                                title="Work availability"
                                subtitle="Shown as a status indicator across your portfolio"
                                right={
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${watchedIsAvailable
                                                ? "border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                : "border-zinc-300/40 bg-zinc-100 text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/60 dark:text-zinc-400"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${watchedIsAvailable
                                                    ? "bg-emerald-500"
                                                    : "bg-zinc-400"
                                                }`}
                                        />
                                        {watchedIsAvailable ? "Available" : "Booked"}
                                    </span>
                                }
                            />

                            <div className="mt-5 space-y-5">
                                <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                            Open for work
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-zinc-500">
                                            Shows an availability badge on your portfolio, hero, and
                                            contact forms.
                                        </p>
                                    </div>
                                    <span className="relative mt-0.5 inline-flex shrink-0 items-center">
                                        <input
                                            type="checkbox"
                                            {...register("isAvailable")}
                                            className="peer sr-only"
                                        />
                                        <span className="h-6 w-11 rounded-full bg-zinc-200 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-500/20 dark:bg-zinc-700" />
                                        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                                    </span>
                                </label>

                                <div>
                                    <label
                                        htmlFor="availabilityNotice"
                                        className={labelBase}
                                    >
                                        Availability notice
                                    </label>
                                    <input
                                        id="availabilityNotice"
                                        type="text"
                                        placeholder="e.g. Open to full-time roles & freelance contracts"
                                        {...register("availabilityNotice")}
                                        className={inputBase}
                                    />
                                    <p className="mt-1.5 text-[11px] text-zinc-500">
                                        Shown as the status message on your portfolio banner.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- Personal info --- */}
                        <div className={`${cardBase} p-5 sm:p-6`}>
                            <SectionHeader
                                icon={MapPin}
                                title="Personal info"
                                subtitle="Your public profile details"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className={labelBase}>
                                        Full name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Shohag Miah"
                                            {...register("name", { required: "Name is required" })}
                                            className={`${inputBase} pl-10`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className={errorBase}>{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="role" className={labelBase}>
                                        Role / title <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="role"
                                            type="text"
                                            placeholder="Full-Stack Engineer & UI Architect"
                                            {...register("role", { required: "Role is required" })}
                                            className={`${inputBase} pl-10`}
                                        />
                                    </div>
                                    {errors.role && (
                                        <p className={errorBase}>{errors.role.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelBase}>
                                        Contact email <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register("email", { required: "Email is required" })}
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
                                    <label htmlFor="address" className={labelBase}>
                                        Address / location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="San Francisco, CA · Remote worldwide"
                                            {...register("address")}
                                            className={`${inputBase} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="timezone" className={labelBase}>
                                        Timezone & working hours
                                    </label>
                                    <div className="relative">
                                        <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="timezone"
                                            type="text"
                                            placeholder="UTC-7 (Pacific) — 09:00 – 18:00"
                                            {...register("timezone")}
                                            className={`${inputBase} pl-10`}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="bio" className={labelBase}>
                                        Short bio / tagline
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows={2}
                                        placeholder="Passionate software craftsman building resilient web systems, design tokens, and scalable cloud architectures."
                                        {...register("bio")}
                                        className={`${inputBase} resize-none leading-relaxed`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- Social links --- */}
                        <div className={`${cardBase} p-5 sm:p-6`}>
                            <SectionHeader
                                icon={Globe}
                                title="Social channels"
                                subtitle="Displayed in the portfolio header and footer"
                            />

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {socials.map(({ name, label, Icon, placeholder, value, color, bg }) => (
                                    <div key={name}>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor={name}
                                                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400"
                                            >
                                                <span className={`flex h-4 w-4 items-center justify-center rounded ${bg}`}>
                                                    <Icon className={`h-3 w-3 ${color}`} />
                                                </span>
                                                {label}
                                            </label>

                                            {value && (
                                                <a
                                                    href={value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                                                >
                                                    Visit
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                            )}
                                        </div>
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

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="discord"
                                            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400"
                                        >
                                            <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo-50 dark:bg-indigo-950/40">
                                                <MessageSquare className="h-3 w-3 text-indigo-500" />
                                            </span>
                                            Discord
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                        <input
                                            id="discord"
                                            type="text"
                                            placeholder="username#1234"
                                            {...register("discord")}
                                            className={`${inputBase} pl-10`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Bottom save bar --- */}
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <p className="hidden text-[11px] text-zinc-500 sm:block">
                                {isDirty
                                    ? "You have unsaved changes."
                                    : "All changes are saved."}
                            </p>

                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    disabled={!isDirty || isSubmitting || isSaving}
                                    className={btnGhost}
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSaving}
                                    className={btnPrimary}
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {isSaving ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* =====================================================
              Right column — Live preview
              ===================================================== */}
                    <div className="lg:col-span-4">
                        <div className="space-y-4 lg:sticky lg:top-20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                                        Live preview
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCopyProfileCard}
                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                                >
                                    {copiedLink ? (
                                        <>
                                            <Check className="h-3 w-3 text-emerald-500" />
                                            <span className="text-emerald-500">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3 w-3" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className={`${cardBase} overflow-hidden`}>
                                {/* Cover strip */}
                                <div className="relative h-28 bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-transparent">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)]" />

                                    <div className="absolute right-3 top-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${watchedIsAvailable
                                                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-200"
                                                    : "border-white/10 bg-black/40 text-white/80"
                                                }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${watchedIsAvailable
                                                        ? "bg-emerald-400"
                                                        : "bg-white/60"
                                                    }`}
                                            />
                                            {watchedIsAvailable ? "Available" : "Booked"}
                                        </span>
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className="px-5 pb-5">
                                    <div className="relative -mt-12 mb-3 inline-block">
                                        <img
                                            src={watchedAvatar || avatarPresets[0].url}
                                            alt={watchedName}
                                            onError={(e) => {
                                                e.currentTarget.src = avatarPresets[0].url;
                                            }}
                                            className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-sm dark:border-zinc-900"
                                        />
                                        <span
                                            className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-zinc-900 ${watchedIsAvailable ? "bg-emerald-500" : "bg-zinc-400"
                                                }`}
                                        />
                                    </div>

                                    <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                        {watchedName || "Your name"}
                                    </h3>

                                    <p className="mt-0.5 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {watchedRole || "Your title"}
                                    </p>

                                    {watchedAvailabilityNotice && (
                                        <div className="mt-3 flex items-start gap-2 rounded-lg border border-zinc-100 bg-zinc-50/60 p-2.5 text-[11px] leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300">
                                            <Briefcase className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" />
                                            <span>{watchedAvailabilityNotice}</span>
                                        </div>
                                    )}

                                    <div className="mt-4 space-y-1.5 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3 shrink-0 text-zinc-400" />
                                            <span className="truncate">
                                                {watchedAddress || "Location"}
                                            </span>
                                        </div>
                                        {watchedEmail && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3 shrink-0 text-zinc-400" />
                                                <span className="truncate">{watchedEmail}</span>
                                            </div>
                                        )}
                                        {watchedPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3 shrink-0 text-zinc-400" />
                                                <span>{watchedPhone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {[watchedGithub, watchedLinkedin, watchedTwitter, watchedWebsite, watchedInstagram, watchedDribbble, watchedYoutube].some(Boolean) && (
                                        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                                                Channels
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {watchedGithub && (
                                                    <a
                                                        href={watchedGithub}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="GitHub"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                                    >
                                                        <Github className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedLinkedin && (
                                                    <a
                                                        href={watchedLinkedin}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="LinkedIn"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400"
                                                    >
                                                        <Linkedin className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedTwitter && (
                                                    <a
                                                        href={watchedTwitter}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Twitter / X"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500 transition-colors hover:bg-sky-100 dark:bg-sky-950/40"
                                                    >
                                                        <Twitter className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedWebsite && (
                                                    <a
                                                        href={watchedWebsite}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Website"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                    >
                                                        <Globe className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedInstagram && (
                                                    <a
                                                        href={watchedInstagram}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Instagram"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600 transition-colors hover:bg-pink-100 dark:bg-pink-950/40 dark:text-pink-400"
                                                    >
                                                        <Instagram className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedDribbble && (
                                                    <a
                                                        href={watchedDribbble}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="Dribbble"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 dark:bg-rose-950/40"
                                                    >
                                                        <Dribbble className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                                {watchedYoutube && (
                                                    <a
                                                        href={watchedYoutube}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        title="YouTube"
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                                                    >
                                                        <Youtube className="h-3.5 w-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="px-1 text-[10px] text-zinc-400">
                                This is exactly how your profile card appears on the public
                                portfolio.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}