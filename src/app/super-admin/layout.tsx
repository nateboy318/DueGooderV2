"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  MessageSquare,
  LogOut,
  ClipboardList,
  Menu,
  Ticket,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { appConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Plans", href: "/super-admin/plans", icon: CreditCard },
  { name: "Users", href: "/super-admin/users", icon: Users },
  { name: "Lifetime Deal", href: "/super-admin/coupons", icon: Ticket },
  { name: "Messages", href: "/super-admin/messages", icon: MessageSquare },
  { name: "Waitlist", href: "/super-admin/waitlist", icon: ClipboardList },
  { name: "Logout", href: "/super-admin/logout", icon: LogOut },
];

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-1 items-center justify-between">
            <Link href="/super-admin" className="font-semibold">
              {appConfig.projectName} Admin Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Side Navigation - Desktop Only */}
        <aside className="hidden md:block w-64 border-r border-border/40 bg-background">
          <nav className="space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    "transition-colors"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
