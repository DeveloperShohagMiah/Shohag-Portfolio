import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-xs font-medium rounded-xl bg-card text-card-foreground shadow-xl border border-border',
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
