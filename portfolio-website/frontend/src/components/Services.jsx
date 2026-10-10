import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import { useGetPublicServicesQuery } from "../redux/features/publicApi";
import EmptyServices from "../ui/EmptyServices";
import ServicesSkeleton from "../ui/ServicesSkeleton";
import ServiceCard from "../ui/ServiceCard";
import ServerDownNotice from "../ui/ServerDownNotice";
import { isServerDown } from "../ui/serverStatus";

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function Services() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetPublicServicesQuery();

  // The API wraps the list in { data: [...] }; tolerate a bare array too.
  const services = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  /*
    Order matters: check "server down" BEFORE "loading". RTK Query keeps `error`
    set while a retry is in flight, but `isLoading` can flip back to true during
    that retry. Checking loading first would swap the notice for the skeleton on
    every retry (flicker) and reset the notice's countdown.
  */
  let content;
  if (isServerDown(error)) {
    content = (
      <div className="mt-16">
        <ServerDownNotice
          variant="inline"
          title="Services couldn't load"
          error={error}
          onRetry={refetch}
          isRetrying={isFetching}
        />
      </div>
    );
  } else if (isLoading) {
    content = <ServicesSkeleton />;
  } else if (isError) {
    content = (
      <div className="mt-16 text-center text-muted-foreground">
        Failed to load services. Please try again later.
      </div>
    );
  } else if (services.length === 0) {
    content = <EmptyServices />;
  } else {
    content = (
      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service._id ?? service.id ?? index}
            service={service}
            index={index}
          />
        ))}
      </div>
    );
  }

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

      {/* Bottom divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
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

        {/* SERVICES GRID / STATES */}
        {content}

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
      </div>
    </section>
  );
}