import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useGetPublicSkillsQuery } from "../redux/features/publicApi";
import {
    FiArrowUpRight,
    FiBox,
    FiCode,
    FiDatabase,
    FiLayers,
    FiServer,
    FiTool,
} from "react-icons/fi";
import {
    AnimatePresence,
    animate,
    motion,
    useInView,
    useReducedMotion,
} from "framer-motion";
import SectionHeader from "./SectionHeader";

/* ========================================================================== */
/*  Content — pass your own via props, or edit these defaults                 */
/* ========================================================================== */
const GROUPS = [
    {
        name: "Frontend",
        color: "#8b5cf6",
        icon: FiLayers,
        description: "Building intuitive user interfaces",
    },
    {
        name: "Backend",
        color: "#38bdf8",
        icon: FiServer,
        description: "Engineering reliable server systems",
    },
    {
        name: "Database",
        color: "#22d3ee",
        icon: FiDatabase,
        description: "Managing and structuring data",
    },
    {
        name: "Tools",
        color: "#a78bfa",
        icon: FiTool,
        description: "Development and productivity tools",
    },
    {
        name: "Others",
        color: "#34d399",
        icon: FiBox,
        description: "Additional technologies and concepts",
    },
];

const DEFAULT_SKILLS = [
    { name: "HTML5", category: "Frontend" },
    { name: "CSS3", category: "Frontend" },
    { name: "JavaScript", category: "Frontend" },
    { name: "React", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "React Router", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Express.js", category: "Backend" },
    { name: "REST API", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "Mongoose", category: "Database" },
    { name: "Git", category: "Tools" },
    { name: "GitHub", category: "Tools" },
    { name: "VS Code", category: "Tools" },
    { name: "Postman", category: "Tools" },
    { name: "Redux Toolkit", category: "Others" },
    { name: "RTK Query", category: "Others" },
    { name: "Socket.IO", category: "Others" },
];

const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70";

const CSS = `
@keyframes sk-marquee   { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
@keyframes sk-marquee-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.sk-track   { animation: sk-marquee 50s linear infinite; }
.sk-track-r { animation: sk-marquee-r 60s linear infinite; }
.sk-marquee:hover .sk-track, .sk-marquee:hover .sk-track-r { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .sk-track, .sk-track-r { animation: none; } }
`;

/* ========================================================================== */
/*  Orbit-map geometry (560 × 560 viewBox)                                    */
/* ========================================================================== */
const SIZE = 560;
const CX = SIZE / 2;
const CY = SIZE / 2;
const NODE_R = 190;

const nodePos = (i, n) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: CX + NODE_R * Math.cos(a), y: CY + NODE_R * Math.sin(a) };
};

/* ========================================================================== */
/*  Small helpers                                                             */
/* ========================================================================== */
function Reveal({ children, delay = 0, className = "" }) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: EASE, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function Counter({ value }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduced = useReducedMotion();
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (reduced) return setN(value);
        const c = animate(0, value, {
            duration: 1.4,
            ease: EASE,
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => c.stop();
    }, [inView, reduced, value]);

    return <span ref={ref}>{String(n).padStart(2, "0")}</span>;
}

const initials = (name = "") =>
    name
        .replace(/[^A-Za-z0-9 ]/g, " ")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "•";

