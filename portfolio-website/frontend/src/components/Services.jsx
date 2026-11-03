import { FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import { useGetPublicServicesQuery } from "../redux/features/publicApi";
import EmptyServices from "../ui/EmptyServices";
import ServicesSkeleton from "../ui/ServicesSkeleton";
import ServiceCard from "../ui/ServiceCard";
import ServerDownNotice from "../ui/ServerDownNotice";
import { isServerDown } from "../ui/ServerStatus.js";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";


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
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      </div>
    );
  } else if (isLoading) {
    content = <ServicesSkeleton />;
  } else if (isError) {
    content = (
      <div
        role="alert"
        className="mt-16 rounded-[28px] border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center"
      >
        <p className="text-sm font-semibold text-destructive">Failed to load services</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className={`mt-6 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border/70 px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-primary/50 hover:text-primary ${FOCUS}`}
        >
          <FiRefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  } else if (services.length === 0) {
    content = <EmptyServices />;
  } else {
    content = (
      <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      className="relative isolate overflow-hidden bg-background py-28 sm:py-32"
    >
      {/* Top / bottom dividers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
      />



      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeader label="Services" title="What I can" highlight="build for you.">
              End-to-end web development — from the first idea to a polished,
              production-ready product.
            </SectionHeader>
          </div>
        </div>

        {/* SERVICES GRID / STATES */}
        {content}

        {/* CTA */}
        <div className="relative mt-5 rounded-[28px] bg-linear-to-b from-primary/40 via-border to-border/20 p-px shadow-[var(--elev-md)]">
          <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-card/90 p-8 backdrop-blur-xl sm:p-12">
            {/* glows + faint grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/25 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 left-1/4 h-52 w-52 rounded-full bg-chart-2/15 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 text-foreground/[0.05] bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_80%_80%_at_80%_20%,black,transparent_75%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent"
            />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-primary">
                  Have a project in mind?
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Let&apos;s build <span className="text-gradient">something great.</span>
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  Tell me what you&apos;re building, what you need, and where you
                  want to go. We&apos;ll figure out the best way to get there.
                </p>
              </div>

              <Button to="#contact" variant="primary" size="lg">
                Start a conversation
                <FiArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 