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

class StripeWebhookHandler {
  private data: Stripe.Event.Data;
  private eventType: string;

  constructor(data: Stripe.Event.Data, eventType: string) {
    this.data = data;
    this.eventType = eventType;
  }
  async handleOutsidePlanManagementProductInvoicePaid() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Invoice = this.data.object;
    console.log("eventType", this.eventType);
    console.log("Outside plan management product invoice paid", object);
    // TODO: Implement your own logic here ex: update user credits (if you have a credits system)
  }

  async onInvoicePaid() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Invoice = this.data.object;

    if (!object.customer_email) {
      return;
    }

    const { user } = await getOrCreateUser({
      emailId: object.customer_email,
      name: object.customer_name,
    });
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
          userId: user.id,
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

    const user = await db
      .select()
      .from(users)
      .where(eq(users.stripeSubscriptionId, object.id))
      .limit(1);
    if (!user?.[0]) {
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
      await downgradeToDefaultPlan({ userId: user[0].id });
      return;
    }

    const dbPlan = await this._getPlanFromStripePriceId(price.id);
    if (!dbPlan) {
      // TIP: Handle outside plan management subscription
      return;
    }

    await updatePlan({ userId: user[0].id, newPlanId: dbPlan.id });
  }

  async _getStripeCustomer(
    customer: string | Stripe.Customer | Stripe.DeletedCustomer
  ): Promise<Stripe.Customer | null> {
    if (typeof customer === "string") {
      const response = await stripe.customers.retrieve(customer);
      if (response.deleted) {
        return null;
      }
      return response;
    }
    if (customer.deleted) {
      return null;
    }
    return customer;
  }

  async onSubscriptionCreated() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Subscription = this.data.object;
    const price = object.items.data[0].price;

    if (!price) {
      throw new APIError("No price found in subscription");
    }

    const customer = await this._getStripeCustomer(object.customer);
    if (!customer || !customer.email) {
      throw new APIError("No customer found in subscription");
    }
    const { user } = await getOrCreateUser({
      emailId: customer.email,
      name: customer.name,
    });
    const dbPlan = await this._getPlanFromStripePriceId(price.id);

    if (!dbPlan) {
      // TIP: Handle outside plan management subscription
      throw new APIError("Plan not found");
    }
    await db
      .update(users)
      .set({ stripeSubscriptionId: object.id })
      .where(eq(users.id, user.id));
    await updatePlan({ userId: user.id, newPlanId: dbPlan.id });
  }

  async onSubscriptionDeleted() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Subscription = this.data.object;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.stripeSubscriptionId, object.id))
      .limit(1);
    if (!user?.[0]) {
      // Subscription is not for this user, skip
      return;
    }
    await downgradeToDefaultPlan({ userId: user[0].id });
  }

  async onCustomerCreated() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Customer = this.data.object;
    if (!object.email) {
      throw new APIError("No email found in customer");
    }
    const { user } = await getOrCreateUser({
      emailId: object.email,
      name: object.name,
    });
    await db
      .update(users)
      .set({ stripeCustomerId: object.id })
      .where(eq(users.id, user.id));
  }

  async onCheckoutSessionCompleted() {
    // @ts-expect-error Stripe types are not fully compatible with Next.js
    const object: Stripe.Checkout.Session = this.data.object;

    // Only proceed if payment was successful
    if (object.payment_status !== "paid") {
      return;
    }

    // If this is a subscription checkout, let subscription events handle it
    if (object.mode === "subscription") {
      return;
    }

    const customer = await this._getStripeCustomer(object.customer as string);
    if (!customer || !customer.email) {
      throw new APIError("No customer found in checkout session");
    }
    const { user } = await getOrCreateUser({
      emailId: customer.email,
      name: customer.name,
    });

    await db
      .update(users)
      .set({
        stripeCustomerId: customer.id,
      })
      .where(eq(users.id, user.id));

    // Get line items to find the plan
    const lineItems = await stripe.checkout.sessions.listLineItems(object.id);

    if (lineItems.data.length === 0) {
      throw new APIError("No line items found in checkout session");
    }

    const firstItem = lineItems.data[0];
    if (!firstItem.price) {
      throw new APIError("No price found in checkout session line item");
    }

    const dbPlan = await this._getPlanFromStripePriceId(firstItem.price.id);

    if (!dbPlan) {
      // Handle outside plan management product
      return;
    }

    await updatePlan({
      userId: user.id,
      newPlanId: dbPlan.id,
    });
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

    const handler = new StripeWebhookHandler(data, eventType);
    try {
      switch (eventType) {
        case "invoice.paid":
          await handler.onInvoicePaid();
          break;
        case "checkout.session.completed":
          await handler.onCheckoutSessionCompleted();
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
