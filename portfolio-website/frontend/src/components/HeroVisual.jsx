import { useEffect, useId, useMemo, useState } from "react";
import {
    FiBell,
    FiCheck,
    FiDatabase,
    FiGitBranch,
    FiLoader,
    FiLock,
    FiMonitor,
    FiServer,
} from "react-icons/fi";
import {
    AnimatePresence,
    animate,
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";
import aboutImage from "../assets/about.png";

/* ========================================================================== */
/*  Content — every number here is a PLACEHOLDER. Put your real figures in.   */
/* ========================================================================== */
const DEV = {
    name: "Shohag",
    role: "Full-stack engineer",
    avatar: aboutImage,
    domain: "shohag.dev",
    version: "v2.4.0",
};

const KPIS = [
    { label: "Performance", value: 100, decimals: 0, suffix: "", delta: "+4", spark: [40, 52, 48, 70, 66, 88, 100] },
    { label: "Uptime", value: 99.99, decimals: 2, suffix: "%", delta: "30d", spark: [96, 98, 97, 99, 99, 100, 100] },
    { label: "Latency p95", value: 42, decimals: 0, suffix: "ms", delta: "-8ms", spark: [80, 72, 74, 60, 55, 48, 42] },
];

// values are 0–100 (chart height); `scale` turns them into request counts
const SERIES = {
    "7D": {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [32, 48, 41, 64, 58, 79, 92],
        scale: 140,
        delta: "+18%",
    },
    "30D": {
        labels: ["1", "5", "10", "15", "20", "25", "30"],
        values: [40, 52, 47, 66, 60, 78, 88],
        scale: 320,
        delta: "+27%",
    },
};

const PIPELINE = [
    { icon: FiMonitor, label: "Client", ms: "12ms" },
    { icon: FiServer, label: "API", ms: "24ms" },
    { icon: FiDatabase, label: "Database", ms: "6ms" },
];

const DEPLOY_STEPS = ["Building", "Running tests", "Deploying", "Live"];

const NOTIFICATIONS = [
    { name: "Aisha K.", text: "requested a project quote", tag: "New inquiry" },
    { name: "Daniel R.", text: "left a 5-star testimonial", tag: "Testimonial" },
    { name: "Maya L.", text: "starred your repository", tag: "GitHub" },
];

const STACK = [
    { name: "React", color: "#61dafb" },
    { name: "Node.js", color: "#84cc16" },
    { name: "PostgreSQL", color: "#818cf8" },
];

const EASE = [0.22, 1, 0.36, 1];

/* Animated gradient rim (falls back to a static one where @property is unsupported) */
const CSS = `
@property --hv-ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes hv-spin { to { --hv-ang: 360deg; } }
.hv-rim {
  padding: 1px;
  background: conic-gradient(from var(--hv-ang),
    var(--primary), transparent 22%, transparent 52%,
    #60a5fa, transparent 80%, var(--primary));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: hv-spin 9s linear infinite;
}
@media (prefers-reduced-motion: reduce) { .hv-rim { animation: none; } }
`;

/* ========================================================================== */
/*  Small building blocks                                                     */
/* ========================================================================== */
function Counter({ value, decimals = 0, delay = 0.9, reduced }) {
    const [v, setV] = useState(reduced ? value : 0);

    useEffect(() => {
        if (reduced) {
            setV(value);
            return;
        }
        const c = animate(0, value, { duration: 1.6, delay, ease: EASE, onUpdate: setV });
        return () => c.stop();
    }, [value, delay, reduced]);

    return <>{v.toFixed(decimals)}</>;
}

function Spark({ values, delay = 1, reduced }) {
    const W = 64;
    const H = 22;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const d = values
        .map((v, i) => {
            const x = (i / (values.length - 1)) * W;
            const y = H - 3 - ((v - min) / (max - min || 1)) * (H - 6);
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="h-5 w-14 text-primary" fill="none" aria-hidden="true">
            <motion.path
                d={d}
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay, ease: EASE }}
            />
        </svg>
    );
}

function KpiTile({ kpi, i, reduced }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.7 + i * 0.08 } },
            }}
            className="rounded-xl border border-border/60 bg-background/40 p-2.5 sm:p-3"
        >
            <p className="truncate font-code text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {kpi.label}
            </p>
            <p className="mt-1.5 flex items-baseline gap-0.5 text-xl font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-2xl">
                <Counter value={kpi.value} decimals={kpi.decimals} delay={0.9 + i * 0.1} reduced={reduced} />
                <span className="text-xs font-medium text-muted-foreground">{kpi.suffix}</span>
            </p>
            <div className="mt-2 flex items-end justify-between gap-1">
                <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-code text-[9px] text-emerald-600 dark:text-emerald-400">
                    {kpi.delta}
                </span>
                <Spark values={kpi.spark} delay={1 + i * 0.1} reduced={reduced} />
            </div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Interactive area chart                                                    */
