import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { DynamicIcon } from "../components/DynamicIcon";

const EASE = [0.22, 1, 0.36, 1];

// opacity + translate only — no `filter: blur()`, which forces a repaint of the
// whole card (and its backdrop-filter) on every frame of the entrance.
const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: EASE, delay },
    }),
};

const LINK_CLASS =
    "block rounded-sm focus-visible:outline-none after:absolute after:inset-0 after:z-10";

/**
 * <ServiceCard
 *    service={{ number?, icon, title, description, tags?, href? }}
 *    index={0}          // used for the entrance stagger and the auto number
 * />
 *
 * Why this replaces the old 3D-tilt version
 *  1. Hover lift is applied to an inner layer while hover/pointer tracking stays
 *     on the static <article>. Before, the element under the cursor moved up on
 *     hover, so near the bottom edge it slipped out from under the pointer, the
 *     hover ended, it dropped back, hovered again… = flicker.
 *  2. rotateX/rotateY + backdrop-filter + overflow-hidden flatten the 3D context
 *     (so the translateZ "depth" never worked) and make text blurry while the
 *     card is rotating. The spotlight + lift gives the same "alive" feel without it.
 *  3. The whole card is clickable through ONE stretched title link, instead of
 *     wrapping all the content in an <a>.
 */
const ServiceCard = ({ service, index = 0, className = "" }) => {
    const reduced = useReducedMotion();
    const ref = useRef(null);

    const { icon, title, description, href } = service;
    const tags = Array.isArray(service.tags) ? service.tags : [];
    const number = service.number ?? String(index + 1).padStart(2, "0");

    // cursor position → CSS variables (no React state, no re-render)
    const onMove = useCallback((e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, []);

    const isExternal = Boolean(href) && /^(https?:)?\/\//i.test(href);
    const isPlainAnchor = Boolean(href) && (isExternal || /^(mailto:|tel:|#)/i.test(href));

    let heading = title;
    if (href) {
        heading = isPlainAnchor ? (
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={LINK_CLASS}
            >
                {title}
            </a>
        ) : (
            <Link to={href} className={LINK_CLASS}>
                {title}
            </Link>
        );
    }

    return (
        <motion.article
            ref={ref}
            variants={cardVariants}
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            custom={(index % 3) * 0.08}
            onPointerMove={onMove}
            className={`group/service relative h-full ${className}`}
        >
            {/* Lifting layer — the static <article> above owns the hover area */}
            <div className="relative h-full rounded-[28px] bg-linear-to-b from-border via-border/40 to-border/10 p-px shadow-[var(--elev-sm)] transition-[transform,box-shadow] duration-500 ease-out group-hover/service:-translate-y-1.5 group-hover/service:shadow-[var(--elev-lg)] motion-reduce:group-hover/service:translate-y-0 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background">
                {/* Border that lights up around the cursor (visible through the 1px gap) */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                    style={{
                        background:
                            "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), var(--primary), transparent 70%)",
                    }}
                />

                <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] bg-card/95 p-7 backdrop-blur-xl sm:p-8">
                    {/* Cursor spotlight (behind the content) */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                        style={{
                            background:
                                "radial-gradient(340px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--primary) 13%, transparent), transparent 70%)",
                        }}
                    />

                    {/* Top accent line */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                    />

                    {/* Number */}
                    <span
                        aria-hidden="true"
                        className="absolute right-7 top-7 font-code text-xs text-muted-foreground/50 transition-colors duration-300 group-hover/service:text-primary"
                    >
                        {number}
                    </span>

                    {/* Icon tile */}
                    <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-linear-to-br from-primary/20 to-primary/5 text-primary transition-all duration-500 group-hover/service:scale-105 group-hover/service:-rotate-3 group-hover/service:border-primary/50 motion-reduce:transition-none motion-reduce:group-hover/service:transform-none">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-primary/30 opacity-0 blur-xl transition-opacity duration-500 group-hover/service:opacity-100"
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent opacity-60"
                        />
                        <DynamicIcon name={icon} size={22} className="relative" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover/service:text-primary">
                        {heading}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {description}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <li
                                    key={`${tag}-${i}`}
                                    className="rounded-full border border-border/60 bg-muted/50 px-3 py-1.5 font-code text-[11px] text-muted-foreground transition-colors duration-300 group-hover/service:border-primary/30 group-hover/service:bg-primary/5 group-hover/service:text-primary/90"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Link affordance (the real link is the title) */}
                    {href && (
                        <span
                            aria-hidden="true"
                            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover/service:text-primary"
                        >
                            Learn more
                            <FiArrowUpRight
                                size={14}
                                className="transition-transform duration-300 group-hover/service:-translate-y-0.5 group-hover/service:translate-x-0.5"
                            />
                        </span>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

export default ServiceCard;