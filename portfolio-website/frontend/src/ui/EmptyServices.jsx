import React from 'react'
import { FiArrowUpRight, FiCode } from 'react-icons/fi'
import Button from '../components/Button'

const EmptyServices = () => {
    return (
        <div className="mt-16 flex justify-center">
            <div
                className="
          group relative clip-polygon w-full max-w-2xl overflow-hidden
          border border-dashed border-border/70 bg-card/30 p-12
          backdrop-blur-sm text-center
          transition-all duration-500
          hover:border-primary/40 hover:bg-card/50
        "
            >
                {/* Ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,theme(colors.primary/15),transparent_70%)] blur-2xl"
                />

                {/* Corner accents */}
                <div className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l border-t border-primary/30" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b border-r border-primary/30" />

                {/* Icon */}
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center clip-polygon border border-primary/30 bg-primary/5 text-primary">
                    <FiCode size={26} />
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 animate-ping rounded-full bg-primary/10"
                        style={{ animationDuration: "3s" }}
                    />
                </div>

                {/* Label */}
                <p className="relative font-code text-[10px] uppercase tracking-[0.28em] text-primary">
                    Currently Crafting
                </p>

                {/* Heading */}
                <h3 className="relative mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    New services{" "}
                    <span className="text-gradient">coming soon.</span>
                </h3>

                {/* Description */}
                <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    I'm refining my service offerings. In the meantime, reach out and we'll
                    figure out the best way to work together.
                </p>

                {/* CTA row */}
                <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Button to="#contact" variant="primary">
                        Start a conversation
                        <FiArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Button>

                    <a
                        href="#projects"
                        className="inline-flex items-center gap-1.5 border border-border/60 bg-background/40 px-4 py-2.5 font-code text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary"
                    >
                        View projects
                    </a>
                </div>
            </div>
        </div>
    )
}

export default EmptyServices