import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const FAQS = [
    {
        question: "Who is Shohag Miah?",
        answer:
            "Shohag Miah is a software engineer from Tangail, Bangladesh, and the founder of Contextser. He was born on 15 March 2004 in Hatia, a village in Kalihati, Tangail, and still lives there. He holds no computer science degree. As a teenager he worked as a mason's helper and saved 4,600 taka, which bought his first computer, and he taught himself to code from YouTube and Google because there was no tuition, no mentor, and nobody nearby who wrote software. He built his first website about six months later. His first ten freelance bids were rejected; the eleventh became his first paid job, for 500 taka. He now builds web applications, mobile apps, desktop software and AI features for clients in Bangladesh and abroad, and publishes free roadmaps and learning resources in Bengali for developers starting where he did.",
    },
    {
        question: "What services does Shohag Miah offer?",
        answer:
            "Shohag Miah builds modern web applications, mobile applications, desktop software, APIs, dashboards, and AI-powered features. Projects can range from custom websites and business applications to complete full-stack products.",
    },
    {
        question: "How can I contact you?",
        answer:
            "You can contact Khairul through the contact form on this website or through his professional social profiles. For project inquiries, include a short description of your idea, your goals, and any relevant timeline or requirements.",
    },
    {
        question: "What is your project pricing?",
        answer:
            "Project pricing depends on the scope, complexity, features, technology requirements, and timeline. After understanding the project requirements, a clear estimate can be provided before development begins.",
    },
    {
        question: "Do you work remotely?",
        answer:
            "Yes. Khairul works remotely with clients in Bangladesh and internationally. Communication, project updates, collaboration, and delivery can all be handled online.",
    },
    {
        question: "What is your project timeline?",
        answer:
            "The timeline depends on the size and complexity of the project. Smaller websites can usually be completed faster, while larger applications require more time for planning, development, testing, and deployment.",
    },
    {
        question: "Do you provide mentorship?",
        answer:
            "Yes. Khairul shares free Bengali roadmaps and learning resources for developers and beginners. Mentorship availability can depend on the type of guidance and current schedule.",
    },
    {
        question: "What are your payment methods?",
        answer:
            "Payment methods can be discussed based on the client's location and project requirements. The payment schedule and milestones are agreed upon before development begins.",
    },
    {
        question: "Do you provide post-delivery support?",
        answer:
            "Yes. Post-delivery support can include bug fixes, minor adjustments, deployment assistance, maintenance, and ongoing improvements depending on the project and support arrangement.",
    },
];

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
/*  Ambient glow + corner accents (shared visual language)            */
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
/*  FAQ item                                                          */
/* ------------------------------------------------------------------ */
function FaqItem({ faq, index, isOpen, onToggle }) {
    return (
        <Reveal
            as="div"
            delay={index * 40}
            className="group relative clip-polygon border border-border/60 bg-card/40 backdrop-blur transition-all duration-500 ease-out shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)] hover:border-primary/40 hover:bg-card/70 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        >
            <CardAmbientGlow />
            <CardAccents inset="inset-x-6 sm:inset-x-8" />

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="relative z-10 flex w-full items-start gap-5 p-5 text-left sm:items-center sm:gap-6 sm:p-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                {/* Number */}
                <span
                    className={`w-7 shrink-0 pt-1 font-code text-[10px] transition-colors duration-300 ${isOpen
                            ? "text-primary"
                            : "text-muted-foreground/40 group-hover:text-primary/60"
                        }`}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span
                    className={`flex-1 text-base font-medium tracking-tight transition-colors duration-300 sm:text-lg ${isOpen
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                >
                    {faq.question}
                </span>

                {/* Toggle icon */}
                <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center clip-polygon border transition-all duration-500 ${isOpen
                            ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_20px_-4px_theme(colors.primary/60)]"
                            : "border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                        }`}
                >
                    {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                </span>
            </button>

            {/* Answer */}
            <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 pb-6 pl-[68px] pr-6 sm:px-7 sm:pb-7 sm:pl-[92px] sm:pr-16">
                        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex((current) => (current === index ? -1 : index));
    };

    return (
        <section
            id="faq"
            className="relative overflow-hidden bg-background py-28 sm:py-36"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Frequently Asked Questions" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Questions,{" "}
                            <span className="text-gradient">answered.</span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        Everything you need to know about working together — from
                        services and pricing to timelines and support.
                    </p>
                </Reveal>

                {/* FAQ LIST */}
                <div className="mt-16 flex flex-col gap-4 lg:mt-20">
                    {FAQS.map((faq, index) => (
                        <FaqItem
                            key={faq.question}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                {/* BOTTOM CTA */}
                <Reveal
                    delay={200}
                    className="mt-16 flex flex-col gap-6 border-t border-border/60 pt-10 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Still have a question?
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Let&apos;s talk about your project directly.
                        </p>
                    </div>

                    <a
                        href="#contact"
                        className="group/cta inline-flex w-fit items-center gap-3 bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_30px_-6px_theme(colors.primary/60)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Get in touch
                        <FiArrowUpRight
                            size={16}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                        />
                    </a>
                </Reveal>
            </div>

            {/* Bottom divider */}
            <div className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36" />
        </section>
    );
}