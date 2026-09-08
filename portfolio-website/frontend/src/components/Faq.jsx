import React, { useState } from "react";
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
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-3xl">
                        <SectionHeader label={"FAQ"} />

                        <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-3xl">
                            I turn
                            <span className="text-gradient">ideas into web experiences.</span>
                        </h2>
                    </div>
                </div>

                {/* =====================================================
                    FAQ LIST
                ====================================================== */}

                <div className="mt-20 flex flex-col gap-2 items-center">

                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={faq.question}
                                className="group border border-border/70 p-2 rounded-xl"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center gap-5 py-2 text-left sm:py-3"
                                >
                                    {/* Number */}
                                    <span
                                        className={`w-7 shrink-0 pt-1 font-code text-[10px] transition-colors duration-300 ${isOpen
                                            ? "text-primary"
                                            : "text-muted-foreground/40"
                                            }`}
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Question */}
                                    <span
                                        className={`flex-1 text-base font-medium tracking-tight transition-colors duration-300 sm:text-sm ${isOpen
                                            ? "text-foreground"
                                            : "text-muted-foreground group-hover:text-foreground"
                                            }`}
                                    >
                                        {faq.question}
                                    </span>

                                    {/* Icon */}
                                    <span
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen
                                            ? "border-primary/30 bg-primary text-primary-foreground"
                                            : "border-border text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground"
                                            }`}
                                    >
                                        {isOpen ? (
                                            <FiMinus size={14} />
                                        ) : (
                                            <FiPlus size={14} />
                                        )}
                                    </span>
                                </button>

                                {/* Answer */}
                                <div
                                    className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out ${isOpen
                                        ? "grid-rows-[1fr] opacity-100"
                                        : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="pb-7 pl-12 pr-10 sm:pl-12 sm:pr-20">
                                            <p className="max-w-3xl text-xs leading-7 text-muted-foreground sm:text-sm">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* =====================================================
                    BOTTOM CTA
                ====================================================== */}

                <div className="mt-12 flex flex-col gap-6 border-t border-border/70 pt-10 sm:flex-row sm:items-center sm:justify-between">

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
                        className="group inline-flex w-fit items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10"
                    >
                        Get in touch

                        <FiArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}
