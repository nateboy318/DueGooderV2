"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { appConfig } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";


const CTAText = "Get Started";
const CTAHref = "/#pricing";

const signInEnabled = process.env.NEXT_PUBLIC_SIGNIN_ENABLED === "true";

const links = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing", 
    href: "/#pricing",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export function Header({ scroll = false }: { scroll?: boolean }) {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 flex w-full justify-center bg-white backdrop-blur-xl transition-all ${
        scroll ? "" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-1.5">
            <p className="text-xl font-semibold">
              <span className="rounded-md border-l-[5px] border-l-myBlue bg-myBlue/20 px-[8px]">
                {appConfig.projectName}
              </span>
            </p>
          </a>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {links.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    "text-foreground/60"
                  )}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          <div className="mx-auto hidden items-center md:block">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Events tracked:</span>
              <span className="font-mono font-bold text-primary">1,234</span>
            </div>
          </div>
          <ThemeSwitcher />
          {session ? (
            <a
              href="/app"
              className="hidden md:block"
            >
              <Button className="gap-2 px-6 py-2" variant="default" size="sm">
                <span>Dashboard</span>
              </Button>
            </a>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 px-6 py-2 md:flex"
              variant="default"
              size="sm"
              asChild
            >
              <Link href="/sign-in">
                <span>Sign In</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <div className="hidden h-9 w-28 rounded-full lg:flex"></div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
