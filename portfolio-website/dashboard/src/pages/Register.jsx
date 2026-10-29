import React, { useState } from "react";
import {
    Lock,
    Mail,
    User,
    ArrowRight,
    Check,
    Code2,
    FileText,
    ChartNoAxesColumnIncreasing,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
import { useUserRegistrationMutation } from "@/redux/features/authApi";

/* ========================================================================== */
/*  Content                                                                   */
/* ========================================================================== */
const FEATURES = [
    {
        icon: FileText,
        title: "One place for everything",
        description: "Manage projects, blogs, services and content.",
        tint: "from-violet-400/30 to-violet-500/5 text-violet-200",
    },
    {
        icon: ChartNoAxesColumnIncreasing,
        title: "Built for your growth",
        description: "Keep your portfolio organized and evolving.",
        tint: "from-cyan-400/30 to-cyan-500/5 text-cyan-200",
    },
    {
        icon: ShieldCheck,
        title: "Your personal workspace",
        description: "Your content, your workflow, your control.",
        tint: "from-fuchsia-400/30 to-fuchsia-500/5 text-fuchsia-200",
    },
];

const ESSENTIALS = [
    "Personalized dashboard",
    "Organized content",
    "Simple management",
    "One workspace",
];

/* Four liquid segments that fill as the password gets stronger */
const STRENGTH = [
    { label: "", bar: "" },
    { label: "Weak", bar: "bg-rose-400", text: "text-rose-300" },
    { label: "Fair", bar: "bg-amber-400", text: "text-amber-300" },
    { label: "Good", bar: "bg-sky-400", text: "text-sky-300" },
    { label: "Strong", bar: "bg-emerald-400", text: "text-emerald-300" },
];

function scorePassword(pw = "") {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.max(1, s);
}

function StrengthMeter({ password }) {
    const score = scorePassword(password);
    const info = STRENGTH[score];

    return (
        <div className="flex items-center gap-3 pt-2.5">
            <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map((n) => (
                    <span key={n} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                        <motion.span
                            className={`absolute inset-0 origin-left rounded-full ${info.bar || "bg-transparent"}`}
                            initial={false}
                            animate={{ scaleX: score >= n ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                        />
                    </span>
                ))}
            </div>
            <span className={`w-12 text-right text-[11px] font-medium ${info.text ?? "text-slate-500"}`}>
                {info.label || "8+ chars"}
            </span>
        </div>
    );
}

/* ========================================================================== */
/*  Left-panel pieces                                                         */
/* ========================================================================== */
const BARS = [38, 62, 48, 78, 58, 92, 72];

/* A small floating "workspace" card — gives the page a product feel */
function WorkspacePreview({ reduced }) {
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
                            Workspace
                        </p>
                        <span className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                                <span className="relative size-1.5 rounded-full bg-emerald-400" />
                            </span>
                            Live
                        </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                ["12", "Projects"],
                                ["08", "Posts"],
                                ["24", "Skills"],
                            ].map(([n, l]) => (
                                <div key={l}>
                                    <p className="text-2xl font-semibold tabular-nums tracking-tight text-white">{n}</p>
                                    <p className="mt-0.5 text-[11px] text-slate-400">{l}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex h-14 items-end gap-1.5" aria-hidden="true">
                            {BARS.map((h, i) => (
                                <motion.span
                                    key={i}
                                    initial={reduced ? false : { height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 0.8, ease: EASE, delay: reduced ? 0 : 1.1 + i * 0.07 }}
                                    className="w-1.5 rounded-full bg-gradient-to-t from-violet-500/70 to-blue-300/90"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Page                                                                      */
/* ========================================================================== */

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const reduced = useReducedMotion();

    const [userRegistration, { isLoading }] = useUserRegistrationMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const passwordsMatch = Boolean(confirmPassword) && confirmPassword === password;

    const onSubmit = async (data) => {
        try {
            const response = await userRegistration({
                name: data.name.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                confirmPassword: data.confirmPassword,
            }).unwrap();

            toast.success(
                response?.data?.message || response?.message || "Registration successful"
            );
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error(
                error?.data?.message ||
                error?.data?.error ||
                error?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-[#05060d] text-slate-100 selection:bg-violet-500/30">
            <style>{PAGE_CSS}</style>


            <AuthHeader>
                <Link
                    to="/login"
                    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:text-white sm:text-sm ${GLASS} ${FOCUS}`}
                >
                    Already registered?
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
            </AuthHeader>

            {/* Main */}
            <section className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-10 px-5 pb-10 pt-5 sm:px-8 sm:pb-14 lg:min-h-[calc(100svh-112px)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:gap-12 lg:px-14 lg:py-8 xl:gap-24 xl:px-20">
                {/* Left panel */}
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mx-auto w-full max-w-xl lg:mx-0 lg:py-8"
                >
                    <div
                        className={`mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-violet-100 sm:text-sm ${GLASS}`}
                    >
                        <Sparkles size={15} className="text-violet-300" />
                        Your next chapter starts here
                    </div>

                    <h1 className="max-w-2xl text-[2.65rem] font-semibold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl lg:text-[3.7rem] xl:text-[4.25rem]">
                        Create your
                        <span className="mt-1 block bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300 bg-clip-text pb-2 text-transparent">
                            digital workspace.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300/80 sm:mt-6 sm:text-base sm:leading-8">
                        Everything you need to build, organize and manage your professional
                        portfolio. Bring your work together in one beautifully designed space.
                    </p>

                    <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4">
                        {FEATURES.map((f, i) => (
                            <FeatureRow key={f.title} feature={f} index={i} reduced={reduced} />
                        ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                        {ESSENTIALS.map((item) => (
                            <span
                                key={item}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md"
                            >
                                <CheckCircle2 size={13} className="text-emerald-400" />
                                {item}
                            </span>
                        ))}
                    </div>

                    <div className="mt-9">
                        <WorkspacePreview reduced={reduced} />
                    </div>
                </motion.div>

                {/* Registration card */}
                <motion.div
                    initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                    className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end"
                >
                    <LiquidCard className="p-5 sm:p-8 md:p-9">
                        {/* Heading */}
                        <div className="mb-7 text-center sm:mb-8">
                            <div className="relative mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-violet-400/40 to-blue-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_30px_-10px_rgba(139,92,246,0.7)]">
                                <Code2 size={28} strokeWidth={2} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300/80">
                                Get started with your portfolio CMS
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
                                id="name"
                                label="Full name"
                                icon={User}
                                type="text"
                                autoComplete="name"
                                error={errors.name?.message}
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
                                })}
                            />

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

                            <Field
                                id="password"
                                label="Password"
                                icon={Lock}
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                error={errors.password?.message}
                                hint={<StrengthMeter password={password} />}
                                right={
                                    <VisibilityToggle
                                        shown={showPassword}
                                        onToggle={() => setShowPassword((p) => !p)}
                                        label="password"
                                    />
                                }
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                                })}
                            />

                            <Field
                                id="confirmPassword"
                                label="Confirm password"
                                icon={Lock}
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                error={errors.confirmPassword?.message}
                                right={
                                    <>
                                        {passwordsMatch && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute right-12 top-1/2 z-10 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300"
                                                aria-label="Passwords match"
                                            >
                                                <Check size={12} strokeWidth={3} />
                                            </motion.span>
                                        )}
                                        <VisibilityToggle
                                            shown={showConfirmPassword}
                                            onToggle={() => setShowConfirmPassword((p) => !p)}
                                            label="confirm password"
                                        />
                                    </>
                                }
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (v) => v === password || "Passwords do not match",
                                })}
                            />

                            {/* Terms — now actually enforced by react-hook-form */}
                            <motion.div variants={fieldIn} className="pt-1">
                                <label htmlFor="terms" className="flex cursor-pointer items-start gap-3">
                                    <span className="relative mt-0.5 size-5 shrink-0">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            aria-invalid={Boolean(errors.terms)}
                                            className={`peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border bg-white/[0.05] transition-all duration-200 checked:border-violet-300 checked:bg-violet-500 ${FOCUS} ${errors.terms ? "border-rose-400/70" : "border-white/25"
                                                }`}
                                            {...register("terms", {
                                                required: "Please accept the terms to continue",
                                            })}
                                        />
                                        <Check
                                            size={14}
                                            strokeWidth={3}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100"
                                        />
                                    </span>
                                    <span className="text-xs leading-5 text-slate-300/80">
                                        I agree to the{" "}
                                        <Link
                                            to="/terms"
                                            className="font-medium text-violet-200 underline-offset-4 hover:text-white hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            to="/privacy"
                                            className="font-medium text-violet-200 underline-offset-4 hover:text-white hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                        .
                                    </span>
                                </label>
                                {errors.terms && (
                                    <p role="alert" className="pl-8 pt-1.5 text-xs text-rose-300">
                                        {errors.terms.message}
                                    </p>
                                )}
                            </motion.div>

                            {/* Submit */}
                            <motion.div variants={fieldIn}>
                                <SubmitButton isLoading={isLoading} loadingText="Creating account…">
                                    <span className="relative">Create your account</span>
                                    <ArrowRight
                                        size={17}
                                        className="relative transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </SubmitButton>
                            </motion.div>
                        </motion.form>

                        {/* Sign in */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
                            <span className="text-xs text-slate-400">Already have an account?</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
                        </div>

                        <Link
                            to="/login"
                            className={`group flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.14] bg-white/[0.04] px-4 text-sm font-medium text-slate-100 backdrop-blur-md transition-all duration-300 hover:border-violet-300/40 hover:bg-white/[0.09] hover:text-white ${FOCUS}`}
                        >
                            Sign in instead
                            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>

                        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400">
                            <ShieldCheck size={15} className="shrink-0 text-emerald-400" />
                            <span>Your information stays protected</span>
                        </div>
                    </LiquidCard>

                    <p className="mt-5 px-3 text-center text-xs leading-6 text-slate-500">
                        Create your workspace and bring your work together.
                    </p>
                </motion.div>
            </section>

            <AuthFooter />
        </main>
    );
};

export default Register;