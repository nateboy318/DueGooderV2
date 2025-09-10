"use client";

import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Loader } from "@/components/ui/loader";
import { AppDataProvider, useAppData } from "@/contexts/AppDataContext";
import React, { useState, useEffect } from "react";
import useUser from "@/lib/users/useUser";

function DashboardSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Loader />
    </div>
  );
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading: userLoading } = useUser();
  const { classesLoading } = useAppData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false);
  
  // Track minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTimeElapsed(true);
    }, 2000); // 2 seconds minimum
    
    return () => clearTimeout(timer);
  }, []);

  // Show loader if user is loading, classes are loading, or minimum time hasn't elapsed
  const isLoading = userLoading || classesLoading || !minLoadingTimeElapsed;

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
          <div className="w-full">
            {isLoading ? <DashboardSkeleton /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppDataProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AppDataProvider>
  );
}

export default AppLayout;
