import React from "react";
import {
  FiArrowUpRight,
  FiCode,
  FiLayout,
  FiServer,
  FiDatabase,
  FiSmartphone,
  FiSettings,
} from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import Button from "./Button";

const SERVICES = [
  {
    number: "01",
    icon: FiCode,
    title: "Full-Stack Development",
    description:
      "End-to-end web applications built with modern frontend and backend technologies, from architecture to deployment.",
    tags: ["React", "Node.js", "REST API"],
  },
  {
    number: "02",
    icon: FiLayout,
    title: "Frontend Development",
    description:
      "Fast, responsive, and polished interfaces with reusable components and thoughtful interactions across every screen size.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    number: "03",
    icon: FiServer,
    title: "Backend & APIs",
    description:
      "Reliable server-side applications and APIs designed around clean architecture, security, performance, and scalability.",
    tags: ["Node.js", "Express", "REST"],
  },
  {
    number: "04",
    icon: FiDatabase,
    title: "Database Solutions",
    description:
      "Well-structured data models and database integrations that keep applications reliable, efficient, and easy to maintain.",
    tags: ["MongoDB", "PostgreSQL", "Data Modeling"],
  },
  {
    number: "05",
    icon: FiSmartphone,
    title: "Responsive Web Design",
    description:
      "Interfaces that look and feel great on desktops, tablets, and mobile devices without sacrificing usability or performance.",
    tags: ["Responsive", "UI/UX", "Accessibility"],
  },
  {
    number: "06",
    icon: FiSettings,
    title: "Maintenance & Optimization",
    description:
      "Improve existing applications with performance optimization, bug fixes, refactoring, new features, and technical improvements.",
    tags: ["Optimization", "Refactoring", "Support"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-background py-28 sm:py-32"
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeader label="Services" />
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              What I can{" "}
              <span className="text-gradient">build for you.</span>
            </h2>
          </div>
        </div>

        {/* SERVICES GRID */}
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className="
                  group relative clip-polygon flex flex-col overflow-hidden
                  border border-border/60 bg-card/40 p-7 backdrop-blur
                  transition-all duration-500 ease-out
                "
              >
                {/* Ambient animated glow (pulses on hover) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >


                </div>

                {/* Number */}
                <div className="absolute right-6 top-6 font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/70">
                  {service.number}
                </div>

                {/* Icon */}
                <div className="relative mb-7 flex h-12 w-12 items-center clip-polygon justify-center border border-primary/30 text-primary transition-all duration-500 bg-primary/5 group-hover:scale-110 group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:shadow-[0_0_20px_-4px_theme(colors.primary/60),0_4px_12px_-4px_rgba(0,0,0,0.3)]">
                  <Icon
                    size={21}
                    className="transition-transform duration-500 group-hover:rotate-[-6deg]"
                  />
                </div>

                {/* Title */}
                <h3 className="relative text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="relative mt-3 min-h-[84px] text-sm leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/90">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="relative mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/90 group-hover:shadow-[0_2px_8px_-2px_--theme(--color-primary/40)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover top line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-7 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Corner accent lines (decorative) */}
                <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-primary/0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:border-primary/50" />
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="relative mt-6 overflow-hidden border border-border/60 bg-card/40 p-8 backdrop-blur-sm sm:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.3)]">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 bg-primary/10 blur-[80px]" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-code text-xs uppercase tracking-[0.18em] text-primary">
                Have a project in mind?
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Let&apos;s build something great.
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                Tell me what you&apos;re building, what you need, and where you
                want to go. We&apos;ll figure out the best way to get there.
              </p>
            </div>

            <Button to={"#contact"} variant="primary">
              Start a conversation
              <FiArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Button>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute -bottom-28 h-px w-full bg-linear-to-r from-transparent via-border to-transparent sm:-bottom-36" />
      </div>
    </section>
  );
}