import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import {
  FolderGit2,
  Briefcase,
  Cpu,
  BookOpen,
  MessageSquareQuote,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Plus,
  Star,
  UserCheck,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useGetAllProjectsQuery } from "@/redux/features/projectApi.js";
import { useGetAllServicesQuery } from "@/redux/features/serviceApi.js";
import { useGetActiveSkillsQuery } from "@/redux/features/skillApi.js";
import { useGetAllBlogsQuery } from "@/redux/features/blogsApi.js";
import { useGetAllTestimonialsQuery } from "@/redux/features/testimonialsApi.js";

export function DashboardOverview() {
  const { profile, about, messages } = useData();

  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetAllProjectsQuery();
  const { data: servicesData, isLoading: isLoadingServices } =
    useGetAllServicesQuery();
  const { data: skillsData, isLoading: isLoadingSkills } =
    useGetActiveSkillsQuery();
  const { data: blogsData, isLoading: isLoadingBlogs } =
    useGetAllBlogsQuery();
  const { data: testimonialsData, isLoading: isLoadingTestimonials } =
    useGetAllTestimonialsQuery();

  // ---------- Safe data extraction ----------
  const projects = Array.isArray(projectsData?.data?.projects)
    ? projectsData.data.projects
    : Array.isArray(projectsData?.data)
      ? projectsData.data
      : Array.isArray(projectsData)
        ? projectsData
        : [];

  const services = Array.isArray(servicesData?.data)
    ? servicesData.data
    : Array.isArray(servicesData)
      ? servicesData
      : [];

  const skills = Array.isArray(skillsData?.data)
    ? skillsData.data
    : Array.isArray(skillsData)
      ? skillsData
      : [];

  const blogs = Array.isArray(blogsData?.data?.blogs)
    ? blogsData.data.blogs
    : Array.isArray(blogsData?.data)
      ? blogsData.data
      : Array.isArray(blogsData)
        ? blogsData
        : [];

  const testimonials = Array.isArray(testimonialsData?.data)
    ? testimonialsData.data
    : Array.isArray(testimonialsData)
      ? testimonialsData
      : [];

  // ---------- Derived counts ----------
  const activeProjectsCount = projects.filter((p) => p.isActive).length;
  const featuredProjectsCount = projects.filter((p) => p.isFeatured).length;
  const unreadMessagesCount = messages.filter(
    (m) => m.status === "unread"
  ).length;
  const publishedBlogsCount = blogs.filter((b) => b.isActive).length;
  const featuredBlogsCount = blogs.filter((b) => b.isFeatured).length;

  const statCards = [
    {
      title: "Projects",
      value: projects.length,
      subtext: `${featuredProjectsCount} featured · ${activeProjectsCount} active`,
      icon: FolderGit2,
      link: "/projects",
      loading: isLoadingProjects,
      accent:
        "from-blue-500/10 to-blue-500/0 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    },
    {
      title: "Services",
      value: services.filter((s) => s.isActive).length,
      subtext: `${services.length} offerings registered`,
      icon: Briefcase,
      link: "/services",
      loading: isLoadingServices,
      accent:
        "from-emerald-500/10 to-emerald-500/0 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    },
    {
      title: "Skills",
      value: skills.length,
      subtext: "Cataloged proficiencies",
      icon: Cpu,
      link: "/skills",
      loading: isLoadingSkills,
      accent:
        "from-purple-500/10 to-purple-500/0 text-purple-600 dark:text-purple-400 ring-purple-500/20",
    },
    {
      title: "Blogs",
      value: blogs.length,
      subtext: `${publishedBlogsCount} published · ${featuredBlogsCount} featured`,
      icon: BookOpen,
      link: "/blogs",
      loading: isLoadingBlogs,
      accent:
        "from-rose-500/10 to-rose-500/0 text-rose-600 dark:text-rose-400 ring-rose-500/20",
    },
    {
      title: "Inquiries",
      value: messages.length,
      subtext: `${unreadMessagesCount} unread`,
      icon: Mail,
      link: "/contact",
      loading: false,
      accent:
        "from-amber-500/10 to-amber-500/0 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      subtext: "Client feedback collected",
      icon: MessageSquareQuote,
      link: "/testimonials",
      loading: isLoadingTestimonials,
      accent:
        "from-indigo-500/10 to-indigo-500/0 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20",
    },
  ];

  const quickActions = [
    {
      label: "Projects",
      to: "/projects",
      icon: FolderGit2,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Services",
      to: "/services",
      icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Blogs",
      to: "/blogs",
      icon: BookOpen,
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Skills",
      to: "/skills",
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Testimonials",
      to: "/testimonials",
      icon: MessageSquareQuote,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      label: "Messages",
      to: "/contact",
      icon: Mail,
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ============================================================
          Welcome banner
          ============================================================ */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5"
        />

        <div className="relative z-10">
          {/* Status pills */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Portfolio live
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${profile.isAvailable !== false
                  ? "border-blue-500/20 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  : "border-zinc-300/60 bg-zinc-100 text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/60 dark:text-zinc-400"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${profile.isAvailable !== false
                    ? "bg-blue-500"
                    : "bg-zinc-400"
                  }`}
              />
              {profile.isAvailable !== false
                ? "Available for work"
                : "Not available"}
            </span>
          </div>

          {/* Greeting */}
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              {profile.name || "Shohag"}
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Manage your profile, projects, services, blog, and client
            inquiries — all from one place.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link
              to="/profile"
              className="group inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              <UserCheck className="h-4 w-4" />
              Manage profile
            </Link>

            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              New project
            </Link>

            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Edit about
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          Metrics grid
          ============================================================ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Subtle gradient overlay on hover */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${stat.accent}`}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-inset ${stat.accent}`}
                  >
                    {stat.loading ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <Icon className="h-4.5 w-4.5" />
                    )}
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-700 dark:group-hover:text-zinc-300" />
                </div>

                <div className="mt-5">
                  <div className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {stat.loading ? (
                      <span className="inline-block h-7 w-12 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {stat.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-500">
                    {stat.loading ? "Loading…" : stat.subtext}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ============================================================
          Three-column section
          ============================================================ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* --- Featured projects --- */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Featured projects
              </h2>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Top showcase entries
              </p>
            </div>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              View all
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-1 p-2">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              </div>
            ) : projects.length === 0 ? (
              <p className="py-10 text-center text-xs text-zinc-400">
                No projects yet
              </p>
            ) : (
              projects.slice(0, 3).map((proj) => (
                <Link
                  key={proj.id}
                  to="/projects"
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-11 w-14 shrink-0 rounded-md border border-zinc-200 object-cover dark:border-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {proj.title}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {proj.stacks?.join(" · ") || "No stack"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${proj.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                  >
                    {proj.isActive ? "Active" : "Draft"}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* --- Recent articles --- */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Recent articles
              </h2>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Latest published posts
              </p>
            </div>
            <Link
              to="/blogs"
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              View all
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-2 p-3">
            {isLoadingBlogs ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              </div>
            ) : blogs.length === 0 ? (
              <p className="py-10 text-center text-xs text-zinc-400">
                No articles yet
              </p>
            ) : (
              blogs.slice(0, 3).map((blog) => (
                <Link
                  key={blog.id}
                  to="/blogs"
                  className="block rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="line-clamp-2 text-xs font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                    {blog.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    {blog.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium ${blog.isActive
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400"
                        }`}
                    >
                      {blog.isActive ? "Published" : "Draft"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* --- Incoming inquiries --- */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Incoming inquiries
              </h2>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Latest client messages
              </p>
            </div>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Inbox
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="space-y-2 p-3">
            {messages.length === 0 ? (
              <p className="py-10 text-center text-xs text-zinc-400">
                No messages yet
              </p>
            ) : (
              messages.slice(0, 3).map((msg) => (
                <Link
                  key={msg.id}
                  to="/contact"
                  className="block rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {msg.receivedAt}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {msg.subject}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500">
                    {msg.message}
                  </p>
                  {msg.status === "unread" && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Unread
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          Quick actions
          ============================================================ */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Quick actions
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map(({ label, to, icon: Icon, color }) => (
            <Link
              key={label}
              to={to}
              className="group flex flex-col items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-200 hover:bg-white hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60"
            >
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}