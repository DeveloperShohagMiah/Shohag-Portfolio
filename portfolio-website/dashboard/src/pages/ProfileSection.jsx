import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext.jsx';
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
    ShieldCheck,
    Briefcase,
    Radio,
    Check,
    MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

// Curated avatar presets for rapid selection
const avatarPresets = [
    {
        label: 'Modern Tech Leader',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    {
        label: 'Software Engineer',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    {
        label: 'UI/UX Architect',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    {
        label: 'Full-Stack Developer',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    {
        label: 'Creative Technologist',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    },
    {
        label: 'Engineering Manager',
        url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'
    }
];

export function ProfileSection() {
    const { profile, updateProfile } = useData();
    const fileInputRef = useRef(null);
    const [copiedLink, setCopiedLink] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isDirty, errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: profile.name || '',
            email: profile.email || '',
            role: profile.role || '',
            phone: profile.phone || '',
            address: profile.address || '',
            timezone: profile.timezone || 'UTC-7 (Pacific Time)',
            isAvailable: profile.isAvailable !== undefined ? profile.isAvailable : true,
            availabilityNotice:
                profile.availabilityNotice ||
                'Open to full-time engineering roles & high-impact contracts',
            bio: profile.bio || '',
            avatar: profile.avatar || '',
            github: profile.socialLinks?.github || '',
            linkedin: profile.socialLinks?.linkedin || '',
            twitter: profile.socialLinks?.twitter || '',
            website: profile.socialLinks?.website || '',
            instagram: profile.socialLinks?.instagram || '',
            dribbble: profile.socialLinks?.dribbble || '',
            youtube: profile.socialLinks?.youtube || '',
            discord: profile.socialLinks?.discord || ''
        }
    });

    const watchedAvatar = watch('avatar');
    const watchedIsAvailable = watch('isAvailable');
    const watchedName = watch('name');
    const watchedRole = watch('role');
    const watchedAddress = watch('address');
    const watchedEmail = watch('email');
    const watchedPhone = watch('phone');
    const watchedAvailabilityNotice = watch('availabilityNotice');
    const watchedGithub = watch('github');
    const watchedLinkedin = watch('linkedin');
    const watchedTwitter = watch('twitter');
    const watchedWebsite = watch('website');
    const watchedInstagram = watch('instagram');
    const watchedDribbble = watch('dribbble');
    const watchedYoutube = watch('youtube');
    const watchedDiscord = watch('discord');

    // Handle local file upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (PNG, JPG, WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result;
            if (typeof dataUrl === 'string') {
                setValue('avatar', dataUrl, { shouldDirty: true, shouldValidate: true });
                toast.success('Profile photo uploaded');
            }
        };
        reader.readAsDataURL(file);
    };

    const onSelectPreset = (url) => {
        setValue('avatar', url, { shouldDirty: true, shouldValidate: true });
        toast.success('Avatar preset applied');
    };

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone,
            address: data.address,
            timezone: data.timezone,
            isAvailable: Boolean(data.isAvailable),
            availabilityNotice: data.availabilityNotice,
            bio: data.bio,
            avatar: data.avatar,
            socialLinks: {
                github: data.github,
                linkedin: data.linkedin,
                twitter: data.twitter,
                website: data.website,
                instagram: data.instagram,
                dribbble: data.dribbble,
                youtube: data.youtube,
                discord: data.discord
            }
        };

        updateProfile(payload);
        reset(data);
    };

    const handleCopyProfileCard = () => {
        const summary = `${watchedName} - ${watchedRole}\n📍 ${watchedAddress}\n✉️ ${watchedEmail}\n🌐 ${watchedWebsite || 'https://shohagmiah.dev'}\nStatus: ${watchedIsAvailable ? 'Available for work' : 'Not available'}`;
        navigator.clipboard.writeText(summary);
        setCopiedLink(true);
        toast.success('Profile details copied to clipboard');
        setTimeout(() => setCopiedLink(false), 2000);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                        <User className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                        Profile Management
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        Update your public profile photo, job availability status, address &amp; location coordinates, and social network handles.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {isDirty && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Unsaved changes
                        </span>
                    )}
                    <button
                        id="discard-profile-btn"
                        type="button"
                        onClick={() => reset()}
                        disabled={!isDirty || isSubmitting}
                        className="px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                    </button>
                    <button
                        id="save-profile-top-btn"
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl transition-colors shadow-xs flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Profile
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Form Controls (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 1. Profile Picture Management */}
                        <div
                            id="profile-image-section"
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        Profile Picture / Avatar
                                    </h2>
                                </div>
                                <span className="text-xs text-zinc-400">
                                    Recommended: 1:1 square, at least 400x400px
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                {/* Avatar Preview with Status Ring */}
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-zinc-100 dark:ring-zinc-800 bg-zinc-100 dark:bg-zinc-800 shadow-md">
                                        <img
                                            src={watchedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                            }}
                                        />
                                    </div>

                                    {/* Availability Badge on Avatar */}
                                    <span
                                        className={`absolute -bottom-1 -right-1 p-1 rounded-full ring-2 ring-white dark:ring-zinc-900 shadow-xs ${watchedIsAvailable
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-zinc-400 text-zinc-900'
                                            }`}
                                        title={watchedIsAvailable ? 'Available for work' : 'Not available'}
                                    >
                                        {watchedIsAvailable ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <XCircle className="w-4 h-4" />
                                        )}
                                    </span>
                                </div>

                                {/* Upload & URL Controls */}
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="avatar-file-input"
                                        />
                                        <button
                                            id="upload-avatar-btn"
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-xs"
                                        >
                                            <Upload className="w-3.5 h-3.5" />
                                            Upload From Computer
                                        </button>

                                        <button
                                            id="reset-avatar-default-btn"
                                            type="button"
                                            onClick={() => onSelectPreset(avatarPresets[0].url)}
                                            className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
                                        >
                                            Reset to Default
                                        </button>
                                    </div>

                                    {/* Direct Image URL input */}
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                                            Or Paste Image URL
                                        </label>
                                        <input
                                            type="url"
                                            {...register('avatar', {
                                                required: 'Avatar URL is required'
                                            })}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                        />
                                        {errors.avatar && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.avatar.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Avatar Presets Selection */}
                            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    Quick Avatar Presets (Click to apply)
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                                    {avatarPresets.map((preset, idx) => {
                                        const isSelected = watchedAvatar === preset.url;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => onSelectPreset(preset.url)}
                                                className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${isSelected
                                                        ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs'
                                                        : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 opacity-80 hover:opacity-100'
                                                    }`}
                                                title={preset.label}
                                            >
                                                <img
                                                    src={preset.url}
                                                    alt={preset.label}
                                                    className="w-full h-full object-cover"
                                                />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-zinc-950/40 flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 2. Availability for Work Toggle & Status Banner */}
                        <div
                            id="work-availability-section"
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        Work Availability &amp; Hiring Status
                                    </h2>
                                </div>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${watchedIsAvailable
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${watchedIsAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                                            }`}
                                    />
                                    {watchedIsAvailable ? 'Currently Available' : 'Currently Booked'}
                                </span>
                            </div>

                            {/* Main Toggle Switch */}
                            <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                <div className="space-y-0.5">
                                    <label
                                        htmlFor="isAvailableToggle"
                                        className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                                    >
                                        Open for Work &amp; New Opportunities (`isAvailable`)
                                    </label>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        When active, an indicator badge is shown across your portfolio, hero banner, and contact forms.
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        id="isAvailableToggle"
                                        type="checkbox"
                                        {...register('isAvailable')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-zinc-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* Availability Notice Text */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                    Availability Notice / Status Message
                                </label>
                                <input
                                    type="text"
                                    {...register('availabilityNotice')}
                                    placeholder="e.g. Open to full-time staff engineering & freelance contracts"
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                />
                                <p className="text-[11px] text-zinc-400 mt-1">
                                    Shown as the status message on your public portfolio banner and hiring callout.
                                </p>
                            </div>
                        </div>

                        {/* 3. Personal & Address Coordinates */}
                        <div
                            id="profile-address-section"
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        Personal Info &amp; Address Location
                                    </h2>
                                </div>
                                <span className="text-xs text-zinc-400">Public profile details</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        placeholder="Shohag Miah"
                                        className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Professional Role */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Professional Role / Title *
                                    </label>
                                    <input
                                        type="text"
                                        {...register('role', { required: 'Role is required' })}
                                        placeholder="Full Stack Engineer & UI Architect"
                                        className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                    {errors.role && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.role.message}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Contact Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            {...register('email', { required: 'Email is required' })}
                                            placeholder="shohagmiah7474@gmail.com"
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            {...register('phone')}
                                            placeholder="+1 (555) 349-8291"
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* Address / Location */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Address / Physical Location *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            {...register('address', { required: 'Address is required' })}
                                            placeholder="San Francisco, CA & Remote Worldwide"
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>
                                    )}
                                </div>

                                {/* Timezone */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Timezone &amp; Working Hours
                                    </label>
                                    <div className="relative">
                                        <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            {...register('timezone')}
                                            placeholder="UTC-7 (Pacific Time) — 09:00 - 18:00 PST"
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                        />
                                    </div>
                                </div>

                                {/* Short Bio / Tagline */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-2">
                                        Short Tagline / Bio
                                    </label>
                                    <textarea
                                        rows={2}
                                        {...register('bio')}
                                        placeholder="Passionate software craftsman building resilient web systems, UI design tokens, and scalable cloud architectures."
                                        className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Social Links Management */}
                        <div
                            id="social-links-section"
                            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                        Social Channels &amp; Developer Links
                                    </h2>
                                </div>
                                <span className="text-xs text-zinc-400">Displayed in portfolio footer &amp; header</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* GitHub */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Github className="w-3.5 h-3.5" />
                                            GitHub
                                        </label>
                                        {watchedGithub && (
                                            <a
                                                href={watchedGithub}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('github')}
                                        placeholder="https://github.com/shohagmiah"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                                            LinkedIn
                                        </label>
                                        {watchedLinkedin && (
                                            <a
                                                href={watchedLinkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('linkedin')}
                                        placeholder="https://linkedin.com/in/shohagmiah"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Twitter / X */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Twitter className="w-3.5 h-3.5 text-sky-500" />
                                            Twitter / X
                                        </label>
                                        {watchedTwitter && (
                                            <a
                                                href={watchedTwitter}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('twitter')}
                                        placeholder="https://twitter.com/shohag_dev"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Personal Website */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-emerald-500" />
                                            Personal Website
                                        </label>
                                        {watchedWebsite && (
                                            <a
                                                href={watchedWebsite}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('website')}
                                        placeholder="https://shohagmiah.dev"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Instagram */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Instagram className="w-3.5 h-3.5 text-pink-500" />
                                            Instagram
                                        </label>
                                        {watchedInstagram && (
                                            <a
                                                href={watchedInstagram}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('instagram')}
                                        placeholder="https://instagram.com/shohag.dev"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Dribbble */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Dribbble className="w-3.5 h-3.5 text-rose-500" />
                                            Dribbble
                                        </label>
                                        {watchedDribbble && (
                                            <a
                                                href={watchedDribbble}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('dribbble')}
                                        placeholder="https://dribbble.com/shohagmiah"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* YouTube */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                                            YouTube
                                        </label>
                                        {watchedYoutube && (
                                            <a
                                                href={watchedYoutube}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 inline-flex items-center gap-0.5"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <input
                                        type="url"
                                        {...register('youtube')}
                                        placeholder="https://youtube.com/@shohagdev"
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>

                                {/* Discord */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                            Discord Username / Community
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        {...register('discord')}
                                        placeholder="shohag#1234 or discord.gg/..."
                                        className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Save bar */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                id="profile-reset-bottom-btn"
                                type="button"
                                onClick={() => reset()}
                                disabled={!isDirty || isSubmitting}
                                className="px-4 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl transition-colors disabled:opacity-40 disabled:pointer-events-none"
                            >
                                Discard Changes
                            </button>
                            <button
                                id="profile-save-bottom-btn"
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl transition-colors shadow-xs flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Profile Changes
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Live Portfolio Preview Card (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-20 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    Live Portfolio Preview
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyProfileCard}
                                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 inline-flex items-center gap-1"
                                >
                                    {copiedLink ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-emerald-500 font-semibold">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy Info
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Public Portfolio Profile Card */}
                            <div
                                id="profile-live-card"
                                className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
                            >
                                {/* Card Header Cover Gradient */}
                                <div className="h-28 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 relative">
                                    <div className="absolute top-3 right-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md ${watchedIsAvailable
                                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                    : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
                                                }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${watchedIsAvailable
                                                        ? 'bg-emerald-400 animate-pulse'
                                                        : 'bg-zinc-400'
                                                    }`}
                                            />
                                            {watchedIsAvailable ? 'Available for work' : 'Not available'}
                                        </span>
                                    </div>
                                </div>

                                {/* Profile Avatar & Details */}
                                <div className="px-6 pb-6 pt-0 relative">
                                    {/* Overlapping Avatar */}
                                    <div className="-mt-14 mb-4 relative inline-block">
                                        <img
                                            src={watchedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                                            alt={watchedName}
                                            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-zinc-900 shadow-lg bg-zinc-100 dark:bg-zinc-800"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                            }}
                                        />
                                        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                                    </div>

                                    {/* Name & Headline */}
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                            {watchedName || 'Your Name'}
                                        </h3>
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            {watchedRole || 'Your Title'}
                                        </p>
                                    </div>

                                    {/* Availability Notice Banner */}
                                    {watchedAvailabilityNotice && (
                                        <div className="mt-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                            <span>{watchedAvailabilityNotice}</span>
                                        </div>
                                    )}

                                    {/* Address & Coordinates */}
                                    <div className="mt-4 space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                            <span className="truncate">{watchedAddress || 'Location / Address'}</span>
                                        </div>
                                        {watchedEmail && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                <span className="truncate">{watchedEmail}</span>
                                            </div>
                                        )}
                                        {watchedPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                <span>{watchedPhone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Buttons list */}
                                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                                            Connected Channels
                                        </p>
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {watchedGithub && (
                                                <a
                                                    href={watchedGithub}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors"
                                                    title="GitHub"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedLinkedin && (
                                                <a
                                                    href={watchedLinkedin}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors"
                                                    title="LinkedIn"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedTwitter && (
                                                <a
                                                    href={watchedTwitter}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-colors"
                                                    title="Twitter"
                                                >
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedWebsite && (
                                                <a
                                                    href={watchedWebsite}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors"
                                                    title="Website"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedInstagram && (
                                                <a
                                                    href={watchedInstagram}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-pink-600 dark:text-pink-400 flex items-center justify-center transition-colors"
                                                    title="Instagram"
                                                >
                                                    <Instagram className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedDribbble && (
                                                <a
                                                    href={watchedDribbble}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors"
                                                    title="Dribbble"
                                                >
                                                    <Dribbble className="w-4 h-4" />
                                                </a>
                                            )}
                                            {watchedYoutube && (
                                                <a
                                                    href={watchedYoutube}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                                                    title="YouTube"
                                                >
                                                    <Youtube className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
