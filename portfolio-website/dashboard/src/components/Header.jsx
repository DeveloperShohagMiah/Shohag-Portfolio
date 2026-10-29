import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sun,
  Moon,
  Bell,
  Check,
  LogOut,
  User,
  Menu,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  ChevronDown,
  Settings,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext.jsx";
import { useData } from "../context/DataContext.jsx";
import toast from "react-hot-toast";
import {
  authApi,
  useUserLogoutMutation,
  useUserProfileQuery,
} from "@/redux/features/authApi.js";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function getInitials(name) {
  if (!name || typeof name !== "string") return "S";

  const parts = name.trim().split(/\s+/).filter(Boolean);

  return parts.length
    ? parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("")
    : "S";
}

function IconButton({
  children,
  label,
  onClick,
  title,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title || label}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center",
        "rounded-xl border border-transparent",
        "text-zinc-500 transition-colors duration-150",
        "hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
        "dark:text-zinc-400 dark:hover:border-white/[0.08]",
        "dark:hover:bg-white/[0.06] dark:hover:text-white",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownHeading({ title, description, action }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3.5 dark:border-white/[0.07]">
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function Header({ onMobileMenuToggle }) {
  const { theme, toggleTheme } = useTheme();

  const {
    notifications = [],
    markNotificationRead,
    clearAllNotifications,
    profile = {},
    searchQuery,
    setSearchQuery,
    resetAllToDefault,
  } = useData();

  const safeNotifications = Array.isArray(notifications)
    ? notifications
    : [];

  const safeProfile = profile ?? {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const [userLogout, { isLoading: isLogoutLoading }] =
    useUserLogoutMutation();

  const {
    data: profileData,
    isLoading: isProfileLoading,
  } = useUserProfileQuery();

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const resetRef = useRef(null);
  const searchRef = useRef(null);

  const unreadNotifCount = safeNotifications.filter(
    (notification) => !notification?.read,
  ).length;

  const name =
    profileData?.data?.name ||
    (isProfileLoading ? "Loading profile..." : "Unknown user");

  const email = profileData?.data?.email || "";

  const isAvailable = safeProfile.isAvailable !== false;

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      if (
        resetRef.current &&
        !resetRef.current.contains(event.target)
      ) {
        setShowResetConfirmation(false);
      }
    }

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      setShowNotifications(false);
      setShowProfileMenu(false);
      setShowResetConfirmation(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeDropdowns = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
    setShowResetConfirmation(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications((previous) => !previous);
    setShowProfileMenu(false);
    setShowResetConfirmation(false);
  };

  const handleProfileToggle = () => {
    setShowProfileMenu((previous) => !previous);
    setShowNotifications(false);
    setShowResetConfirmation(false);
  };

  const handleLogout = async () => {
    try {
      const response = await userLogout().unwrap();

      toast.success(response?.message || "Logged out successfully");
    } catch (error) {
      toast.error(
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Logout failed",
      );
    } finally {
      dispatch(authApi.util.resetApiState());
      closeDropdowns();
      navigate("/login", { replace: true });
    }
  };

  const handleReset = () => {
    try {
      resetAllToDefault();
      setShowResetConfirmation(false);
      toast.success("Reset action completed");
    } catch (error) {
      toast.error(error?.message || "Unable to reset data");
    }
  };

  const handleMarkAllRead = () => {
    clearAllNotifications();
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      markNotificationRead(notification.id);
    }
  };

  return (
    <header
      id="main-header"
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between gap-3",
        "border-b border-zinc-200/80 bg-white/85 px-3 backdrop-blur-xl",
        "transition-colors duration-200 sm:px-5 lg:px-6",
        "dark:border-white/[0.07] dark:bg-[#101012]/90",
        "motion-reduce:transition-none",
      )}
    >
      {/* Left section */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Mobile navigation */}
        <IconButton
          label="Open navigation menu"
          onClick={onMobileMenuToggle}
          className="lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </IconButton>

        {/* Global search */}
        <div
          ref={searchRef}
          className="relative w-full max-w-[520px]"
        >
          <Search
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-3.5 top-1/2",
              "-translate-y-1/2 h-4 w-4 text-zinc-400",
              "dark:text-zinc-500",
            )}
          />

          <input
            id="global-search-input"
            type="search"
            value={searchQuery ?? ""}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search anything..."
            aria-label="Search dashboard"
            className={cn(
              "h-10 w-full rounded-xl border border-zinc-200/80",
              "bg-zinc-50/80 pl-10 pr-10 text-xs text-zinc-900",
              "placeholder:text-zinc-400",
              "transition-colors duration-150",
              "hover:border-zinc-300",
              "focus:border-violet-400 focus:bg-white focus:outline-none",
              "focus:ring-2 focus:ring-violet-500/10",
              "dark:border-white/[0.07] dark:bg-white/[0.035]",
              "dark:text-zinc-100 dark:placeholder:text-zinc-600",
              "dark:hover:border-white/[0.13]",
              "dark:focus:border-violet-500/60 dark:focus:bg-white/[0.045]",
              "motion-reduce:transition-none",
            )}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className={cn(
                "absolute right-2.5 top-1/2 flex h-6 w-6",
                "-translate-y-1/2 items-center justify-center rounded-md",
                "text-zinc-400 transition-colors",
                "hover:bg-zinc-200 hover:text-zinc-800",
                "dark:hover:bg-white/[0.1] dark:hover:text-white",
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Reset action */}
        <div ref={resetRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => {
              setShowResetConfirmation((previous) => !previous);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            title="Reset dashboard data"
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl px-3",
              "text-[11px] font-medium text-zinc-500",
              "transition-colors hover:bg-zinc-100 hover:text-zinc-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              "dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white",
            )}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {showResetConfirmation && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-950/5 dark:border-white/[0.08] dark:bg-[#18181b] dark:shadow-black/20">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <RefreshCw className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    Reset dashboard data?
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                    This runs your existing reset action. Confirm before
                    continuing.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirmation(false)}
                  className="rounded-xl px-3 py-2 text-[11px] font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl bg-violet-600 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-violet-700"
                >
                  Confirm reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <IconButton
          id="theme-toggle-btn"
          label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-[17px] w-[17px] text-amber-400" />
          ) : (
            <Moon className="h-[17px] w-[17px]" />
          )}
        </IconButton>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <IconButton
            id="notifications-dropdown-btn"
            label="Notifications"
            onClick={handleNotificationToggle}
            aria-expanded={showNotifications}
            aria-controls="notifications-panel"
            className={showNotifications ? "bg-zinc-100 dark:bg-white/[0.07]" : ""}
          >
            <Bell className="h-[17px] w-[17px]" />

            {unreadNotifCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full border-2 border-white bg-violet-600 px-0.5 text-[8px] font-bold text-white dark:border-[#101012]">
                {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
              </span>
            )}
          </IconButton>

          {showNotifications && (
            <div
              id="notifications-panel"
              role="dialog"
              aria-label="Notifications"
              className={cn(
                "absolute right-0 top-full z-50 mt-2",
                "w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-2xl",
                "border border-zinc-200 bg-white",
                "shadow-xl shadow-zinc-950/[0.08]",
                "dark:border-white/[0.08] dark:bg-[#18181b]",
                "dark:shadow-black/25",
              )}
            >
              <DropdownHeading
                title="Notifications"
                description={`${unreadNotifCount} unread update${unreadNotifCount !== 1 ? "s" : ""}`}
                action={
                  unreadNotifCount > 0 ? (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold text-violet-600 transition-colors hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  ) : null
                }
              />

              <div className="max-h-[340px] overflow-y-auto">
                {safeNotifications.length > 0 ? (
                  safeNotifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "flex w-full gap-3 border-b border-zinc-100 p-3.5 text-left",
                        "transition-colors last:border-b-0",
                        "hover:bg-zinc-50 dark:border-white/[0.05]",
                        "dark:hover:bg-white/[0.035]",
                        !notification.read &&
                        "bg-violet-50/40 dark:bg-violet-500/[0.045]",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                          notification.read
                            ? "bg-zinc-100 text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-400"
                            : "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                        )}
                      >
                        <Bell className="h-3.5 w-3.5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">
                            {notification.title}
                          </span>

                          {!notification.read && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                          )}
                        </span>

                        <span className="mt-1 block text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                          {notification.description}
                        </span>

                        {notification.time && (
                          <span className="mt-1.5 block text-[9px] text-zinc-400 dark:text-zinc-500">
                            {notification.time}
                          </span>
                        )}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center px-5 py-10 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-white/[0.05]">
                      <Bell className="h-5 w-5" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      All caught up
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-400">
                      No notifications to show right now.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Vertical separator */}
        <div className="mx-1 hidden h-7 w-px bg-zinc-200 dark:bg-white/[0.08] sm:block" />

        {/* Profile menu */}
        <div ref={profileRef} className="relative">
          <button
            id="profile-dropdown-btn"
            type="button"
            onClick={handleProfileToggle}
            aria-label="Open user profile menu"
            aria-expanded={showProfileMenu}
            aria-controls="profile-menu"
            className={cn(
              "group flex h-10 items-center gap-2 rounded-xl p-1.5",
              "transition-colors hover:bg-zinc-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              "dark:hover:bg-white/[0.06]",
              showProfileMenu && "bg-zinc-100 dark:bg-white/[0.06]",
            )}
          >
            <div className="relative h-8 w-8 shrink-0">
              {safeProfile.avatar ? (
                <img
                  src={safeProfile.avatar}
                  alt=""
                  className="h-full w-full rounded-full border border-zinc-200 object-cover dark:border-white/[0.12]"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full border border-violet-500/15 bg-violet-500/10 text-[10px] font-bold text-violet-700 dark:text-violet-300">
                  {getInitials(name === "Loading profile..." ? safeProfile.name : name)}
                </span>
              )}

              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full",
                  "border-2 border-white dark:border-[#101012]",
                  isAvailable ? "bg-emerald-500" : "bg-zinc-400",
                )}
              />
            </div>

            <div className="hidden max-w-[120px] text-left xl:block">
              <p className="truncate text-[11px] font-semibold text-zinc-800 dark:text-zinc-100">
                {name}
              </p>
              <p className="mt-0.5 text-[9px] text-zinc-400">
                Administrator
              </p>
            </div>

            <ChevronDown
              className={cn(
                "mr-0.5 hidden h-3.5 w-3.5 text-zinc-400 transition-transform xl:block",
                showProfileMenu && "rotate-180",
              )}
            />
          </button>

          {showProfileMenu && (
            <div
              id="profile-menu"
              role="dialog"
              aria-label="User profile menu"
              className={cn(
                "absolute right-0 top-full z-50 mt-2",
                "w-[min(288px,calc(100vw-24px))] overflow-hidden rounded-2xl",
                "border border-zinc-200 bg-white p-2",
                "shadow-xl shadow-zinc-950/[0.08]",
                "dark:border-white/[0.08] dark:bg-[#18181b]",
                "dark:shadow-black/25",
              )}
            >
              {/* User details */}
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-white/[0.035]">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0">
                    {safeProfile.avatar ? (
                      <img
                        src={safeProfile.avatar}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-700 dark:text-violet-300">
                        {getInitials(name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {name}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                      {email || "No email available"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-violet-500/10 px-2 py-1 text-[9px] font-semibold text-violet-700 dark:text-violet-300">
                    <ShieldCheck className="h-3 w-3" />
                    Portfolio Admin
                  </span>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[9px] font-medium",
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
              </div>

              {/* Navigation actions */}
              <div className="space-y-0.5 py-2">
                <Link
                  to="/profile"
                  onClick={closeDropdowns}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-[11px] font-medium text-zinc-700",
                    "transition-colors hover:bg-zinc-100",
                    "dark:text-zinc-300 dark:hover:bg-white/[0.06]",
                  )}
                >
                  <User className="h-4 w-4 text-zinc-400" />
                  <span className="flex-1">Manage profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </Link>

                <a
                  href="https://demo.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeDropdowns}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-[11px] font-medium text-zinc-700",
                    "transition-colors hover:bg-zinc-100",
                    "dark:text-zinc-300 dark:hover:bg-white/[0.06]",
                  )}
                >
                  <ExternalLink className="h-4 w-4 text-zinc-400" />
                  <span className="flex-1">View live portfolio</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                </a>
              </div>

              {/* Logout */}
              <div className="border-t border-zinc-100 pt-2 dark:border-white/[0.07]">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-left text-[11px] font-medium text-rose-600",
                    "transition-colors hover:bg-rose-50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "dark:text-rose-400 dark:hover:bg-rose-500/[0.08]",
                  )}
                >
                  {isLogoutLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}

                  <span>
                    {isLogoutLoading ? "Logging out..." : "Log out"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;