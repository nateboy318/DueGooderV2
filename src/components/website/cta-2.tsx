"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";

export function CTA2() {
  return (
    <aside className="border-y border-border/40" aria-label="Call to Action">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join our team of 5,000+ users who are already transforming their
            workflow with Indie Kit.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>5,000+ active users</span>
            </div>
          </div>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/#pricing">Get Indie Kit Pro</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            199$ discount for the first 100 users
          </p>
        </div>
      </div>
    </aside>
  );
}
