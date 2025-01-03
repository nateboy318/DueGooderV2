import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  MessageSquare,
  Rocket,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { appConfig } from "@/lib/config";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Plans", href: "/super-admin/plans", icon: CreditCard },
  { name: "Users", href: "/super-admin/users", icon: Users },
  { name: "Messages", href: "/super-admin/messages", icon: MessageSquare },
  { name: "Waitlist", href: "/super-admin/waitlist", icon: ClipboardList },
  { name: "Roadmap", href: "/super-admin/roadmap", icon: Rocket },
  { name: "Logout", href: "/super-admin/logout", icon: LogOut },
];

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
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
        {/* Side Navigation */}
        <aside className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-border/40 bg-background">
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
        <main className="flex-1 pl-64">
          <div className="container py-6 px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
