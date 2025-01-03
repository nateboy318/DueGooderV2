import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import APIError from "@/lib/api/errors";
import getOrCreateUser from "@/lib/users/getOrCreateUser";
import downgradeToDefaultPlan from "@/lib/plans/downgradeToDefaultPlan";
import { plans } from "@/db/schema/plans";
import { eq } from "drizzle-orm";
import { db } from "@/db";

async function handler(req: NextRequest) {
  if (req.method === "POST") {
    // Wait for 5 seconds to simulate a long running process
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let data;
    let eventType;
    // Check if webhook signing is configured.
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event: Stripe.Event;
      const signature = req.headers.get("stripe-signature") as string;

      try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed.`, err);
        return NextResponse.json({
          received: true,
          error: "Webhook signature verification failed",
        });
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      const body = await req.json();
      data = body.data;
      eventType = body.type;
    }

    const { user, created } = await getOrCreateUser({
      emailId: data.object.customer_email,
      name: data.object.customer_name,
    });

    try {
      switch (eventType) {
        case "checkout.session.completed":
          // Payment is successful and the subscription is created.
          // You should provision the subscription and save the customer ID to your database.
          // We cannot manage both onetime and recurring products in same checkout session
          const object: Stripe.Checkout.Session = data.object;

          console.log("Received event", eventType);
          console.log("Data", object);
          const planId = await db
            .select()
            .from(plans)
            .where(
              eq(
                plans.monthlyStripePriceId,
                object.subscription?.items.data[0].price.id
              )
            );
          break;
        case "invoice.paid":
          // Continue to provision the subscription as payments continue to be made.
          // Store the status in your database and check when a user accesses your service.
          // This approach helps you avoid hitting rate limits.
          // Do not do anything since we already created the subscription in checkout.session.completed
          break;
        case "invoice.payment_failed":
          // The payment failed or the customer does not have a valid payment method.
          // The subscription becomes past_due. Notify your customer and send them to the
          // customer portal to update their payment information.
          await downgradeToDefaultPlan({ userId: user.id });
          break;
        case "customer.subscription.deleted":
          // Delete the subscription.
          // Archive the customer.
          await downgradeToDefaultPlan({ userId: user.id });
          break;
        case "customer.subscription.updated":
          // Update the subscription.
          // TODO: Implement this
          console.log("Received event", eventType);
          console.log("Data", data);
          break;
        default:
        // Unhandled event type
      }
    } catch (error) {
      if (error instanceof APIError) {
        return NextResponse.json({
          received: true,
          message: error.message,
        });
      }
    }
    // Return a response to acknowledge receipt of the event.
    return NextResponse.json({ received: true });
  }
}

export const POST = handler;

export const maxDuration = 20;
