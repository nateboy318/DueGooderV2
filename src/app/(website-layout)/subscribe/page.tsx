import { auth } from "@/auth";
import { db } from "@/db";
import { plans } from "@/db/schema/plans";
import {
  PlanProvider,
  PlanType,
  SubscribeParams,
} from "@/lib/plans/getSubscribeUrl";
import stripe from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React from "react";

async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<SubscribeParams>;
}) {
  const { codename, type, provider } = await searchParams;
  const session = await auth();
  //   Step 1: Get the plan
  const plansList = await db
    .select()
    .from(plans)
    .where(eq(plans.codename, codename))
    .limit(1);

  if (!plansList?.[0]) {
    return notFound();
  }

  const plan = plansList[0];

  switch (provider) {
    case PlanProvider.STRIPE:
      // Check type and get price id from db
      const key: keyof typeof plan | null =
        type === PlanType.MONTHLY
          ? "monthlyStripePriceId"
          : type === PlanType.YEARLY
            ? "yearlyStripePriceId"
            : type === PlanType.ONETIME
              ? "onetimeStripePriceId"
              : null;

      if (!key) {
        return notFound();
      }
      const priceId = plan[key];
      if (!priceId) {
        return notFound();
      }
      //  Create checkout session
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: type === PlanType.ONETIME ? "payment" : "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: session?.user?.email ?? undefined,
        success_url: `${process.env.NEXT_PUBLIC_URL}/subscribe/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscribe/cancel`,
      });

      if (!checkoutSession.url) {
        throw new Error("Checkout session URL not found");
      }
      return redirect(checkoutSession.url);
    case PlanProvider.LEMON_SQUEEZY:
      return <div>Lemon Squeezy is not implemented yet</div>;
    default:
      return <div>Provider not found</div>;
  }
}

export default SubscribePage;
