import withAuthRequired from "@/lib/auth/withAuthRequired";
import stripe from "@/lib/stripe";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = withAuthRequired(async (req, context) => {
  const user = context.session.user;

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

  return NextResponse.json({
    message: "You are not subscribed to any plan.",
  });
});
