
import React, { useRef } from "react";
import {
    FiArrowLeft,
    FiArrowRight,
    FiArrowUpRight,
    FiGithub,
    FiExternalLink,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
    {
        number: "01",
        title: "Project One",
        description:
            "A modern full-stack web application focused on delivering a fast, intuitive, and scalable user experience.",
        category: "Full-Stack Application",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        number: "02",
        title: "Project Two",
        description:
            "A polished product interface with responsive layouts, reusable components, and seamless interactions.",
        category: "Frontend Development",
        technologies: ["React", "JavaScript", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
    {
        number: "03",
        title: "Project Three",
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
        number: "04",
        title: "Project Four",
        description:
            "A sleek e-commerce experience designed around conversion, accessibility, and a frictionless shopping journey.",
        category: "E-Commerce",
        technologies: ["React", "Next.js", "Stripe", "Tailwind CSS"],
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",
        liveUrl: "#",
        githubUrl: "#",
    },
];

export default function Projects() {
    const carouselRef = useRef(null);

    const scrollCarousel = (direction) => {
        if (!carouselRef.current) return;

        const scrollAmount = carouselRef.current.clientWidth;

        carouselRef.current.scrollBy({
            left: direction === "next" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section
            id="portfolio"
            className="relative overflow-hidden bg-background py-28 sm:py-32"
        >
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>



            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Heading */}
                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="max-w-3xl">
                        <SectionHeader label={"Selected Works"} />

                        <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Things I&apos;ve{" "}
                            <span className="text-gradient">built.</span>
                        </h2>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            A selection of projects where design, engineering,
                            and problem solving come together to create useful
                            digital experiences.
                        </p>
                    </div>

                    {/* Carousel controls */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => scrollCarousel("prev")}
                            aria-label="Previous projects"
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/40 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                            <FiArrowLeft size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollCarousel("next")}
                            aria-label="Next projects"
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/40 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                            <FiArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Carousel */}
                <div
                    ref={carouselRef}
                    className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {PROJECTS.map((project) => (
                        <article
                            key={project.number}
                            className="group relative w-full min-w-full snap-start overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/30"
                        >
                            {/* TWO COLUMN PROJECT */}
                            <div className="grid min-h-[500px] lg:grid-cols-2">
                                {/* Image */}
                                <div className="relative min-h-[300px] overflow-hidden bg-muted lg:min-h-[500px]">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Image overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />

                                    {/* Number */}
                                    <span className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 font-code text-xs text-white/70 backdrop-blur-md">
                                        {project.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                                    <span className="font-code text-xs uppercase tracking-[0.18em] text-primary">
                                        {project.category}
                                    </span>

                                    <h3 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                        {project.title}
                                    </h3>

                                    <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    <div className="mt-7 flex flex-wrap gap-2">
                                        {project.technologies.map(
                                            (technology) => (
                                                <span
                                                    key={technology}
                                                    className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-colors duration-300 group-hover:border-primary/20 group-hover:text-foreground"
                                                >
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="mt-9 flex items-center gap-3">
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group/link inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                                        >
                                            View project

                                            <FiExternalLink
                                                size={15}
                                                className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                            />
                                        </a>

                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`View ${project.title} on GitHub`}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                        >
                                            <FiGithub size={17} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-700 group-hover:w-full" />
                        </article>
                    ))}
                </div>

                {/* Carousel indicator */}
                <div className="mt-5 flex justify-center">
                    <p className="font-code text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        ← Scroll or use the arrows →
                    </p>
                </div>

                {/* GitHub CTA */}
                <div className="mt-10 flex justify-center">
                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
                    >
                        More projects on GitHub

                        <FiArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>
                </div>


            </div>
        </section>
    );
}
