
import React, { useMemo, useState } from "react";
import {
    FiCode,
    FiDatabase,
    FiFigma,
    FiGitBranch,
    FiLayers,
    FiServer,
    FiTool,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";

const SKILLS = [
    {
        name: "React",
        category: "Frontend",
        icon: FiCode,
        description: "Component-driven interfaces",
    },
    {
        name: "JavaScript",
        category: "Frontend",
        icon: FiCode,
        description: "Modern ES6+ development",
    },
    {
        name: "TypeScript",
        category: "Frontend",
        icon: FiCode,
        description: "Type-safe application development",
    },
    {
        name: "HTML5",
        category: "Frontend",
        icon: FiCode,
        description: "Semantic web structure",
    },
    {
        name: "CSS3",
        category: "Frontend",
        icon: FiLayers,
        description: "Modern styling & layouts",
    },
    {
        name: "Tailwind CSS",
        category: "UI",
        icon: FiLayers,
        description: "Utility-first design systems",
    },
    {
        name: "Node.js",
        category: "Backend",
        icon: FiServer,
        description: "Server-side JavaScript",
    },
    {
        name: "Express.js",
        category: "Backend",
        icon: FiServer,
        description: "REST API development",
    },
    {
        name: "MongoDB",
        category: "Backend",
        icon: FiDatabase,
        description: "NoSQL data architecture",
    },
    {
        name: "PostgreSQL",
        category: "Backend",
        icon: FiDatabase,
        description: "Relational databases",
    },
    {
        name: "REST API",
        category: "Backend",
        icon: FiServer,
        description: "API architecture & integration",
    },
    {
        name: "Git",
        category: "Tools",
        icon: FiGitBranch,
        description: "Version control",
    },
    {
        name: "GitHub",
        category: "Tools",
        icon: FiGitBranch,
        description: "Collaboration & workflows",
    },
    {
        name: "Figma",
        category: "Design",
        icon: FiFigma,
        description: "Interface design & prototyping",
    },
    {
        name: "UI Design",
        category: "Design",
        icon: FiLayers,
        description: "Clean product interfaces",
    },
    {
        name: "Responsive Design",
        category: "UI",
        icon: FiLayers,
        description: "Mobile-first experiences",
    },
    {
        name: "Authentication",
        category: "Backend",
        icon: FiServer,
        description: "Secure user systems",
    },
    {
        name: "Deployment",
        category: "Tools",
        icon: FiTool,
        description: "Production-ready applications",
    },
];

const CATEGORIES = [
    "All",
    "Frontend",
    "Backend",
    "Tools",
    "Design",
    "UI",
];

export default function Skills() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredSkills = useMemo(() => {
        if (activeCategory === "All") {
            return SKILLS;
        }

        return SKILLS.filter((skill) => skill.category === activeCategory);
    }, [activeCategory]);

    return (
        <section
            id="skills"
            className="relative overflow-hidden bg-background py-28 sm:py-32"
        >
            <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                    <div>
                        <SectionHeader label={"Skills"} />

                        <h2 className="max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Building systems that feel{" "}
                            <span className="text-gradient">
                                engineered.
                            </span>
                        </h2>
                    </div>

                    <div>
                        <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                            My stack is built around modern full-stack development, clean
                            interfaces, reliable architecture, and a workflow that takes
                            products from the first idea to production.
                        </p>
                    </div>
                </div>

                {/* Category navigation */}
                <div className="mt-14 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex min-w-max items-center gap-2 rounded-2xl border border-border/60 bg-card/30 p-1.5 backdrop-blur-sm bg-gradient gradient-border">
                        {CATEGORIES.map((category) => {
                            const isActive = activeCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`relative rounded-xl px-4 py-2.5 font-medium font-display text-xs transition-all duration-300 sm:px-5 ${isActive
                                        ? "bg-muted text-muted-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                                        }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Skill count */}
                <div className="mt-10 flex items-center justify-between">
                    <p className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {activeCategory === "All"
                            ? "Core technology stack"
                            : `${activeCategory} stack`}
                    </p>

                    <p className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {String(filteredSkills.length).padStart(2, "0")} skills
                    </p>
                </div>

                {/* Skills */}
                <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSkills.map((skill, index) => {
                        const Icon = skill.icon;

                        return (
                            <div
                                key={skill.name}
                                className="group relative bg-background p-6 transition-colors duration-300 hover:bg-linear-to-br hover:from-muted/.5 hover:to-muted/35"
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/50 text-primary transition-all duration-300">
                                        <Icon size={18} />
                                    </div>

                                    <span className="font-code text-[10px] text-muted-foreground/40">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="mt-6 text-base font-semibold text-foreground">
                                    {skill.name}
                                </h3>

                                {/* Description */}
                                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                                    {skill.description}
                                </p>

                                {/* Category */}
                                <div className="mt-5 flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-primary" />

                                    <span className="font-code text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                                        {skill.category}
                                    </span>
                                </div>

                                {/* Hover accent */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-7 top-0 h-[1.5px] bg-linear-to-r from-transparent via-foreground/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                />

                            </div>
                        );
                    })}
                </div>


            </div>
        </section>
    );
}
