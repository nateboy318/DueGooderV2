"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

export function CTA3() {
  const { theme } = useTheme();

  return (
    <section className="overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Transform your workflow with AI-powered automation
            </h2>

            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of businesses that are saving time and increasing
              productivity with our AI solutions.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button
                size="lg"
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full"
                asChild
              >
                <Link href="/sign-up">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                asChild
              >
                <Link href="/book-demo">Book a demo</Link>
              </Button>
            </div>

            {/* Reviews */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < 5
                          ? "fill-primary-foreground text-primary-foreground"
                          : "fill-primary-foreground/20 text-primary-foreground/20"
                      )}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium">Rated 5.0 by 1,000+ users</p>
                  <p className="text-primary-foreground/60">
                    on leading review platforms
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-4xl bg-primary-foreground/10">
              {theme === 'dark' ? (
                <Image
                  src="https://picsum.photos/800/800?random=1"
                  alt="Dashboard Preview (Dark)"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="https://picsum.photos/800/800?random=2"
                  alt="Dashboard Preview (Light)"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 rounded-3xl bg-background p-6 shadow-xl ring-1 ring-border/10 sm:-bottom-8 sm:-left-8 sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-bold">50%</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Increase in productivity
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold">30hr</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Saved per month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 