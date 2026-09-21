import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import {
  FolderGit2,
  Briefcase,
  Cpu,
  BookOpen,
  MessageSquareQuote,
  Mail,
  ArrowRight,
  ExternalLink,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';

export function DashboardOverview() {
  const {
    profile,
    about,
    projects,
    services,
    skills,
    blogs,
    testimonials,
    messages
  } = useData();

  const activeProjectsCount = projects.filter(p => p.isActive).length;
  const featuredProjectsCount = projects.filter(p => p.isFeatured).length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;

  const statCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      subtext: `${featuredProjectsCount} featured on portfolio`,
      icon: FolderGit2,
      link: '/projects',
      accent: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.isActive).length,
      subtext: `${services.length} offerings registered`,
      icon: Briefcase,
      link: '/services',
      accent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
    },
    {
      title: 'Skills & Tech',
      value: skills.length,
      subtext: 'Cataloged proficiencies',
      icon: Cpu,
      link: '/skills',
      accent: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
    },
    {
      title: 'Client Inquiries',
      value: messages.length,
      subtext: `${unreadMessagesCount} unread incoming`,
      icon: Mail,
      link: '/contact',
      accent: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Portfolio Live &amp; Ready
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${profile.isAvailable !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60'
                }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${profile.isAvailable !== false ? 'bg-emerald-400' : 'bg-zinc-400'
                  }`}
              />
              {profile.isAvailable !== false ? 'Available for work' : 'Not available'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {profile.name || 'Shohag'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Manage your profile, public contact coordinates, work availability status, featured projects, services catalog, and client inquiries from one central studio.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              Manage Profile &amp; Avatar
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-700/60"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-700/60"
            >
              Edit About Story
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-zinc-800/50 pointer-events-none blur-2xl" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${stat.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="mt-4">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stat.value}
                </span>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                  {stat.title}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {stat.subtext}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Section: Recent Projects & Latest Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Featured Projects
              </h2>
              <p className="text-xs text-zinc-400">
                Top showcase entries currently visible
              </p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:underline flex items-center gap-1"
            >
              Manage all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-14 h-11 rounded-lg object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {proj.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {proj.stacks.join(' • ')}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${proj.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                >
                  {proj.isActive ? 'Active' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Inquiries */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Incoming Inquiries
              </h2>
              <p className="text-xs text-zinc-400">
                Latest client messages and opportunities
              </p>
            </div>
            <Link
              to="/contact"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:underline flex items-center gap-1"
            >
              Open inbox
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No messages received yet.
              </p>
            ) : (
              messages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {msg.receivedAt}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
