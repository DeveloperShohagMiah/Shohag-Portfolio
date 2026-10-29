import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserCheck,
  User,
  Briefcase,
  Cpu,
  FolderGit2,
  BookOpen,
  HelpCircle,
  MessageSquareQuote,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  X,
  PanelLeftClose,
} from "lucide-react";
import { useData } from "../context/DataContext.jsx";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { name: "About", path: "/about", icon: User },
  { name: "Services", path: "/services", icon: Briefcase },
  { name: "Skills", path: "/skills", icon: Cpu },
  { name: "Projects", path: "/projects", icon: FolderGit2 },
  { name: "Blogs", path: "/blogs", icon: BookOpen },
  { name: "FAQ", path: "/faq", icon: HelpCircle },
  {
    name: "Testimonials",
    path: "/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: Mail,
    badgeKey: "unreadMessages",
  },
  { name: "Profile", path: "/profile", icon: UserCheck },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

function getInitials(name) {
  if (!name || typeof name !== "string") return "S";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "S";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const context = useData() ?? {};

  const profile = context.profile ?? {};
  const messages = Array.isArray(context.messages)
    ? context.messages
    : [];

  const unreadMessagesCount = messages.filter(
    (message) => message?.status === "unread",
  ).length;

  const isAvailable = profile.isAvailable !== false;
  const profileName = profile.name || "Portfolio Owner";
  const profileRole = profile.role || "Administrator";

  const closeMobileSidebar = () => setMobileOpen(false);

  const handleNavigation = () => {
    if (mobileOpen) {
      closeMobileSidebar();
    }
  };

  const sidebarWidth = collapsed ? "lg:w-[76px]" : "lg:w-[264px]";

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={mobileOpen ? 0 : -1}
        onClick={closeMobileSidebar}
        className={cn(
          "fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-[3px]",
          "transition-opacity duration-200 motion-reduce:transition-none lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        aria-label="Admin sidebar"
        aria-hidden={!mobileOpen && undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "border-r border-zinc-200/80 bg-white",
          "transition-[width,transform] duration-200 ease-out",
          "motion-reduce:transition-none",
          "dark:border-white/[0.08] dark:bg-[#101012]",
          sidebarWidth,
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Brand header */}
        <div
          className={cn(
            "flex h-[72px] shrink-0 items-center border-b",
            "border-zinc-200/70 px-4 dark:border-white/[0.07]",
            collapsed ? "lg:justify-center lg:px-2" : "justify-between",
          )}
        >
          <NavLink
            to="/"
            onClick={handleNavigation}
            title={collapsed ? "Portfolio CMS" : undefined}
            className={cn(
              "group flex min-w-0 items-center gap-3 rounded-xl",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-violet-500",
              collapsed && "lg:justify-center",
            )}
          >
            {/* Logo */}
            <div
              className={cn(
                "relative flex h-10 w-10 shrink-0 items-center justify-center",
                "rounded-[13px] border border-violet-400/20",
                "bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600",
                "shadow-lg shadow-violet-600/15",
              )}
            >
              <Sparkles
                className="h-[19px] w-[19px] text-white"
                strokeWidth={1.8}
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#101012]" />
            </div>

            {/* Brand text */}
            <div
              className={cn(
                "min-w-0 overflow-hidden whitespace-nowrap",
                "transition-[width,opacity] duration-200 motion-reduce:transition-none",
                collapsed
                  ? "w-0 opacity-0 lg:invisible"
                  : "w-auto opacity-100",
              )}
            >
              <p className="truncate text-[13px] font-bold tracking-tight text-zinc-950 dark:text-white">
                Portfolio CMS
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.19em] text-zinc-400 dark:text-zinc-500">
                Admin Studio
              </p>
            </div>
          </NavLink>

          {/* Desktop collapse control */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              "text-zinc-400 transition-colors",
              "hover:bg-zinc-100 hover:text-zinc-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              "dark:hover:bg-white/[0.07] dark:hover:text-white lg:flex",
              collapsed && "lg:hidden",
            )}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:hover:bg-white/[0.07] dark:hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className={cn(
            "sidebar-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain",
            "px-3 py-5",
          )}
        >
          {/* Section label */}
          <div
            className={cn(
              "mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em]",
              "text-zinc-400 dark:text-zinc-600",
              collapsed && "lg:px-0 lg:text-center",
            )}
          >
            <span className={collapsed ? "lg:hidden" : ""}>
              Workspace
            </span>

            {collapsed && (
              <span className="hidden lg:inline" aria-hidden="true">
                •••
              </span>
            )}
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const badgeValue =
                item.badgeKey === "unreadMessages" &&
                  unreadMessagesCount > 0
                  ? unreadMessagesCount
                  : null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={handleNavigation}
                  title={collapsed ? item.name : undefined}
                  aria-label={
                    collapsed
                      ? `${item.name}${badgeValue ? `, ${badgeValue} unread` : ""
                      }`
                      : undefined
                  }
                  className={({ isActive }) =>
                    cn(
                      "group relative flex min-h-10 items-center gap-3 rounded-xl",
                      "text-[12px] font-medium",
                      "transition-colors duration-150 motion-reduce:transition-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                      collapsed
                        ? "justify-center px-0 py-2.5 lg:mx-auto lg:w-11"
                        : "px-3 py-2.5",
                      isActive
                        ? "bg-linear-to-r from-purple-500/20 via-purple-500/10 to-purple-500/5 text-purple-500 border-l-2 border-purple-500 shadow-sm  shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        : " hover:bg-purple-500/5 hover:text-zinc-900  dark:hover:text-zinc-100",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>


                      {/* Icon */}
                      <Icon
                        aria-hidden="true"
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          "transition-colors",
                        )}
                        strokeWidth={isActive ? 2 : 1.7}
                      />

                      {/* Label */}
                      <span
                        className={cn(
                          "min-w-0 flex-1 truncate whitespace-nowrap",
                          "transition-[width,opacity] duration-200 motion-reduce:transition-none",
                          collapsed
                            ? "w-0 overflow-hidden opacity-0 lg:hidden"
                            : "w-auto opacity-100",
                        )}
                      >
                        {item.name}
                      </span>

                      {/* Unread count */}
                      {badgeValue !== null && (
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center justify-center",
                            "rounded-full bg-violet-600 font-semibold text-white",
                            "tabular-nums",
                            collapsed
                              ? "absolute right-0 top-0 h-2.5 w-2.5 border-2 border-white text-[0px] dark:border-[#101012] lg:right-0.5 lg:top-0.5"
                              : "ml-auto min-w-5 px-1.5 py-0.5 text-[9px] dark:bg-violet-500",
                          )}
                          aria-label={`${badgeValue} unread messages`}
                        >
                          <span className={collapsed ? "sr-only" : ""}>
                            {badgeValue > 99 ? "99+" : badgeValue}
                          </span>
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-zinc-200/70 p-3 dark:border-white/[0.07]">
          {/* Profile link */}
          <NavLink
            to="/profile"
            onClick={handleNavigation}
            title={collapsed ? profileName : undefined}
            className={({ isActive }) =>
              cn(
                "group flex min-w-0 items-center gap-3 rounded-xl",
                "transition-colors duration-150 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                collapsed
                  ? "justify-center p-1.5 lg:mx-auto lg:w-11"
                  : "bg-zinc-50/80 p-2.5 hover:bg-zinc-100 dark:bg-white/[0.035] dark:hover:bg-white/[0.07]",
                isActive && "ring-1 ring-violet-500/20",
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Avatar */}
                <div className="relative h-9 w-9 shrink-0">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      loading="lazy"
                      className="h-full w-full rounded-full border border-zinc-200 object-cover dark:border-white/[0.12]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-violet-500/15 bg-violet-500/10 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                      {getInitials(profileName)}
                    </div>
                  )}

                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full",
                      "border-2 border-white dark:border-[#101012]",
                      isAvailable ? "bg-emerald-500" : "bg-zinc-400",
                    )}
                    title={
                      isAvailable ? "Available for work" : "Not available"
                    }
                  />
                </div>

                {/* Profile details */}
                <div
                  className={cn(
                    "min-w-0 flex-1 overflow-hidden",
                    "transition-[width,opacity] duration-200 motion-reduce:transition-none",
                    collapsed
                      ? "w-0 opacity-0 lg:hidden"
                      : "w-auto opacity-100",
                  )}
                >
                  <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {profileName}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                    {profileRole}
                  </p>
                </div>

                {!collapsed && (
                  <ArrowUpRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-zinc-400",
                      "transition-colors group-hover:text-violet-500",
                    )}
                  />
                )}
              </>
            )}
          </NavLink>

          {/* Availability footer */}
          {!collapsed && (
            <div className="mt-3 flex items-center justify-between gap-2 px-2 pb-1">
              <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                Work status
              </span>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-[10px] font-medium",
                  isAvailable
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isAvailable ? "bg-emerald-500" : "bg-zinc-400",
                  )}
                />
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Collapsed desktop expand button */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className={cn(
            "fixed left-[60px] top-[22px] z-[60] hidden h-7 w-7",
            "items-center justify-center rounded-xl",
            "border border-zinc-200 bg-white text-zinc-500 shadow-sm",
            "transition-colors hover:bg-zinc-100 hover:text-zinc-900",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
            "dark:border-white/[0.1] dark:bg-[#18181b] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white",
            "lg:flex",
          )}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </>
  );
}

export default Sidebar;