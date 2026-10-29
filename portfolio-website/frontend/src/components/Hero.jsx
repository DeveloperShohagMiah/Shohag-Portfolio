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

/* Tracks a CSS media query (used to switch scroll effects off on small screens) */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
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
      className="relative mx-auto mt-5 flex h-8 items-center justify-center gap-2.5 overflow-hidden font-code text-[13px] text-foreground sm:mt-6 sm:gap-3 sm:text-base lg:mx-0 lg:justify-start"
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
      {/* big blurs are expensive on phones, so the soft bloom + breathing light are md+ only */}
      <div
        className="absolute left-1/2 top-0 hidden h-[140vh] w-[180vw] -translate-x-1/2 -translate-y-[62vh] blur-3xl md:block"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 70%, rgba(139,92,246,0.35) 73%, transparent 78%)",
        }}
      />
      <div className="absolute left-1/2 top-[14vh] h-40 w-[26rem] max-w-[90vw] -translate-x-1/2 rounded-full bg-primary/35 blur-[60px] sm:top-[18vh] sm:h-56 sm:w-[42rem] sm:blur-[80px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent sm:h-64" />

      {!reduced && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[8vh] hidden h-[40vh] w-[80vw] max-w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] md:block"
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

        {/* cursor-lit grid + soft glow (mouse only, so it never runs on touch screens) */}
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
      className={`group relative isolate inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-border/70 bg-card/40 py-1.5 pl-3 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_30px_-12px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-colors duration-300 hover:border-primary/50 sm:gap-2.5 sm:py-2 sm:pl-4 sm:pr-3 ${FOCUS}`}
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

      <span className="truncate font-code text-[10px] uppercase tracking-[0.1em] text-foreground/90 sm:text-[11px] sm:tracking-[0.14em]">
        Available for new projects
      </span>

      {/* the date only appears once there is room for it */}
      <span aria-hidden="true" className="mx-0.5 hidden h-3 w-px bg-border sm:block" />
      <span className="hidden font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:inline">
        {CURRENT_MONTH}
      </span>

      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
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
      className="mt-6 flex flex-wrap justify-center gap-x-[0.26em] text-balance font-heading text-[clamp(1.75rem,8vw,2.25rem)] font-semibold leading-[1.1] tracking-tight text-foreground sm:mt-8 sm:text-4xl md:text-5xl lg:justify-start xl:text-6xl 2xl:text-7xl"
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
    <div className="relative mx-auto mt-10 grid max-w-md grid-cols-3 overflow-hidden rounded-lg border border-border/60 bg-card/30 backdrop-blur-xl sm:mt-12 sm:max-w-2xl lg:mx-0 lg:max-w-xl">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent sm:inset-x-8"
      />
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`min-w-0 px-2 py-4 text-center transition-colors duration-300 hover:bg-foreground/[0.03] sm:px-6 sm:py-5 ${i > 0 ? "border-l border-border/60" : ""
            }`}
        >
          <p className="font-heading text-xl font-semibold tabular-nums text-foreground sm:text-2xl lg:text-3xl">
            <Counter value={s.value} />
          </p>
          <p className="mt-1 font-code text-[9px] uppercase leading-tight tracking-[0.1em] text-muted-foreground sm:text-[10px] sm:tracking-[0.14em]">
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
      className="relative mt-5 overflow-hidden sm:mt-6"
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
            className="mr-2.5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-3.5 py-1.5 font-code text-[10px] font-medium text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:text-primary sm:mr-3 sm:px-4 sm:py-2 sm:text-[11px]"
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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

  // Scroll parallax: the dome drifts slower everywhere; the content only eases up and
  // fades on desktop. On phones the hero is taller than the screen, so fading it while
  // you read it would make the text look washed out.
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
      className="relative isolate min-h-svh overflow-hidden pb-10 pt-28 sm:pt-32 md:pb-16 md:pt-36 lg:pt-40"
    >
      <style>{HERO_CSS}</style>
      <DomeGlow y={reduced ? 0 : domeY} />
      <TechGrid mx={mx} my={my} />

      <motion.div
        style={reduced || !isDesktop ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]"
      >
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="grid items-center gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12"
        >
          {/* Text column */}
          <div className="min-w-0 text-center lg:col-span-7 lg:text-left">
            <Reveal>
              <AvailabilityPill />
            </Reveal>

            <Headline />

            <Reveal>
              <RoleRotator />
              <p className="sr-only">{ROLES.join(", ")}</p>
            </Reveal>

            <Reveal>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:max-w-2xl sm:text-base sm:leading-8 lg:mx-0 lg:max-w-xl lg:text-lg">
                {DESCRIPTION}
              </p>
            </Reveal>

            {/* CTAs: full-width stack on phones, a row from sm up */}
            <Reveal>
              <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-5 lg:mx-0 lg:justify-start">
                <Button to="#contact" className="w-full sm:w-fit">
                  Start a project
                  <FiArrowUpRight size={16} />
                </Button>
                <Button to="#portfolio" variant="secondary" className="w-full sm:w-fit">
                  View works
                  <FiArrowUpRight size={16} />
                </Button>
              </div>
            </Reveal>

            {/* Socials + location */}
            <Reveal>
              <div className="mt-8 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row sm:justify-center sm:gap-6 lg:justify-start">
                <div className="flex items-center gap-2.5 sm:gap-2">
                  {SOCIALS.map(({ icon: Icon, label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={reduced ? undefined : { y: -3 }}
                      whileTap={reduced ? undefined : { scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`group/social flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/30 text-muted-foreground backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:h-10 sm:w-10 ${FOCUS}`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>

                <span
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-border/70 sm:block"
                />

                <div className="flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:tracking-[0.15em]">
                  <FiMapPin size={12} aria-hidden="true" className="shrink-0" />
                  <span>Working remotely, worldwide</span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <StatsBar />
            </Reveal>
          </div>

          {/* Visual column — pulled up a little on phones because the visual has its own padding */}
          <div className="-mt-4 min-w-0 sm:-mt-2 lg:mt-0 lg:col-span-5">
            <HeroVisual />
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-12 sm:mt-16 md:mt-20">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <p className="text-center font-code text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:tracking-[0.2em]">
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