import React, { useMemo, useState } from "react";
import {
    FiCode,
    FiDatabase,
    FiFigma,
    FiGitBranch,
    FiLayers,
    FiServer,
    FiTool,
    FiSearch,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import { useGetPublicSkillsQuery } from "../redux/features/publicApi";
import SkillsSkeleton from "../ui/SkillsSkeleton";
import SkillCard from "../ui/SkillCard";

/* ------------------------------------------------------------------ */
/*  Icon map — backend sends a string, we map it to a component        */
/* ------------------------------------------------------------------ */
const ICON_MAP = {
    code: FiCode,
    frontend: FiCode,
    layers: FiLayers,
    ui: FiLayers,
    server: FiServer,
    backend: FiServer,
    database: FiDatabase,
    db: FiDatabase,
    git: FiGitBranch,
    tools: FiGitBranch,
    figma: FiFigma,
    design: FiFigma,
    tool: FiTool,
    default: FiCode,
};

const FALLBACK_ICONS = [FiCode, FiLayers, FiServer, FiDatabase, FiGitBranch, FiFigma, FiTool];



/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function Skills() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetPublicSkillsQuery();

    // Normalize backend data
    const raw = data?.data ?? data ?? [];


    // Derive categories from data (unique), with "All" first
    const categories = useMemo(() => {
        const set = new Set(raw.map((s) => s.category));
        return ["All", ...Array.from(set).sort()];
    }, [raw]);

    // Filter by category + search
    const filtered = useMemo(() => {
        let list = raw;

        if (activeCategory !== "All") {
            list = list.filter((s) => s.category === activeCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.category.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q)
            );
        }

        return list;
    }, [raw, activeCategory, search]);

    return (
        <section
            id="skills"
            className="relative overflow-hidden bg-background py-28 sm:py-32"
        >
            {/* Top divider */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 bg-primary/8 blur-[140px]" />
            <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 bg-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* HEADER */}
                <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                    <div>
                        <SectionHeader label="Skills" />
                        <h2 className="max-w-4xl text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Building systems that feel{" "}
                            <span className="text-gradient">engineered.</span>
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

                {/* TOOLBAR */}
                <div className="mt-14 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Categories — horizontally scrollable on mobile */}
                    <div className="scrollbar-hide -mx-6 overflow-x-auto px-6 lg:mx-0 lg:px-0">
                        <div className="flex min-w-max items-center gap-1 border border-border/60 bg-card/40 p-1.5 backdrop-blur-sm">
                            {categories.map((category) => {
                                const isActive = activeCategory === category;
                                const count =
                                    category === "All"
                                        ? raw.length
                                        : raw.filter((s) => s.category === category).length;

                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setActiveCategory(category)}
                                        className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 font-display text-xs font-medium transition-all duration-300 sm:px-4 ${isActive
                                            ? "bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_theme(colors.primary/50)]"
                                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                            }`}
                                    >
                                        {category}
                                        <span
                                            className={`font-code text-[9px] tabular-nums ${isActive
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground/50"
                                                }`}
                                        >
                                            {String(count).padStart(2, "0")}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full max-w-xs shrink-0">
                        <FiSearch
                            size={14}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search skills..."
                            className="w-full rounded-xl border border-border/60 bg-card/40 py-2.5 pl-10 pr-3 font-code text-[11px] text-foreground placeholder:text-muted-foreground/60 backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                    </div>
                </div>

                {/* COUNT / LABEL */}
                <div className="mt-10 flex items-center justify-between">
                    <p className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {activeCategory === "All"
                            ? "Core technology stack"
                            : `${activeCategory} stack`}
                    </p>

                    <p className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {String(filtered.length).padStart(2, "0")} skills
                    </p>
                </div>

                {/* GRID */}
                {isLoading ? (
                    <SkillsSkeleton />
                ) : isError ? (
                    <div className="mt-5 border border-border/60 bg-card/30 p-12 text-center text-sm text-muted-foreground">
                        Failed to load skills. Please try again later.
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mt-5 border border-dashed border-border/60 bg-card/20 p-12 text-center">
                        <p className="font-code text-[10px] uppercase tracking-[0.24em] text-primary">
                            {search ? "No match" : "Coming soon"}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {search
                                ? `No skills match "${search}"`
                                : "New skills are being added."}
                        </p>
                    </div>
                ) : (
                    <div className="mt-5 grid gap-px overflow-hidden border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
                        {filtered.map((skill, i) => (
                            <SkillCard key={skill.id} skill={skill} index={i} />
                        ))}
                    </div>
                )}
            </div>

            {/* Hide scrollbar utility */}
            <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}