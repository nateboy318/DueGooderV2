"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import useUserName from "@/hooks/useUserName";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Settings,
  CreditCard,
  Users,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  User,
  LogOut,
  Bell,
  ChevronLeft,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev =>
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/app",
      icon: Home,
      active: pathname === "/app",
    },
    {
      id: "duey",
      label: "Duey",
      href: "/app/duey",
      icon: MessageCircle,
      active: pathname === "/app/duey",
    },
    {
      id: "flashcards",
      label: "Flashcards",
      href: "/app/flashcards",
      icon: BookOpen,
      active: pathname === "/app/flashcards",
    },
    {
      id: "users",
      label: "Classes",
      icon: Users,
      active: pathname.startsWith("/app/classes"),
      children: [
        { label: "My Classes", href: "/app/classes" },
        { label: "Add Class", href: "/app/classes/add" },
        { label: "Class Settings", href: "/app/classes/settings" },
      ],
    },
    {
      id: "account",
      label: "Account",
      icon: User,
      children: [
        { label: "Profile", href: "/app/profile" },
        { label: "Settings", href: "/app/settings" },
        { label: "Notifications", href: "/app/notifications" },
      ],
    },
    {
      id: "calendar",
      label: "Calendar",
      href: "/app/calendar",
      icon: Calendar,
      active: pathname === "/app/calendar",
    },
    {
      id: "billing",
      label: "Billing",
      href: "/app/billing",
      icon: CreditCard,
    },
    {
      id: "docs",
      label: "Documentation",
      href: "/docs",
      icon: FileText,
    },
  ];

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden py-16 text-center">
        <Button
          type="button"
          onClick={() => onClose()}
          className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-gray-800 border border-gray-800 text-white text-sm font-medium rounded-lg shadow-2xs align-middle hover:bg-gray-950 focus:outline-hidden focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200 dark:focus:bg-neutral-200"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="app-sidebar"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
          Open
        </Button>
      </div>

      {/* Sidebar */}
      <div
        id="app-sidebar"
        className={`hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-all duration-300 transform h-full fixed top-0 start-0 bottom-0 z-60
        bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700`}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2 max-h-16">
            
            {isCollapsed && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="flex-none w-full justify-center text-xl font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                aria-label="Expand navigation"
              >
                <ChevronRight className="size-4" />
              </Button>
            )}

            <div className="flex items-center gap-2">
              {/* Collapse Toggle Button - Desktop Only (when not collapsed) */}
              {!isCollapsed && (
                <div className="hidden lg:block">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onToggleCollapse}
                    className="flex justify-center items-center flex-none gap-x-3 size-9 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    aria-label="Collapse navigation"
                  >
                    <X className="shrink-0 size-4" />
                    <span className="sr-only">Navigation Toggle</span>
                  </Button>
                </div>
              )}

              {/* Close Button - Mobile Only */}
              <div className="lg:hidden -me-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                >
                  <X className="shrink-0 size-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
          </header>

          
          {/* Navigation Body */}
          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="pb-0 px-2 pt-2 w-full flex flex-col flex-wrap">
              <ul className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                  if (item.children && !isCollapsed) {
                    return (
                      <li key={item.id}>
                        <Collapsible
                          open={openAccordions.includes(item.id)}
                          onOpenChange={() => toggleAccordion(item.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
                            >
                              <item.icon className="size-4" />
                              {item.label}
                              {openAccordions.includes(item.id) ? (
                                <ChevronDown className="ms-auto size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" />
                              ) : (
                                <ChevronRight className="ms-auto size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <ul className="pt-1 ps-7 flex flex-col gap-1">
                              {item.children.map((child, index) => (
                                <li key={index}>
                                  <Link
                                    href={child.href}
                                    className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </CollapsibleContent>
                        </Collapsible>
                      </li>
                    );
                  }

                  // For collapsed state, show only main items without children
                  if (item.children && isCollapsed) {
                    return (
                      <li key={item.id}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full flex items-center justify-center py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
                          title={item.label}
                        >
                          <item.icon className="size-4" />
                        </Button>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href || "#"}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-x-3.5'} py-2 px-2.5 text-sm rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200 ${
                          item.active
                            ? "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
                            : "text-gray-800"
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <item.icon className="size-4" />
                        {!isCollapsed && (
                          <>
                            {item.label}
                            {item.label === "Calendar" && (
                              <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-gray-200 text-gray-800 rounded-full dark:bg-neutral-600 dark:text-neutral-200">
                                New
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
