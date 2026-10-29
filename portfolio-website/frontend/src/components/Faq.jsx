import React, { useState } from "react";
import { FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { useGetPublicFaqsQuery } from "../redux/features/publicApi";
import EmptyServices from "../ui/EmptyServices";
import Button from "./Button";

function CardAmbientGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -inset-1/2 bg-[conic-gradient(from_0deg,transparent,rgba(139,92,246,0.12),transparent)] opacity-40" />
        </div>
    );
}

function CardAccents({ inset = "inset-x-6" }) {
    return (
        <>
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${inset} top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-colors duration-300 group-hover:border-primary/50"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-colors duration-300 group-hover:border-primary/50"
            />
        </>
    );
}

function FaqItem({ faq, index, isOpen, onToggle }) {
    const triggerId = `faq-trigger-${index}`;
    const panelId = `faq-panel-${index}`;

    return (
        <div
            className="
                group relative isolate rounded-xl
                border border-border/60
                bg-card/40 backdrop-blur
                shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
                hover:border-primary/40 hover:bg-card/70
                hover:shadow-[0_0_35px_-12px_var(--color-primary)]
            "
        >
            <CardAccents inset="inset-x-6 sm:inset-x-8" />

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                id={triggerId}
                className="
                    relative z-10 flex w-full items-start gap-5
                    p-5 text-left sm:items-center sm:gap-6 sm:p-7
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-primary
                "
            >
                <span
                    aria-hidden="true"
                    className={`w-7 shrink-0 pt-1 font-code text-[10px] ${isOpen
                        ? "text-primary"
                        : "text-muted-foreground/40 group-hover:text-primary/60"
                        }`}
                >
                    {String(index + 1).padStart(2, "0")}
                </span>

                <span
                    className={`flex-1 text-base font-medium tracking-tight sm:text-lg ${isOpen
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                        }`}
                >
                    {faq.question}
                </span>

                <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isOpen
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                        }`}
                >
                    {isOpen ? (
                        <FiMinus size={14} />
                    ) : (
                        <FiPlus size={14} />
                    )}
                </span>
            </button>

            <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
                className="relative z-10"
            >
                <div className="px-5 pb-6 pl-[68px] pr-6 sm:px-7 sm:pb-7 sm:pl-[92px] sm:pr-16">
                    <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState();

    const {
        data: faqsResponse,
        isLoading,
        isError,
    } = useGetPublicFaqsQuery();

    // Use the API response directly.
    const faqs = faqsResponse?.data ?? [];
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

            {/* Ambient background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]"
            />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Frequently Asked Questions" title={"Common questions people have about me"} highlight={"- answered here."}></SectionHeader>
                    </div>
                </div>

                {/* FAQ list */}
                <div className="mt-16 flex flex-col gap-4 lg:mt-20">
                    {isLoading && (
                        <p className="text-sm text-muted-foreground" role="status">
                            Loading FAQs...
                        </p>
                    )}

                    {isError && <EmptyServices />}

                    {!isLoading && !isError && faqs.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No FAQs available.
                        </p>
                    )}

                    {!isLoading &&
                        !isError &&
                        faqs.map((faq, index) => (
                            <FaqItem
                                key={faq._id}
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                onToggle={() => toggleFAQ(index)}
                            />
                        ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 flex flex-col gap-6 border-t border-border/60 pt-10 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Still have a question?
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Let&apos;s talk about your project directly.
                        </p>
                    </div>

                    <Button
                        to="#contact"
                        className="
                            group/cta inline-flex w-fit items-center gap-3
                            bg-primary px-6 py-3.5
                            text-sm font-semibold text-primary-foreground
                            hover:opacity-90
                            hover:shadow-[0_0_30px_-6px_var(--color-primary)]
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-primary
                        "
                    >
                        Get in touch

                        <FiArrowUpRight
                            size={16}
                            aria-hidden="true"
                            className="group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1"
                        />
                    </Button>
                </div>
            </div>

            {/* Bottom divider */}
            <div
                aria-hidden="true"
                className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36"
            />
        </section>
    );
}