/* ========================================================================== */
/*  Orbit map                                                                 */
/* ========================================================================== */
function OrbitMap({ groups, active, onSelect, onHover, reduced }) {
    const uid = useId().replace(/:/g, "");
    const n = groups.length;
    const current = groups[active];
    const target = current ? nodePos(active, n) : { x: CX, y: CY };

    return (
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full"
                fill="none"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id={`${uid}-core`}>
                        <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.35" />
                        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                    </radialGradient>
                    <filter id={`${uid}-glow`} x="-200%" y="-200%" width="500%" height="500%">
                        <feGaussianBlur stdDeviation="4" />
                    </filter>
                </defs>

                <circle cx={CX} cy={CY} r={150} fill={`url(#${uid}-core)`} />

                {/* orbit rings */}
                <circle cx={CX} cy={CY} r={96} stroke="#fff" strokeOpacity="0.07" />
                <circle cx={CX} cy={CY} r={NODE_R} stroke="#fff" strokeOpacity="0.09" />
                <motion.circle
                    cx={CX}
                    cy={CY}
                    r={250}
                    stroke="#a78bfa"
                    strokeOpacity="0.28"
                    strokeDasharray="2 9"
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                />
                <motion.g
                    animate={reduced ? undefined : { rotate: -360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx={CX} cy={CY} r={143} stroke="#22d3ee" strokeOpacity="0.16" strokeDasharray="1 7" />
                    <circle cx={CX + 143} cy={CY} r={3} fill="#22d3ee" fillOpacity="0.8" />
                    <circle cx={CX - 143} cy={CY} r={2.5} fill="#a78bfa" fillOpacity="0.8" />
                </motion.g>

                {/* spokes hub → node */}
                {groups.map((g, i) => {
                    const p = nodePos(i, n);
                    const on = i === active;
                    return (
                        <motion.line
                            key={g.name}
                            x1={CX}
                            y1={CY}
                            x2={p.x}
                            y2={p.y}
                            stroke={g.color}
                            strokeDasharray={on ? "5 6" : "2 7"}
                            animate={{
                                strokeOpacity: on ? 0.85 : 0.2,
                                strokeWidth: on ? 1.6 : 1,
                                ...(reduced || !on ? {} : { strokeDashoffset: [0, -44] }),
                            }}
                            transition={{
                                strokeOpacity: { duration: 0.5 },
                                strokeWidth: { duration: 0.5 },
                                strokeDashoffset: { duration: 2.2, repeat: Infinity, ease: "linear" },
                            }}
                        />
                    );
                })}

                {/* data packet travelling to the active domain */}
                {!reduced && current && (
                    <motion.g
                        key={current.name}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, target.x - CX],
                            y: [0, target.y - CY],
                            opacity: [0, 1, 1, 0],
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <circle cx={CX} cy={CY} r={9} fill={current.color} fillOpacity="0.7" filter={`url(#${uid}-glow)`} />
                        <circle cx={CX} cy={CY} r={3.5} fill={current.color} />
                    </motion.g>
                )}
            </svg>

            {/* hub */}
            <div
                className="absolute left-1/2 top-1/2 flex aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                aria-hidden="true"
            >
                <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/20 [animation-duration:3.5s] motion-reduce:animate-none" />
                <span className="absolute inset-[-14%] rounded-full border border-cyan-300/15" />
                <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-primary/40 bg-background shadow-[0_0_40px_rgba(59,130,246,0.22)]">
                    <FiCode className="text-cyan-300" size={24} />
                    <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground sm:block">
                        Developer
                    </span>
                </div>
            </div>

            {/* domain nodes (real buttons) */}
            {groups.map((g, i) => {
                const p = nodePos(i, n);
                const Icon = g.icon;
                const on = i === active;

                return (
                    <div
                        key={g.name}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%` }}
                    >
                        <motion.button
                            type="button"
                            aria-pressed={on}
                            aria-label={`${g.name}, ${g.skills.length} technologies`}
                            onClick={() => onSelect(i)}
                            onPointerEnter={() => onHover(i)}
                            onFocus={() => onHover(i)}
                            whileHover={reduced ? undefined : { scale: 1.08 }}
                            whileTap={reduced ? undefined : { scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 320, damping: 20 }}
                            className={`group flex flex-col items-center gap-2 rounded-2xl ${FOCUS}`}
                        >
                            <span
                                className="relative flex h-12 w-12 items-center justify-center rounded-full border bg-card transition-all duration-500 sm:h-14 sm:w-14"
                                style={{
                                    color: g.color,
                                    borderColor: on ? `${g.color}cc` : `${g.color}40`,
                                    boxShadow: on
                                        ? `0 0 0 4px ${g.color}1f, 0 0 34px ${g.color}66`
                                        : "none",
                                }}
                            >
                                <Icon size={20} />
                                <span
                                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-background px-1 font-mono text-[9px] font-semibold text-background"
                                    style={{ backgroundColor: g.color }}
                                >
                                    {g.skills.length}
                                </span>
                            </span>
                            <span
                                className={`hidden rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur-md transition-colors duration-300 sm:block ${on
                                    ? "border-primary/40 bg-primary/10 text-foreground"
                                    : "border-border/60 bg-card/50 text-muted-foreground group-hover:text-foreground"
                                    }`}
                            >
                                {g.name}
                            </span>
                        </motion.button>
                    </div>
                );
            })}
        </div>
    );
}

/* ========================================================================== */
/*  Detail panel                                                              */
/* ========================================================================== */
function SkillCard({ skill, color, index, reduced }) {
    const hasLevel = typeof skill.level === "number";

    return (
        <motion.li
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 + index * 0.04 }}
            whileHover={reduced ? undefined : { y: -3 }}
            className="group relative overflow-hidden rounded-xl border border-border/70 bg-card/50 p-3 transition-colors duration-300 hover:border-border hover:bg-accent/70"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            />

            <div className="flex items-center gap-3">
                <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-[11px] font-semibold"
                    style={{
                        color,
                        borderColor: `${color}40`,
                        backgroundColor: `${color}14`,
                    }}
                >
                    {initials(skill.name)}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{skill.name}</p>
                    {skill.shortDescription && (
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{skill.shortDescription}</p>
                    )}
                </div>

                <FiArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
            </div>

            {hasLevel && (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={reduced ? false : { width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, skill.level))}%` }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.2 + index * 0.04 }}
                    />
                </div>
            )}
        </motion.li>
    );
}

