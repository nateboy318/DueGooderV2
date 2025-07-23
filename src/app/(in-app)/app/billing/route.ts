import { db } from "@/db";
import { users } from "@/db/schema/user";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { eq } from "drizzle-orm";
import stripe from "@/lib/stripe";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import client from "@/lib/dodopayments/client";
import { paypalContext } from "@/db/schema/paypal";

export const GET = withAuthRequired(async (req, context) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, context.session.user.id))
    .limit(1)
    .then((res) => res[0]);

  const stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId) {
    // create customer portal link
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
    });
    return redirect(portalSession.url);
  }
  const lemonSqueezyCustomerId = user.lemonSqueezyCustomerId;
  if (lemonSqueezyCustomerId) {
    // TODO: Get lemonSqueezy customer and redirect to lemonSqueezy customer portal
  }

  const dodoCustomerId = user.dodoCustomerId;
  if (dodoCustomerId) {
    const customerPortalSession =
      await client.customers.customerPortal.create(dodoCustomerId);
    return redirect(customerPortalSession.link);
  }

  // Check if has paypal context
  const paypalContexts = await db
    .select()
    .from(paypalContext)
    .where(eq(paypalContext.userId, user.id));
  if (paypalContexts.length > 0) {
    return redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/billing/paypal`);
  }

  return NextResponse.json({
    message: "You are not subscribed to any plan.",
  });
});
