import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useData } from "../context/DataContext.jsx";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  BookOpen,
  Check,
  ChartNoAxesCombined,
  CircleDot,
  Cpu,
  FolderGit2,
  Inbox,
  ListChecks,
  Mail,
  MessageSquareQuote,
  Plus,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import { useGetAllProjectsQuery } from "@/redux/features/projectApi.js";
import { useGetAllServicesQuery } from "@/redux/features/serviceApi.js";
import { useGetActiveSkillsQuery } from "@/redux/features/skillApi.js";
import { useGetAllBlogsQuery } from "@/redux/features/blogsApi.js";
import { useGetAllTestimonialsQuery } from "@/redux/features/testimonialsApi.js";

/* ========================================================================== */
/*  Helpers                                                                   */
/* ========================================================================== */
const cn = (...classes) => classes.filter(Boolean).join(" ");
const extractArray = (...candidates) => candidates.find(Array.isArray) ?? [];
const getId = (item) => item?._id ?? item?.id;
const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* One tone map used by cards, actions and the chart legend */
const TONES = {
  violet: {
    icon: "bg-violet-500/10 text-violet-600 ring-violet-500/15 dark:text-violet-400",
    soft: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/15",
    bar: "bg-violet-500",
    dot: "bg-violet-500",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 ring-blue-500/15 dark:text-blue-400",
    soft: "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/15",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400",
    soft: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/15",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 ring-amber-500/15 dark:text-amber-400",
    soft: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/15",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 ring-rose-500/15 dark:text-rose-400",
    soft: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/15",
    bar: "bg-rose-500",
    dot: "bg-rose-500",
  },
  indigo: {
    icon: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/15 dark:text-indigo-400",
    soft: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/15",
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
  },
};

/* ========================================================================== */
/*  Motion + surfaces                                                         */
/* ========================================================================== */
function Reveal({ children, delay = 0, className }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Card surface with an optional cursor spotlight. Pass as={Link} + to=... to make it a link. */
const SURFACE_VARIANTS = {
  card: "rounded-2xl border border-zinc-200/80 bg-white/85 shadow-sm shadow-zinc-950/[0.03] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#111113]/85 dark:shadow-black/20",
  tile: "rounded-xl border border-zinc-200/80 bg-zinc-50/60 dark:border-white/[0.07] dark:bg-white/[0.02]",
};

function Surface({ as: Tag = "div", variant = "card", spotlight = true, className, children, ...props }) {
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      onPointerMove={spotlight ? onMove : undefined}
      className={cn(
        "group/surface relative min-w-0 overflow-hidden",
        SURFACE_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {spotlight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/surface:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.10), transparent 70%)",
          }}
        />
      )}
      {children}
    </Tag>
  );
}

function Panel({ children, className }) {
  return (
    <Surface spotlight={false} className={className}>
      {children}
    </Surface>
  );
}

function AnimatedNumber({ value }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const previous = useRef(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduced]);

  return <>{display}</>;
}

