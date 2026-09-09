
import { useEffect, useRef, useState } from 'react';
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCode,
  FiMapPin,
  FiFacebook,
} from 'react-icons/fi';

const ROLES = [
  'Full-stack developer',
  'React & Node engineer',
  'UI-obsessed builder',
];

const STATS = [
  { value: '6+', label: 'Years building' },
  { value: '40+', label: 'Projects shipped' },
  { value: '100%', label: 'Remote friendly' },
];

const SOCIALS = [
  {
    icon: FiGithub,
    label: 'GitHub',
    href: '#',
  },
  { icon: FiFacebook, label: 'Facebook', href: '#' },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    href: '#',
  },
  {
    icon: FiMail,
    label: 'Email',
    href: '#',
  },
];

/* ==========================================================================
   Typewriter Hook
   ========================================================================== */

const useTypewriter = (
  words,
  { typeSpeed = 55, deleteSpeed = 30, pause = 1600 } = {}
) => {
  const [text, setText] = useState('');
  const indexRef = useRef(0);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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

/* ==========================================================================
   Hero
   ========================================================================== */

const Hero = () => {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      {/* ------------------------------------------------------------------
          Ambient Background
          ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Radial glow */}
        <div className="absolute left-1/2 top-[-15rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />

        {/* Technical grid */}
        <div aria-hidden="true" className="absolute inset-0 -z-30 [background-image:linear-gradient(to_right,oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.045)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_40%,transparent_85%)]"></div>

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ------------------------------------------------------------------
          Content
          ------------------------------------------------------------------ */}

      <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-5 sm:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">

          {/* Availability / status pill */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-100" />
              <span className="relative inline-flex h-full w-full rounded-full bg-green-600" />
            </span>

            <span className='font-code text-[11px] '>Available for new projects</span>

            <span className="mx-1 h-3 w-px bg-border" />

            <span className="font-code uppercase text-[11px]">
              Sep 2026
            </span>
          </div>

          {/* Role */}
          {/* <div className="animate-fade-up mt-8 flex items-center justify-center gap-2 font-code text-sm text-primary md:text-base">
            <FiCode className="h-4 w-4 text-muted-foreground" />

            <span>{typed}</span>

            <span className="cursor-blink text-muted-foreground">_</span>
          </div> */}

          {/* Main heading */}
          <h1 className="animate-fade-up mt-5 font-display text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem]">
            Building digital
            <br />

            <span className="text-gradient">
              experiences that matter.
            </span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            I design and build fast, accessible web products for startups
            and ambitious teams — from the first commit to a polished
            production launch.
          </p>

          {/* Stack */}
          <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-2">
            {['React', 'Node.js', 'PostgreSQL'].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/70 bg-card/30 px-3 py-1.5 font-code text-[11px] text-muted-foreground backdrop-blur-md transition-colors duration-300 hover:border-primary/30 hover:text-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#portfolio"
              className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-foreground to-foreground/90 px-6 text-sm font-semibold text-background shadow-[0_1px_0_0_oklch(1_0_0/0.25)_inset,0_-1px_0_0_oklch(0_0_0/0.15)_inset,0_8px_24px_-8px_oklch(0.75_0_0/0.35)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              View my work

              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="#contact"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border/60 bg-muted/30 px-5 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:border-border hover:bg-muted/50 hover:text-foreground"
            >
              Let's talk
            </a>
          </div>

          {/* Socials */}
          <div className="animate-fade-up mt-8 flex items-center justify-center gap-2">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/20 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card/60 hover:text-foreground"
              >
                <Icon className="h-[15px] w-[15px] transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>

          {/* Stats */}
          {/* <div className="animate-fade-up mx-auto mt-14 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-border/60 bg-card/20 backdrop-blur-xl">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`relative px-3 py-5 sm:px-6 ${index !== STATS.length - 1
                  ? 'border-r border-border/60'
                  : ''
                  }`}
              >
                <div className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {stat.value}
                </div>

                <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}

          {/* Location */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <FiMapPin className="h-3.5 w-3.5" />

            <span>Working remotely, worldwide</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          Scroll indicator
          ------------------------------------------------------------------ */}

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        <span>Scroll</span>

        <span className="h-8 w-px bg-gradient-to-b from-border to-transparent" />
      </a>

      <div className="absolute -bottom-28 sm:-bottom-36 w-[100%]  h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default Hero;

