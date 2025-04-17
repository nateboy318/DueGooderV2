import { auth, signIn } from "@/auth";
import { db } from "@/db";
import { plans } from "@/db/schema/plans";
import { users } from "@/db/schema/user";
import {
  createOneTimePaymentCheckout,
  createSubscriptionCheckout,
} from "@/lib/dodopayments";
import { createCheckoutSession } from "@/lib/lemonsqueezy";
import {
  PlanProvider,
  PlanType,
  subscribeParams,
  SubscribeParams,
} from "@/lib/plans/getSubscribeUrl";
import stripe from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<
    SubscribeParams & {
      billing_country?: string;
      billing_state?: string;
      billing_city?: string;
      billing_street?: string;
      billing_zipcode?: string;
      tax_id?: string;
    }
  >;
}) {
  const { codename, type, provider, trialPeriodDays } = await searchParams;

  try {
    subscribeParams.parse({
      codename,
      type,
      provider,
      trialPeriodDays: trialPeriodDays ? Number(trialPeriodDays) : undefined,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?code=INVALID_PARAMS&message=${error.message}`
      );
    }
    throw error;
  }

  const session = await auth();

  if (!session?.user?.email) {
    return signIn();
  }

  const dbUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!dbUsers?.[0]) {
    return signIn();
  }

  const user = dbUsers[0];

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

      // Check if existing subscription for this user

      if (user.stripeSubscriptionId) {
        // If this is onetime plan then redirect to error page with message to
        // cancel existing subscription
        if (type === PlanType.ONETIME) {
          return redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?code=STRIPE_CANCEL_BEFORE_SUBSCRIBING`
          );
        }
        // If this is monthly or yearly plan then redirect to billing page
        return redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/billing`);
      }

      //  Create checkout session
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        mode: type === PlanType.ONETIME ? "payment" : "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: trialPeriodDays
          ? {
              trial_period_days: trialPeriodDays,
            }
          : undefined,
        customer: user.stripeCustomerId ?? undefined,
        customer_email: user.stripeCustomerId
          ? undefined
          : session?.user?.email ?? undefined,
        billing_address_collection: "required",
        tax_id_collection: {
          enabled: true,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/success?provider=${provider}&codename=${codename}&type=${type}&sessionId={CHECKOUT_SESSION_ID}&trialPeriodDays=${trialPeriodDays}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/cancel?provider=${provider}&codename=${codename}&type=${type}&sessionId={CHECKOUT_SESSION_ID}&trialPeriodDays=${trialPeriodDays}`,
      });

      if (!stripeCheckoutSession.url) {
        throw new Error("Checkout session URL not found");
      }
      return redirect(stripeCheckoutSession.url);
    case PlanProvider.LEMON_SQUEEZY:
      const lemonsqueezyKey: keyof typeof plan | null =
        type === PlanType.MONTHLY
          ? "monthlyLemonSqueezyVariantId"
          : type === PlanType.YEARLY
          ? "yearlyLemonSqueezyVariantId"
          : type === PlanType.ONETIME
          ? "onetimeLemonSqueezyVariantId"
          : null;

      if (!lemonsqueezyKey) {
        return notFound();
      }
      const lemonsqueezyVariantId = plan[lemonsqueezyKey];
      if (!lemonsqueezyVariantId) {
        return notFound();
      }

      // Check if existing subscription for this user
      if (user.lemonSqueezySubscriptionId) {
        // If this is onetime plan then redirect to error page with message to
        // cancel existing subscription
        if (type === PlanType.ONETIME) {
          return redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?code=LEMON_SQUEEZY_CANCEL_BEFORE_SUBSCRIBING`
          );
        }
        // If this is monthly or yearly plan then redirect to billing page
        return redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/billing`);
      }

      const checkoutSession = await createCheckoutSession({
        variantId: lemonsqueezyVariantId,
        customerEmail: session?.user?.email ?? "",
      });
      if (!checkoutSession.data.url) {
        throw new Error("Checkout session URL not found");
      }
      return redirect(checkoutSession.data.url);
    case PlanProvider.DODO:
      const dodoKey: keyof typeof plan | null =
        type === PlanType.MONTHLY
          ? "monthlyDodoProductId"
          : type === PlanType.YEARLY
          ? "yearlyDodoProductId"
          : type === PlanType.ONETIME
          ? "onetimeDodoProductId"
          : null;


      if (!dodoKey) {
        return notFound();
      }
      const dodoProductId = plan[dodoKey];
      if (!dodoProductId) {
        return notFound();
      }

      // Check if existing subscription for this user
      if (user.dodoSubscriptionId) {
        // If this is onetime plan then redirect to error page with message to
        // cancel existing subscription
        if (type === PlanType.ONETIME) {
          return redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?code=DODO_CANCEL_BEFORE_SUBSCRIBING`
          );
        }
        // If this is monthly or yearly plan then redirect to billing page
        return redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/billing`);
      }
      const {
        billing_country,
        billing_state,
        billing_city,
        billing_street,
        billing_zipcode,
        tax_id,
      } = await searchParams;
      // Check if billing information is provided in the query parameters
      const hasBillingInfo =
        billing_country &&
        billing_state &&
        billing_city &&
        billing_street &&
        billing_zipcode;

      // If not, redirect to the billing form
      if (!hasBillingInfo) {
        // Create the current URL as the callback URL
        const currentUrl = new URL(
          `/app/subscribe`,
          process.env.NEXT_PUBLIC_APP_URL
        );

        // Add all current search params to the URL
        Object.entries(searchParams).forEach(([key, value]) => {
          if (typeof value === "string") {
            currentUrl.searchParams.set(key, value);
          }
        });

        return redirect(
          `/app/subscribe/billing-form?callbackUrl=${encodeURIComponent(
            currentUrl.toString()
          )}`
        );
      }

      // Extract tax ID from query parameters if available
      const taxId = tax_id;

      // Create checkout session based on plan type
      let dodoCheckoutResponse;
      if (type === PlanType.ONETIME) {
        dodoCheckoutResponse = await createOneTimePaymentCheckout({
          productId: dodoProductId,
          customerEmail: session?.user?.email ?? "",
          customerId: user.dodoCustomerId ?? undefined,
          billing: {
            country: billing_country,
            state: billing_state,
            city: billing_city,
            street: billing_street,
            zipcode: billing_zipcode,
          },
          taxId: taxId,
        });
      } else {
        dodoCheckoutResponse = await createSubscriptionCheckout({
          productId: dodoProductId,
          customerEmail: session?.user?.email ?? "",
          customerId: user.dodoCustomerId ?? undefined,
          trialPeriodDays: trialPeriodDays
            ? Number(trialPeriodDays)
            : undefined,
          billing: {
            country: billing_country,
            state: billing_state,
            city: billing_city,
            street: billing_street,
            zipcode: billing_zipcode,
          },
          taxId: taxId,
        });
      }

      if (!dodoCheckoutResponse.payment_link) {
        throw new Error("DodoPayments checkout link not found");
      }
      return redirect(dodoCheckoutResponse.payment_link);
    default:
      return <div>Provider not found</div>;
  }
}

export default SubscribePage;
