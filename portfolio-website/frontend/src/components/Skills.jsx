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
    FiZap,
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

const EASE = [0.22, 1, 0.36, 1];
const TOUR_SECONDS = 4.5;
const UNLOCK_AFTER_MS = 20000;

const FOCUS =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const CSS = `
@keyframes sk-marquee   { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
@keyframes sk-marquee-r { from { transform: translateX(-50%); } to { transform: translateX(0); } }
@keyframes sk-spin      { to { transform: rotate(360deg); } }
@keyframes sk-progress  { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes sk-shimmer   { to { transform: translateX(100%); } }
.sk-track   { animation: sk-marquee 50s linear infinite; }
.sk-track-r { animation: sk-marquee-r 60s linear infinite; }
.sk-marquee:hover .sk-track, .sk-marquee:hover .sk-track-r { animation-play-state: paused; }
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
        if (reduced) {
            setN(value);
            return;
        }
        const controls = animate(0, value, {
            duration: 1.4,
            ease: EASE,
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
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
/*  Loading skeleton (matches the final layout, so nothing jumps)             */
/* ========================================================================== */
function PanelSkeleton() {
    return (
        <div
            role="status"
            aria-live="polite"
            className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/60 p-6 lg:p-8"
        >
            <span className="sr-only">Loading skills…</span>
            <div className="grid items-center gap-10 lg:grid-cols-2">
                <div className="mx-auto aspect-square w-full max-w-[420px] rounded-full bg-muted/70" />
                <div className="space-y-4">
                    <div className="h-12 w-2/3 rounded-2xl bg-muted/70" />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[62px] rounded-2xl bg-muted/50" />
                        ))}
                    </div>
                </div>
            </div>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-foreground/[0.06] to-transparent animate-[sk-shimmer_1.8s_ease-in-out_infinite] motion-reduce:hidden"
            />
        </div>
    );
}

/* ========================================================================== */
/*  Orbit map (decorative — the tabs are the accessible control)              */
/* ========================================================================== */
function OrbitMap({ groups, active, locked, onSelect, onHover, reduced }) {
    const uid = useId().replace(/:/g, "");
    const n = groups.length;
    const current = groups[active];
    const target = current ? nodePos(active, n) : { x: CX, y: CY };

    return (
        <div
            className="relative mx-auto aspect-square w-full max-w-[520px] text-foreground"
            aria-hidden="true"
        >
            {/* radar sweep */}
            {!reduced && (
                <div
                    className="pointer-events-none absolute inset-[16%] rounded-full opacity-80 animate-[sk-spin_16s_linear_infinite]"
                    style={{
                        background:
                            "conic-gradient(from 0deg, transparent 0deg, transparent 240deg, color-mix(in srgb, var(--primary) 30%, transparent) 360deg)",
                        maskImage:
                            "radial-gradient(circle closest-side, transparent 30%, #000 31%)",
                        WebkitMaskImage:
                            "radial-gradient(circle closest-side, transparent 30%, #000 31%)",
                    }}
                />
            )}

            <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 h-full w-full"
                fill="none"
            >
                <defs>
                    <radialGradient id={`${uid}-core`}>
                        <stop offset="0" style={{ stopColor: "var(--primary)" }} stopOpacity="0.32" />
                        <stop offset="1" style={{ stopColor: "var(--primary)" }} stopOpacity="0" />
                    </radialGradient>
                    <filter id={`${uid}-glow`} x="-200%" y="-200%" width="500%" height="500%">
                        <feGaussianBlur stdDeviation="4" />
                    </filter>
                </defs>

                <circle cx={CX} cy={CY} r={150} fill={`url(#${uid}-core)`} />

                {/* orbit rings — currentColor, so they read in light and dark */}
                <circle cx={CX} cy={CY} r={96} stroke="currentColor" strokeOpacity="0.09" />
                <circle cx={CX} cy={CY} r={NODE_R} stroke="currentColor" strokeOpacity="0.12" />
                <motion.circle
                    cx={CX}
                    cy={CY}
                    r={250}
                    stroke="currentColor"
                    strokeOpacity="0.22"
                    strokeDasharray="2 9"
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                />
                <motion.g
                    animate={reduced ? undefined : { rotate: -360 }}
                    transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx={CX} cy={CY} r={143} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="1 7" />
                    <circle cx={CX + 143} cy={CY} r={3} fill="currentColor" fillOpacity="0.55" />
                    <circle cx={CX - 143} cy={CY} r={2.5} fill="currentColor" fillOpacity="0.4" />
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
                                strokeOpacity: on ? 0.9 : 0.22,
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
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-duration:3.5s] motion-reduce:animate-none" />
                <span className="absolute -inset-[14%] rounded-full border border-primary/20" />
                <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-primary/40 bg-linear-to-b from-card to-background shadow-[0_0_40px_-6px_color-mix(in_srgb,var(--primary)_50%,transparent)]">
                    <FiCode className="text-primary" size={24} />
                    <span className="mt-1 hidden text-[10px] font-medium text-muted-foreground sm:block">
                        Developer
                    </span>
                </div>
            </div>

            {/* domain nodes — mouse/touch shortcuts; keyboard users use the tabs */}
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
                            tabIndex={-1}
                            onClick={() => onSelect(i)}
                            onPointerEnter={() => !locked && onHover(i)}
                            whileHover={reduced ? undefined : { scale: 1.08 }}
                            whileTap={reduced ? undefined : { scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 320, damping: 20 }}
                            className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl"
                        >
                            <span
                                className="relative flex h-12 w-12 items-center justify-center rounded-full border bg-card transition-all duration-500 sm:h-14 sm:w-14"
                                style={{
                                    color: g.color,
                                    borderColor: on ? `${g.color}cc` : `${g.color}40`,
                                    background: on
                                        ? `radial-gradient(circle at 30% 25%, ${g.color}33, var(--card) 72%)`
                                        : undefined,
                                    boxShadow: on
                                        ? `0 0 0 4px ${g.color}1f, 0 0 34px ${g.color}66`
                                        : "none",
                                }}
                            >
                                <Icon size={20} />
                                <span
                                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-card px-1 font-code text-[9px] font-semibold text-background"
                                    style={{ backgroundColor: g.color }}
                                >
                                    {g.skills.length}
                                </span>
                            </span>
                            <span
                                className={`hidden rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-colors duration-300 sm:block ${on
                                    ? "border-primary/40 bg-primary/10 text-foreground"
                                    : "border-border/60 bg-card/60 text-muted-foreground group-hover:text-foreground"
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
/*  Domain tabs — keyboard accessible, sliding indicator, auto-tour progress  */
/* ========================================================================== */
function DomainTabs({ groups, active, uid, paused, autoTour, onSelect, onCycle, reduced }) {
    const listRef = useRef(null);
    const tabRefs = useRef([]);

    // keep the active tab centred when the row scrolls (mobile)
    useEffect(() => {
        const list = listRef.current;
        const el = tabRefs.current[active];
        if (!list || !el) return;
        list.scrollTo({
            left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2,
            behavior: reduced ? "auto" : "smooth",
        });
    }, [active, reduced]);

    const onKeyDown = (e, i) => {
        const n = groups.length;
        let next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = n - 1;
        if (next === null) return;
        e.preventDefault();
        onSelect(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <div
            ref={listRef}
            role="tablist"
            aria-label="Skill domains"
            className="scrollbar-hide relative flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border/70 bg-background/50 p-1 backdrop-blur-xl"
        >
            {groups.map((g, i) => {
                const on = i === active;
                return (
                    <button
                        key={g.name}
                        ref={(el) => (tabRefs.current[i] = el)}
                        id={`${uid}-tab-${i}`}
                        type="button"
                        role="tab"
                        aria-selected={on}
                        aria-controls={`${uid}-panel`}
                        tabIndex={on ? 0 : -1}
                        onClick={() => onSelect(i)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                        className={`relative shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition-colors duration-300 ${FOCUS} ${on ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {on && (
                            <motion.span
                                layoutId={`${uid}-tab-bg`}
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-inset ring-primary/30"
                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: g.color, boxShadow: on ? `0 0 10px ${g.color}` : "none" }}
                            />
                            {g.name}
                            <span className="font-code text-[10px] text-muted-foreground">{g.skills.length}</span>
                        </span>

                        {/* auto-tour timer: when it finishes, the tour moves on */}
                        {on && autoTour && !paused && (
                            <span
                                key={`${uid}-progress-${g.name}`}
                                aria-hidden="true"
                                onAnimationEnd={onCycle}
                                className="absolute inset-x-4 bottom-0.5 z-10 h-px origin-left rounded-full"
                                style={{
                                    backgroundColor: g.color,
                                    animation: `sk-progress ${TOUR_SECONDS}s linear forwards`,
                                }}
                            />
                        )}
                    </button>
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
            style={{ "--c": color }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-background/40 p-3.5 transition-[border-color,background-color,box-shadow] duration-300 hover:border-[color-mix(in_srgb,var(--c)_45%,transparent)] hover:bg-card hover:shadow-[0_14px_34px_-18px_var(--c)]"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-4 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(90deg, transparent, var(--c), transparent)" }}
            />

            <div className="flex items-center gap-3">
                <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-code text-xs font-semibold"
                    style={{
                        color,
                        borderColor: `${color}40`,
                        background: `linear-gradient(135deg, ${color}26, ${color}0d)`,
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
                    className="shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
            </div>

            {hasLevel && (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
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
                            background: `linear-gradient(135deg, ${group.color}26, ${group.color}0d)`,
                            boxShadow: `0 0 30px ${group.color}30`,
                        }}
                    >
                        <Icon size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">{group.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
                    </div>

                    <span
                        aria-label={`${group.skills.length} technologies`}
                        className="select-none text-5xl font-semibold leading-none tabular-nums"
                        style={{ color: `${group.color}55` }}
                    >
                        {String(group.skills.length).padStart(2, "0")}
                    </span>
                </div>

                <div
                    aria-hidden="true"
                    className="my-6 h-px"
                    style={{ background: `linear-gradient(90deg, ${group.color}66, transparent)` }}
                />

                <ul className="grid gap-2.5 sm:grid-cols-2">
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
function Stat({ icon: Icon, label, detail, children, className = "" }) {
    return (
        <div
            className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-card/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/80 ${className}`}
        >
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/60 text-primary transition-colors duration-300 group-hover:border-primary/40">
                    <Icon size={14} aria-hidden="true" />
                </span>
            </div>
            <p className="text-gradient mt-4 text-4xl font-semibold tabular-nums tracking-tight">{children}</p>
            <p className="mt-1.5 truncate text-xs text-muted-foreground">{detail}</p>
        </div>
    );
}

function MarqueeRow({ items, reverse = false, reduced }) {
    // Reduced motion: show everything, wrapped, with no looping animation
    if (reduced) {
        return (
            <div className="flex flex-wrap justify-center gap-3">
                {items.map((item) => (
                    <TechPill key={item.name} item={item} />
                ))}
            </div>
        );
    }

    const doubled = [...items, ...items];
    return (
        <div
            className="overflow-hidden py-1"
            style={{
                maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
        >
            <div className={`flex w-max ${reverse ? "sk-track-r" : "sk-track"}`}>
                {doubled.map((item, i) => (
                    <TechPill key={`${item.name}-${i}`} item={item} hidden={i >= items.length} className="mr-3" />
                ))}
            </div>
        </div>
    );
}

function TechPill({ item, hidden = false, className = "" }) {
    return (
        <span
            aria-hidden={hidden ? "true" : undefined}
            style={{ "--c": item.color }}
            className={`inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-[color-mix(in_srgb,var(--c)_50%,transparent)] hover:text-foreground hover:shadow-[0_8px_24px_-12px_var(--c)] ${className}`}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}90` }}
            />
            {item.name}
        </span>
    );
}

/* ========================================================================== */
/*  Section                                                                   */
/* ========================================================================== */
export default function SkillsNetwork({
    skills: providedSkills,
    groups = GROUPS,
    id = "skills",
    eyebrow = "Skills",
    title = "The technologies",
    highlight = "Behind my works.",
    description = "A connected ecosystem of tools and technologies I use to design, build, and deliver modern web applications.",
    focus = "MERN",
    focusDetail = "Modern web development",
    mindset = "Learn continuously. Build thoughtfully. Improve consistently.",
}) {
    const reduced = useReducedMotion();
    const uid = useId().replace(/:/g, "");

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
    const [lockedAt, setLockedAt] = useState(0); // timestamp of the last manual pick

    const locked = lockedAt > 0;
    const paused = hover || locked;
    const autoTour = !reduced && activeGroups.length > 1;

    // keep the index valid if the data changes
    const safeActive = Math.min(active, Math.max(0, activeGroups.length - 1));

    // After a manual pick the tour stays off, but resumes once the visitor goes idle
    useEffect(() => {
        if (!lockedAt) return;
        const t = setTimeout(() => setLockedAt(0), UNLOCK_AFTER_MS);
        return () => clearTimeout(t);
    }, [lockedAt]);

    const select = (i) => {
        setActive(i);
        setLockedAt(Date.now());
    };
    const cycle = () => setActive((a) => (a + 1) % Math.max(1, activeGroups.length));

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
    const ready = !isLoading && !isError;

    return (
        <section
            id={id}
            className="relative isolate overflow-hidden bg-background py-20 text-foreground sm:py-28 lg:py-32"
        >
            <style>{CSS}</style>



            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading — now actually uses the props (they were ignored before) */}
                <Reveal className="mb-12 max-w-3xl sm:mb-16">
                    <SectionHeader label={eyebrow} title={title} highlight={highlight}>
                        {description}
                    </SectionHeader>
                </Reveal>

                {/* API states */}
                {isLoading && <PanelSkeleton />}

                {isError && !isLoading && (
                    <div role="alert" className="rounded-3xl border border-destructive/30 bg-card/60 p-8 text-center backdrop-blur-xl">
                        <p className="text-sm text-foreground">Unable to load skills from the database.</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            {error?.data?.message || error?.error || "Please check your connection and try again."}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className={`mt-4 cursor-pointer rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 ${FOCUS}`}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {ready && !current && (
                    <div className="rounded-3xl border border-border/70 bg-card/50 p-10 text-center backdrop-blur-xl">
                        <p className="text-sm font-medium text-foreground">No skills published yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">Add skills in the dashboard and they will appear here.</p>
                    </div>
                )}

                {/* Interactive map + details */}
                {ready && current && (
                    <Reveal delay={0.05}>
                        <div
                            onPointerMove={onMove}
                            onPointerEnter={() => setHover(true)}
                            onPointerLeave={() => setHover(false)}
                            className="group/panel relative rounded-[32px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-lg)]"
                        >
                            <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-card/85 p-4 backdrop-blur-2xl sm:p-6 lg:p-8">
                                {/* active-domain tint */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.14] blur-[90px] transition-colors duration-700"
                                    style={{ backgroundColor: current.color }}
                                />
                                {/* cursor spotlight */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/panel:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
                                    }}
                                />
                                {/* top highlight */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent"
                                />

                                {/* top bar */}
                                <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">System overview</p>
                                            <p className="mt-0.5 text-sm font-medium text-foreground">Developer technology map</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                                            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </span>
                                        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                                            {isFetching ? "Syncing…" : `${activeGroups.length} domains`}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative mb-8">
                                    <DomainTabs
                                        groups={activeGroups}
                                        active={safeActive}
                                        uid={uid}
                                        paused={paused}
                                        autoTour={autoTour}
                                        onSelect={select}
                                        onCycle={cycle}
                                        reduced={reduced}
                                    />
                                </div>

                                <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
                                    <div>
                                        <OrbitMap
                                            groups={activeGroups}
                                            active={safeActive}
                                            locked={locked}
                                            onSelect={select}
                                            onHover={setActive}
                                            reduced={reduced}
                                        />
                                        <p className="mt-4 text-center text-xs text-muted-foreground/80">
                                            Hover or tap a domain to explore
                                        </p>
                                    </div>

                                    <div
                                        role="tabpanel"
                                        id={`${uid}-panel`}
                                        aria-labelledby={`${uid}-tab-${safeActive}`}
                                        className="min-w-0 lg:min-h-[26rem]"
                                    >
                                        <DetailPanel group={current} reduced={reduced} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                )}

                {/* Stats — bento */}
                {ready && current && (
                    <Reveal delay={0.05} className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Stat icon={FiBox} label="Total skills" detail="Across my technology stack">
                            <Counter value={skills.length} />
                        </Stat>
                        <Stat icon={FiLayers} label="Skill domains" detail="Areas of development">
                            <Counter value={activeGroups.length} />
                        </Stat>
                        <Stat icon={FiZap} label="Core focus" detail={focusDetail}>
                            {focus}
                        </Stat>
                        <div className="col-span-2 flex flex-col justify-center rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-card/50 to-card/50 p-5 backdrop-blur-xl lg:col-span-1">
                            <div className="flex items-center gap-2">
                                <FiCode className="text-primary" size={15} aria-hidden="true" />
                                <span className="text-xs font-medium text-foreground/80">Development mindset</span>
                            </div>
                            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{mindset}</p>
                        </div>
                    </Reveal>
                )}

                {/* Marquee */}
                {ready && marqueeItems.length > 0 && (
                    <Reveal delay={0.05} className="mt-14 sm:mt-20">
                        <div className="sk-marquee space-y-3" role="group" aria-label="All technologies">
                            <MarqueeRow items={rowA.length ? rowA : marqueeItems} reduced={reduced} />
                            {rowB.length > 0 && <MarqueeRow items={rowB} reverse reduced={reduced} />}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}