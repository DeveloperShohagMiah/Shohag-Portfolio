import { Fragment, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FiAlertCircle,
    FiArrowUpRight,
    FiCheck,
    FiClock,
    FiCopy,
    FiGithub,
    FiLinkedin,
    FiMail,
    FiMapPin,
    FiMessageSquare,
    FiSend,
    FiUser,
} from "react-icons/fi";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { useSendMessageMutation } from "../redux/features/publicApi";

/* ========================================================================== */
/*  CONFIG — everything project-specific lives here (or is passed as props)   */
/* ========================================================================== */
const EASE = [0.22, 1, 0.36, 1];
const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const DEFAULT_CONTENT = {
    id: "contact",
    sectionLabel: "Contact me",
    title: "Let's work",
    highlight: "together.",
    panelTitle: "Tell me what you're building.",
    panelText:
        "Whether it's a new website, web application, SaaS product, or something completely different, I'd love to hear about it.",
    responseTime: "Usually replies within 24 hours",
    availability: "Available for work",
    brand: "Shohag",
    author: "Shohag Miah",
    submitLabel: "Send message",
    successTitle: "Message sent!",
    successText:
        "Thanks for reaching out. I'll get back to you as soon as possible.",
    privacyNote: "Your information is only used to respond to your message.",
    backToTopHref: "#home",
};

const DEFAULT_DETAILS = [
    {
        icon: FiMail,
        label: "Email",
        value: "hello@example.com",
        href: "mailto:hello@example.com",
        copyable: true,
    },
    { icon: FiMapPin, label: "Location", value: "Remote · Worldwide" },
];

const DEFAULT_SOCIALS = [
    { icon: FiGithub, label: "GitHub", href: "https://github.com/" },
    { icon: FiLinkedin, label: "LinkedIn", href: "https://linkedin.com/" },
    { icon: FiMail, label: "Email", href: "mailto:hello@example.com" },
];

/*  field = { name, label, type, icon?, required?, minLength?, maxLength?,
              rows?, half?, autoComplete?, suggestions? }                    */
const DEFAULT_FIELDS = [
    {
        name: "name",
        label: "Your name",
        type: "text",
        icon: FiUser,
        autoComplete: "name",
        half: true,
        required: true,
        maxLength: 60,
    },
    {
        name: "email",
        label: "Email address",
        type: "email",
        icon: FiMail,
        autoComplete: "email",
        half: true,
        required: true,
    },
    {
        name: "subject",
        label: "Subject",
        type: "text",
        icon: FiMessageSquare,
        required: true,
        maxLength: 120,
        suggestions: ["New website", "Web application", "SaaS product", "Something else"],
    },
    {
        name: "message",
        label: "Tell me about your project",
        type: "textarea",
        rows: 6,
        required: true,
        minLength: 10,
        maxLength: 1000,
    },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]{1,}\.[^\s@]{2,}$/;

/* react-hook-form rules built from a field's config */
const rulesFor = (f) => ({
    required: f.required ? `${f.label} is required` : false,
    minLength: f.minLength
        ? { value: f.minLength, message: `Write at least ${f.minLength} characters` }
        : undefined,
    maxLength: f.maxLength
        ? { value: f.maxLength, message: `Keep it under ${f.maxLength} characters` }
        : undefined,
    pattern:
        f.type === "email"
            ? { value: EMAIL_RE, message: "Enter a valid email address" }
            : undefined,
    // catches whitespace-only input that "required" lets through
    validate: (v) =>
        !f.required || String(v ?? "").trim().length > 0 || `${f.label} is required`,
});

/* ========================================================================== */
/*  Motion helpers                                                            */
/* ========================================================================== */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE, delay },
    }),
};

