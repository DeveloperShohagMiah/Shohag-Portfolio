import React, { useState } from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
    {
        id: "project-one",
        title: "Project One",
        year: "2026",
        description:
            "A full-stack web application focused on delivering a fast, intuitive, and scalable user experience.",
        category: "Full-Stack Application",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-two",
        title: "Project Two",
        year: "2026",
        description:
            "A product interface built with responsive layouts, reusable components, and seamless interactions.",
        category: "Frontend Development",
        technologies: ["React", "JavaScript", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-three",
        title: "Project Three",
        year: "2025",
        description:
            "A data-driven application combining a clean dashboard experience with a reliable backend architecture.",
        category: "Dashboard / SaaS",
        technologies: ["React", "Node.js", "PostgreSQL"],
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        id: "project-four",
        title: "Project Four",
        year: "2025",
        description:
            "An e-commerce experience designed around conversion, accessibility, and a frictionless shopping journey.",
        category: "E-Commerce",
        technologies: ["Next.js", "Stripe", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
];

function ProjectRow({ project, active, onActivate }) {
    return (
        <li
            onMouseEnter={onActivate}
            onFocus={onActivate}
            className="border-t border-border/60 py-8 first:border-t-0 first:pt-0 lg:py-10"
        >
            {/* Title row */}
            <div className="flex items-baseline justify-between gap-6">
                <h3 className="min-w-0">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-start gap-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-5xl lg:text-6xl ${active
                                ? "text-foreground"
                                : "text-foreground lg:text-foreground/30"
                            }`}
                    >
                        {project.title}
                        <FiArrowUpRight
                            aria-hidden="true"
                            className={`mt-1 size-5 shrink-0 text-primary transition-all duration-500 sm:size-6 lg:size-7 ${active
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-2 opacity-0"
                                } max-lg:translate-x-0 max-lg:opacity-100`}
                        />
                    </a>
                </h3>

                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {project.year}
                </span>
            </div>

            {/* Mobile preview (desktop uses the sticky panel) */}
            <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                className="mt-6 aspect-[16/10] w-full rounded-xl border border-border/60 object-cover object-top lg:hidden"
            />

            {/* Details: always open on mobile, expands for the active row on desktop */}
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${active
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                        {project.description}
                    </p>

                    <p className="mt-5 text-sm font-medium text-foreground">
                        {project.category}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {project.technologies.join(", ")}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Live demo
                            <FiArrowUpRight size={14} aria-hidden="true" />
                        </a>
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.title} source code on GitHub`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <FiGithub size={14} aria-hidden="true" />
                            Code
                        </a>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default function Projects() {
    const [activeId, setActiveId] = useState(PROJECTS[0].id);

    return (
        <section id="portfolio" className="relative bg-background py-28 sm:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Heading */}
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader label="Selected Works" />
                        <h2 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                            Work I&apos;m proud of.
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg lg:col-span-5 lg:justify-self-end">
                        Projects where design, engineering, and problem solving
                        come together to create useful digital experiences.
                    </p>
                </div>

                {/* Index + sticky preview */}
                <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
                    <ul className="lg:col-span-7">
                        {PROJECTS.map((project) => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                active={project.id === activeId}
                                onActivate={() => setActiveId(project.id)}
                            />
                        ))}
                    </ul>

                    {/* Desktop preview */}
                    <div className="relative hidden lg:col-span-5 lg:block">
                        <div className="sticky top-28">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-2xl shadow-primary/5">
                                {PROJECTS.map((project) => (
                                    <img
                                        key={project.id}
                                        src={project.image}
                                        alt={
                                            project.id === activeId
                                                ? `${project.title} preview`
                                                : ""
                                        }
                                        loading="lazy"
                                        className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-out motion-reduce:transition-none ${project.id === activeId
                                                ? "scale-100 opacity-100"
                                                : "scale-105 opacity-0"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GitHub link */}
                <div className="mt-20 border-t border-border/60 pt-8">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                        More projects on GitHub
                        <FiArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
}