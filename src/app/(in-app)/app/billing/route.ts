import withAuthRequired from "@/lib/auth/withAuthRequired";
import { NextResponse } from "next/server";

export const GET = withAuthRequired(async (req, context) => {
  const user = context.session.user;

  const stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId) {
    // TODO: Get stripe customer and redirect to stripe customer portal
  }
  const lemonSqueezyCustomerId = user.lemonSqueezyCustomerId;
  if (lemonSqueezyCustomerId) {
    // TODO: Get lemonSqueezy customer and redirect to lemonSqueezy customer portal
  }

  return NextResponse.json({
    message: "You are not subscribed to any plan.",
  });
});

