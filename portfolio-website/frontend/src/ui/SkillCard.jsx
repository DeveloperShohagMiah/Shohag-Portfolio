import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DynamicIcon } from "../components/DynamicIcon";

const EASE = [0.22, 1, 0.36, 1];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE, delay: custom },
    }),
};

const SkillCard = ({ skill, index = 0 }) => {
    const reduced = useReducedMotion();

    return (
        <motion.div
            variants={cardVariants}
            initial={reduced ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            custom={index * 0.04}
            whileHover={reduced ? undefined : { y: -4 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="
        group/skill relative overflow-hidden bg-background p-6
        transition-[background-color] duration-500 ease-out
        hover:bg-card/40
      "
        >
            {/* Ambient glow on hover */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover/skill:opacity-100"
            >
                <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/12),transparent_70%)] blur-2xl" />
            </div>

            {/* Top row: icon + number */}
            <div className="relative z-10 flex items-start justify-between">
                {/* Icon */}
                <motion.div
                    whileHover={reduced ? undefined : { scale: 1.08, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="
            relative flex h-11 w-11 items-center justify-center rounded-xl
            border border-border/70 bg-card/50 text-primary
            transition-[border-color,background-color,box-shadow] duration-500
            group-hover/skill:border-primary/50
            group-hover/skill:bg-primary/10
            group-hover/skill:shadow-[0_0_24px_-6px_theme(colors.primary/50)]
          "
                >
                    {/* Inner highlight on hover */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-primary/10 to-transparent opacity-100 transition-opacity duration-500 "
                    />

                    {skill.icon ? (
                        <DynamicIcon name={skill.icon} size={18} className="relative z-10" />
                    ) : (
                        <div className="relative z-10 h-6 w-6 rounded-full bg-muted/30" />
                    )}
                </motion.div>

                {/* Number with animated underline */}
                <div className="flex flex-col items-end">
                    <span className="font-code text-[10px] text-muted-foreground/40 transition-colors duration-300 group-hover/skill:text-primary/60">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 h-px w-3 bg-primary/0 transition-all duration-500 group-hover/skill:w-6 group-hover/skill:bg-primary/50" />
                </div>
            </div>

            {/* Name */}
            <h3 className="relative z-10 mt-6 text-base font-semibold text-foreground transition-colors duration-300 group-hover/skill:text-primary">
                {skill.name}
            </h3>

            {/* Description */}
            {skill.shortDescription && (
                <p className="relative z-10 mt-1.5 line-clamp-2 text-xs leading-6 text-muted-foreground">
                    {skill.shortDescription}
                </p>
            )}

            {/* Category */}
            <div className="relative z-10 mt-5 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/70 transition-all duration-500 group-hover/skill:w-4 group-hover/skill:bg-primary" />
                <span className="font-code text-[9px] uppercase tracking-[0.15em] text-muted-foreground transition-colors duration-300 group-hover/skill:text-muted-foreground/80">
                    {skill.category}
                </span>
            </div>

            {/* Top accent line on hover */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-7 top-0 z-20 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100"
            />

            {/* Corner brackets — bottom-right (existing) */}
            <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-6 w-6 border-b border-r border-primary/0 transition-all duration-500 group-hover/skill:h-10 group-hover/skill:w-10 group-hover/skill:border-primary/40" />

            {/* Corner bracket — top-left (new, subtle symmetry) */}
            <div className="pointer-events-none absolute left-0 top-0 z-20 h-5 w-5 border-l border-t border-primary/0 transition-all duration-500 group-hover/skill:h-8 group-hover/skill:w-8 group-hover/skill:border-primary/30" />
        </motion.div>
    );
};

export default SkillCard;