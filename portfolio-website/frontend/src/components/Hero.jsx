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
/*  Reveal on mount                                                   */
/* ------------------------------------------------------------------ */
function useMounted(delay = 0) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ready = useMounted(delay);
  return (
    <div
      className={`transform-gpu transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */
const Hero = () => {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* ==============================
          Ambient background
          ============================== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Primary radial glow */}
        <div className="absolute left-1/2 -top-60 h-[40rem] w-[42rem] max-w-full -translate-x-1/2 bg-primary/10 blur-3xl" />

        {/* Secondary glow bottom-right */}
        <div className="absolute -right-40 bottom-0 h-96 w-96 bg-primary/5 blur-[120px]" />

        {/* Technical grid */}
        <div className="absolute inset-0 -z-30 bg-[linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_40%,transparent_85%)]" />

        {/* Top + bottom fades */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ==============================
          Content
          ============================== */}
      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          {/* Availability pill */}
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2.5 clip-polygon border border-border/70 bg-card/40 px-4 py-2 text-xs text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 bg-primary" />
              </span>

              <span className="font-code text-[11px] uppercase tracking-[0.14em]">
                Available for new projects
              </span>

              <span aria-hidden="true" className="mx-1 h-3 w-px bg-border" />

              <span className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                Sep 2026
              </span>
            </div>
          </FadeUp>

          {/* Main heading */}
          <FadeUp delay={100}>
            <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
              Building digital{" "}
              <span className="text-gradient">experiences</span> that matter.
            </h1>
          </FadeUp>

          {/* Typewriter role */}
          <FadeUp delay={200}>
            <p
              aria-live="polite"
              className="mt-6 inline-flex items-center gap-2 font-code text-sm text-muted-foreground sm:text-base"
            >
              <span aria-hidden="true" className="h-px w-6 bg-primary" />
              <span>{typed}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary"
              />
            </p>
          </FadeUp>

          {/* Description */}
          <FadeUp delay={300}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              I design and build fast, accessible web products for startups
              and ambitious teams — from the first commit to a polished
              production launch.
            </p>
          </FadeUp>

          {/* Tech stack chips */}
          <FadeUp delay={400}>
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
          </FadeUp>

          {/* CTA buttons */}
          <FadeUp delay={500}>
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
          </FadeUp>

          {/* Socials */}
          <FadeUp delay={600}>
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
          </FadeUp>

          {/* Location */}
          <FadeUp delay={700}>
            <div className="mt-8 flex items-center justify-center gap-1.5 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <FiMapPin size={12} aria-hidden="true" />
              <span>Working remotely, worldwide</span>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ==============================
          Stats strip (bottom of hero)
          ============================== */}
      <div className="relative mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <FadeUp delay={800}>
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
        </FadeUp>
      </div>

      {/* ==============================
          Scroll indicator
          ============================== */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        className="group/scroll absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span>Scroll</span>
        <FiArrowDown
          size={12}
          aria-hidden="true"
          className="animate-bounce transition-transform duration-300"
        />
      </a>

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36"
      />
    </section>
  );
};

export default Hero;