/* ========================================================================== */
/*  Shared bits                                                               */
/* ========================================================================== */
function SectionHeading({ eyebrow, title, description, to, linkLabel = "View all" }) {
  return (
    <div className="relative flex items-start justify-between gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-white/[0.07] sm:px-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
            {eyebrow}
          </p>
        )}
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>

      {to && (
        <Link
          to={to}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white",
            FOCUS,
          )}
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function PanelFooter({ to, children }) {
  return (
    <div className="relative border-t border-zinc-100 px-5 py-3 dark:border-white/[0.06] sm:px-6">
      <Link
        to={to}
        className={cn(
          "inline-flex items-center gap-1.5 rounded text-xs font-medium text-zinc-500 transition-colors hover:text-violet-600 dark:hover:text-violet-400",
          FOCUS,
        )}
      >
        {children}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function ListSkeleton({ rows = 3 }) {
  return (
    <div className="relative divide-y divide-zinc-100 dark:divide-white/[0.05]" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3 px-5 py-4 sm:px-6">
          <div className="h-11 w-14 rounded-xl bg-zinc-100 dark:bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/3 rounded bg-zinc-100 dark:bg-white/[0.06]" />
            <div className="h-2.5 w-1/3 rounded bg-zinc-100 dark:bg-white/[0.05]" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, to, actionLabel }) {
  return (
    <div className="relative flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-500">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {to && actionLabel && (
        <Link
          to={to}
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300",
            FOCUS,
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Draft" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium",
        active
          ? "border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-700 dark:text-emerald-400"
          : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-emerald-500" : "bg-zinc-400")} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

/* ========================================================================== */
/*  Metric card                                                               */
/* ========================================================================== */
function MetricCard({ title, value, description, icon: Icon, to, loading, tone }) {
  const t = TONES[tone] ?? TONES.violet;

  return (
    <Surface
      as={Link}
      to={to}
      className={cn(
        "block p-4 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-950/[0.05] dark:hover:border-white/[0.16] sm:p-5",
        FOCUS,
      )}
    >
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset", t.icon)}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover/surface:-translate-y-0.5 group-hover/surface:translate-x-0.5 group-hover/surface:text-zinc-700 dark:text-zinc-600 dark:group-hover/surface:text-zinc-300" />
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="h-8 w-14 animate-pulse rounded-md bg-zinc-100 dark:bg-white/[0.07]" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              <AnimatedNumber value={value} />
            </p>
          )}
          <p className="mt-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">{title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
            {loading ? "Fetching latest data..." : description}
          </p>
        </div>
      </div>
    </Surface>
  );
}

/* ========================================================================== */
/*  Setup progress: ring + checklist                                          */
/* ========================================================================== */
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

function ProgressRing({ percent, loading }) {
  const reduced = useReducedMotion();
  const offset = RING_C * (1 - percent / 100);

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={RING_R} fill="none" strokeWidth="7" className="stroke-zinc-200 dark:stroke-white/[0.08]" />
        <defs>
          <linearGradient id="dash-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r={RING_R}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          stroke="url(#dash-ring)"
          strokeDasharray={RING_C}
          initial={{ strokeDashoffset: reduced ? offset : RING_C }}
          animate={{ strokeDashoffset: loading ? RING_C : offset }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-white">
          {loading ? "—" : <><AnimatedNumber value={percent} />%</>}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400">Setup</span>
      </div>
    </div>
  );
}

function StepsPanel({ steps, loading }) {
  const done = steps.filter((s) => s.done).length;

  return (
    <Panel className="h-full">
      <SectionHeading
        eyebrow="Getting there"
        title="Portfolio checklist"
        description={loading ? "Checking your workspace..." : `${done} of ${steps.length} steps complete`}
      />
      <ul className="relative divide-y divide-zinc-100 dark:divide-white/[0.05]">
        {steps.map((step) => (
          <li key={step.label}>
            <Link
              to={step.to}
              className={cn(
                "group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-zinc-50/80 dark:hover:bg-white/[0.025] sm:px-6",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  step.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-zinc-300 text-transparent dark:border-white/20",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-xs font-medium",
                  step.done ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200",
                )}
              >
                {step.label}
              </span>
              {!step.done && (
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ========================================================================== */
/*  Content activity chart — items created per month, stacked by type         */
/* ========================================================================== */
function buildActivity(sources) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
      long: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      total: 0,
      by: Object.fromEntries(sources.map((s) => [s.label, 0])),
    };
  });
  const index = Object.fromEntries(months.map((m) => [m.key, m]));

  for (const source of sources) {
    for (const item of source.items) {
      const raw = item?.createdAt ?? item?.created_at ?? item?.date;
      if (!raw) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      const m = index[`${d.getFullYear()}-${d.getMonth()}`];
      if (!m) continue;
      m.by[source.label] += 1;
      m.total += 1;
    }
  }
  return months;
}

function ActivityChart({ sources, loading }) {
  const reduced = useReducedMotion();
  const months = useMemo(() => buildActivity(sources), [sources]);
  const max = Math.max(1, ...months.map((m) => m.total));
  const total = months.reduce((sum, m) => sum + m.total, 0);

  return (
    <Panel className="h-full">
      <SectionHeading
        eyebrow="Last 6 months"
        title="Content activity"
        description={
          loading
            ? "Gathering activity..."
            : total
              ? `${total} ${total === 1 ? "item" : "items"} added across your workspace.`
              : "New projects, articles and messages will appear here."
        }
      />

      <div className="relative px-5 pb-5 pt-6 sm:px-6">
        {total === 0 && !loading ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="Add content with a creation date and your timeline will fill in."
          />
        ) : (
          <>
            <div className="flex h-44 items-end gap-2 sm:gap-4">
              {months.map((m, i) => (
                <div
                  key={m.key}
                  tabIndex={0}
                  aria-label={`${m.long}: ${m.total} ${m.total === 1 ? "item" : "items"}`}
                  className={cn("group/bar relative flex h-full flex-1 flex-col justify-end rounded-xl", FOCUS)}
                >
                  {/* tooltip */}
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute -top-1 left-1/2 z-10 w-32 -translate-x-1/2 -translate-y-full rounded-xl border border-zinc-200 bg-white p-2.5 text-[11px] opacity-0 shadow-lg transition-opacity duration-150 group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100 dark:border-white/10 dark:bg-[#18181b]"
                  >
                    <p className="font-semibold text-zinc-900 dark:text-white">{m.long}</p>
                    <ul className="mt-1.5 space-y-1">
                      {sources.map((s) => (
                        <li key={s.label} className="flex items-center justify-between gap-2 text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <span className={cn("h-1.5 w-1.5 rounded-full", TONES[s.tone].dot)} />
                            {s.label}
                          </span>
                          <span className="tabular-nums text-zinc-800 dark:text-zinc-200">{m.by[s.label]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex w-full flex-col-reverse justify-start gap-px overflow-hidden rounded-md bg-zinc-100/70 dark:bg-white/[0.04]" style={{ height: "100%" }}>
                    {/* empty track keeps every column the same width/height */}
                    <div className="flex flex-1 flex-col-reverse justify-start gap-px">
                      {sources.map((s) =>
                        m.by[s.label] ? (
                          <motion.div
                            key={s.label}
                            initial={reduced ? false : { height: 0 }}
                            whileInView={{ height: `${(m.by[s.label] / max) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.07 }}
                            className={cn("w-full shrink-0", TONES[s.tone].bar)}
                            style={reduced ? { height: `${(m.by[s.label] / max) * 100}%` } : undefined}
                          />
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2 sm:gap-4">
              {months.map((m) => (
                <span key={m.key} className="flex-1 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  {m.label}
                </span>
              ))}
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-100 pt-4 dark:border-white/[0.06]">
              {sources.map((s) => (
                <li key={s.label} className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span className={cn("h-2 w-2 rounded-sm", TONES[s.tone].dot)} />
                  {s.label}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Panel>
  );
}

/* ========================================================================== */
/*  Lists                                                                     */
/* ========================================================================== */
const rowLink =
  "group block px-5 py-4 transition-colors hover:bg-zinc-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 dark:hover:bg-white/[0.025] sm:px-6";

function ProjectList({ projects, loading }) {
  if (loading) return <ListSkeleton />;

  if (!projects.length) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No projects yet"
        description="Your projects will appear here when you add them."
        to="/projects"
        actionLabel="Add a project"
      />
    );
  }

  return (
    <div className="relative divide-y divide-zinc-100 dark:divide-white/[0.05]">
      {projects.slice(0, 4).map((project, index) => (
        <Link
          key={getId(project) ?? project.slug ?? project.title ?? index}
          to="/projects"
          className={cn(rowLink, "flex min-w-0 items-center gap-3 py-3.5")}
        >
          <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.03]">
            {project.image ? (
              <img
                src={project.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <FolderGit2 className="h-5 w-5 text-zinc-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {project.title || "Untitled project"}
            </p>
            <p className="mt-1 truncate text-[11px] text-zinc-500">
              {Array.isArray(project.stacks) && project.stacks.length
                ? project.stacks.join(" · ")
                : "No stack specified"}
            </p>
          </div>

          <StatusBadge active={Boolean(project.isActive)} />
          <ArrowUpRight className="hidden h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
        </Link>
      ))}
    </div>
  );
}

function BlogList({ blogs, loading, error }) {
  if (loading) return <ListSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Articles unavailable"
        description="We couldn't load articles. Please try again later."
        to="/blogs"
        actionLabel="Open articles"
      />
    );
  }

  if (!blogs.length) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No articles yet"
        description="Your blog posts will appear here when you create them."
        to="/blogs"
        actionLabel="Create an article"
      />
    );
  }

  return (
    <div className="relative divide-y divide-zinc-100 dark:divide-white/[0.05]">
      {blogs.slice(0, 4).map((blog, index) => (
        <Link key={getId(blog) ?? blog.slug ?? blog.title ?? index} to="/blogs" className={rowLink}>
          <div className="flex items-center justify-between gap-3">
            <span className="max-w-[65%] truncate rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400">
              {blog.category || "Uncategorized"}
            </span>
            {blog.readTime && <span className="shrink-0 text-[10px] text-zinc-400">{blog.readTime}</span>}
          </div>

          <h3 className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-zinc-800 transition-colors group-hover:text-violet-700 dark:text-zinc-200 dark:group-hover:text-violet-300">
            {blog.title || "Untitled article"}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <StatusBadge active={Boolean(blog.isActive)} activeLabel="Published" inactiveLabel="Draft" />
            {blog.isFeatured && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function MessageList({ messages }) {
  if (!messages.length) {
    return (
      <EmptyState
        icon={Inbox}
        title="Your inbox is clear"
        description="New client inquiries will show up here."
        to="/contact"
        actionLabel="Open inbox"
      />
    );
  }

  return (
    <div className="relative divide-y divide-zinc-100 dark:divide-white/[0.05]">
      {messages.slice(0, 4).map((message, index) => {
        const unread = message.status === "unread";
        return (
          <Link
            key={getId(message) ?? `${message.email ?? message.name ?? "message"}-${index}`}
            to="/contact"
            className={rowLink}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 text-xs font-semibold text-zinc-600 dark:border-white/[0.08] dark:from-white/[0.06] dark:to-white/[0.02] dark:text-zinc-300">
                {(message.name || "U").trim().charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {message.name || "Unknown sender"}
                  </p>
                  {unread && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-violet-500 ring-4 ring-violet-500/10" />
                  )}
                </div>
                <p className="mt-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {message.subject || "No subject"}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {message.message || "No message content"}
                </p>
                {unread && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-violet-600 dark:text-violet-400">
                    <CircleDot className="h-3 w-3" />
                    Unread
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ========================================================================== */
/*  Page                                                                      */
/* ========================================================================== */
export function DashboardOverview() {
  const reduced = useReducedMotion();
  const dataContext = useData() ?? {};

  const profile = dataContext.profile ?? {};
  const messages = useMemo(
    () => (Array.isArray(dataContext.messages) ? dataContext.messages : []),
    [dataContext.messages],
  );

  const { data: projectsData, isLoading: isLoadingProjects, isError: isProjectsError } = useGetAllProjectsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: skillsData, isLoading: isLoadingSkills } = useGetActiveSkillsQuery();
  const { data: blogsData, isLoading: isLoadingBlogs, isError: isBlogsError } = useGetAllBlogsQuery();
  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useGetAllTestimonialsQuery();

  const projects = useMemo(
    () => extractArray(projectsData?.data?.projects, projectsData?.data, projectsData?.projects, projectsData),
    [projectsData],
  );
  const services = useMemo(
    () => extractArray(servicesData?.data?.services, servicesData?.data, servicesData?.services, servicesData),
    [servicesData],
  );
  const skills = useMemo(
    () => extractArray(skillsData?.data?.skills, skillsData?.data, skillsData?.skills, skillsData),
    [skillsData],
  );
  const blogs = useMemo(
    () => extractArray(blogsData?.data?.blogs, blogsData?.data, blogsData?.blogs, blogsData),
    [blogsData],
  );
  const testimonials = useMemo(
    () =>
      extractArray(
        testimonialsData?.data?.testimonials,
        testimonialsData?.data,
        testimonialsData?.testimonials,
        testimonialsData,
      ),
    [testimonialsData],
  );

  const activeProjects = projects.filter((p) => p.isActive);
  const featuredProjects = projects.filter((p) => p.isFeatured);
  const activeServices = services.filter((s) => s.isActive);
  const publishedBlogs = blogs.filter((b) => b.isActive);
  const featuredBlogs = blogs.filter((b) => b.isFeatured);
  const unreadMessages = messages.filter((m) => m.status === "unread");

  const availability = profile.isAvailable !== false;
  const anyLoading =
    isLoadingProjects || isLoadingServices || isLoadingSkills || isLoadingBlogs || isLoadingTestimonials;

  /* ---- checklist ---------------------------------------------------- */
  const steps = [
    { label: "Add your first project", done: projects.length > 0, to: "/projects" },
    { label: "Feature a project", done: featuredProjects.length > 0, to: "/projects" },
    { label: "Publish an article", done: publishedBlogs.length > 0, to: "/blogs" },
    { label: "List your services", done: activeServices.length > 0, to: "/services" },
    { label: "Add at least 5 skills", done: skills.length >= 5, to: "/skills" },
    { label: "Collect a testimonial", done: testimonials.length > 0, to: "/testimonials" },
    { label: "Clear unread messages", done: unreadMessages.length === 0, to: "/contact" },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);
  const nextStep = steps.find((s) => !s.done);

  /* ---- chart sources ------------------------------------------------- */
  const activitySources = useMemo(
    () => [
      { label: "Projects", items: projects, tone: "violet" },
      { label: "Articles", items: blogs, tone: "rose" },
      { label: "Services", items: services, tone: "emerald" },
      { label: "Testimonials", items: testimonials, tone: "indigo" },
      { label: "Messages", items: messages, tone: "amber" },
    ],
    [projects, blogs, services, testimonials, messages],
  );

  const statCards = [
    {
      title: "Total projects",
      value: projects.length,
      description: `${featuredProjects.length} featured · ${activeProjects.length} active`,
      icon: FolderGit2,
      to: "/projects",
      loading: isLoadingProjects,
      tone: "violet",
    },
    {
      title: "Services",
      value: activeServices.length,
      description: `${services.length} total offerings`,
      icon: BriefcaseBusiness,
      to: "/services",
      loading: isLoadingServices,
      tone: "emerald",
    },
    {
      title: "Skills",
      value: skills.length,
      description: "Active skills in your portfolio",
      icon: Cpu,
      to: "/skills",
      loading: isLoadingSkills,
      tone: "blue",
    },
    {
      title: "Blog articles",
      value: blogs.length,
      description: `${publishedBlogs.length} published · ${featuredBlogs.length} featured`,
      icon: BookOpen,
      to: "/blogs",
      loading: isLoadingBlogs,
      tone: "rose",
    },
    {
      title: "Inquiries",
      value: messages.length,
      description: `${unreadMessages.length} unread messages`,
      icon: Mail,
      to: "/contact",
      loading: false,
      tone: "amber",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      description: "Client feedback collected",
      icon: MessageSquareQuote,
      to: "/testimonials",
      loading: isLoadingTestimonials,
      tone: "indigo",
    },
  ];

  const quickActions = [
    { label: "Add project", description: "Showcase your work", to: "/projects", icon: FolderGit2, tone: "violet" },
    { label: "Manage services", description: "Your offerings", to: "/services", icon: BriefcaseBusiness, tone: "emerald" },
    { label: "Write an article", description: "Publish your ideas", to: "/blogs", icon: BookOpen, tone: "rose" },
    { label: "Update skills", description: "Keep skills current", to: "/skills", icon: Cpu, tone: "blue" },
    { label: "Testimonials", description: "Manage feedback", to: "/testimonials", icon: MessageSquareQuote, tone: "indigo" },
    { label: "View messages", description: "Client inquiries", to: "/contact", icon: Mail, tone: "amber" },
  ];

  // Show featured projects when there are any, otherwise fall back to everything.
  const projectsToShow = featuredProjects.length ? featuredProjects : projects;

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 pb-8 sm:space-y-7">
      {/* Page heading */}
      <Reveal>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              <ChartNoAxesCombined className="h-3.5 w-3.5" />
              Workspace overview
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              Dashboard<span className="text-violet-500">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              An overview of your portfolio, published content, and incoming client activity.
            </p>
          </div>

          <Link
            to="/profile"
            className={cn(
              "inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.07]",
              FOCUS,
            )}
          >
            <UserRound className="h-4 w-4" />
            Edit profile
            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
          </Link>
        </header>
      </Reveal>

      {/* Welcome banner */}
      <Reveal delay={0.05}>
        <section className="relative isolate overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:border-white/[0.08] dark:bg-[#111113]">
          {/* drifting aurora + faint grid */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]"
              animate={reduced ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px]"
              animate={reduced ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 text-zinc-900/[0.04] dark:text-white/[0.04] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-8">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Portfolio workspace
                </span>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold",
                    availability
                      ? "border-violet-500/20 bg-violet-500/[0.06] text-violet-700 dark:text-violet-300"
                      : "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", availability ? "bg-violet-500" : "bg-zinc-400")} />
                  {availability ? "Available for work" : "Not available"}
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                {greeting()},{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  {profile.name || "Shohag"}
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                Your portfolio control center. Keep your projects polished, your content fresh, and your
                professional profile up to date.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Link
                  to="/projects"
                  className={cn(
                    "group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-[#111113]",
                    FOCUS,
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Manage projects
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  to="/about"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07]",
                    FOCUS,
                  )}
                >
                  Edit about
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </Link>
              </div>
            </div>

            {/* Setup progress */}
            <div className="flex items-center gap-5 rounded-2xl border border-zinc-200/80 bg-white/70 p-5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-black/20">
              <ProgressRing percent={percent} loading={anyLoading} />
              <div className="min-w-0 max-w-44">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Portfolio setup
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {anyLoading
                    ? "Checking your workspace..."
                    : nextStep
                      ? `${doneCount} of ${steps.length} steps done.`
                      : "Everything is set up. Nice work."}
                </p>
                {!anyLoading && nextStep && (
                  <Link
                    to={nextStep.to}
                    className={cn(
                      "group mt-3 inline-flex items-center gap-1.5 rounded text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300",
                      FOCUS,
                    )}
                  >
                    {nextStep.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Metrics */}
      <section aria-labelledby="metrics-heading">
        <Reveal>
          <div className="mb-4">
            <h2 id="metrics-heading" className="text-sm font-semibold text-zinc-900 dark:text-white">
              At a glance
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Your portfolio statistics</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {statCards.map((stat, i) => (
            <Reveal key={stat.title} delay={Math.min(i * 0.05, 0.25)}>
              <MetricCard {...stat} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Activity + checklist */}
      <section aria-label="Activity and setup" className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
        <Reveal className="min-w-0 xl:col-span-2">
          <ActivityChart sources={activitySources} loading={anyLoading} />
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <StepsPanel steps={steps} loading={anyLoading} />
        </Reveal>
      </section>

      {/* Content overview */}
      <section aria-labelledby="content-heading">
        <Reveal>
          <div className="mb-4">
            <h2 id="content-heading" className="text-sm font-semibold text-zinc-900 dark:text-white">
              Content & communication
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Review your latest portfolio activity.</p>
          </div>
        </Reveal>

        <div className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          <Reveal className="min-w-0">
            <Panel>
              <SectionHeading
                eyebrow="Your work"
                title={featuredProjects.length ? "Featured projects" : "Recent projects"}
                description="A quick look at your project collection."
                to="/projects"
              />
              {isProjectsError ? (
                <EmptyState
                  icon={FolderGit2}
                  title="Projects unavailable"
                  description="We couldn't load projects. Please try again later."
                  to="/projects"
                  actionLabel="Open projects"
                />
              ) : (
                <ProjectList projects={projectsToShow} loading={isLoadingProjects} />
              )}
              <PanelFooter to="/projects">Manage all projects</PanelFooter>
            </Panel>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <Panel>
              <SectionHeading
                eyebrow="Writing"
                title="Recent articles"
                description="Keep track of your portfolio blog."
                to="/blogs"
              />
              <BlogList blogs={blogs} loading={isLoadingBlogs} error={isBlogsError} />
              <PanelFooter to="/blogs">Manage all articles</PanelFooter>
            </Panel>
          </Reveal>

          <Reveal delay={0.12} className="min-w-0 xl:col-span-2 2xl:col-span-1">
            <Panel>
              <SectionHeading
                eyebrow="Inbox"
                title="Incoming inquiries"
                description={
                  unreadMessages.length
                    ? `${unreadMessages.length} unread ${unreadMessages.length === 1 ? "message" : "messages"} need your attention.`
                    : "The latest messages from your visitors."
                }
                to="/contact"
                linkLabel="Open inbox"
              />
              <MessageList messages={messages} />
              <PanelFooter to="/contact">View all messages</PanelFooter>
            </Panel>
          </Reveal>
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions-heading">
        <Reveal>
          <Panel>
            <div className="relative flex items-center gap-3 border-b border-zinc-200/70 px-5 py-4 dark:border-white/[0.07] sm:px-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <ListChecks className="h-4 w-4" />
              </div>
              <div>
                <h2 id="quick-actions-heading" className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Quick actions
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Jump straight into your workspace.</p>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 xl:grid-cols-6">
              {quickActions.map(({ label, description, to, icon: Icon, tone }) => (
                <Surface
                  key={label}
                  as={Link}
                  to={to}
                  variant="tile"
                  className={cn(
                    "flex items-start gap-3 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:shadow-sm dark:hover:border-white/[0.14] dark:hover:bg-white/[0.04] sm:flex-col sm:p-4",
                    FOCUS,
                  )}
                >
                  <div
                    className={cn(
                      "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                      TONES[tone].soft,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">{description}</p>
                  </div>

                  <ArrowUpRight className="relative hidden h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-hover/surface:-translate-y-0.5 group-hover/surface:translate-x-0.5 sm:block" />
                </Surface>
              ))}
            </div>
          </Panel>
        </Reveal>
      </section>
    </main>
  );
}

export default DashboardOverview;