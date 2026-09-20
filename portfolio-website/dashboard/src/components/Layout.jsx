import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-xs font-medium rounded-xl dark:bg-zinc-800 dark:text-zinc-100 shadow-xl border border-zinc-200 dark:border-zinc-700',
          duration: 3500
        }}
      />

      {/* Collapsible Animated Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
          }`}
      >
        <Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} collapsed={collapsed}
          setCollapsed={setCollapsed} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
