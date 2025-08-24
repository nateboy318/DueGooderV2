"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";

const plans = [
  {
    name: "Indie Kit",
    description: "Perfect for building B2C products",
    price: 79,
    anchorPrice: 349,
    showBorderBeam: true,
    paymentLink:
      "https://checkout.dodopayments.com/buy/pdt_ICnsTbAPy8VERlAgVo9QJ?quantity=1&redirect_url=https://indiekit.pro%2Fpayment-success",
    features: [
      "NextJS boilerplate",
      "SEO & Blog",
      "SES/Mailgun/Resend Emails",
      "Stripe/Lemon Squeezy",
      "Planetscale/NeonDB",
      "Background Jobs",
      "Google Auth & Magic Link",
      "Components & UI",
      "Quota Management Hooks",
      "Super Admin Dashboard",
      "Waitlist Module",
      "Working Contact Form",
      "MDX Blog",
      "Pro tips for better coding workflow",
      "Plan Management",
      "Discord Community",
      "Lifetime Updates",
    ],
  },
  {
    name: "ShipFast",
    description: "Competitor's offering",
    price: 249,
    anchorPrice: 349,
    isCompetitor: true,
    features: [
      "NextJS boilerplate",
      "SEO & Blog",
      "Mailgun emails",
      "Stripe / Lemon Squeezy",
      "MongoDB / Supabase",
      "Google Oauth & Magic Links",
      "Components & animations",
      "ChatGPT prompts for terms & privacy",
      "Discord community & Leaderboard",
      "$1,210 worth of discounts",
      "Lifetime updates",
    ],
    negativePoints: [
      "No TypeScript",
      "No Shadcn/UI",
      "No Background Jobs",
      "No Quota Management",
      "No Super Admin Dashboard",
      "No Plan Management",
    ],
  },
];

export function WebsitePricing() {
  return (
    <section className="py-16 sm:py-24" id="pricing">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Save Money & Development Time
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get more features at a fraction of the cost.{" "}
            <span className="font-bold text-primary">
              68% cheaper than competitors
            </span>
          </p>
        </div>
        {/* Pricing Cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl ${plan.isCompetitor ? "bg-muted/20" : "bg-muted/40"} p-8 shadow-xs ring-1 ring-border/60`}
            >
              {plan.showBorderBeam && <BorderBeam />}
              <div className="mb-8">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <div className="flex items-end gap-2">
                    <span
                      className={`text-4xl font-bold ${plan.isCompetitor ? "text-muted-foreground" : ""}`}
                    >
                      ${plan.price}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-muted-foreground line-through">
                        ${plan.anchorPrice}
                      </span>
                      <span className="text-sm text-green-500">
                        ${plan.anchorPrice - plan.price} off
                      </span>
                    </div>
                  </div>
                </div>
                {!plan.isCompetitor && (
                  <div className="flex flex-row gap-2">
                    <Badge className="mt-2">One time payment</Badge>
                    <Badge className="mt-2">Early Access</Badge>
                  </div>
                )}
              </div>
              {plan.paymentLink && (
                <Button className="w-full" asChild>
                  <Link href={plan.paymentLink}>Get Indie Kit Pro</Link>
                </Button>
              )}
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check
                      className={`h-4 w-4 ${plan.isCompetitor ? "text-muted-foreground" : "text-primary"}`}
                    />
                    <span
                      className={
                        plan.isCompetitor ? "text-muted-foreground" : ""
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.negativePoints && (
                  <>
                    <li className="mt-6 pt-6 border-t border-border">
                      <span className="text-sm font-medium text-muted-foreground">
                        What&apos;s missing:
                      </span>
                    </li>
                    {plan.negativePoints.map((point) => (
                      <li key={point} className="flex items-center gap-3">
                        <X className="h-4 w-4 text-destructive" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* B2B Card */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-3xl bg-muted/40 p-8 shadow-xs ring-1 ring-border/60">
            <div className="mb-8">
              <h3 className="text-xl font-bold">B2B Indie Kit</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Perfect for building B2B SaaS with team & workspace features
              </p>
              <div className="mt-4">
                <Badge variant="secondary" className="mr-2">
                  Coming Soon
                </Badge>
                <Badge>Save 50+ hours</Badge>
              </div>
            </div>
            <ul className="mt-8 space-y-3 text-sm grid grid-cols-2 gap-4">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Team Management</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Workspace Models</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Role-based Access</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Team Hooks</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Workspace Hooks</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <span>Multi-tenant Setup</span>
              </li>
            </ul>
            <Button className="w-full mt-8" asChild>
              <Link href="/join-waitlist">Join B2B Waitlist</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
