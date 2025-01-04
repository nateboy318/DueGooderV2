import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import APIError from "@/lib/api/errors";
import getOrCreateUser from "@/lib/users/getOrCreateUser";
import { users } from "@/db/schema/user";
import { plans } from "@/db/schema/plans";
import { db } from "@/db";
import { eq, or } from "drizzle-orm";
import updatePlan from "@/lib/plans/updatePlan";
import downgradeToDefaultPlan from "@/lib/plans/downgradeToDefaultPlan";

type User = typeof users.$inferSelect;

class StripeWebhookHandler {
  private data: Stripe.Event.Data;
  private eventType: string;
  private user: User;

  constructor(data: Stripe.Event.Data, eventType: string, user: User) {
    this.data = data;
    this.user = user;
    this.eventType = eventType;
  }
  async handleOutsidePlanManagementProductInvoicePaid() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Invoice = this.data.object;
    console.log("Outside plan management product invoice paid", object);
    // TODO: Implement
  }

  async onInvoicePaid() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Invoice = this.data.object;

    // Get first item
    const item = object.lines.data[0];
    if (!item) {
      throw new APIError("No item found in invoice");
    }

    if (item.subscription) {
      // Subscription is created, skip "customer.subscription.created" or "customer.subscription.updated" will handle this
      return;
    }

    const price = item.price;

    if (price) {
      // Check if item is a subscription
      const dbPlan = await this._getPlanFromStripePriceId(price.id);

      if (!dbPlan) {
        await this.handleOutsidePlanManagementProductInvoicePaid();
      } else {
        await updatePlan({
          userId: this.user.id,
          newPlanId: dbPlan.id,
        });
      }
    } else {
      await this.handleOutsidePlanManagementProductInvoicePaid();
    }
  }

  async _getPlanFromStripePriceId(priceId: string) {
    const plan = await db
      .select()
      .from(plans)
      .where(
        or(
          eq(plans.monthlyStripePriceId, priceId),
          eq(plans.yearlyStripePriceId, priceId),
          eq(plans.onetimeStripePriceId, priceId)
        )
      )
      .limit(1);

    if (plan.length === 0) {
      return null;
    }

    return plan[0];
  }

  async onSubscriptionUpdated() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Subscription = this.data.object;

    if (this.user.stripeSubscriptionId !== object.id) {
      // Subscription is not for this user, skip
      return;
    }

    const price = object.items.data[0].price;
    if (!price) {
      throw new APIError("No price found in subscription");
    }

    const isActive = object.status === "active" || object.status === "trialing";

    if (!isActive) {
      // Subscription is cancelled, downgrade to free plan
      await downgradeToDefaultPlan({ userId: this.user.id });
      return;
    }

    const dbPlan = await this._getPlanFromStripePriceId(price.id);
    if (!dbPlan) {
      // TIP: Handle outside plan management subscription
      return;
    }

    await updatePlan({ userId: this.user.id, newPlanId: dbPlan.id });
  }

  async onSubscriptionCreated() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Subscription = this.data.object;
    const price = object.items.data[0].price;
    if (!price) {
      throw new APIError("No price found in subscription");
    }
    const dbPlan = await this._getPlanFromStripePriceId(price.id);
    if (!dbPlan) {
      // TIP: Handle outside plan management subscription
      throw new APIError("Plan not found");
    }
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ stripeSubscriptionId: object.id })
        .where(eq(users.id, this.user.id));
      await updatePlan({ userId: this.user.id, newPlanId: dbPlan.id });
    });
  }

  async onSubscriptionDeleted() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Subscription = this.data.object;

    if (this.user.stripeSubscriptionId !== object.id) {
      // Subscription is not for this user, skip
      return;
    }
    await downgradeToDefaultPlan({ userId: this.user.id });
  }

  async onCustomerCreated() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Customer = this.data.object;
    await db
      .update(users)
      .set({ stripeCustomerId: object.id })
      .where(eq(users.id, this.user.id));
  }
}

async function handler(req: NextRequest) {
  if (req.method === "POST") {
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

    const { user } = await getOrCreateUser({
      emailId: data.object.customer_email,
      name: data.object.customer_name,
    });

    const handler = new StripeWebhookHandler(data, eventType, user);
    try {
      switch (eventType) {
        case "invoice.paid":
          await handler.onInvoicePaid();
          break;
        case "customer.created":
          await handler.onCustomerCreated();
          break;
        case "customer.subscription.created":
          await handler.onSubscriptionCreated();
          break;
        case "customer.subscription.updated":
          await handler.onSubscriptionUpdated();
          break;
        case "customer.subscription.deleted":
          await handler.onSubscriptionDeleted();
          break;
        default:
          // Unhandled event type
          break;
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
