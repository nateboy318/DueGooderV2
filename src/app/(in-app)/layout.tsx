"use client";

import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import React, { useState } from "react";
import useUser from "@/lib/users/useUser";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Shimmer */}
      <div className="border-b border-border/40 bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {/* Logo/Brand shimmer */}
            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
            {/* Navigation items shimmer */}
            <div className="hidden md:flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
          {/* User menu shimmer */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Shimmer */}
      <div className="grow p-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Page title shimmer */}
          <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse" />

          {/* Content blocks shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-border/40 bg-card"
              >
                <div className="flex flex-col gap-4">
                  <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Shimmer */}
      <div className="border-t border-border/40 bg-background">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Footer left side */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>
          {/* Footer right side */}
          <div className="flex items-center gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen dark:bg-neutral-900">
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Mobile Header with Toggle */}
        <div className="lg:hidden">
          <AppHeader onMenuClick={() => setSidebarOpen(true)} sidebarCollapsed={sidebarCollapsed} />
        </div>
        
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <AppHeader sidebarCollapsed={sidebarCollapsed} />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
