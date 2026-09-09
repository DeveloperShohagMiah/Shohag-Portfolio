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
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeader label="Services" />

            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              What I can{" "}
              <span className="text-gradient">
                build for you.
              </span>
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
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card/45"
              >

                {/* Number */}
                <div className="absolute right-6 top-6 font-code text-xs text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/50">
                  {service.number}
                </div>

                {/* Icon */}
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/30 text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5">
                  <Icon size={21} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-3 min-h-[84px] text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 font-code text-[10px] text-muted-foreground transition-colors duration-300 group-hover:border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom action */}
                <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-5">
                  <span className="font-code text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Explore service
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
                    <FiArrowUpRight size={15} />
                  </span>
                </div>

                {/* Hover line */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-7 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-foreground/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm sm:p-10">
          {/* CTA glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/10 blur-[80px]" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-code text-xs uppercase tracking-[0.18em] text-primary">
                Have a project in mind?
              </p>

              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Let&apos;s build something great.
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                Tell me what you&apos;re building, what you need,
                and where you want to go. We&apos;ll figure out
                the best way to get there.
              </p>
            </div>

            <a
              href="#contact"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            >
              Start a conversation

              <FiArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute -bottom-28 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-36" />
      </div>
    </section>
  );
}
