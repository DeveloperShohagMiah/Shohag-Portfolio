import React, { useEffect, useRef, useState } from "react";
import {
    FiArrowUpRight,
    FiCheck,
    FiGithub,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiSend,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll hook                                             */
/* ------------------------------------------------------------------ */
function useReveal(options = {}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReduced) {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px", ...options }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [options]);

    return [ref, visible];
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
    const [ref, visible] = useReveal();

    return (
        <Tag
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${className}`}
        >
            {children}
        </Tag>
    );
}

/* ------------------------------------------------------------------ */
/*  Ambient glow + accents                                            */
/* ------------------------------------------------------------------ */
function CardAmbientGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/25),transparent_70%)] blur-2xl animate-[pulseGlow_4s_ease-in-out_infinite]" />
            <div className="absolute -inset-1/2 animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/20)_60deg,transparent_120deg,theme(colors.primary/10)_240deg,transparent_360deg)] opacity-40" />
        </div>
    );
}

function CardAccents({ inset = "inset-x-6" }) {
    return (
        <>
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Contact details sidebar                                           */
/* ------------------------------------------------------------------ */
function ContactInfo() {
    const details = [
        {
            icon: FiMail,
            label: "Email",
            value: "hello@example.com",
            href: "mailto:hello@example.com",
        },
        {
            icon: FiMapPin,
            label: "Location",
            value: "Remote · Worldwide",
        },
    ];

    return (
        <div className="relative flex flex-col justify-between border-b border-border/60 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            {/* Oversized watermark icon */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-6 font-code text-8xl font-bold text-foreground/[0.03]"
            >
                <FiMail />
            </span>

            <div className="relative z-10">
                <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                    Get in touch
                </span>

                <h3 className="mt-5 max-w-sm font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Tell me what you&apos;re building.
                </h3>

                <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                    Whether it&apos;s a new website, web application, SaaS product, or
                    something completely different, I&apos;d love to hear about it.
                </p>
            </div>

            {/* Contact details */}
            <div className="relative z-10 mt-12 space-y-6">
                {details.map(({ icon: Icon, label, value, href }) => (
                    <div key={label}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon size={14} aria-hidden="true" />
                            <span className="font-code text-[10px] uppercase tracking-[0.15em]">
                                {label}
                            </span>
                        </div>

                        {href ? (
                            <a
                                href={href}
                                className="group/link mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                                {value}
                                <FiArrowUpRight
                                    size={14}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                />
                            </a>
                        ) : (
                            <p className="mt-2 text-sm text-foreground">{value}</p>
                        )}
                    </div>
                ))}

                {/* Availability */}
                <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-50" />
                        <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
                    </span>

                    <span className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        Available for work
                    </span>
                </div>
            </div>

            {/* Social links */}
            <div className="relative z-10 mt-12">
                <p className="mb-4 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Social
                </p>

                <div className="flex gap-2">
                    {[
                        { icon: FiGithub, href: "https://github.com/", label: "GitHub" },
                        { icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
                        { icon: FiMail, href: "mailto:hello@example.com", label: "Email" },
                    ].map(({ icon: Icon, href, label }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={href.startsWith("http") ? "noreferrer" : undefined}
                            aria-label={label}
                            className="flex h-10 w-10 items-center justify-center clip-polygon border border-border/70 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <Icon size={16} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                      */
/* ------------------------------------------------------------------ */
function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    const inputClasses =
        "h-14 w-full border border-border/70 bg-background/40 px-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10";

    const labelClasses =
        "mb-2 block font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground";

    if (submitted) {
        return (
            <div className="relative flex min-h-[520px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center clip-polygon border border-primary/30 bg-primary/10 text-primary shadow-[0_0_40px_-8px_theme(colors.primary/60)]">
                    <FiCheck size={30} aria-hidden="true" />
                </div>

                <h3 className="mt-7 font-display text-3xl font-semibold text-foreground">
                    Message sent!
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                    Thanks for reaching out. I&apos;ll get back to you as soon as
                    possible.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative z-10">
            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="name" className={labelClasses}>
                        Your name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label htmlFor="email" className={labelClasses}>
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="mt-5">
                <label htmlFor="subject" className={labelClasses}>
                    Subject
                </label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can I help you with?"
                    className={inputClasses}
                />
            </div>

            <div className="mt-5">
                <label htmlFor="message" className={labelClasses}>
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    className="w-full resize-none border border-border/70 bg-background/40 px-4 py-4 text-sm leading-7 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                />
            </div>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                    Your information is only used to respond to your message.
                </p>

                <button
                    type="submit"
                    className="group/send inline-flex h-14 items-center justify-center gap-3 bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_30px_-6px_theme(colors.primary/60)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    Send message
                    <FiSend
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/send:translate-x-1"
                    />
                </button>
            </div>
        </form>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function Contact() {
    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Purple ambient backdrop (kept from your original) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 blur-[125px] md:blur-[180px]"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 70% at 50% 110%, rgba(172, 40, 238, 0.35) 0%, rgba(120, 20, 180, 0.2) 40%, rgba(0, 0, 0, 0) 75%)",
                    mixBlendMode: "screen",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 blur-[50px] md:blur-[72px]"
                style={{
                    background:
                        "linear-gradient(to top, rgba(172, 40, 238, 0.15) 0%, rgba(0, 0, 0, 0) 35%)",
                    mixBlendMode: "screen",
                }}
            />

            {/* Site-wide primary ambient glows */}
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Contact" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Let&apos;s work{" "}
                            <span className="text-gradient">together.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        Have a project in mind? Send me a message and let&apos;s discuss how
                        we can turn your idea into something great.
                    </p>
                </Reveal>

                {/* MAIN CONTACT CARD */}
                <Reveal
                    delay={100}
                    className="group relative mt-16 grid clip-polygon overflow-hidden border border-border/60 bg-card/40 backdrop-blur-xl transition-all duration-500 ease-out lg:mt-20 lg:grid-cols-[0.7fr_1.3fr] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)] hover:border-primary/40 hover:bg-card/70 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                    <CardAmbientGlow />
                    <CardAccents inset="inset-x-6 sm:inset-x-10 lg:inset-x-12" />

                    <ContactInfo />
                    <div className="relative p-8 sm:p-10 lg:p-12">
                        <ContactForm />
                    </div>
                </Reveal>

                {/* FOOTER */}
                <Reveal
                    delay={200}
                    className="mt-10 flex flex-col justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center"
                >
                    <p className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                        © {new Date().getFullYear()} Shohag. All rights reserved.
                    </p>

                    <a
                        href="#home"
                        className="group/top inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Back to top
                        <FiArrowUpRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/top:-translate-y-0.5 group-hover/top:translate-x-0.5"
                        />
                    </a>
                </Reveal>
            </div>
        </section>
    );
}