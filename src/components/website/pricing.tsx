"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals and small projects",
    price: {
      monthly: 19,
      yearly: 190,
    },
    features: [
      "1 User",
      "5GB Storage",
      "Basic Support",
      "Limited API Access",
      "Standard Analytics",
    ],
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses and teams",
    price: {
      monthly: 49,
      yearly: 490,
    },
    features: [
      "5 Users",
      "50GB Storage",
      "Priority Support",
      "Full API Access",
      "Advanced Analytics",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations and high-volume users",
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      "Unlimited Users",
      "500GB Storage",
      "24/7 Premium Support",
      "Custom Integrations",
      "AI-Powered Insights",
    ],
  },
];

export function WebsitePricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose the plan that's right for you
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing that grows with you. Try any plan free for
            7 days.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="relative flex items-center gap-4 rounded-full bg-muted p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative rounded-full px-4 py-1 text-sm transition ${
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative rounded-full px-4 py-1 text-sm transition ${
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="absolute -right-8 -top-8 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl bg-muted/40 p-8 shadow-sm ring-1 ring-border/60 ${
                plan.popular
                  ? "before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:rounded-full before:bg-primary before:px-3 before:py-1 before:text-xs before:font-medium before:text-primary-foreground before:content-['Popular']"
                  : ""
              }`}
            >
              <div className="mb-8">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href="/sign-up">Subscribe</Link>
              </Button>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 