function ScrollReveal({ children, delay = 0, className = "", amount = 0.15 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const inView = useInView(ref, { once: true, amount });

    return (
        <motion.div
            ref={ref}
            initial={reduced ? "show" : "hidden"}
            animate={inView ? "show" : "hidden"}
            variants={fadeUp}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/* ========================================================================== */
/*  Animated background                                                       */
/*  Aurora glows  +  Smoke  +  Constellation  (each can be switched off)       */
/*  All colours follow your `primary` token, theme switches included.         */
/* ========================================================================== */
const BACKDROP_CSS = `
@keyframes ct-float-a { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(60px,-40px,0) scale(1.15)} }
@keyframes ct-float-b { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(-70px,50px,0) scale(1.1)} }
@keyframes ct-float-c { 0%,100%{transform:translate3d(0,0,0) scale(1.05)} 50%{transform:translate3d(40px,60px,0) scale(0.92)} }
@keyframes ct-sheen { from{transform:translateX(-120%) skewX(-18deg)} to{transform:translateX(320%) skewX(-18deg)} }
@media (prefers-reduced-motion: reduce) {
  .ct-anim { animation: none !important; }
}
`;

function ConstellationCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let w = 0;
        let h = 0;
        let raf = 0;
        let running = true;
        let visible = true;
        let color = "#a855f7";
        let particles = [];
        const mouse = { x: -9999, y: -9999 };

        /* Read the real computed `primary` colour (works with hsl/oklch/hex) */
        const readColor = () => {
            const probe = document.createElement("span");
            probe.className = "text-primary";
            probe.style.display = "none";
            document.body.appendChild(probe);
            color = getComputedStyle(probe).color || color;
            probe.remove();
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.max(24, Math.min(70, Math.floor(w / 20)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.4 + 0.6,
            }));
        };

        const LINK = 130;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = color;
            ctx.strokeStyle = color;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!reduced) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;

                    // gentle push away from the cursor
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 140 * 140 && d2 > 0.01) {
                        const f = (1 - Math.sqrt(d2) / 140) * 0.6;
                        p.x += (dx / Math.sqrt(d2)) * f;
                        p.y += (dy / Math.sqrt(d2)) * f;
                    }
                }

                ctx.globalAlpha = 0.55;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < LINK) {
                        ctx.globalAlpha = (1 - dist / LINK) * 0.22;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        const loop = () => {
            if (!running) return;
            if (visible) draw();
            raf = requestAnimationFrame(loop);
        };

        const onMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const onLeave = () => {
            mouse.x = mouse.y = -9999;
        };

        readColor();
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement);

        const io = new IntersectionObserver(
            ([entry]) => (visible = entry.isIntersecting),
            { threshold: 0 }
        );
        io.observe(canvas);

        // re-read colour when the theme class flips
        const mo = new MutationObserver(readColor);
        mo.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave);

        if (reduced) draw();
        else raf = requestAnimationFrame(loop);

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            mo.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 opacity-70" />;
}

/* -------------------------------------------------------------------------- */
/*  Smoke — soft puffs rise, swell, twist and fade. Tinted by `primary` plus  */
/*  a neutral (foreground) layer, so it looks right in dark and light themes. */
/* -------------------------------------------------------------------------- */
function SmokeCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const SIZE = 256;
        let w = 0;
        let h = 0;
        let raf = 0;
        let last = 0;
        let running = true;
        let visible = true;
        let puffs = [];
        let sprites = {};
        const mouse = { x: -9999, y: -9999 };

        /* Soft white blob, then recoloured with any CSS colour via source-in */
        const makeSprite = (cls) => {
            const probe = document.createElement("span");
            probe.className = cls;
            probe.style.display = "none";
            document.body.appendChild(probe);
            const color = getComputedStyle(probe).color;
            probe.remove();

            const c = document.createElement("canvas");
            c.width = c.height = SIZE;
            const g = c.getContext("2d");
            const grad = g.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
            grad.addColorStop(0.7, "rgba(255,255,255,0.14)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            g.fillStyle = grad;
            g.fillRect(0, 0, SIZE, SIZE);
            g.globalCompositeOperation = "source-in";
            g.fillStyle = color;
            g.fillRect(0, 0, SIZE, SIZE);
            return c;
        };

        const buildSprites = () => {
            sprites = { primary: makeSprite("text-primary"), neutral: makeSprite("text-foreground") };
        };

        const makePuff = (prewarm) => {
            const life = 900 + Math.random() * 800; // frames @60fps
            const neutral = Math.random() < 0.4;
            return {
                sprite: neutral ? "neutral" : "primary",
                x0: Math.random() * w,
                y0: h + 80,
                vy: ((h + 260) / life) * (0.8 + Math.random() * 0.5),
                wind: (Math.random() - 0.5) * 0.18,
                amp: 30 + Math.random() * 70,
                freq: 0.004 + Math.random() * 0.006,
                phase: Math.random() * Math.PI * 2,
                base: 150 + Math.random() * 130,
                grow: 1.2 + Math.random() * 1.4,
                rot: Math.random() * Math.PI * 2,
                spin: (Math.random() - 0.5) * 0.004,
                peak: neutral ? 0.07 + Math.random() * 0.06 : 0.12 + Math.random() * 0.1,
                life,
                t: prewarm ? Math.random() * life : 0,
                ox: 0,
                oy: 0,
            };
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = w < 640 ? 12 : w < 1100 ? 18 : 26;
            puffs = Array.from({ length: count }, () => makePuff(true));
        };

        const draw = (step) => {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < puffs.length; i++) {
                let p = puffs[i];
                p.t += step;
                if (p.t >= p.life) p = puffs[i] = makePuff(false);

                const k = p.t / p.life;
                let x = p.x0 + p.wind * p.t + Math.sin(p.t * p.freq + p.phase) * p.amp;
                let y = p.y0 - p.vy * p.t;

                // cursor stirs the smoke
                const dx = x + p.ox - mouse.x;
                const dy = y + p.oy - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < 200 && d > 0.1) {
                    const f = (1 - d / 200) * 1.6 * step;
                    p.ox += (dx / d) * f;
                    p.oy += (dy / d) * f;
                }
                p.ox *= 0.985;
                p.oy *= 0.985;
                x += p.ox;
                y += p.oy;

                const size = p.base * (1 + p.grow * k);
                const alpha = p.peak * Math.pow(Math.sin(Math.PI * k), 1.4);

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.translate(x, y);
                ctx.rotate(p.rot + p.t * p.spin);
                ctx.drawImage(sprites[p.sprite], -size / 2, -size / 2, size, size);
                ctx.restore();
            }
        };

        const loop = (now) => {
            if (!running) return;
            const step = Math.min(2.5, (now - (last || now)) / 16.67);
            last = now;
            if (visible) draw(step);
            raf = requestAnimationFrame(loop);
        };

        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        };
        const onLeave = () => {
            mouse.x = mouse.y = -9999;
        };

        buildSprites();
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement);
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
        io.observe(canvas);
        const mo = new MutationObserver(buildSprites); // theme switch
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerleave", onLeave);

        if (reduced) draw(0);
        else raf = requestAnimationFrame(loop);

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            mo.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0" />;
}

