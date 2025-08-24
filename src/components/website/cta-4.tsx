"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const benefits = [
  "Free 7-day trial",
  "No credit card required",
  "Cancel anytime",
  "24/7 support",
];

export function CTA4() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thanks for signing up! Check your email for next steps.");
    setEmail("");
    setIsLoading(false);
  };

  return (
    <aside className="relative overflow-hidden" aria-label="Call to Action">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5" />

      <div className="relative mx-auto max-w-(--breakpoint-xl) px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start your AI journey today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the power of AI-driven automation. Join thousands of
              businesses that are already transforming their workflow.
            </p>

            {/* Benefits List */}
            <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Testimonial */}
            <figure className="mt-12">
              <blockquote className="text-lg font-medium leading-8">
                &ldquo;This platform has completely transformed how we handle our data
                processing. The AI-powered insights have been a game-changer for our
                business.&rdquo;
              </blockquote>
              <figcaption className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src="https://picsum.photos/150/150?random=3"
                      alt="Sarah Chen"
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">
                      CTO at TechFlow
                    </div>
                  </div>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-3xl bg-background p-8 shadow-xs ring-1 ring-border/10 sm:p-12">
              <h3 className="text-2xl font-bold">Get started for free</h3>
              <p className="mt-4 text-muted-foreground">
                Try our platform free for 7 days. No credit card required.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Creating account..."
                    ) : (
                      <>
                        Get started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                By signing up, you agree to our{" "}
                <a href="/terms" className="underline hover:text-primary">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 