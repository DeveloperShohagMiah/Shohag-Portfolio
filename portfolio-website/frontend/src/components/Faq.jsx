import { useId, useRef, useState } from "react";
import { FiArrowUpRight, FiHelpCircle, FiPlus, FiRefreshCw } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import { useGetPublicFaqsQuery } from "../redux/features/publicApi";

const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* ========================================================================== */
/*  One accordion item                                                        */
/*  - 1px gradient border that turns primary while open                       */
/*  - smooth height animation (grid-rows trick), no `hidden` pop              */
/*  - closed answers are `invisible`, so they leave the accessibility tree    */
/* ========================================================================== */
function FaqItem({ faq, index, isOpen, onToggle, baseId }) {
    const triggerId = `${baseId}-trigger-${index}`;
    const panelId = `${baseId}-panel-${index}`;

    return (
        <div
            className={`group/faq relative rounded-3xl p-px transition-all duration-500 ${isOpen
                ? "bg-linear-to-b from-primary/60 via-primary/20 to-primary/5 shadow-[var(--elev-md)]"
                : "bg-linear-to-b from-border via-border/50 to-border/20 shadow-[var(--elev-sm)] hover:from-primary/40 hover:via-primary/10 hover:to-border/20"
                }`}
        >
            <div
                className={`relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card transition-colors duration-500 ${isOpen ? "bg-linear-to-br from-primary/[0.07] to-transparent" : ""
                    }`}
            >
                {/* top highlight while open */}
                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                <h3 className="m-0">
                    <button
                        type="button"
                        id={triggerId}
                        onClick={onToggle}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        data-faq-trigger
                        className={`flex w-full cursor-pointer items-start gap-4 rounded-[inherit] p-5 text-left sm:items-center sm:gap-5 sm:p-6 ${FOCUS}`}
                    >
                        <span
                            aria-hidden="true"
                            className={`w-7 shrink-0 pt-1 font-code text-xs tabular-nums transition-colors duration-300 sm:w-8 sm:pt-0 ${isOpen
                                ? "text-primary"
                                : "text-muted-foreground/50 group-hover/faq:text-primary/70"
                                }`}
                        >
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                            className={`flex-1 text-base font-medium tracking-tight transition-colors duration-300 sm:text-lg ${isOpen
                                ? "text-foreground"
                                : "text-foreground/75 group-hover/faq:text-foreground"
                                }`}
                        >
                            {faq.question}
                        </span>

                        <span
                            aria-hidden="true"
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${isOpen
                                ? "rotate-45 border-primary/50 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "border-border text-muted-foreground group-hover/faq:border-primary/40 group-hover/faq:text-primary"
                                }`}
                        >
                            <FiPlus size={15} />
                        </span>
                    </button>
                </h3>

                <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-[grid-template-rows,opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="min-h-0 overflow-hidden">
                        <div className="pb-6 pl-[4rem] pr-6 sm:pb-7 sm:pl-[4.75rem] sm:pr-16">
                            <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-[15px] sm:leading-8">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================== */
/*  States                                                                    */
/* ========================================================================== */
function FaqSkeleton() {
    return (
        <div role="status" aria-busy="true" className="flex flex-col gap-4">
            <span className="sr-only">Loading FAQs…</span>
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="h-[76px] animate-pulse rounded-3xl border border-border/50 bg-card/40"
                />
            ))}
        </div>
    );
}

function FaqMessage({ icon: Icon, title, text, onRetry, tone = "neutral" }) {
    const isError = tone === "error";
    return (
        <div
            role={isError ? "alert" : undefined}
            className={`rounded-3xl border border-dashed p-10 text-center sm:p-14 ${isError
                ? "border-destructive/30 bg-destructive/5"
                : "border-border/60 bg-card/30"
                }`}
        >
            <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${isError
                    ? "border-destructive/30 bg-destructive/5 text-destructive"
                    : "border-primary/30 bg-primary/5 text-primary"
                    }`}
            >
                <Icon size={22} aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={() => onRetry()}
                    className={`mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`}
                >
                    <FiRefreshCw size={14} aria-hidden="true" />
                    Try again
                </button>
            )}
        </div>
    );
}

/* ========================================================================== */
/*  Section                                                                   */
/* ========================================================================== */
export default function FAQ() {
    const baseId = useId().replace(/:/g, "");
    const listRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(0); // first question open by default

    const { data: faqsResponse, isLoading, isError, refetch } = useGetPublicFaqsQuery();

    // Accept { data: [...] } or a bare array
    const faqs = Array.isArray(faqsResponse?.data)
        ? faqsResponse.data
        : Array.isArray(faqsResponse)
            ? faqsResponse
            : [];

    const toggleFAQ = (index) => setOpenIndex((current) => (current === index ? -1 : index));

    // Arrow keys / Home / End move focus between the question buttons
    const onListKeyDown = (e) => {
        if (!e.target.matches?.("[data-faq-trigger]")) return;
        const triggers = [...listRef.current.querySelectorAll("[data-faq-trigger]")];
        const i = triggers.indexOf(e.target);
        let next = null;
        if (e.key === "ArrowDown") next = (i + 1) % triggers.length;
        else if (e.key === "ArrowUp") next = (i - 1 + triggers.length) % triggers.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = triggers.length - 1;
        if (next === null) return;
        e.preventDefault();
        triggers[next].focus();
    };

    return (
        <section id="faq" className="relative overflow-hidden bg-background py-28 sm:py-36">
            {/* Top / bottom dividers (the old bottom one sat outside the section and was clipped) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
            />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left: heading + contact card (sticky on desktop) */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-28">
                            <SectionHeader
                                label="Frequently asked questions"
                                title="Common questions people have about me,"
                                highlight="answered here."
                            />

                            <div className="mt-10 rounded-3xl bg-linear-to-b from-primary/40 via-border to-border/20 p-px shadow-[var(--elev-md)]">
                                <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card p-6 sm:p-8">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent"
                                    />
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-linear-to-br from-primary/20 to-primary/5 text-primary">
                                        <FiHelpCircle size={20} aria-hidden="true" />
                                    </span>
                                    <p className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                                        Still have a question?
                                    </p>
                                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                        Let&apos;s talk about your project directly.
                                    </p>
                                    <Button to="#contact" className="mt-6">
                                        Get in touch
                                        <FiArrowUpRight
                                            size={16}
                                            aria-hidden="true"
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: accordion */}
                    <div className="lg:col-span-7">
                        {isLoading && <FaqSkeleton />}

                        {isError && !isLoading && (
                            <FaqMessage
                                tone="error"
                                icon={FiHelpCircle}
                                title="Couldn't load the FAQs"
                                text="Please check your connection and try again."
                                onRetry={refetch}
                            />
                        )}

                        {!isLoading && !isError && faqs.length === 0 && (
                            <FaqMessage
                                icon={FiHelpCircle}
                                title="No FAQs yet"
                                text="Questions will show up here once they are published."
                            />
                        )}

                        {!isLoading && !isError && faqs.length > 0 && (
                            <div
                                ref={listRef}
                                onKeyDown={onListKeyDown}
                                className="flex flex-col gap-4"
                            >
                                {faqs.map((faq, index) => (
                                    <FaqItem
                                        key={faq._id ?? faq.id ?? index}
                                        faq={faq}
                                        index={index}
                                        baseId={baseId}
                                        isOpen={openIndex === index}
                                        onToggle={() => toggleFAQ(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}