/* -------------------------------------------------------------------------- */
/*  Backdrop — toggle layers with `effects`                                   */
/* -------------------------------------------------------------------------- */
const DEFAULT_EFFECTS = { aurora: true, smoke: true, constellation: true };

function AnimatedBackdrop({ effects = DEFAULT_EFFECTS }) {
    const fx = { ...DEFAULT_EFFECTS, ...effects };
    const fade = {
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 100%)",
    };

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <style>{BACKDROP_CSS}</style>

            {fx.aurora && (
                <>
                    <div className="ct-anim absolute -left-24 top-24 h-[26rem] w-[26rem] rounded-full bg-primary/15 blur-[120px] [animation:ct-float-a_16s_ease-in-out_infinite]" />
                    <div className="ct-anim absolute -right-24 top-1/2 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[140px] [animation:ct-float-b_20s_ease-in-out_infinite]" />
                    <div className="ct-anim absolute bottom-[-8rem] left-1/3 h-[22rem] w-[34rem] rounded-full bg-primary/15 blur-[130px] [animation:ct-float-c_18s_ease-in-out_infinite]" />
                </>
            )}

            {fx.smoke && (
                <div className="absolute inset-0">
                    <SmokeCanvas />
                </div>
            )}

            {fx.constellation && (
                <div className="absolute inset-0" style={fade}>
                    <ConstellationCanvas />
                </div>
            )}

            {/* Edge vignette so content stays readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
    );
}

/* ========================================================================== */
/*  Card — spotlight + rotating rim light                                     */
/* ========================================================================== */
const FORM_CSS = `
@property --ct-ang { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes ct-spin { to { --ct-ang: 360deg; } }
.ct-rim {
  padding: 1px;
  background: conic-gradient(from var(--ct-ang),
    var(--primary), transparent 22%, transparent 52%,
    #60a5fa, transparent 80%, var(--primary));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: ct-spin 10s linear infinite;
}
@media (prefers-reduced-motion: reduce) { .ct-rim { animation: none; } }
`;

function SpotlightCard({ children, className = "" }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, []);

    const mask = "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), #000, transparent 70%)";

    return (
        <div
            ref={ref}
            onPointerMove={onMove}
            className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_70px_-30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${className}`}
        >
            <div
                aria-hidden="true"
                className="ct-rim pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-50 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-primary/[0.12] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
            />
            <div className="relative z-10 grid lg:grid-cols-[0.75fr_1.25fr]">{children}</div>
        </div>
    );
}

/* ========================================================================== */
/*  Info panel                                                                */
/* ========================================================================== */
function CopyButton({ value }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard blocked — the mailto link still works */
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : `Copy ${value}`}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary ${FOCUS}`}
        >
            {copied ? <FiCheck size={13} className="text-primary" /> : <FiCopy size={13} />}
            <span className="sr-only" aria-live="polite">
                {copied ? "Copied to clipboard" : ""}
            </span>
        </button>
    );
}

