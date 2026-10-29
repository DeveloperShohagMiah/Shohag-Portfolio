import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiFacebook,
} from "react-icons/fi";
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import HeroVisual from "./HeroVisual";
import Button from "./Button";

/* ========================================================================== */
/*  Content — edit this block, the rest of the file stays untouched           */
/* ========================================================================== */
const HEADLINE = [
  { text: "Building" },
  { text: "digital" },
  { text: "experiences", gradient: true },
  { text: "that" },
  { text: "matter." },
];

const ROLES = [
  "Full-stack developer",
  "React & Node engineer",
  "UI-obsessed builder",
];

const DESCRIPTION =
  "I design and build fast, accessible web products for startups and ambitious teams — from the first commit to a polished production launch.";

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

const STACK = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "Tailwind CSS",
  "Redux Toolkit",
  "Framer Motion",
  "MongoDB",
  "Docker",
];

const CURRENT_MONTH = new Date().toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
});

/* ========================================================================== */
/*  Shared motion + grid constants                                            */
/* ========================================================================== */
const EASE = [0.22, 1, 0.36, 1];
const CELL = 55;

// Grid colour per theme. Dark is the default; `.light` is added to <html> for light mode.
const GRID_STYLE = `
  #home { --grid-rgb: 167, 139, 250; }
  .light #home { --grid-rgb: 109, 40, 217; }
`;

// Lit cells on very wide screens: [col offset from centre, row, w, h, alpha]
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

// Slow shimmer on the gradient word in the headline
const HERO_CSS = `
  @keyframes hero-shine { from { background-position: 0% 50%; } to { background-position: 100% 50%; } }
  .hero-shine { background-size: 200% 100%; animation: hero-shine 5s ease-in-out infinite alternate; }
  @media (prefers-reduced-motion: reduce) { .hero-shine { animation: none; } }
`;

const lineV = (a) =>
  `linear-gradient(to right, rgba(var(--grid-rgb), ${a}) 1px, transparent 1px)`;
const lineH = (a) =>
  `linear-gradient(to bottom, rgba(var(--grid-rgb), ${a}) 1px, transparent 1px)`;