/* ========================================================================== */
const CW = 300;
const CH = 110;

function buildChart(values) {
    const n = values.length;
    const pts = values.map((v, i) => [(i / (n - 1)) * CW, CH - 8 - (v / 100) * (CH - 24)]);

    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return { pts, line: d, area: `${d} L${CW},${CH} L0,${CH} Z` };
}

const fmtK = (n) => `${(n / 1000).toFixed(1)}k`;

function ChartCard({ reduced }) {
    const uid = useId().replace(/:/g, "");
    const [range, setRange] = useState("7D");
    const [hover, setHover] = useState(null);

    const series = SERIES[range];
    const chart = useMemo(() => buildChart(series.values), [series]);
    const total = series.values.reduce((a, b) => a + b, 0) * series.scale;
    const last = chart.pts[chart.pts.length - 1];

    const onMove = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        setHover(Math.round(ratio * (series.values.length - 1)));
    };

    const hp = hover !== null ? chart.pts[hover] : null;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.95 } },
            }}
            className="rounded-xl border border-border/60 bg-background/40 p-3 sm:p-3.5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-code text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Requests</p>
                    <p className="mt-1 flex items-center gap-2">
                        <span className="text-xl font-semibold leading-none tracking-tight tabular-nums text-foreground sm:text-2xl">
                            {fmtK(total)}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-code text-[9px] text-emerald-600 dark:text-emerald-400">
                            {series.delta}
                        </span>
                    </p>
                </div>

                <div role="group" aria-label="Chart range" className="flex shrink-0 rounded-xl border border-border/60 bg-background/50 p-0.5">
                    {Object.keys(SERIES).map((k) => (
                        <button
                            key={k}
                            type="button"
                            aria-pressed={range === k}
                            onClick={() => {
                                setRange(k);
                                setHover(null);
                            }}
                            className={`rounded-md px-2 py-1 font-code text-[9px] transition-colors duration-300 ${range === k
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative mt-3" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
                <svg viewBox={`0 0 ${CW} ${CH}`} className="block h-auto w-full overflow-visible" fill="none" aria-hidden="true">
                    <defs>
                        <linearGradient id={`${uid}-area`} x1="0" y1="0" x2="0" y2="1" className="text-primary">
                            <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
                            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <g className="text-border" stroke="currentColor" strokeDasharray="2 5">
                        {[0.25, 0.5, 0.75].map((f) => (
                            <line key={f} x1="0" x2={CW} y1={CH * f} y2={CH * f} />
                        ))}
                    </g>

                    <g key={range}>
                        <motion.path
                            d={chart.area}
                            fill={`url(#${uid}-area)`}
                            initial={reduced ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.9, delay: 0.5 }}
                        />
                        <motion.path
                            d={chart.line}
                            className="text-primary"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            initial={reduced ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.3, ease: EASE, delay: 0.1 }}
                        />
                    </g>

                    {/* live dot on the latest value */}
                    <g className="text-primary">
                        <circle cx={last[0]} cy={last[1]} r={3.5} fill="currentColor" />
                        {!reduced && (
                            <motion.circle
                                cx={last[0]}
                                cy={last[1]}
                                r={3.5}
                                fill="none"
                                stroke="currentColor"
                                initial={{ scale: 1, opacity: 0.7 }}
                                animate={{ scale: 3, opacity: 0 }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </g>

                    {/* scrub marker */}
                    {hp && (
                        <g className="text-primary">
                            <line x1={hp[0]} x2={hp[0]} y1="0" y2={CH} stroke="currentColor" strokeOpacity="0.4" strokeDasharray="3 3" />
                            <circle cx={hp[0]} cy={hp[1]} r={4.5} fill="currentColor" className="text-primary" />
                            <circle cx={hp[0]} cy={hp[1]} r={8} fill="currentColor" fillOpacity="0.2" />
                        </g>
                    )}
                </svg>

                <AnimatePresence>
                    {hp && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-xl border border-border/70 bg-card px-2.5 py-1.5 shadow-lg"
                            style={{ left: `${(hp[0] / CW) * 100}%`, top: `${(hp[1] / CH) * 100}%` }}
                        >
                            <p className="font-code text-[9px] text-muted-foreground">{series.labels[hover]}</p>
                            <p className="text-xs font-semibold tabular-nums text-foreground">
                                {fmtK(series.values[hover] * series.scale)} requests
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-2 flex justify-between font-code text-[9px] text-muted-foreground/80">
                {series.labels.map((l) => (
                    <span key={l}>{l}</span>
                ))}
            </div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Request pipeline: client → API → database                                 */
/* ========================================================================== */
function Pipeline({ reduced }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setStep((s) => (s + 1) % PIPELINE.length), 1300);
        return () => clearInterval(id);
    }, [reduced]);

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 1.1 } },
            }}
            className="rounded-xl border border-border/60 bg-background/40 px-3 py-3"
        >
            <div className="flex items-center">
                {PIPELINE.map((node, i) => {
                    const Icon = node.icon;
                    const on = !reduced && step === i;
                    return (
                        <div key={node.label} className="flex flex-1 items-center last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <span
                                    className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-500 ${on
                                        ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_24px_-4px_var(--primary)]"
                                        : "border-border/70 bg-background/60 text-muted-foreground"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-card bg-emerald-400" />
                                </span>
                                <span className="font-code text-[9px] leading-none text-muted-foreground">{node.label}</span>
                                <span className="font-code text-[9px] leading-none text-foreground/80">{node.ms}</span>
                            </div>

                            {i < PIPELINE.length - 1 && (
                                <span className="relative mx-2 mb-8 h-px flex-1 bg-border">
                                    {!reduced && (
                                        <motion.span
                                            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
                                            initial={{ left: "0%", opacity: 0 }}
                                            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                                            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.65 }}
                                        />
                                    )}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Floating cards                                                            */
/* ========================================================================== */
const FLOAT_CARD =
    "rounded-2xl border border-border/60 bg-card/85 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl";

function DeployCard({ reduced }) {
    const [d, setD] = useState(reduced ? DEPLOY_STEPS.length - 1 : 0);

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setD((s) => (s + 1) % DEPLOY_STEPS.length), 2200);
        return () => clearInterval(id);
    }, [reduced]);

    const live = d === DEPLOY_STEPS.length - 1;
    const progress = ((d + 1) / DEPLOY_STEPS.length) * 100;

    return (
        <div className={`w-56 p-3 ${FLOAT_CARD}`}>
            <div className="flex items-center gap-2.5">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${live ? "bg-emerald-500/15 text-emerald-500" : "bg-primary/15 text-primary"
                        }`}
                >
                    {live ? <FiCheck size={15} /> : <FiLoader size={15} className="animate-spin motion-reduce:animate-none" />}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
                        {live ? "Deployed to production" : `${DEPLOY_STEPS[d]}…`}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 font-code text-[10px] text-muted-foreground">
                        <FiGitBranch size={10} aria-hidden="true" />
                        main · {DEV.version}
                    </p>
                </div>
            </div>

            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border/60">
                <motion.div
                    className={`h-full rounded-full ${live ? "bg-emerald-500" : "bg-primary"}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                />
            </div>
        </div>
    );
}

function NotificationCard({ reduced }) {
    const [i, setI] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const id = setInterval(() => setI((s) => (s + 1) % NOTIFICATIONS.length), 4200);
        return () => clearInterval(id);
    }, [reduced]);

    const n = NOTIFICATIONS[i];

    return (
        <div className={`w-60 overflow-hidden p-3 ${FLOAT_CARD}`}>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={n.name}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex items-center gap-2.5"
                >
                    <span className="relative shrink-0">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-xs font-semibold text-white">
                            {n.name.charAt(0)}
                        </span>
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                            <FiBell size={8} />
                        </span>
                    </span>
                    <div className="min-w-0">
                        <p className="font-code text-[9px] uppercase tracking-[0.12em] text-primary">{n.tag}</p>
                        <p className="truncate text-[12px] leading-snug text-foreground">
                            <span className="font-semibold">{n.name}</span> {n.text}
                        </p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function StackCard() {
    return (
        <div className={`flex items-center gap-3 px-3.5 py-2.5 ${FLOAT_CARD}`}>
            <span className="font-code text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Stack</span>
            <span className="h-3 w-px bg-border" />
            <ul className="flex items-center gap-3">
                {STACK.map((s) => (
                    <li key={s.name} className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                        {s.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* A floating layer: cursor parallax outside, gentle bob inside */
function Floater({ nx, ny, depth = 20, float = 8, duration = 6, enter = 1.2, reduced, className = "", children }) {
    const x = useTransform(nx, [-0.5, 0.5], [-depth, depth]);
    const y = useTransform(ny, [-0.5, 0.5], [-depth * 0.75, depth * 0.75]);

    return (
        <motion.div style={reduced ? undefined : { x, y }} className={`absolute z-20 ${className}`}>
            <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1, y: [0, -float, 0] }}
                transition={{
                    opacity: { delay: enter, duration: 0.8, ease: EASE },
                    scale: { delay: enter, duration: 0.8, ease: EASE },
                    y: { delay: enter, duration, repeat: Infinity, ease: "easeInOut" },
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Hero visual                                                               */
/* ========================================================================== */
export default function HeroVisual({ className = "" }) {
    const reduced = useReducedMotion();

    /* cursor, normalised to -0.5 … 0.5 across the viewport */
    const nxRaw = useMotionValue(0);
    const nyRaw = useMotionValue(0);
    const nx = useSpring(nxRaw, { stiffness: 110, damping: 20, mass: 0.6 });
    const ny = useSpring(nyRaw, { stiffness: 110, damping: 20, mass: 0.6 });

    // resting tilt of about (-8°, 4°), leaning toward the cursor
    const rotateY = useTransform(nx, [-0.5, 0.5], [-14, -2]);
    const rotateX = useTransform(ny, [-0.5, 0.5], [9, -1]);

    // soft light that slides across the glass
    const sx = useTransform(nx, [-0.5, 0.5], [15, 85]);
    const sy = useTransform(ny, [-0.5, 0.5], [10, 90]);
    const sheen = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.14), transparent 55%)`;

    useEffect(() => {
        if (reduced) return;
        const onMove = (e) => {
            if (e.pointerType !== "mouse") return;
            nxRaw.set(e.clientX / window.innerWidth - 0.5);
            nyRaw.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [reduced, nxRaw, nyRaw]);

    return (
        <motion.div
            role="img"
            aria-label="A live portfolio dashboard showing performance, uptime, traffic and deployments"
            initial={reduced ? false : "hidden"}
            animate="show"
            variants={{ hidden: {}, show: {} }}
            style={{ perspective: 1400 }}
            className={`relative mx-auto w-full max-w-[560px] px-1 py-12 sm:px-6 ${className}`}
        >
            <style>{CSS}</style>

            {/* ambient light behind the whole composition */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-x-6 inset-y-14 rounded-full bg-primary/25 blur-3xl" />
                <div className="absolute -right-6 top-6 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute -bottom-2 left-4 h-36 w-36 rounded-full bg-fuchsia-500/15 blur-3xl" />
            </div>

            {/* main dashboard window */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE, delay: 0.2 } },
                }}
                style={{ rotateX: reduced ? 4 : rotateX, rotateY: reduced ? -8 : rotateY }}
            >
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-[0_50px_90px_-35px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div aria-hidden="true" className="hv-rim pointer-events-none absolute inset-0 rounded-[inherit]" />
                    {!reduced && (
                        <motion.div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-[inherit]"
                            style={{ background: sheen }}
                        />
                    )}

                    {/* title bar */}
                    <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                        </div>

                        <div className="mx-auto flex h-6 min-w-0 max-w-[15rem] flex-1 items-center justify-center gap-1.5 rounded-md bg-background/60 px-3 font-code text-[10px] text-muted-foreground">
                            <FiLock size={10} aria-hidden="true" className="shrink-0 text-emerald-500" />
                            <span className="truncate">{DEV.domain}/dashboard</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="relative">
                                <img src={DEV.avatar} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-border" />
                                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-card bg-emerald-400" />
                            </span>
                            <span className="hidden font-code text-[10px] text-muted-foreground sm:block">{DEV.name}</span>
                        </div>
                    </div>

                    {/* body */}
                    <div className="relative space-y-2.5 p-3 sm:space-y-3 sm:p-4">
                        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                            {KPIS.map((kpi, i) => (
                                <KpiTile key={kpi.label} kpi={kpi} i={i} reduced={reduced} />
                            ))}
                        </div>

                        <ChartCard reduced={reduced} />
                        <Pipeline reduced={reduced} />
                    </div>
                </div>
            </motion.div>

            {/* floating cards (sm and up) */}
            <div className="hidden sm:block">
                <Floater nx={nx} ny={ny} reduced={reduced} depth={26} float={8} duration={6.5} enter={1.5} className="-right-1 top-0 lg:right-0">
                    <DeployCard reduced={reduced} />
                </Floater>

                <Floater nx={nx} ny={ny} reduced={reduced} depth={34} float={10} duration={7.5} enter={1.8} className="bottom-2 left-0">
                    <NotificationCard reduced={reduced} />
                </Floater>

                <Floater nx={nx} ny={ny} reduced={reduced} depth={16} float={6} duration={5.5} enter={2.1} className="-bottom-1 right-3">
                    <StackCard />
                </Floater>
            </div>
        </motion.div>
    );
}