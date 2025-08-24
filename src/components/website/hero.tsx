"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";
import AvatarCircles from "@/components/ui/avatar-circles";
import { cn } from "@/lib/utils";
import HyperText from "@/components/ui/hyper-text";
import WordRotate from "@/components/ui/word-rotate";

import IconCloud from "@/components/ui/icon-cloud";

export function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg text-foreground">
      <IconCloud
        iconSlugs={[
          "nextdotjs",
          "stripe",
          "lemonsqueezy",
          "vercel",
          "tailwindcss",
          "shadcnui",
          "typescript",
          "resend",
          "mailgun",
          "mailchimp",
          "postgresql",
          "mongodb",
          "upstash",
          "planetscale",
        ]}
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
      {/* Hero Section */}
      <section className="overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12" aria-label="Hero">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Left Column */}
            <div className="flex flex-col justify-center lg:col-span-6">
              <h1 className="mt-8 text-4xl font-bold tracking-tight sm:mt-10 sm:text-5xl lg:mt-12 lg:text-6xl">
                <span className="inline-block">Ship your</span>
                <WordRotate
                  className="text-primary inline-block"
                  words={["Startup", "SaaS", "AI App", "B2B SaaS"]}
                />
                <HyperText as="span" startOnView delay={600}>
                  in days, not months.
                </HyperText>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:mt-6">
                NextJS 15 boilerplate with all the features you need to build
                your SaaS, AI, or B2B application and get it to market faster.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-6 lg:mt-12">
                <Button size="lg" asChild>
                  <Link href="/#pricing">Get Indie Kit Pro</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/#features">Tech Stack</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Built with tech stack that you are already familiar with.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-4">
                  <AvatarCircles avatarUrls={avatarUrls} numPeople={4996} />
                  <div className="text-sm">
                    <p className="font-medium">5,000+ developers</p>
                    <p className="text-muted-foreground">
                      Already using boilerplates
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < 4
                            ? "fill-primary text-primary"
                            : "fill-muted text-muted"
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
              <IconCloudDemo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
