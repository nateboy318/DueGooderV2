"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import useSWR from "swr";
import getSubscribeUrl, { PlanType, PlanProvider } from "@/lib/plans/getSubscribeUrl";

interface Plan {
  id: string;
  name: string;
  codename: string;
  hasMonthlyPricing: boolean;
  hasYearlyPricing: boolean;
  hasOnetimePricing: boolean;
  monthlyPrice: number;
  monthlyPriceAnchor: number;
  yearlyPrice: number;
  yearlyPriceAnchor: number;
  onetimePrice: number;
  onetimePriceAnchor: number;
  quotas: {
    canUseApp: boolean;
    numberOfThings: number;
    somethingElse: string;
  };
}

function WebsitePricing() {
  const { data, isLoading, error } = useSWR<{ plans: Plan[] }>('/api/public');

  if (isLoading) {
    return (
      <section className="py-16 sm:py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loading Plans...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data?.plans) {
    return (
      <section className="py-16 sm:py-24" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Error loading plans
            </h2>
          </div>
        </div>
      </section>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  };

  return (
    <section className="py-16 sm:py-24" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Select the perfect plan for your needs. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {data.plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl bg-muted/40 p-8 shadow-xs ring-1 ring-border/60 ${
                index === 0 ? "lg:col-span-1" : ""
              }`}
            >
              {index === 0 && <BorderBeam />}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for {plan.quotas.somethingElse || "your needs"}
                </p>
                
                {/* Pricing Display */}
                <div className="mt-6">
                  {plan.hasOnetimePricing && (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.onetimePrice)}
                      </span>
                      {plan.onetimePriceAnchor > plan.onetimePrice && (
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(plan.onetimePriceAnchor)}
                          </span>
                          <span className="text-sm text-green-500">
                            {formatPrice(plan.onetimePriceAnchor - plan.onetimePrice)} off
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {plan.hasMonthlyPricing && !plan.hasOnetimePricing && (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.monthlyPrice)}
                      </span>
                      <span className="text-sm text-muted-foreground">/month</span>
                      {plan.monthlyPriceAnchor > plan.monthlyPrice && (
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(plan.monthlyPriceAnchor)}
                          </span>
                          <span className="text-sm text-green-500">
                            {formatPrice(plan.monthlyPriceAnchor - plan.monthlyPrice)} off
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-row gap-2 mt-4">
                  {plan.hasOnetimePricing && (
                    <Badge>One time payment</Badge>
                  )}
                  {plan.hasMonthlyPricing && (
                    <Badge variant="secondary">Monthly</Badge>
                  )}
                  {plan.hasYearlyPricing && (
                    <Badge variant="secondary">Yearly</Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {plan.hasOnetimePricing && (
                  <Button className="w-full" asChild>
                    <Link href={getSubscribeUrl({
                      codename: plan.codename,
                      type: PlanType.ONETIME,
                      provider: PlanProvider.STRIPE
                    })}>
                      Buy Lifetime - {formatPrice(plan.onetimePrice)}
                    </Link>
                  </Button>
                )}
                
                {plan.hasMonthlyPricing && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={getSubscribeUrl({
                      codename: plan.codename,
                      type: PlanType.MONTHLY,
                      provider: PlanProvider.STRIPE,
                      trialPeriodDays: 7
                    })}>
                      Start Monthly - {formatPrice(plan.monthlyPrice)}/mo
                    </Link>
                  </Button>
                )}
                
                {plan.hasYearlyPricing && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={getSubscribeUrl({
                      codename: plan.codename,
                      type: PlanType.YEARLY,
                      provider: PlanProvider.STRIPE,
                      trialPeriodDays: 14
                    })}>
                      Start Yearly - {formatPrice(plan.yearlyPrice)}/year
                    </Link>
                  </Button>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Up to {plan.quotas.numberOfThings} things</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{plan.quotas.somethingElse}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WebsitePricing;
