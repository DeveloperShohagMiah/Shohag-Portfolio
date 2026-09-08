import React, { useState } from "react";
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

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData);

        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
        }, 3000);
    };

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* =========================
                    HEADER
                ========================== */}

                <div className="mb-16 max-w-3xl">
                    <SectionHeader label={"Contact"} />

                    <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                        Let&apos;s work
                        <br />
                        <span className="text-gradient">together.</span>
                    </h2>

                    <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                        Have a project in mind? Send me a message and let&apos;s
                        discuss how we can turn your idea into something great.
                    </p>
                </div>

                {/* =========================
                    MAIN CONTACT CARD
                ========================== */}

                <div className="relative grid overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl lg:grid-cols-[0.7fr_1.3fr]">

                    <div aria-hidden="true" class="pointer-events-none absolute inset-x-7 top-0 h-[1.5px] bg-linear-to-r from-transparent via-foreground/20 to-transparent opacity-100 transition-opacity duration-300"></div>

                    <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[680px] -translate-x-1/2 [background:radial-gradient(ellipse_50%_50%_at_50%_50%,oklch(0.7_0_0/0.16),transparent_70%)] blur-2xl"></div>
                    {/* =========================
                        CONTACT INFO
                    ========================== */}

                    <div className="relative flex flex-col justify-between border-b border-border/60 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">

                        {/* Decorative number */}
                        <span className="pointer-events-none absolute right-8 top-6 font-code text-8xl font-bold text-foreground/[0.025]">
                            <FiMail />
                        </span>

                        <div className="relative">
                            <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                                Get in touch
                            </span>

                            <h3 className="mt-5 max-w-sm text-3xl font-semibold tracking-tight text-foreground">
                                Tell me what you&apos;re building.
                            </h3>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                                Whether it&apos;s a new website, web application,
                                SaaS product, or something completely different,
                                I&apos;d love to hear about it.
                            </p>
                        </div>

                        {/* Contact details */}
                        <div className="relative mt-14 space-y-7">

                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FiMail size={14} />

                                    <span className="font-code text-[10px] uppercase tracking-[0.15em]">
                                        Email
                                    </span>
                                </div>

                                <a
                                    href="mailto:hello@example.com"
                                    className="group mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                                >
                                    hello@example.com

                                    <FiArrowUpRight
                                        size={14}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FiMapPin size={14} />

                                    <span className="font-code text-[10px] uppercase tracking-[0.15em]">
                                        Location
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-foreground">
                                    Remote · Worldwide
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                                    <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
                                </span>

                                <span className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                    Available for work
                                </span>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="relative mt-12">
                            <p className="mb-4 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                Social
                            </p>

                            <div className="flex gap-2">
                                <a
                                    href="https://github.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                >
                                    <FiGithub size={16} />
                                </a>

                                <a
                                    href="https://linkedin.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                >
                                    <FiLinkedin size={16} />
                                </a>

                                <a
                                    href="mailto:hello@example.com"
                                    aria-label="Email"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                                >
                                    <FiMail size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* =========================
                        FORM
                    ========================== */}

                    <div className="p-8 sm:p-10 lg:p-12">

                        {submitted ? (
                            <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                                    <FiCheck size={30} />
                                </div>

                                <h3 className="mt-7 text-3xl font-semibold text-foreground">
                                    Message sent!
                                </h3>

                                <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                                    Thanks for reaching out. I&apos;ll get back
                                    to you as soon as possible.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>

                                {/* Name + Email */}
                                <div className="grid gap-5 md:grid-cols-2">

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                                        >
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
                                            className="h-14 w-full rounded-xl border border-border/70 bg-background/40 px-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                                        >
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
                                            className="h-14 w-full rounded-xl border border-border/70 bg-background/40 px-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                                    >
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
                                        className="h-14 w-full rounded-xl border border-border/70 bg-background/40 px-4 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>

                                {/* Message */}
                                <div className="mt-5">
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block font-code text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                                    >
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
                                        className="w-full resize-none rounded-xl border border-border/70 bg-background/40 px-4 py-4 text-sm leading-7 text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-border focus:border-primary focus:bg-background/70 focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>

                                {/* Submit area */}
                                <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                    <p className="max-w-sm text-xs leading-5 text-muted-foreground">
                                        Your information is only used to respond
                                        to your message.
                                    </p>

                                    <button
                                        type="submit"
                                        className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
                                    >
                                        Send message

                                        <FiSend
                                            size={16}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-col justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center">
                    <p className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40">
                        © {new Date().getFullYear()} Shohag. All rights reserved.
                    </p>

                    <a
                        href="#home"
                        className="group inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
                    >
                        Back to top

                        <FiArrowUpRight
                            size={13}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