function DetailPanel({ group, reduced }) {
    const Icon = group.icon;

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={group.name}
                initial={reduced ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: EASE }}
            >
                <div className="flex items-start gap-4">
                    <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                            color: group.color,
                            borderColor: `${group.color}50`,
                            backgroundColor: `${group.color}14`,
                            boxShadow: `0 0 30px ${group.color}30`,
                        }}
                    >
                        <Icon size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <h3 className="text-xl font-semibold tracking-tight text-foreground">{group.name}</h3>
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                {String(group.skills.length).padStart(2, "0")} technologies
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                    </div>
                </div>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {group.skills.map((skill, i) => (
                        <SkillCard
                            key={skill._id || skill.name}
                            skill={skill}
                            color={group.color}
                            index={i}
                            reduced={reduced}
                        />
                    ))}
                </ul>
            </motion.div>
        </AnimatePresence>
    );
}

/* ========================================================================== */
/*  Stats + marquee                                                           */
/* ========================================================================== */
function Stat({ label, children, detail }) {
    return (
        <div className="rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-xl transition-colors duration-300 hover:bg-accent/50 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">{children}</p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">{detail}</p>
        </div>
    );
}

function MarqueeRow({ items, reverse = false }) {
    const doubled = [...items, ...items];
    return (
        <div
            className="overflow-hidden"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
        >
            <div className={`flex w-max ${reverse ? "sk-track-r" : "sk-track"}`}>
                {doubled.map((item, i) => (
                    <span
                        key={`${item.name}-${i}`}
                        aria-hidden={i >= items.length ? "true" : undefined}
                        className="mr-3 inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:text-foreground"
                    >
                        <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}90` }}
                        />
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ========================================================================== */
/*  Section                                                                   */
/* ========================================================================== */
export default function SkillsNetwork({
    skills: providedSkills,
    groups = GROUPS,
    id = "skills",
    eyebrow = "01 / Technical Ecosystem",
    title = "The Technologies",
    highlight = "Behind My Work",
    description = "A connected ecosystem of tools and technologies I use to design, build, and deliver modern web applications.",
    focus = "MERN",
    focusDetail = "Modern web development",
    mindset = "Learn continuously. Build thoughtfully. Improve consistently.",
}) {
    const reduced = useReducedMotion();
    const {
        data: skillsResponse,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetPublicSkillsQuery();

    // Accept either { data: [...] } or a direct array from the API.
    // Explicitly supplied skills can still be used for previews/testing.
    const apiSkills = useMemo(() => {
        if (Array.isArray(skillsResponse?.data)) return skillsResponse.data;
        if (Array.isArray(skillsResponse)) return skillsResponse;
        return [];
    }, [skillsResponse]);

    const skills = Array.isArray(providedSkills) ? providedSkills : apiSkills;

    /* Bucket skills into groups; unknown categories fall into "Others" if present. */
    const grouped = useMemo(() => {
        const base = groups.map((g) => ({ ...g, skills: [] }));
        const others = base.find((g) => g.name.toLowerCase() === "others");
        for (const skill of skills) {
            const key = skill.category?.toLowerCase();
            const target = base.find((g) => g.name.toLowerCase() === key) ?? others;
            if (target) target.skills.push(skill);
        }
        return base;
    }, [skills, groups]);

    const activeGroups = useMemo(() => grouped.filter((g) => g.skills.length > 0), [grouped]);

    const [active, setActive] = useState(0);
    const [hover, setHover] = useState(false);
    const [locked, setLocked] = useState(false);

    // keep the index valid if the data changes
    const safeActive = Math.min(active, Math.max(0, activeGroups.length - 1));

    // gentle auto-tour until the visitor interacts
    useEffect(() => {
        if (reduced || hover || locked || activeGroups.length < 2) return;
        const t = setInterval(() => setActive((a) => (a + 1) % activeGroups.length), 4500);
        return () => clearInterval(t);
    }, [reduced, hover, locked, activeGroups.length]);

    const select = (i) => {
        setActive(i);
        setLocked(true);
    };

    const marqueeItems = useMemo(
        () => activeGroups.flatMap((g) => g.skills.map((s) => ({ name: s.name, color: g.color }))),
        [activeGroups],
    );
    const half = Math.ceil(marqueeItems.length / 2);
    const rowA = marqueeItems.slice(0, half);
    const rowB = marqueeItems.slice(half);

    // cursor spotlight on the main panel
    const onMove = (e) => {
        if (e.pointerType !== "mouse") return;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    const current = activeGroups[safeActive];

    return (
        <section
            id={id}
            className="relative isolate overflow-hidden bg-background py-20 text-foreground sm:py-28 lg:py-32"
        >
            <style>{CSS}</style>

            {/* ambient lighting */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    className="absolute -left-48 top-20 h-[28rem] w-[28rem] rounded-full bg-violet-600/[0.12] blur-[140px]"
                    animate={reduced ? undefined : { x: [0, 50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-48 top-48 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.10] blur-[140px]"
                    animate={reduced ? undefined : { x: [0, -40, 0], y: [0, 40, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                    className="absolute inset-0 opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <Reveal className="mb-12 max-w-3xl sm:mb-16">
                    <SectionHeader label={"Skills"} title={"The technologies"} highlight={"Behind my works."}>

                    </SectionHeader>

                </Reveal>

                {/* API states */}
                {isLoading && (
                    <div className="rounded-2xl border border-border/70 bg-card/50 p-10 text-center text-sm text-muted-foreground">
                        Loading skills from database...
                    </div>
                )}

                {isError && !isLoading && (
                    <div role="alert" className="rounded-2xl border border-destructive/30 bg-card/60 p-8 text-center">
                        <p className="text-sm text-foreground">Unable to load skills from the database.</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {error?.data?.message || error?.error || "Please check your connection and try again."}
                        </p>
                        <button
                            type="button"
                            onClick={refetch}
                            className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {isFetching && !isLoading && (
                    <p className="mb-3 text-right text-xs text-muted-foreground">Refreshing skills…</p>
                )}

                {/* Interactive map + details */}
                {!isLoading && !isError && current && (
                    <Reveal delay={0.05}>
                        <div
                            onPointerMove={onMove}
                            onPointerEnter={() => setHover(true)}
                            onPointerLeave={() => setHover(false)}
                            className="group/panel relative overflow-hidden rounded-[28px] border border-border/70 bg-card/80 p-4 shadow-[0_30px_100px_-35px_color-mix(in_srgb,var(--foreground)_18%,transparent)] backdrop-blur-2xl sm:p-6 lg:p-8"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.10), transparent 70%)",
                                }}
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent"
                            />

                            {/* top bar */}
                            <div className="relative mb-6 flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                                <div>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                        System overview
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground">Developer technology map</p>
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                                        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    </span>
                                    <span className="text-[10px] text-emerald-300">{activeGroups.length} domains</span>
                                </div>
                            </div>

                            {/* mobile / tablet domain pills */}
                            <div className="relative -mx-4 mb-6 px-4">
                                <div role="tablist" aria-label="Skill domains" className="flex flex-wrap gap-2">
                                    {activeGroups.map((g, i) => {
                                        const on = i === safeActive;
                                        return (
                                            <button
                                                key={g.name}
                                                type="button"
                                                role="tab"
                                                aria-selected={on}
                                                onClick={() => select(i)}
                                                className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${FOCUS} ${on
                                                    ? "border-primary/40 bg-primary/10 text-foreground"
                                                    : "border-border/60 bg-card/50 text-muted-foreground"
                                                    }`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: g.color }} />
                                                {g.name}
                                                <span className="font-mono text-[10px] text-muted-foreground">{g.skills.length}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
                                <div>
                                    <OrbitMap
                                        groups={activeGroups}
                                        active={safeActive}
                                        onSelect={select}
                                        onHover={(i) => !locked && setActive(i)}
                                        reduced={reduced}
                                    />
                                    <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                                        Hover or tap a domain to explore
                                    </p>
                                </div>

                                <div className="min-w-0 lg:min-h-[26rem]">
                                    <DetailPanel group={current} reduced={reduced} />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* Stats */}
                {!isLoading && !isError && <Reveal delay={0.05} className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Stat label="Total skills" detail="Across my technology stack">
                        <Counter value={skills.length} />
                    </Stat>
                    <Stat label="Skill domains" detail="Areas of development">
                        <Counter value={activeGroups.length} />
                    </Stat>
                    <Stat label="Core focus" detail={focusDetail}>
                        {focus}
                    </Stat>
                    <div className="col-span-2 flex flex-col justify-center rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-xl sm:p-5 lg:col-span-1">
                        <div className="flex items-center gap-2">
                            <FiCode className="text-violet-300" size={15} aria-hidden="true" />
                            <span className="text-xs font-medium text-foreground/80">Development mindset</span>
                        </div>
                        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{mindset}</p>
                    </div>
                </Reveal>}

                {/* Marquee */}
                {!isLoading && !isError && marqueeItems.length > 0 && (
                    <Reveal delay={0.05} className="mt-14 sm:mt-20">
                        <div className="sk-marquee space-y-3" aria-label="All technologies">
                            <MarqueeRow items={rowA.length ? rowA : marqueeItems} />
                            {rowB.length > 0 && <MarqueeRow items={rowB} reverse />}
                        </div>


                    </Reveal>
                )}
            </div>
        </section >
    );
}