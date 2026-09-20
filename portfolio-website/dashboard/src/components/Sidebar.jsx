import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  BookOpen,
  HelpCircle,
  MessageSquareQuote,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wrench
} from 'lucide-react';
import { useData } from '../context/DataContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'About', path: '/about', icon: User },
  { name: 'Services', path: '/services', icon: Wrench },
  { name: 'Skills', path: '/skills', icon: Sparkles },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Blogs', path: '/blogs', icon: BookOpen },
  { name: 'FAQ', path: '/faq', icon: HelpCircle },
  { name: 'Testimonials', path: '/testimonials', icon: MessageSquareQuote },
  { name: 'Contact', path: '/contact', icon: Mail, badgeKey: 'unreadMessages' }
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { messages, profile } = useData();
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-64'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 relative flex items-center px-4 border-b border-zinc-100 dark:border-zinc-800/80 justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div
              className={`flex flex-col transition-all duration-300 whitespace-nowrap overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}
            >
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Portfolio CMS
              </span>
              <span className="text-[11px] font-medium text-zinc-400">
                Admin Studio
              </span>
            </div>
          </div>


        </div>

        {/* Navigation Items List */}
        {/* Using no-scrollbar class & overflow-y-auto when expanded, overflow-visible when collapsed so tooltip doesn't get cut off and scrollbar is never visible */}
        <nav
          className={`flex-1 py-4 px-3 space-y-1.5 no-scrollbar ${collapsed ? 'overflow-visible' : 'overflow-y-auto'
            }`}
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const badgeValue =
              item.badgeKey === 'unreadMessages' && unreadMessagesCount > 0
                ? unreadMessagesCount
                : null;

            return (
              <div key={item.path} className="relative group">
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150 relative ${isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />

                  {/* Nav Label with proper fade/collapse animation */}
                  <span
                    className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                      }`}
                  >
                    {item.name}
                  </span>

                  {/* Unread message badge */}
                  {badgeValue && (
                    <span
                      className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white shrink-0 ${collapsed ? 'absolute top-1 right-2' : ''
                        }`}
                    >
                      {badgeValue}
                    </span>
                  )}
                </NavLink>

                {/* Floating Tooltip when collapsed */}
                {collapsed && (
                  <div className="pointer-events-none fixed left-[80px] -translate-y-9 z-50 hidden group-hover:flex items-center">
                    <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-zinc-700/40 dark:border-zinc-300/40 animate-in fade-in zoom-in-95 duration-100">
                      {item.name}
                      {badgeValue && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer User info */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 ${collapsed ? 'justify-center p-1' : ''
              }`}
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-zinc-200 dark:ring-zinc-700"
            />
            <div
              className={`flex flex-col min-w-0 transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'
                }`}
            >
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {profile.name}
              </span>
              <span className="text-[10px] text-zinc-500 truncate">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
