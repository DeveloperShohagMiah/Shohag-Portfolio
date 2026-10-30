import React, { useState } from "react";
import {
    ArrowRight,
    Check,
    ChartNoAxesColumnIncreasing,
    Code2,
    FileText,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import {
    AuthFooter,
    AuthHeader,
    EASE,
    Field,
    FeatureRow,
    FOCUS,
    GLASS,
    LiquidBackground,
    LiquidCard,
    PAGE_CSS,
    SubmitButton,
    VisibilityToggle,
    fieldIn,
    stagger,
} from "../components/AuthKid";
import { useUserLoginMutation } from "@/redux/features/authApi";

/* ========================================================================== */
/*  Content                                                                   */
/* ========================================================================== */
const FEATURES = [
    {
        icon: FileText,
        title: "Manage your content",
        description: "Update projects, blogs, services and more.",
        tint: "from-violet-400/30 to-violet-500/5 text-violet-200",
    },
    {
        icon: ChartNoAxesColumnIncreasing,
        title: "Track your progress",
        description: "Keep your portfolio organized and growing.",
        tint: "from-cyan-400/30 to-cyan-500/5 text-cyan-200",
    },
    {
        icon: Zap,
        title: "Everything in one place",
        description: "A smarter workspace for your digital presence.",
        tint: "from-fuchsia-400/30 to-fuchsia-500/5 text-fuchsia-200",
    },
];

// Decorative preview card — replace with real data or delete <ActivityPreview />.
const ACTIVITY = [
    { label: "Blog post published", time: "2h ago", dot: "bg-emerald-400" },
    { label: "Project updated", time: "Yesterday", dot: "bg-violet-400" },
    { label: "New skill added", time: "3d ago", dot: "bg-sky-400" },
];

/* ========================================================================== */
/*  Floating "recent activity" card                                           */
/* ========================================================================== */
function ActivityPreview({ reduced }) {
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.8 }}
            className="hidden lg:block"
        >
            <motion.div
                animate={reduced ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className={`relative w-full max-w-sm rounded-3xl p-5 ${GLASS}`}
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_45%)]"
                />
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                            Recent activity
                        </p>
                        <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                                <span className="relative size-1.5 rounded-full bg-emerald-400" />
                            </span>
                            Synced
                        </span>
                    </div>

                    <ul className="mt-4 space-y-3">
                        {ACTIVITY.map((item, i) => (
                            <motion.li
                                key={item.label}
                                initial={reduced ? false : { opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 1.1 + i * 0.12 }}
                                className="flex items-center justify-between gap-4"
                            >
                                <span className="flex items-center gap-3 text-sm text-slate-200">
                                    <span className={`size-2 rounded-full ${item.dot}`} />
                                    {item.label}
                                </span>
                                <span className="text-xs text-slate-500">{item.time}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Page                                                                      */
/* ========================================================================== */
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userLogin, { isLoading }] = useUserLoginMutation();
    const reduced = useReducedMotion();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: { email: "", password: "", remember: false },
    });

    const onSubmit = async (data) => {
        try {
            await userLogin({
                email: data.email.trim().toLowerCase(),
                password: data.password,
            }).unwrap();

            // Keep your existing successful-login navigation or
            // authentication state handling here if required.
        } catch (error) {
            console.error("Login failed:", error);

            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                error?.message ||
                "Login failed. Please check your credentials."
            );
        }
    };

    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-[#05060d] text-slate-100 selection:bg-violet-500/30">
            <style>{PAGE_CSS}</style>

            <AuthHeader>
                <div
                    className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-xs text-slate-300 sm:inline-flex ${GLASS}`}
                >
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                    </span>
                    Secure workspace
                </div>
            </AuthHeader>

            <section className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-12 px-5 pb-10 pt-5 sm:px-8 sm:pb-14 lg:min-h-[calc(100svh-112px)] lg:grid-cols-[minmax(0,1fr)_minmax(400px,550px)] lg:gap-12 lg:px-14 lg:py-10 xl:gap-24 xl:px-20">
                {/* Left content */}
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mx-auto w-full max-w-xl lg:mx-0 lg:py-8 hidden! md:block!"
                >
                    <div
                        className={`mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-violet-100 sm:text-sm ${GLASS}`}
                    >
                        <Sparkles size={15} className="text-violet-300" />
                        <span>Your creative workspace</span>
                    </div>

                    <h1 className="max-w-2xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl lg:text-[3.7rem] xl:text-[4.25rem]">
                        Build your
                        <span className="mt-1 block bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300 bg-clip-text pb-2 text-transparent">
                            digital presence.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300/80 sm:mt-6 sm:text-base sm:leading-8">
                        Your portfolio, projects, blogs and services. Everything you need to
                        manage your digital presence, beautifully organized in one place.
                    </p>

                    <div className="mt-9 grid gap-3 sm:mt-10 sm:gap-4">
                        {FEATURES.map((f, i) => (
                            <FeatureRow key={f.title} feature={f} index={i} reduced={reduced} />
                        ))}
                    </div>

                    <div className="mt-8 flex items-center gap-3 text-xs text-slate-400 sm:mt-9">
                        <ShieldCheck size={17} className="shrink-0 text-emerald-400" />
                        <span>Your workspace. Your content. Your control.</span>
                    </div>

                    <div className="mt-9">
                        <ActivityPreview reduced={reduced} />
                    </div>
                </motion.div>

                {/* Login card */}
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                    className="mx-auto w-full max-w-137.5 lg:mx-0 lg:justify-self-end"
                >
                    <LiquidCard className="p-5 sm:p-8 md:p-10">
                        <div className="mb-8 text-center sm:mb-9">
                            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-violet-400/40 to-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_-10px_rgba(139,92,246,0.7)]">
                                <Code2 size={29} strokeWidth={2} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300/80">
                                Sign in to access your dashboard
                            </p>
                        </div>

                        <motion.form
                            onSubmit={handleSubmit(onSubmit)}
                            variants={stagger}
                            initial={reduced ? false : "hidden"}
                            animate="show"
                            className="space-y-4"
                            noValidate
                        >
                            <Field
                                id="email"
                                label="Email address"
                                icon={Mail}
                                type="email"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Please enter a valid email address",
                                    },
                                })}
                            />

                            {/* No minLength here: sign-in should only check that a password was
                                entered, so older/shorter passwords still work and rules aren't leaked. */}
                            <Field
                                id="password"
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                error={errors.password?.message}
                                right={
                                    <VisibilityToggle
                                        shown={showPassword}
                                        onToggle={() => setShowPassword((p) => !p)}
                                        label="password"
                                    />
                                }
                                {...register("password", { required: "Password is required" })}
                            />

                            {/* Remember me + forgot password */}
                            <motion.div
                                variants={fieldIn}
                                className="flex items-center justify-between gap-3 pt-1"
                            >
                                <label htmlFor="remember" className="group inline-flex cursor-pointer items-center gap-2.5">
                                    <span className="relative size-5 shrink-0">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            className={`peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border border-white/25 bg-white/[0.05] transition-all duration-200 checked:border-violet-300 checked:bg-violet-500 ${FOCUS}`}
                                            {...register("remember")}
                                        />
                                        <Check
                                            size={14}
                                            strokeWidth={3}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                        />
                                    </span>
                                    <span className="text-sm text-slate-300/80 transition-colors group-hover:text-white">
                                        Remember me
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => toast("Password reset is not available yet.")}
                                    className={`rounded-md text-xs font-medium text-violet-200 transition-colors hover:text-white ${FOCUS}`}
                                >
                                    Forgot password?
                                </button>
                            </motion.div>

                            <motion.div variants={fieldIn}>
                                <SubmitButton isLoading={isLoading} loadingText="Signing in…">
                                    <span className="relative">Sign in to dashboard</span>
                                    <ArrowRight
                                        size={17}
                                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </SubmitButton>
                            </motion.div>
                        </motion.form>

                        <div className="my-7 flex items-center gap-4 sm:my-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                            <span className="text-xs text-slate-400">New to your workspace?</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
                        </div>

                        <Link
                            to="/register"
                            className={`group flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.14] bg-white/[0.04] px-4 text-sm font-medium text-slate-100 backdrop-blur-md transition-all duration-300 hover:border-violet-300/40 hover:bg-white/[0.09] hover:text-white ${FOCUS}`}
                        >
                            Create an account
                            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400">
                            <ShieldCheck size={15} className="shrink-0 text-emerald-400" />
                            <span>Secure access to your personal workspace</span>
                        </div>
                    </LiquidCard>

                    <p className="mt-5 px-3 text-center text-xs leading-6 text-slate-500">
                        By signing in, you access your portfolio management workspace.
                    </p>
                </motion.div>
            </section>

            <AuthFooter />
        </main>
    );
};

export default Login;