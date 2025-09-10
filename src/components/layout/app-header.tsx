"use client";

import { UserButton } from "@/components/layout/user-button";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { appConfig } from "@/lib/config";
  
interface AppHeaderProps {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export function AppHeader({ onMenuClick, sidebarCollapsed = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex w-full justify-center bg-white backdrop-blur-xl transition-all border-b border-gray-200 dark:border-neutral-700 dark:shadow-neutral-800">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="flex items-center gap-2"
            >
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>
          
            <div className="hidden lg:flex items-center flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 dark:text-white">
              <span className="rounded-md border-l-[5px] border-l-myBlue bg-myBlue/20 px-[8px] font-bold">
                  {appConfig.projectName}
                </span>
            </div>
          
          {/* Desktop Spacer */}
          <div className={`hidden lg:block ${sidebarCollapsed ? 'flex-1' : 'flex-1'}`} />
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
} 