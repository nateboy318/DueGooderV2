"use client";

import Link from "next/link";
import { appConfig } from "@/lib/config";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12">
          {/* Brand and Description */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-3">
            <Link href="/" className="text-lg font-semibold">
              {appConfig.projectName}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {appConfig.description}
            </p>
          </div>

          {/* Product Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-primary"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-primary"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-muted-foreground hover:text-primary"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-primary"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-primary"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-muted-foreground hover:text-primary"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold">Social</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {appConfig.social.twitter && (
                <li>
                  <a
                    href={appConfig.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                  </a>
                </li>
              )}
              {appConfig.social.instagram && (
                <li>
                  <a
                    href={appConfig.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>
                </li>
              )}
              {appConfig.social.youtube && (
                <li>
                  <a
                    href={appConfig.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Youtube className="h-4 w-4" />
                    <span>Youtube</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} {appConfig.projectName}
          </p>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
