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
} from "lucide-react";
import { useData } from "../context/DataContext.jsx";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "About", path: "/about", icon: User },
  { name: "Services", path: "/services", icon: Briefcase },
  { name: "Skills", path: "/skills", icon: Cpu },
  { name: "Projects", path: "/projects", icon: FolderGit2 },
  { name: "Blogs", path: "/blogs", icon: BookOpen },
  { name: "FAQ", path: "/faq", icon: HelpCircle },
  { name: "Testimonials", path: "/testimonials", icon: MessageSquareQuote },
  { name: "Contact", path: "/contact", icon: Mail, badgeKey: "unreadMessages" },
  { name: "Profile", path: "/profile", icon: UserCheck },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { messages, profile } = useData();
  const unreadMessagesCount = messages.filter(
    (m) => m.status === "unread"
  ).length;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed bottom-0 left-0 top-0 z-50 flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950 ${collapsed ? "w-[76px]" : "w-64"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* ============================================================
            Brand header
            ============================================================ */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-3 dark:border-zinc-800/80">
          <div className="flex min-w-0 items-center gap-3">
            {/* Logo mark */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-100">
              <Sparkles className="h-4.5 w-4.5 text-violet-400 dark:text-violet-600" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>

            {/* Brand text */}
            <div
              className={`flex min-w-0 flex-col whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
            >
              <span className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Portfolio CMS
              </span>
              <span className="truncate font-code text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                Admin Studio
              </span>
            </div>
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            id="sidebar-collapse-toggle"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:flex ${collapsed ? "" : ""
              }`}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* ============================================================
            Navigation
            ============================================================ */}
        <nav
          className={`flex-1 space-y-1 px-3 py-4 ${collapsed
              ? "overflow-visible"
              : "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const badgeValue =
              item.badgeKey === "unreadMessages" && unreadMessagesCount > 0
                ? unreadMessagesCount
                : null;

            return (
              <div key={item.path} className="group relative">
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      "relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                      collapsed
                        ? "justify-center px-0 py-2.5"
                        : "px-3 py-2.5",
                      isActive
                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/80 dark:text-zinc-100"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && !collapsed && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-violet-500"
                        />
                      )}

                      {/* Icon */}
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive
                            ? "text-violet-500"
                            : ""
                          }`}
                      />

                      {/* Label */}
                      <span
                        className={`whitespace-nowrap transition-all duration-300 ${collapsed
                            ? "w-0 overflow-hidden opacity-0"
                            : "w-auto opacity-100"
                          }`}
                      >
                        {item.name}
                      </span>

                      {/* Unread badge */}
                      {badgeValue && !collapsed && (
                        <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold tabular-nums text-white">
                          {badgeValue > 99 ? "99+" : badgeValue}
                        </span>
                      )}

                      {/* Collapsed dot indicator */}
                      {badgeValue && collapsed && (
                        <span
                          aria-hidden="true"
                          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950"
                        />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Tooltip — collapsed only */}
                {collapsed && (
                  <div className="pointer-events-none fixed left-[84px] z-50 hidden -translate-y-[34px] items-center group-hover:flex">
                    <div className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-zinc-800/20 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl dark:border-zinc-200/20 dark:bg-zinc-100 dark:text-zinc-900">
                      {item.name}
                      {badgeValue && (
                        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold tabular-nums text-white">
                          {badgeValue}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ============================================================
            Footer — profile
            ============================================================ */}
        <div className="shrink-0 border-t border-zinc-100 p-3 dark:border-zinc-800/80">
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen(false)}
            title="Edit profile"
            className={[
              "group flex items-center gap-3 rounded-lg transition-all duration-200",
              collapsed
                ? "justify-center p-1.5"
                : "bg-zinc-50 p-2 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
              />
              <span
                title={
                  profile.isAvailable !== false
                    ? "Available for work"
                    : "Not available"
                }
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-zinc-950 ${profile.isAvailable !== false
                    ? "bg-emerald-500"
                    : "bg-zinc-400"
                  }`}
              />
            </div>

            {/* Name / role */}
            <div
              className={`flex min-w-0 flex-col overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
            >
              <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {profile.name}
              </span>
              <span className="truncate text-[10px] text-zinc-500">
                {profile.role}
              </span>
            </div>

            {/* Chevron on hover */}
            {!collapsed && (
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}