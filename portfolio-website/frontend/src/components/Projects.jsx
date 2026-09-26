import React from "react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
    {
        number: "01",
        title: "Project One",
        description:
            "A full-stack web application focused on delivering a fast, intuitive, and scalable user experience.",
        category: "Full-Stack Application",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=85",
        liveUrl: "#",
        githubUrl: "#",
        span: "lg:col-span-8",
    },
    {
        number: "02",
        title: "Project Two",
        description:
            "A product interface built with responsive layouts, reusable components, and seamless interactions.",
        category: "Frontend Development",
        technologies: ["React", "JavaScript", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
        liveUrl: "#",
        githubUrl: "#",
        span: "lg:col-span-4",
    },
    {
        number: "03",
        title: "Project Three",
        description:
            "A data-driven application combining a clean dashboard experience with a reliable backend architecture.",
        category: "Dashboard / SaaS",
        technologies: ["React", "Node.js", "PostgreSQL"],
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
        liveUrl: "#",
        githubUrl: "#",
        span: "lg:col-span-4",
    },
    {
        number: "04",
        title: "Project Four",
        description:
            "An e-commerce experience designed around conversion, accessibility, and a frictionless shopping journey.",
        category: "E-Commerce",
        technologies: ["React", "Next.js", "Stripe", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85",
        liveUrl: "#",
        githubUrl: "#",
        span: "lg:col-span-8",
    },
];

function ProjectCard({ project }) {
    return (
        <article
            className={`group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl ${project.span}`}
        >
            {/* Image */}
            <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Number, top corner */}
            <span className="absolute right-6 top-6 font-code text-sm text-white/50">
                {project.number}
            </span>

            {/* Content */}
            <div className="relative z-10 p-7 sm:p-9">
                <span className="text-sm text-white/70">{project.category}</span>

                <h3 className="mt-2 text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl">
                    {project.title}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-base">
                    {project.description}
                </p>

                <div className="mt-4 flex max-h-0 flex-wrap gap-x-4 gap-y-1 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                    {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs text-white/50">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex items-center gap-5">
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
                    >
                        View project
                        <FiArrowUpRight size={14} />
                    </a>
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} source on GitHub`}
                        className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <FiGithub size={14} />
                        Source
                    </a>
                </div>
            </div>
        </article>
    );
}

export default function Projects() {
    return (
        <section id="portfolio" className="relative bg-background py-28 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Heading */}
                <div className="max-w-2xl">
                    <SectionHeader label={"Selected Works"} />

                    <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Things I&apos;ve built
                    </h2>

                    <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                        A selection of projects where design, engineering, and
                        problem solving come together to create useful
                        digital experiences.
                    </p>
                </div>

                {/* Bento grid */}
                <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {PROJECTS.map((project) => (
                        <ProjectCard key={project.number} project={project} />
                    ))}
                </div>

                {/* GitHub CTA */}
                <div className="mt-16 flex justify-center">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                        More projects on GitHub
                        <FiArrowUpRight size={14} />
                    </a>
                </div>
            </div>
        </section>
    );
}