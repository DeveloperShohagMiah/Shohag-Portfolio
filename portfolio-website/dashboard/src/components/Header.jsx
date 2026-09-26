import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Check,
  LogOut,
  User,
  Settings,
  Menu,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useData } from '../context/DataContext.jsx';
import toast from 'react-hot-toast';
import { useUserLogoutMutation } from '@/redux/features/apiSlice.js';

export function Header({ onMobileMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    profile,
    searchQuery,
    setSearchQuery,
    resetAllToDefault
  } = useData();
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userLogut, { isLoading, isError }] = useUserLogoutMutation()
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await userLogut()
      toast.success(response?.data?.message || response?.message);

      setShowProfileMenu(false);
      navigate("/login")
    } catch (error) {
      toast.error(error?.data?.message ||
        error?.data?.error ||
        error?.message)
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between transition-colors"
    >
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, skills, blogs, inquiries..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800/70 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-xl focus:outline-hidden text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Dark/Light Mode, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Reset Database button for easy testing */}
        <button
          type="button"
          onClick={resetAllToDefault}
          title="Reset to sample data"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          id="theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600 hover:text-zinc-900 transition-transform -rotate-12" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-dropdown-btn"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div
              id="notifications-panel"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Notifications
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {unreadNotifCount} unread update{unreadNotifCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${!notif.read ? 'bg-zinc-50/70 dark:bg-zinc-800/30' : ''
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-dropdown-btn"
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-hidden relative"
            aria-label="User profile menu"
          >
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900 ${profile.isAvailable !== false ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`}
                title={profile.isAvailable !== false ? 'Available for work' : 'Not available'}
              />
            </div>
          </button>

          {showProfileMenu && (
            <div
              id="profile-menu"
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2"
            >
              {/* Profile Header */}
              <div className="px-3 py-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {profile.name}
                </p>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {profile.email}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Portfolio Admin
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md ${profile.isAvailable !== false
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                  >
                    ● {profile.isAvailable !== false ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  Manage Profile &amp; Avatar
                </Link>
                <a
                  href="https://demo.app"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                  View Live Portfolio
                </a>
              </div>

              <div className="pt-2 mt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
