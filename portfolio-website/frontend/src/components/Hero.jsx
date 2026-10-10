import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiArrowDown,
} from "react-icons/fi";
import { motion, useReducedMotion } from "framer-motion";
import Button from "./Button";

const ROLES = [
  "Full-stack developer",
  "React & Node engineer",
  "UI-obsessed builder",
];

const STATS = [
  { value: "6+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "100%", label: "Remote friendly" },
];

const SOCIALS = [
  { icon: FiGithub, label: "GitHub", href: "#" },
  { icon: FiFacebook, label: "Facebook", href: "#" },
  { icon: FiLinkedin, label: "LinkedIn", href: "#" },
  { icon: FiMail, label: "Email", href: "#" },
];

const STACK = ["React", "Node.js", "PostgreSQL", "TypeScript"];

// Computed once so the availability pill never goes stale.
const CURRENT_MONTH = new Date().toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});

/* ------------------------------------------------------------------ */
/*  Technical grid geometry                                           */
/* ------------------------------------------------------------------ */
const CELL = 32; // minor cell, px
const MAJOR = CELL * 5; // major cell, px (every 5th line)

/*
  Grid color swaps per theme via --grid-rgb.
  Light: violet-700 (dark enough to read on white)
  Dark:  violet-400 (bright enough to read on near-black)
*/
const GRID_STYLE = `
  #home { --grid-rgb: 109, 40, 217; }
  .dark #home { --grid-rgb: 167, 139, 250; }
`;

/*
  Highlighted cells. All coordinates are in grid cells:
  [column offset from the centre cell, row from the top, width, height, fill alpha]
  Columns sit at |15| or further so they stay outside the 56rem content column.
*/
const GRID_CELLS = [
  [-17, 4, 1, 1, 0.14],
  [-16, 5, 2, 1, 0.08],
  [-19, 9, 1, 2, 0.1],
  [-15, 12, 1, 1, 0.16],
  [16, 3, 2, 1, 0.09],
  [19, 4, 1, 1, 0.16],
  [15, 10, 1, 1, 0.12],
  [19, 11, 1, 2, 0.08],
  [17, 15, 2, 1, 0.1],
];

const CROSS_MARKS = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${MAJOR}' height='${MAJOR}'%3E%3Cpath d='M0 .5h8M${MAJOR - 8
  } .5h8M.5 0v8M.5 ${MAJOR - 8}v8' stroke='%236d28d9' stroke-opacity='.7' fill='none'/%3E%3C/svg%3E")`;

const lineV = (alpha) =>
  `linear-gradient(to right, rgba(var(--grid-rgb), ${alpha}) 1px, transparent 1px)`;
const lineH = (alpha) =>
  `linear-gradient(to bottom, rgba(var(--grid-rgb), ${alpha}) 1px, transparent 1px)`;

/* ------------------------------------------------------------------ */
/*  Framer Motion variants                                            */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

function Reveal({ children, variants = fadeUp, className = "" }) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter hook                                                   */
/* ------------------------------------------------------------------ */
const useTypewriter = (
  words,
  { typeSpeed = 55, deleteSpeed = 30, pause = 1600 } = {}
) => {
  const [text, setText] = useState("");
  const indexRef = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setText(words[0]);
      return;
    }

    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const tick = () => {
      const current = words[indexRef.current % words.length];

      if (!deleting) {
        charIndex += 1;
        setText(current.slice(0, charIndex));

        if (charIndex === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, pause);
          return;
        }

        timeoutId = setTimeout(tick, typeSpeed);
      } else {
        charIndex -= 1;
        setText(current.slice(0, charIndex));

        if (charIndex === 0) {
          deleting = false;
          indexRef.current += 1;
        }

        timeoutId = setTimeout(tick, deleteSpeed);
      }
    };

    timeoutId = setTimeout(tick, typeSpeed);

    return () => clearTimeout(timeoutId);
  }, [words, typeSpeed, deleteSpeed, pause, reduced]);

  return text;
};

