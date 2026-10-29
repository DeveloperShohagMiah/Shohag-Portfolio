import { useCallback, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";
import {
    FiArrowUpRight,
    FiAlertCircle,
    FiCheck,
    FiGithub,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiMessageSquare,
    FiSend,
    FiUser,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { useSendMessageMutation } from "../redux/features/publicApi";

const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const DEFAULT_CONTENT = {
    id: "contact",
    sectionLabel: "Contact me",
    title: "Let's work",
    highlight: "together.",
    description:
        "Have a project in mind? Tell me what you're building and let's turn your idea into something meaningful.",
    panelTitle: "Good things start with a conversation.",
    panelText:
        "From a new website to a complete web application, I'm always interested in discussing thoughtful ideas and useful products.",
    availability: "Available for select projects",
    brand: "Shohag",
    submitLabel: "Send message",
    successTitle: "Message received.",
    successText:
        "Thanks for reaching out. Your message has been submitted successfully. I'll get back to you as soon as I can.",
    privacyNote: "Your details are only used to respond to your message.",
    backToTopHref: "#home",
};

const DEFAULT_DETAILS = [
    {
        icon: FiMail,
        label: "Email",
        value: "shohagmiah7474@gmail.com",
        href: "mailto:shohagmiah7474@gmail.com",
    },
    { icon: FiMapPin, label: "Location", value: "Nicosia, Cyprus" },
];

const DEFAULT_SOCIALS = [
    { icon: FiGithub, label: "GitHub", href: "https://github.com/" },
    { icon: FiLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
    { icon: FiMail, label: "Email", href: "mailto:shohagmiah7474@gmail.com" },
];

const DEFAULT_FIELDS = [
    {
        name: "name",
        label: "Full name",
        type: "text",
        icon: FiUser,
        placeholder: "Your name",
        autoComplete: "name",
        half: true,
        required: true,
    },
    {
        name: "email",
        label: "Email address",
        type: "email",
        icon: FiMail,
        placeholder: "you@example.com",
        autoComplete: "email",
        half: true,
        required: true,
    },
    {
        name: "subject",
        label: "Subject",
        type: "text",
        icon: FiMessageSquare,
        placeholder: "What would you like to discuss?",
        required: true,
        half: false,
    },
    {
        name: "message",
        label: "Your message",
        type: "textarea",
        rows: 5,
        placeholder: "Share a little context about your idea, project, or question…",
        required: true,
        minLength: 10,
        half: false,
    },
];

function Reveal({ children, delay = 0, className = "" }) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
                duration: reducedMotion ? 0 : 0.65,
                delay: reducedMotion ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function ContactInfo({ content, details, socials }) {
    return (
        <aside className="relative flex flex-col justify-between gap-10 overflow-hidden border-b border-border/70 bg-muted/20 p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
            />

            <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Let's connect
                </div>

                <h3 className="mt-6 max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {content.panelTitle}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                    {content.panelText}
                </p>
            </div>

            <div className="relative space-y-5">
                {details.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background text-primary shadow-sm">
                            <Icon size={17} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                {label}
                            </p>
                            {href ? (
                                <a
                                    href={href}
                                    className={`mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-sm font-medium text-foreground transition-colors hover:text-primary ${FOCUS}`}
                                >
                                    <span className="truncate">{value}</span>
                                    <FiArrowUpRight size={14} aria-hidden="true" />
                                </a>
                            ) : (
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {value}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative space-y-4">
                {content.availability && (
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50 motion-safe:animate-ping motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        {content.availability}
                    </div>
                )}

                {socials.length > 0 && (
                    <div className="flex items-center gap-2">
                        {socials.map(({ icon: Icon, href, label }) => {
                            const external = /^https?:\/\//i.test(href);
                            return (
                                <a
                                    key={label}
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    aria-label={label}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/70 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary ${FOCUS}`}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </aside>
    );
}

function FormField({ field, register, error, disabled, id }) {
    const Icon = field.icon;
    const isTextarea = field.type === "textarea";
    const errorId = `${id}-error`;
    const inputClass = `block w-full rounded-xl border bg-background px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/55 hover:border-border focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60 ${error ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/10" : "border-border/80"
        }`;

    const rules = {
        required: field.required ? `${field.label} is required.` : false,
        ...(field.type === "email"
            ? {
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "Enter a valid email address.",
                },
            }
            : {}),
        ...(field.minLength
            ? {
                minLength: {
                    value: field.minLength,
                    message: `Please write at least ${field.minLength} characters.`,
                },
            }
            : {}),
        validate: (value) =>
            !value || value.trim().length > 0 || `${field.label} cannot be blank.`,
    };

    return (
        <div className={field.half ? "" : "sm:col-span-2"}>
            <label
                htmlFor={id}
                className="mb-2.5 block text-sm font-medium text-foreground"
            >
                {field.label}
                {field.required && <span className="ml-1 text-primary">*</span>}
            </label>

            <div className="relative">
                {Icon && !isTextarea && (
                    <Icon
                        size={16}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70"
                    />
                )}

                {isTextarea ? (
                    <textarea
                        id={id}
                        rows={field.rows || 5}
                        placeholder={field.placeholder}
                        disabled={disabled}
                        autoComplete={field.autoComplete}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : undefined}
                        className={`${inputClass} min-h-36 resize-y px-4 py-3.5 leading-6`}
                        {...register(field.name, rules)}
                    />
                ) : (
                    <input
                        id={id}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        disabled={disabled}
                        autoComplete={field.autoComplete}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : undefined}
                        className={`${inputClass} h-12 ${Icon ? "pl-10" : ""}`}
                        {...register(field.name, rules)}
                    />
                )}
            </div>

            <div className="min-h-5 pt-1">
                {error && (
                    <p
                        id={errorId}
                        role="alert"
                        className="flex items-center gap-1.5 text-xs text-rose-500"
                    >
                        <FiAlertCircle size={12} aria-hidden="true" />
                        {error.message}
                    </p>
                )}
            </div>
        </div>
    );
}

function ContactForm({ content, fields, onSubmit }) {
    const [status, setStatus] = useState("idle");
    const [serverError, setServerError] = useState("");
    const formId = useId();

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: Object.fromEntries(fields.map((field) => [field.name, ""])),
    });

    const submit = async (values) => {
        if (isSubmitting) return;
        setServerError("");

        // Honeypot: bots may fill this hidden field. Do not send the payload.
        if (values.website) {
            setStatus("success");
            return;
        }

        const payload = Object.fromEntries(
            fields.map((field) => {
                const value = String(values[field.name] ?? "").trim();
                return [field.name, field.type === "email" ? value.toLowerCase() : value];
            }),
        );

        try {
            await onSubmit(payload);
            reset();
            setStatus("success");
        } catch (error) {
            console.error("Contact form submission failed:", error);
            setServerError(
                error?.data?.message ||
                error?.message ||
                "Your message could not be sent. Please try again.",
            );
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex min-h-[420px] flex-col items-center justify-center px-4 py-12 text-center"
                role="status"
                aria-live="polite"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <FiCheck size={28} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
                    {content.successTitle}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                    {content.successText}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setStatus("idle");
                        setServerError("");
                        reset();
                        setFocus(fields[0]?.name);
                    }}
                    className={`mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary ${FOCUS}`}
                >
                    Send another message
                </button>
            </motion.div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(submit)}
            noValidate
            className="w-full"
            aria-busy={isSubmitting}
        >
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Contact form
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Send me a message
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Fill in the details below and I’ll be in touch.
                </p>
            </div>

            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {fields.map((field, index) => (
                    <FormField
                        key={field.name}
                        field={field}
                        register={register}
                        error={errors[field.name]}
                        disabled={isSubmitting}
                        id={`${formId}-${field.name || index}`}
                    />
                ))}
            </div>

            {/* Honeypot field for basic bot filtering. Keep it out of the visual layout. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
            >
                <label htmlFor={`${formId}-website`}>Leave this field empty</label>
                <input
                    id={`${formId}-website`}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                />
            </div>

            {serverError && (
                <p
                    className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3.5 py-3 text-sm text-rose-500"
                    role="alert"
                >
                    <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                    <span>{serverError}</span>
                </p>
            )}

            <div className="mt-5 flex flex-col gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-5 text-muted-foreground">
                    {content.privacyNote}
                </p>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2.5 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto ${FOCUS}`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current motion-reduce:animate-none" />
                            Sending…
                        </>
                    ) : (
                        <>
                            {content.submitLabel}
                            <FiSend
                                size={15}
                                aria-hidden="true"
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

export function ContactSection({
    onSubmit,
    content: contentOverride,
    details = DEFAULT_DETAILS,
    socials = DEFAULT_SOCIALS,
    fields = DEFAULT_FIELDS,
    background = true,
    className = "",
}) {
    const content = { ...DEFAULT_CONTENT, ...contentOverride };

    return (
        <section
            id={content.id}
            className={`relative isolate overflow-hidden bg-background py-24 sm:py-32 ${className}`}
        >
            {background && (
                <>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                    >
                        <div className="absolute -left-40 top-16 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
                        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
                    </div>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px]"
                    />
                </>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="max-w-3xl">
                        <SectionHeader
                            label={content.sectionLabel}
                            title={content.title}
                            highlight={content.highlight}
                        />
                        {content.description && (
                            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                                {content.description}
                            </p>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={0.08} className="mt-10 sm:mt-14">
                    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-[0_24px_80px_-36px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                        />
                        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                            <ContactInfo
                                content={content}
                                details={details}
                                socials={socials}
                            />
                            <div className="min-w-0 p-6 sm:p-9 lg:p-10 xl:p-12">
                                <ContactForm
                                    content={content}
                                    fields={fields}
                                    onSubmit={onSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.12}>
                    <div className="mt-8 flex flex-col justify-between gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
                        <p>
                            © {new Date().getFullYear()} {content.brand}. Built with care by{" "}
                            <span className="font-medium text-foreground">Shohag Miah</span>.
                        </p>
                        <a
                            href={content.backToTopHref}
                            className={`inline-flex w-fit items-center gap-1.5 transition-colors hover:text-primary ${FOCUS}`}
                        >
                            Back to top <FiArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    </div>
                </Reveal>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </section>
    );
}

export default function Contact(props) {
    const [sendMessage] = useSendMessageMutation();
    const handleSubmit = useCallback(
        (data) => sendMessage(data).unwrap(),
        [sendMessage],
    );

    return <ContactSection onSubmit={handleSubmit} {...props} />;
}