const gridStyle = (alpha) => ({
  backgroundImage: `${lineV(alpha)}, ${lineH(alpha)}`,
  backgroundSize: `${CELL}px ${CELL}px, ${CELL}px ${CELL}px`,
  backgroundPosition: "50% 0",
});

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`;

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/* Variants */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const wordUp = {
  hidden: { y: "115%", rotate: 5, opacity: 0 },
  show: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 1, ease: EASE },
  },
};

function Reveal({ children, className = "" }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ========================================================================== */
/*  Magnetic wrapper — element leans toward the cursor                        */
/* ========================================================================== */
function Magnetic({ children, strength = 0.3, className = "" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ========================================================================== */
/*  Count-up number ("40+" → counts 0…40, keeps the suffix)                   */
/* ========================================================================== */
function Counter({ value }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : value;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) return setN(target);
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/* ========================================================================== */
/*  Rotating role line                                                        */
/* ========================================================================== */
function RoleRotator() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((c) => (c + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div
      className="relative mx-auto mt-6 flex h-8 items-center justify-center gap-3 lg:mx-0 lg:justify-start overflow-hidden font-code text-sm text-foreground sm:text-base"
      aria-hidden="true"
    >
      <span aria-hidden="true" className="text-primary">
        /
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROLES[i]}
          initial={{ y: 18, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -18, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="block"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
      <span aria-hidden="true" className="text-primary">
        /
      </span>
    </div>
  );
}

/* ========================================================================== */
/*  Background — dome glow (parallax), cursor-lit grid, grain                 */
/* ========================================================================== */
function DomeGlow({ y }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      style={{ y }}
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] overflow-hidden opacity-60 dark:opacity-100"
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh]"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 68%, rgba(139,92,246,0.18) 72%, rgba(167,139,250,0.55) 74%, rgba(216,180,254,0.9) 74.5%, rgba(216,180,254,0.6) 75%, transparent 76%)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh]"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.15) 55%, transparent 74%)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh] blur-3xl"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 70%, rgba(139,92,246,0.35) 73%, transparent 78%)",
        }}
      />
      <div className="absolute left-1/2 top-[18vh] h-56 w-[42rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/40 blur-[80px]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />

      {!reduced && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[8vh] h-[40vh] w-[80vw] max-w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
        />
      )}
    </motion.div>
  );
}

function TechGrid({ mx, my }) {
  const reduced = useReducedMotion();
  const fade =
    "radial-gradient(ellipse 90% 80% at 50% 30%, black 25%, transparent 75%)";

  // The brighter grid is only revealed under the cursor.
  const reveal = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, black, transparent 70%)`;
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(var(--grid-rgb), 0.12), transparent 70%)`;

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
        <div className="absolute inset-0" style={gridStyle(0.1)} />

        {/* cursor-lit grid + soft glow */}
        {!reduced && (
          <>
            <motion.div
              className="absolute inset-0"
              style={{
                ...gridStyle(0.5),
                maskImage: reveal,
                WebkitMaskImage: reveal,
              }}
            />
            <motion.div className="absolute inset-0" style={{ background: glow }} />
          </>
        )}

        {/* lit cells — wide screens only, never behind text */}
        <div className="absolute inset-0 hidden xl:block">
          {GRID_CELLS.map(([col, row, w, h, alpha], i) => (
            <motion.div
              key={`${col}-${row}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: [0, 1, 0.55, 1] }
              }
              transition={{
                delay: 0.7 + i * 0.09,
                duration: 4 + (i % 3),
                repeat: reduced ? 0 : Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute"
              style={{
                left: `calc(50% + ${col * CELL - CELL / 2}px)`,
                top: row * CELL,
                width: w * CELL,
                height: h * CELL,
                background: `rgba(var(--grid-rgb), ${Math.min(1, alpha * 1.8)})`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />
    </>
  );
}

/* ========================================================================== */
/*  Pieces                                                                    */
/* ========================================================================== */
function AvailabilityPill() {
  return (
    <a
      href="#contact"
      className={`group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-border/70 bg-card/40 py-2 pl-4 pr-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_30px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-colors duration-300 hover:border-primary/50 ${FOCUS}`}
    >
      {/* travelling highlight */}
      <motion.span
        aria-hidden="true"
        initial={{ x: "-120%" }}
        animate={{ x: "320%" }}
        transition={{
          duration: 2.2,
          delay: 1.6,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/4 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
      </span>

      <span className="font-code text-[11px] uppercase tracking-[0.14em] text-foreground/90">
        Available for new projects
      </span>
      <span aria-hidden="true" className="mx-0.5 h-3 w-px bg-border" />
      <span className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {CURRENT_MONTH}
      </span>

      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <FiArrowUpRight
          size={12}
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px"
        />
      </span>
    </a>
  );
}

function Headline() {
  const label = HEADLINE.map((w) => w.text).join(" ");

  return (
    <motion.h1
      variants={stagger}
      aria-label={label}
      className="mt-8 flex flex-wrap justify-center gap-x-[0.26em] lg:justify-start text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-5xl xl:text-6xl"
    >
      {HEADLINE.map((w) => (
        <span
          key={w.text}
          aria-hidden="true"
          className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em]"
        >
          <motion.span
            variants={wordUp}
            className={`inline-block origin-bottom-left ${w.gradient ? "text-gradient hero-shine" : ""
              }`}
          >
            {w.text}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

function StatsBar() {
  return (
    <div className="relative mx-auto mt-12 grid max-w-2xl grid-cols-3 lg:mx-0 lg:max-w-xl overflow-hidden rounded-lg border border-border/60 bg-card/30 backdrop-blur-xl">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`px-3 py-5 text-center transition-colors duration-300 hover:bg-foreground/[0.03] sm:px-6 ${i > 0 ? "border-l border-border/60" : ""
            }`}
        >
          <p className="font-heading text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
            <Counter value={s.value} />
          </p>
          <p className="mt-1 font-code text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px]">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}


function StackMarquee() {
  const reduced = useReducedMotion();
  const mask =
    "linear-gradient(to right, transparent, black 15%, black 85%, transparent)";

  return (
    <motion.div
      aria-label="Technologies I work with"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1 }}
      className="relative mt-6 overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <motion.div
        className="flex w-max"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
      >
        {[...STACK, ...STACK].map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            aria-hidden={i >= STACK.length ? "true" : undefined}
            className="mr-3 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2 font-code text-[11px] font-medium text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:text-primary"
          >
            <span className="h-1 w-1 rounded-full bg-primary/70" />
            {tech}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ========================================================================== */
/*  Hero                                                                      */
/* ========================================================================== */
const Hero = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);

  // Cursor position (relative to the section) drives the lit grid.
  const mxRaw = useMotionValue(-600);
  const myRaw = useMotionValue(-600);
  const mx = useSpring(mxRaw, { stiffness: 140, damping: 22, mass: 0.5 });
  const my = useSpring(myRaw, { stiffness: 140, damping: 22, mass: 0.5 });

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = sectionRef.current.getBoundingClientRect();
    mxRaw.set(e.clientX - r.left);
    myRaw.set(e.clientY - r.top);
  };
  const onPointerLeave = () => {
    mxRaw.set(-600);
    myRaw.set(-600);
  };

  // Scroll parallax: dome drifts slower, content eases up and fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const domeY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="home"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16"
    >
      <style>{HERO_CSS}</style>
      <DomeGlow y={reduced ? 0 : domeY} />
      <TechGrid mx={mx} my={my} />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12"
        >
          {/* Text column */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <Reveal>
              <AvailabilityPill />
            </Reveal>

            <Headline />

            <Reveal>
              <RoleRotator />
              <p className="sr-only">{ROLES.join(", ")}</p>
            </Reveal>

            <Reveal>
              <p className="mx-auto mt-5 max-w-2xl text-base lg:mx-0 lg:max-w-xl leading-8 text-muted-foreground sm:text-lg">
                {DESCRIPTION}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 lg:justify-start">
                <Button to={`#contact`}>
                  Start a project
                  <FiArrowUpRight size={16} />
                </Button>
                <Button to={`#projects`} variant={"secondary"}>
                  View works
                  <FiArrowUpRight size={16} />
                </Button>
              </div>
            </Reveal>

            {/* Socials + location */}
            <Reveal>
              <div className="mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={reduced ? undefined : { y: -3 }}
                      whileTap={reduced ? undefined : { scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`group/social flex h-10 w-10 rounded-full items-center justify-center border border-border/80 bg-card/30 text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary ${FOCUS}`}
                    >
                      <Icon size={15} aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>

                <span
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-border/70 sm:block"
                />

                <div className="flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                  <FiMapPin size={12} aria-hidden="true" />
                  <span>Working remotely, worldwide</span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <StatsBar />
            </Reveal>
          </div>

          {/* Visual column */}
          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-16 md:mt-20">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Technologies I build with
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
        <StackMarquee />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </section>
  );
};

export default Hero;