/* ------------------------------------------------------------------ */
/*  Dome / arc-of-light background                                    */
/* ------------------------------------------------------------------ */
function DomeGlow() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] overflow-hidden opacity-60 dark:opacity-100"
    >
      {/* Layer 1 - the bright arc line (top edge of the dome) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh]"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 68%, rgba(139, 92, 246, 0.18) 72%, rgba(167, 139, 250, 0.55) 74%, rgba(216, 180, 254, 0.9) 74.5%, rgba(216, 180, 254, 0.6) 75%, transparent 76%)",
        }}
      />

      {/* Layer 2 - inner dome fill (soft purple wash inside the arc) */}
      <div
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh]"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(124, 58, 237, 0.35) 0%, rgba(124, 58, 237, 0.15) 55%, transparent 74%)",
        }}
      />

      {/* Layer 3 - outer bloom (halo light spilling below the arc) */}
      <div
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh] blur-3xl"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 70%, rgba(139, 92, 246, 0.35) 73%, transparent 78%)",
        }}
      />

      {/* Layer 4 - top glow ball (the "sun" of the dome) */}
      <div className="absolute left-1/2 top-[18vh] h-56 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/40 blur-[80px]" />

      {/* Layer 5 - fade the dome into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {/* Slow breathing light */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-[8vh] h-[40vh] w-[80vw] max-w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Technical grid: minor lines, cross marks, lit cells, ruler         */
/* ------------------------------------------------------------------ */
function TechGrid() {
  const reduced = useReducedMotion();

  const fade =
    "radial-gradient(ellipse 90% 80% at 50% 30%, black 25%, transparent 75%)";

  // Higher alpha so grid lines are visible in both themes.
  const layers = [
    { image: lineV(0.14), size: CELL },
    { image: lineH(0.14), size: CELL },
  ];

  // Boost lit-cell alphas so they read on a light background.
  const cellBoost = 1.8;

  return (
    <>
      <style>{GRID_STYLE}</style>

      <motion.div
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: layers.map((l) => l.image).join(", "),
            backgroundSize: layers
              .map((l) => `${l.size}px ${l.size}px`)
              .join(", "),
            backgroundPosition: "50% 0",
          }}
        />

        {/* Cross marks at every major intersection */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: CROSS_MARKS,
            backgroundSize: `${MAJOR}px ${MAJOR}px`,
            backgroundPosition: "50% 0",
          }}
        />

        {/* Lit cells - wide screens only, so they never sit behind text */}
        <div className="absolute inset-0 hidden xl:block">
          {GRID_CELLS.map(([col, row, w, h, alpha], i) => (
            <motion.div
              key={`${col}-${row}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.09, duration: 0.8, ease: EASE }}
              className="absolute"
              style={{
                left: `calc(50% + ${col * CELL - CELL / 2}px)`,
                top: row * CELL,
                width: w * CELL,
                height: h * CELL,
                background: `rgba(var(--grid-rgb), ${Math.min(
                  1,
                  alpha * cellBoost
                )})`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <Ruler />
    </>
  );
}

/* Left-edge ruler, ticks line up with the grid rows */
function Ruler() {
  const fade =
    "linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)";
  const marks = Array.from({ length: 7 }, (_, i) => (i + 1) * MAJOR);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-5 -z-10 hidden w-16 lg:block"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {/* Minor ticks, one per grid row */}
      <div
        className="absolute inset-y-0 left-0 w-2"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, rgba(var(--grid-rgb), 0.5) 0, rgba(var(--grid-rgb), 0.5) 1px, transparent 1px, transparent ${CELL}px)`,
        }}
      />

      {/* Major ticks with coordinate labels */}
      {marks.map((y) => (
        <div key={y}>
          <span
            aria-hidden="true"
            className="absolute left-0 h-px w-4 bg-violet-700/70 dark:bg-violet-300/60"
            style={{ top: y }}
          />
          <span
            aria-hidden="true"
            className="absolute left-6 -translate-y-1/2 font-code text-[9px] tracking-wider text-violet-700/60 dark:text-violet-200/40"
            style={{ top: y + 0.5 }}
          >
            {String(y).padStart(4, "0")}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */
const Hero = () => {
  const typed = useTypewriter(ROLES);
  const reduced = useReducedMotion();

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* Dome / arc-of-light background */}
      <DomeGlow />

      {/* Technical grid sits above the dome glow, below the ambient fades */}
      <TechGrid />

      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute left-1/2 -top-60 h-[40rem] w-[42rem] max-w-full -translate-x-1/2 bg-primary/10 blur-3xl"
        />

        <div className="absolute -right-40 bottom-0 h-96 w-96 bg-primary/5 blur-[120px]" />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-6 lg:px-8">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="mx-auto w-full max-w-4xl text-center"
        >
          {/* Availability pill */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs text-foreground/90 shadow-[0_1px_2px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.06] dark:text-white/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 dark:bg-emerald-400 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              </span>

              <span className="font-code text-[11px] uppercase tracking-[0.14em]">
                Available for new projects
              </span>

              <span
                aria-hidden="true"
                className="mx-1 h-3 w-px bg-border dark:bg-white/20"
              />

              <span className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground dark:text-white/60">
                {CURRENT_MONTH}
              </span>
            </div>
          </Reveal>

          {/* Main heading */}
          <Reveal>
            <h1 className="mt-7 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Building digital{" "}
              <span className="text-gradient">experiences</span> that matter.
            </h1>
          </Reveal>

          {/* Typewriter role — hidden for now, kept for later */}
          {/* <Reveal>
            <p className="mt-6 inline-flex items-center justify-center gap-2 font-code text-sm text-muted-foreground sm:text-base">
              <span className="sr-only">{ROLES.join(", ")}</span>
              <span
                aria-hidden="true"
                className="h-px w-6 bg-violet-500 dark:bg-violet-400"
              />
              <span aria-hidden="true">{typed}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-violet-500 dark:bg-violet-400"
              />
            </p>
          </Reveal> */}

          {/* Description */}
          <Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              I design and build fast, accessible web products for startups
              and ambitious teams — from the first commit to a polished
              production launch.
            </p>
          </Reveal>

          {/* Tech stack chips */}
          <Reveal>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary/90"
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 bg-violet-500/70 dark:bg-violet-400/70"
                  />
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA buttons */}
          <Reveal>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                to="#portfolio"
                className="group/cta inline-flex h-12 items-center justify-center gap-2 clip-polygon bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_30px_-6px_theme(colors.primary/60)] active:translate-y-0"
              >
                View my work
                <FiArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                />
              </Button>

              <Button
                to="#contact"
                variant="secondary"
                className="inline-flex h-12 items-center justify-center clip-polygon border border-border/70 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                Let&apos;s talk
              </Button>
            </div>
          </Reveal>

          {/* Socials */}
          <Reveal>
            <div className="mt-9 flex items-center justify-center gap-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group/social flex h-10 w-10 items-center justify-center clip-polygon border border-border/70 bg-card/30 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon
                    size={15}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/social:scale-110"
                  />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Location */}
          <Reveal>
            <div className="mt-8 flex items-center justify-center gap-1.5 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <FiMapPin size={12} aria-hidden="true" />
              <span>Working remotely, worldwide</span>
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* Stats strip — reveals when scrolled into view */}
      <div className="relative mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
        >
          <Reveal>
            <div className="grid grid-cols-3 gap-px overflow-hidden border-y border-border/60 bg-border/40">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="group/stat relative flex flex-col items-center justify-center bg-background/60 px-4 py-6 backdrop-blur-sm transition-colors duration-300 hover:bg-card/50 sm:py-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 font-code text-[9px] text-muted-foreground/40 transition-colors duration-300 group-hover/stat:text-primary/60"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </span>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-300 group-hover/stat:opacity-100"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
        className="group/scroll absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span>Scroll</span>
        <FiArrowDown
          size={12}
          aria-hidden="true"
          className="animate-bounce transition-transform duration-300"
        />
      </motion.a>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </section>
  );
};

export default Hero;