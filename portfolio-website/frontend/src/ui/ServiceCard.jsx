import React from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { DynamicIcon } from "../components/DynamicIcon";

const EASE = [0.22, 1, 0.36, 1];

const cardVariants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: EASE, delay },
    }),
};

const tagsContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } },
};

const tagVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const FOCUS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * <ServiceCard
 *    service={{ number, icon, title, description, tags, href? }}
 *    index={0}          // stagger delay in a grid
 *    tilt={true}        // 3D tilt following the cursor
 * />
 */
const ServiceCard = ({ service, index = 0, tilt = true, className = "" }) => {
    const reduced = useReducedMotion();
    const { icon, title, description, href } = service;
    const tags = service.tags ?? [];
    const number = service.number ?? String(index + 1).padStart(2, "0");

    /* Cursor position inside the card (px) — drives the spotlight + border glow */
    const px = useMotionValue(-300);
    const py = useMotionValue(-300);
    const sx = useSpring(px, { stiffness: 220, damping: 28 });
    const sy = useSpring(py, { stiffness: 220, damping: 28 });

    /* Normalised cursor (-0.5…0.5) — drives the tilt */
    const nx = useMotionValue(0);
    const ny = useMotionValue(0);
    const tx = useSpring(nx, { stiffness: 180, damping: 18 });
    const ty = useSpring(ny, { stiffness: 180, damping: 18 });
    const rotateX = useTransform(ty, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(tx, [-0.5, 0.5], [-5, 5]);

    const spotlight = useMotionTemplate`radial-gradient(320px circle at ${sx}px ${sy}px, black, transparent 70%)`;
    const edge = useMotionTemplate`radial-gradient(180px circle at ${sx}px ${sy}px, black, transparent 70%)`;

    const onMove = (e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        px.set(x);
        py.set(y);
        nx.set(x / r.width - 0.5);
        ny.set(y / r.height - 0.5);
    };

    const onLeave = () => {
        px.set(-300);
        py.set(-300);
        nx.set(0);
        ny.set(0);
    };

    const Wrapper = href ? "a" : "div";
    const wrapperProps = href ? { href } : {};

    return (
        <motion.article
            variants={cardVariants}
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            custom={index * 0.08}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className={`group/service relative h-full [perspective:1000px] ${className}`}
        >
            <motion.div
                style={
                    reduced || !tilt
                        ? undefined
                        : { rotateX, rotateY, transformStyle: "preserve-3d" }
                }
                whileHover={reduced ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="relative h-full"
            >
                <Wrapper
                    {...wrapperProps}
                    className={`relative flex h-full flex-col overflow-hidden rounded-md border dark:border-border/50 bg-card/60 p-7 backdrop-blur-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.35)] transition-[border-color,background-color,box-shadow] duration-500 ease-out hover:border-primary/30 hover:bg-card/80 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_28px_56px_-20px_rgba(0,0,0,0.5)] ${FOCUS}`}
                >
                    {/* Cursor spotlight */}
                    {/* <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 bg-primary/[0.10] opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                        style={{ maskImage: spotlight, WebkitMaskImage: spotlight }}
                    /> */}

                    {/* Border that lights up near the cursor */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 border border-primary opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                        style={{ maskImage: edge, WebkitMaskImage: edge }}
                    />

                    {/* Top accent line */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-7 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                    />

                    {/* Number */}
                    <div className="absolute right-6 top-6 z-20 flex flex-col items-end">
                        <span className="font-code text-xs text-muted-foreground/40 transition-colors duration-300 group-hover/service:text-primary/80">
                            {number}
                        </span>
                        <span className="mt-1 h-px w-4 bg-primary/0 transition-all duration-500 group-hover/service:w-8 group-hover/service:bg-primary/60" />
                    </div>

                    {/* Icon */}
                    <motion.div
                        whileHover={reduced ? undefined : { scale: 1.08, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        style={reduced || !tilt ? undefined : { translateZ: 30 }}
                        className="relative z-10 mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-primary transition-[border-color,background-color] duration-500 group-hover/service:border-primary/60 group-hover/service:bg-primary/10"
                    >
                        {/* soft halo behind the icon */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-primary/30 opacity-0 blur-xl transition-opacity duration-500 group-hover/service:opacity-100"
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                        />
                        <DynamicIcon name={icon} size={21} className="relative z-10" />
                    </motion.div>

                    {/* Title */}
                    <h3
                        style={reduced || !tilt ? undefined : { transform: "translateZ(20px)" }}
                        className="relative z-10 text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover/service:text-primary"
                    >
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                        {description}
                    </p>

                    {/* Tags */}
                    {tags.length > 0 && (
                        <motion.ul
                            variants={tagsContainer}
                            initial={reduced ? "show" : "hidden"}
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            className="relative z-10 mt-6 flex flex-wrap gap-2"
                        >
                            {tags.map((tag, i) => (
                                <motion.li
                                    key={`${tag}-${i}`}
                                    variants={tagVariants}
                                    whileHover={reduced ? undefined : { y: -2 }}
                                    className="rounded-full border dark:border-border/50 bg-muted/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-[border-color,background-color,color] duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                                >
                                    {tag}
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}

                    {/* Optional link affordance */}
                    {href && (
                        <span className="relative z-10 mt-6 inline-flex items-center gap-1.5 font-code text-[11px] text-muted-foreground transition-colors duration-300 group-hover/service:text-primary">
                            Learn more
                            <FiArrowUpRight
                                size={13}
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover/service:-translate-y-0.5 group-hover/service:translate-x-0.5"
                            />
                        </span>
                    )}
                </Wrapper>
            </motion.div>
        </motion.article>
    );
};

export default ServiceCard;