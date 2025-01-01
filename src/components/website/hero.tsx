"use client";

import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import Link from "next/link";
import { Star } from "lucide-react";
import AvatarCircles from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";

function HeroVideoDialogDemo() {
  return (
    <div className="relative">
      <HeroVideoDialog
        className="dark:hidden block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}

export function WebsiteHero() {
  const avatarUrls = [
    {
      imageUrl: "https://i.pravatar.cc/150?img=1",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=2",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=3",
      profileUrl: "#",
    },
    {
      imageUrl: "https://i.pravatar.cc/150?img=4",
      profileUrl: "#",
    },
  ];

  return (
    <>
      {/* Announcement Banner */}
      <div className="relative overflow-hidden border-b border-border/40 bg-muted/20 dark:bg-muted/5">
        <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-2 px-4 py-3 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-lg bg-background/60 px-3 py-1 text-sm backdrop-blur">
            <span className="mr-2 font-semibold text-primary">📣 New</span>
            <span>Introducing our new AI-powered features</span>
            <Button variant="link" size="sm" className="ml-2 h-auto p-0" asChild>
              <Link href="/features">Learn more →</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Left Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:mt-10 sm:text-5xl lg:mt-12 lg:text-6xl">
                Automate your workflow with AI
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:mt-6">
                No matter what problem you have, our AI can help you solve it.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-6 lg:mt-12">
                <Button size="lg" asChild>
                  <Link href="/sign-up">Get started for free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#features">Learn more</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                7 day free trial. No credit card required.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-4">
                  <AvatarCircles avatarUrls={avatarUrls} numPeople={4996} />
                  <div className="text-sm">
                    <p className="font-medium">5,000+ active users</p>
                    <p className="text-muted-foreground">Join them today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative mt-12 lg:col-span-6 lg:mt-0">
              <HeroVideoDialogDemo />
            </div>
          </div>

          {/* Trusted By Section */}
          <div className="mt-16 sm:mt-24">
            <p className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Trusted by leading teams
            </p>
            <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center grayscale transition hover:grayscale-0"
                >
                  <img
                    src={`https://startup-template-sage.vercel.app/company-${i + 1}.svg`}
                    alt={`Company ${i + 1}`}
                    className="h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 