function ContactInfo({ content, details, socials }) {
    return (
        <div className="relative flex flex-col justify-between gap-12 border-b border-border/60 bg-foreground/[0.02] p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div>
                <span className="font-code text-[10px] uppercase tracking-[0.2em] text-primary">
                    Get in touch
                </span>
                <h3 className="mt-5 max-w-sm font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {content.panelTitle}
                </h3>
                <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                    {content.panelText}
                </p>

                {content.responseTime && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                        <FiClock size={13} aria-hidden="true" className="text-primary" />
                        {content.responseTime}
                    </p>
                )}
            </div>

            <ul className="space-y-5">
                {details.map(({ icon: Icon, label, value, href, copyable }) => (
                    <li key={label} className="flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/40 text-primary">
                            <Icon size={16} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                                {label}
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                                {href ? (
                                    <a
                                        href={href}
                                        className={`group/link inline-flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary ${FOCUS}`}
                                    >
                                        <span className="truncate">{value}</span>
                                        <FiArrowUpRight
                                            size={14}
                                            aria-hidden="true"
                                            className="shrink-0 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                        />
                                    </a>
                                ) : (
                                    <p className="text-sm text-foreground">{value}</p>
                                )}
                                {copyable && <CopyButton value={value} />}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="space-y-6">
                {content.availability && (
                    <div className="inline-flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3.5 py-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="ct-anim absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                        </span>
                        <span className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                            {content.availability}
                        </span>
                    </div>
                )}

                {socials.length > 0 && (
                    <div className="flex gap-2">
                        {socials.map(({ icon: Icon, href, label }) => {
                            const external = href.startsWith("http");
                            return (
                                <a
                                    key={label}
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noreferrer" : undefined}
                                    aria-label={label}
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary ${FOCUS}`}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ========================================================================== */
/*  Floating-label field — plugs straight into react-hook-form's register()   */
/* ========================================================================== */
const FloatingField = forwardRef(function FloatingField(
    { field, error, counter, ...rest },
    ref
) {
    const id = `contact-${field.name}`;
    const Icon = field.icon;
    const isArea = field.type === "textarea";
    const hasIcon = Boolean(Icon) && !isArea;

    const tone = error
        ? "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/10"
        : "border-border/70 focus:border-primary focus:ring-primary/10";

    const control = `peer w-full rounded-xl border bg-background/40 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-transparent hover:border-border hover:bg-background/50 focus:bg-background/70 focus:ring-4 disabled:opacity-60 ${tone}`;

    const shared = {
        id,
        ref,
        placeholder: " ",
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${id}-error` : undefined,
        ...rest,
    };

    return (
        <div className={field.half ? "" : "md:col-span-2"}>
            <div className="group/field relative">
                {hasIcon && (
                    <Icon
                        size={15}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-muted-foreground/70 transition-colors duration-300 group-focus-within/field:text-primary"
                    />
                )}

                {isArea ? (
                    <textarea
                        rows={field.rows || 5}
                        className={`${control} min-h-[10rem] resize-none px-4 pb-8 pt-7 leading-7`}
                        {...shared}
                    />
                ) : (
                    <input
                        type={field.type}
                        className={`${control} h-14 pb-1 pr-4 pt-5 ${hasIcon ? "pl-11" : "pl-4"}`}
                        {...shared}
                    />
                )}

                <label
                    htmlFor={id}
                    className={`pointer-events-none absolute ${hasIcon ? "left-11" : "left-4"} ${isArea ? "top-4" : "top-1/2 -translate-y-1/2"
                        } text-sm text-muted-foreground transition-all duration-200 peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]`}
                >
                    {field.label}
                    {field.required && (
                        <span aria-hidden="true" className="text-primary">
                            {" "}*
                        </span>
                    )}
                </label>

                {counter}
            </div>

            <AnimatePresence initial={false}>
                {error && (
                    <motion.p
                        id={`${id}-error`}
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-1 pt-1.5 text-xs text-rose-500"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
});

/* ========================================================================== */
/*  Success view                                                              */
/* ========================================================================== */
function SuccessView({ content, onReset, reduced }) {
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[480px] flex-col items-center justify-center text-center"
            role="status"
        >
            <div className="relative flex h-24 w-24 items-center justify-center">
                <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
                <svg viewBox="0 0 96 96" className="relative h-full w-full text-primary" fill="none" aria-hidden="true">
                    <motion.circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={reduced ? false : { pathLength: 0, rotate: -90 }}
                        animate={{ pathLength: 1, rotate: -90 }}
                        transition={{ duration: 0.9, ease: EASE }}
                        style={{ originX: "50%", originY: "50%" }}
                    />
                    <motion.path
                        d="M32 49l11 11 21-23"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduced ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
                    />
                </svg>
            </div>

            <h3 className="mt-7 font-display text-3xl font-semibold text-foreground">
                {content.successTitle}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
                {content.successText}
            </p>

            <button
                type="button"
                onClick={onReset}
                className={`mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-border/70 px-5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`}
            >
                Send another message
            </button>
        </motion.div>
    );
}

/* ========================================================================== */
/*  Form — react-hook-form                                                    */
/* ========================================================================== */
function ContactForm({ content, fields, onSubmit }) {
    const reduced = useReducedMotion();
    const [sent, setSent] = useState(false);

    const defaults = useMemo(
        () => ({
            ...Object.fromEntries(fields.map((f) => [f.name, ""])),
            website: "", // honeypot
        }),
        [fields]
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setFocus,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ mode: "onTouched", defaultValues: defaults });

    const values = watch();
    const required = fields.filter((f) => f.required);
    const filled = required.filter((f) => String(values[f.name] ?? "").trim().length > 0).length;
    const progress = required.length ? (filled / required.length) * 100 : 0;

    const submit = handleSubmit(async (data) => {
        // Bots fill hidden fields — pretend success, send nothing.
        if (data.website) {
            setSent(true);
            return;
        }

        const payload = Object.fromEntries(
            fields.map((f) => {
                const v = String(data[f.name] ?? "").trim();
                return [f.name, f.type === "email" ? v.toLowerCase() : v];
            })
        );

        try {
            await onSubmit(payload);
            reset(defaults);
            setSent(true);
        } catch (err) {
            console.error("Send failed:", err);
            setError("root.server", {
                type: "server",
                message: err?.data?.message || "Something went wrong. Please try again.",
            });
        }
    });

    const sendAnother = () => {
        setSent(false);
        setTimeout(() => setFocus(fields[0].name), 80);
    };

    if (sent) return <SuccessView content={content} onReset={sendAnother} reduced={reduced} />;

    const serverError = errors.root?.server?.message;

    return (
        <form onSubmit={submit} noValidate aria-label="Contact form">
            {/* completion bar */}
            <div aria-hidden="true" className="mb-7 h-0.5 overflow-hidden rounded-full bg-border/60">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-sky-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => {
                    const isArea = field.type === "textarea";
                    const len = String(values[field.name] ?? "").length;

                    return (
                        <Fragment key={field.name}>
                            <FloatingField
                                field={field}
                                error={errors[field.name]?.message}
                                disabled={isSubmitting}
                                autoComplete={field.autoComplete}
                                inputMode={field.type === "email" ? "email" : undefined}
                                maxLength={field.maxLength}
                                onKeyDown={
                                    isArea
                                        ? (e) => {
                                            // Ctrl/⌘ + Enter sends from the message box
                                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                e.preventDefault();
                                                submit();
                                            }
                                        }
                                        : undefined
                                }
                                counter={
                                    isArea && field.maxLength ? (
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute bottom-2.5 right-3.5 font-code text-[10px] tabular-nums transition-colors ${len > field.maxLength * 0.9 ? "text-amber-500" : "text-muted-foreground/60"
                                                }`}
                                        >
                                            {len}/{field.maxLength}
                                        </span>
                                    ) : null
                                }
                                {...register(field.name, rulesFor(field))}
                            />

                            {field.suggestions?.length > 0 && (
                                <div className="-mt-1 flex flex-wrap items-center gap-2 md:col-span-2">
                                    <span className="font-code text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                                        Quick pick
                                    </span>
                                    {field.suggestions.map((s) => {
                                        const active = String(values[field.name] ?? "") === s;
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                aria-pressed={active}
                                                onClick={() => {
                                                    setValue(field.name, s, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true,
                                                    });
                                                    const next = fields[fields.indexOf(field) + 1];
                                                    if (next) setFocus(next.name);
                                                }}
                                                className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ${FOCUS} ${active
                                                    ? "border-primary/60 bg-primary/15 text-primary"
                                                    : "border-border/70 bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>

            {/* honeypot */}
            <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                {...register("website")}
            />

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                    className="max-w-xs text-xs leading-5 text-muted-foreground"
                    role={serverError ? "alert" : undefined}
                >
                    {serverError ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-500">
                            <FiAlertCircle size={12} aria-hidden="true" />
                            {serverError}
                        </span>
                    ) : (
                        <>
                            {content.privacyNote}
                            <span className="hidden sm:inline">
                                {" "}
                                Press{" "}
                                <kbd className="rounded border border-border/70 bg-background/50 px-1 font-code text-[10px]">
                                    Ctrl
                                </kbd>{" "}
                                +{" "}
                                <kbd className="rounded border border-border/70 bg-background/50 px-1 font-code text-[10px]">
                                    Enter
                                </kbd>{" "}
                                to send.
                            </span>
                        </>
                    )}
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group/send relative inline-flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-7 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_var(--primary)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_var(--primary)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto ${FOCUS}`}
                >
                    <span aria-hidden="true" className="absolute inset-0 bg-primary" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" />
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/50" />
                    <span
                        aria-hidden="true"
                        className="ct-anim pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-white/25 opacity-0 group-hover/send:opacity-100 group-hover/send:[animation:ct-sheen_1.1s_ease-out]"
                    />
                    {isSubmitting ? (
                        <>
                            <span
                                aria-hidden="true"
                                className="relative h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                            />
                            <span className="relative">Sending…</span>
                        </>
                    ) : (
                        <>
                            <span className="relative">{content.submitLabel}</span>
                            <FiSend
                                size={16}
                                aria-hidden="true"
                                className="relative transition-transform duration-300 group-hover/send:translate-x-1 group-hover/send:-translate-y-0.5"
                            />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

/* ========================================================================== */
/*  Reusable section — no API coupling. Drop it in any project.               */
/*                                                                            */
/*  <ContactSection                                                           */
/*     onSubmit={async (data) => { await fetch(...) }}                        */
/*     content={{ title: "Say hi", highlight: "today." }}                     */
/*     details={[...]}  socials={[...]}  fields={[...]}                       */
/*  />                                                                        */
/* ========================================================================== */
export function ContactSection({
    onSubmit,
    content: contentOverride,
    details = DEFAULT_DETAILS,
    socials = DEFAULT_SOCIALS,
    fields = DEFAULT_FIELDS,
    background = true,
    className = "",
}) {
    const content = { ...DEFAULT_CONTENT, ...contentOverride };

    return (
        <section
            id={content.id}
            className={`relative overflow-hidden bg-background py-28 sm:py-36 ${className}`}
        >
            <style>{FORM_CSS}</style>

            {background && (
                <AnimatedBackdrop effects={typeof background === "object" ? background : undefined} />
            )}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollReveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <SectionHeader
                            label={content.sectionLabel}
                            title={content.title}
                            highlight={content.highlight}
                        />
                    </div>
                </ScrollReveal>

                {/* Card */}
                <ScrollReveal delay={0.1} className="mt-14 lg:mt-20">
                    <SpotlightCard>
                        <ContactInfo content={content} details={details} socials={socials} />
                        <div className="relative p-8 sm:p-10 lg:p-12">
                            <ContactForm content={content} fields={fields} onSubmit={onSubmit} />
                        </div>
                    </SpotlightCard>
                </ScrollReveal>

                {/* Footer */}
                <ScrollReveal
                    delay={0.2}
                    className="mt-10 flex flex-col justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center"
                >
                    <p className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                        © {new Date().getFullYear()} {content.brand}. All rights reserved by{" "}
                        <span className="font-bold text-primary underline">{content.author}</span>
                    </p>
                    <a
                        href={content.backToTopHref}
                        className={`group/top inline-flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary ${FOCUS}`}
                    >
                        Back to top
                        <FiArrowUpRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/top:-translate-y-0.5 group-hover/top:translate-x-0.5"
                        />
                    </a>
                </ScrollReveal>
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
        </section>
    );
}

/* ========================================================================== */
/*  Default export — wired to your RTK Query mutation                         */
/* ========================================================================== */
export default function Contact(props) {
    const [sendMessage] = useSendMessageMutation();
    const handleSubmit = useCallback((data) => sendMessage(data).unwrap(), [sendMessage]);

    return <ContactSection onSubmit={handleSubmit} {...props} />;
}