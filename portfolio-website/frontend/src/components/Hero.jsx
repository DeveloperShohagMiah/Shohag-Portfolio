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

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

/* Wrapper that respects reduced-motion preference */
function Reveal({ children, variants = fadeUp, className = "", delay = 0 }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? "show" : "hidden"}
      animate="show"
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typewriter hook (unchanged)                                       */
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
      {/* ==============================
          Ambient background
          ============================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Primary radial glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute left-1/2 -top-60 h-[40rem] w-[42rem] max-w-full -translate-x-1/2 bg-primary/10 blur-3xl"
        />

        {/* Secondary glow bottom-right */}
        <div className="absolute -right-40 bottom-0 h-96 w-96 bg-primary/5 blur-[120px]" />

        {/* Technical grid — works in BOTH light and dark */}
        {/* <div
          className="
            absolute inset-0 -z-30
            bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]
            bg-[size:44px_44px]
            [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_40%,transparent_85%)]
          "
          style={{
            // Light: black at 6% / Dark: white at 4%
            "--grid-color": "color-mix(in srgb, currentColor 6%, transparent)",
          }}
        /> */}

        {/* Top + bottom fades */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ==============================
          Content
          ============================== */}
      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-6 lg:px-8">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="mx-auto w-full max-w-4xl text-center"
        >
          {/* Availability pill */}
          <Reveal variants={fadeUp}>
            <div className="inline-flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/60 px-4 py-2 text-xs text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-green-500 rounded-full" />
              </span>

              <span className="font-code text-[11px] uppercase tracking-[0.14em]">
                Available for new projects
              </span>

              <span aria-hidden="true" className="mx-1 h-3 w-px bg-border" />

              <span className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Sep 2026
              </span>
            </div>
          </Reveal>

          {/* Main heading */}
          <Reveal variants={fadeUp}>
            <h1 className="mt-7 text-balance font-heading text-5xl font-semibold leading-[1.2] tracking-wider text-foreground sm:text-5xl lg:text-6xl">
              Building digital{" "}
              <span className="text-gradient">experiences</span> that matter.
            </h1>
          </Reveal>

          {/* Description */}
          <Reveal variants={fadeUp}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-sm">
              I design and build fast, accessible web products for startups
              and ambitious teams — from the first commit to a polished
              production launch.
            </p>
          </Reveal>

          {/* Tech stack chips */}
          <Reveal variants={fadeUp}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary/90"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA buttons */}
          <Reveal variants={fadeUp}>
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
          <Reveal variants={fadeUp}>
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
          <Reveal variants={fadeUp}>
            <div className="mt-8 flex items-center justify-center gap-1.5 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <FiMapPin size={12} aria-hidden="true" />
              <span>Working remotely, worldwide</span>
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* ==============================
          Stats strip
          ============================== */}
      <div className="relative mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={stagger}
        >
          <Reveal variants={fadeUp}>
            <div className="grid grid-cols-3 gap-px overflow-hidden border-y border-border/60 bg-border/40">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center bg-background/60 px-4 py-6 backdrop-blur-sm sm:py-7"
                >
                  <span className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* ==============================
          Scroll indicator
          ============================== */}
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
        className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36"
      />
    </section>
  );
};

export default Hero;