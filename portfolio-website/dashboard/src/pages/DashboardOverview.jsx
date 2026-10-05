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
  UserCheck,
  Star,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useGetAllProjectsQuery } from '@/redux/features/projectApi.js';
import { useGetAllServicesQuery } from '@/redux/features/serviceApi.js';
import { useGetActiveSkillsQuery } from '@/redux/features/skillApi.js';
import { useGetAllBlogsQuery } from '@/redux/features/blogsApi.js';
import { useGetAllTestimonialsQuery } from '@/redux/features/testimonialsApi.js';

export function DashboardOverview() {
  const {
    profile,
    about,
    messages
  } = useData();

  const { data: projectsData, isLoading: isLoadingProjects } = useGetAllProjectsQuery();
  const { data: servicesData, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: skillsData, isLoading: isLoadingSkills } = useGetActiveSkillsQuery();
  const { data: blogsData, isLoading: isLoadingBlogs } = useGetAllBlogsQuery();
  const { data: testimonialsData, isLoading: isLoadingTestimonials } = useGetAllTestimonialsQuery()

  // Safely extract arrays from API responses
  const projects = Array.isArray(projectsData?.data.projects)
    ? projectsData.data.projects
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
    ? blogsData.data?.blogs
    : Array.isArray(blogsData)
      ? blogsData
      : [];

  const testimonials = Array.isArray(testimonialsData?.data)
    ? testimonialsData?.data
    : Array.isArray(blogsData)
      ? blogsData
      : [];

  console.log(testimonialsData)

  const activeProjectsCount = projects.filter(p => p.isActive).length;
  const featuredProjectsCount = projects.filter(p => p.isFeatured).length;
  const unreadMessagesCount = messages.filter(m => m.status === 'unread').length;
  const publishedBlogsCount = blogs.filter(b => b.isActive).length;
  const featuredBlogsCount = blogs.filter(b => b.isFeatured).length;
  const testimonialsCount = testimonials.filter(b => b.isActive).length

  const statCards = [
    {
      title: 'Total Projects',
      value: projects.length,
      subtext: `${featuredProjectsCount} featured on portfolio`,
      icon: FolderGit2,
      link: '/projects',
      accent: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
      loading: isLoadingProjects
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.isActive).length,
      subtext: `${services.length} offerings registered`,
      icon: Briefcase,
      link: '/services',
      accent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
      loading: isLoadingServices
    },
    {
      title: 'Skills & Tech',
      value: skills.length,
      subtext: 'Cataloged proficiencies',
      icon: Cpu,
      link: '/skills',
      accent: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
      loading: isLoadingSkills
    },
    {
      title: 'Published Blogs',
      value: blogs.length,
      subtext: `${publishedBlogsCount} active, ${featuredBlogsCount} featured`,
      icon: BookOpen,
      link: '/blogs',
      accent: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
      loading: isLoadingBlogs
    },
    {
      title: 'Client Inquiries',
      value: messages.length,
      subtext: `${unreadMessagesCount} unread incoming`,
      icon: Mail,
      link: '/contact',
      accent: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
      loading: false
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      subtext: 'Client feedback collected',
      icon: MessageSquareQuote,
      link: '/testimonials',
      accent: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
      loading: false
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600/20 to-transparent text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1  text-xs font-semibold bg-white/10 backdrop-blur-md text-zinc-200">
              <span className="w-2 h-2  bg-emerald-400 animate-ping" />
              Portfolio Live &amp; Ready
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1  text-xs font-semibold backdrop-blur-md ${profile.isAvailable !== false
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60'
                }`}
            >
              <span
                className={`w-1.5 h-1.5  ${profile.isAvailable !== false ? 'bg-emerald-400' : 'bg-zinc-400'
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

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="p-5  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${stat.accent}`}>
                  {stat.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="mt-4">
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {stat.loading ? '—' : stat.value}
                </span>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                  {stat.title}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {stat.loading ? 'Loading...' : stat.subtext}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Three Column Section: Recent Projects, Latest Blogs & Latest Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Preview */}
        <div className="p-6  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
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
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No projects yet. Start adding your work!
              </p>
            ) : (
              projects.slice(0, 3).map((proj) => (
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
                      {proj.stacks?.join(' • ') || 'No tech stack'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium  shrink-0 ${proj.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                  >
                    {proj.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Blogs */}
        <div className="p-6  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Recent Articles
              </h2>
              <p className="text-xs text-zinc-400">
                Latest published blog posts
              </p>
            </div>
            <Link
              to="/blogs"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {isLoadingBlogs ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              </div>
            ) : blogs.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                No articles published yet.
              </p>
            ) : (
              blogs.slice(0, 3).map((blog) => (
                <div
                  key={blog.id}
                  className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5  bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {blog.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-medium ${blog.isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-500'
                        }`}
                    >
                      {blog.isActive ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Inquiries */}
        <div className="p-6  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
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
                  {msg.status === 'unread' && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      <span className="w-1.5 h-1.5  bg-blue-500" />
                      Unread
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6  bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/projects"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Projects</span>
          </Link>
          <Link
            to="/services"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Services</span>
          </Link>
          <Link
            to="/blogs"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Blogs</span>
          </Link>
          <Link
            to="/skills"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Skills</span>
          </Link>
          <Link
            to="/testimonials"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MessageSquareQuote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Testimonials</span>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
}