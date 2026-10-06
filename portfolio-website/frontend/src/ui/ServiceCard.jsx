import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DynamicIcon } from "../components/DynamicIcon";

const EASE = [0.22, 1, 0.36, 1];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE, delay: custom },
    }),
};

const tagVariants = {
    hidden: { opacity: 0, y: 6 },
    show: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE, delay: custom },
    }),
};

const ServiceCard = ({ service, index = 0 }) => {
    const reduced = useReducedMotion();

    return (
        <motion.article
            variants={cardVariants}
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            custom={index * 0.08}
            whileHover={reduced ? undefined : { y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="
        group/service relative clip-polygon flex flex-col overflow-hidden
        border border-border/60 bg-card/40 p-7 backdrop-blur-md
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.25)]
        transition-[border-color,background-color,box-shadow] duration-500 ease-out
        hover:bg-card/60
        hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_48px_-16px_rgba(0,0,0,0.45),0_0_60px_-12px_theme(colors.primary/50),inset_0_1px_0_0_rgba(255,255,255,0.06)]
      "
        >
            {/* Ambient glow — appears on hover */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-700 group-hover/service:opacity-100"
            >
                <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/18),transparent_70%)] blur-2xl" />
                <div className="absolute -inset-1/2 animate-[spin_14s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,theme(colors.primary/12)_60deg,transparent_120deg,theme(colors.primary/6)_240deg,transparent_360deg)] opacity-40" />
            </div>

            {/* Top hover accent line */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-7 top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
            />

            {/* Corner brackets */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover/service:h-12 group-hover/service:w-12 group-hover/service:border-primary/50" />
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover/service:h-12 group-hover/service:w-12 group-hover/service:border-primary/50" />

            {/* Number — top right, with animated underline */}
            <div className="absolute right-6 top-6 z-20 flex flex-col items-end">
                <span className="font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover/service:text-primary/70">
                    {service.number}
                </span>
                <span className="mt-1 h-px w-4 bg-primary/0 transition-all duration-500 group-hover/service:w-8 group-hover/service:bg-primary/60" />
            </div>

            {/* Icon — spring on hover */}
            <motion.div
                whileHover={reduced ? undefined : { scale: 1.08, rotate: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="
          relative z-10 mb-7 flex h-12 w-12 items-center justify-center clip-polygon
          border border-primary/30 bg-primary/5 text-primary
          transition-[border-color,background-color,box-shadow] duration-500
          group-hover/service:border-primary/60
          group-hover/service:bg-primary/10
          group-hover/service:shadow-[0_0_24px_-4px_theme(colors.primary/60),0_4px_16px_-4px_rgba(0,0,0,0.3)]
        "
            >
                {/* Icon inner glow on hover */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100"
                />

                <DynamicIcon name={service.icon} size={21} className="relative z-10" />
            </motion.div>

            {/* Title */}
            <h3 className="relative z-10 text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover/service:text-primary">
                {service.title}
            </h3>

            {/* Description */}
            <p className="relative z-10 mt-3 flex-1 text-xs leading-7 text-muted-foreground transition-colors duration-300 group-hover/service:text-muted-foreground/90">
                {service.description}
            </p>

            {/* Tags — staggered, hover lift */}
            {service.tags.length > 0 && (
                <motion.div
                    className="relative z-10 mt-6 flex flex-wrap gap-2"
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
                    }}
                    initial={reduced ? "show" : "hidden"}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {service.tags.map((tag, i) => (
                        <motion.span
                            key={`${tag}-${i}`}
                            variants={tagVariants}
                            whileHover={reduced ? undefined : { y: -2 }}
                            className="
                border border-border/60 bg-background/50 px-3 py-1.5
                font-code text-[10px] text-muted-foreground
                transition-[border-color,background-color,color,box-shadow] duration-300
                hover:border-primary/40 hover:bg-primary/5 hover:text-primary/90
                hover:shadow-[0_4px_12px_-4px_theme(colors.primary/40)]
              "
                        >
                            {tag}
                        </motion.span>
                    ))}
                </motion.div>
            )}
        </motion.article>
    );
};

export default ServiceCard;