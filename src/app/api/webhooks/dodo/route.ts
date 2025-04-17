import { NextRequest, NextResponse } from "next/server";
import APIError from "@/lib/api/errors";
import getOrCreateUser from "@/lib/users/getOrCreateUser";
import { users } from "@/db/schema/user";
import { plans } from "@/db/schema/plans";
import { db } from "@/db";
import { eq, or } from "drizzle-orm";
import updatePlan from "@/lib/plans/updatePlan";
import downgradeToDefaultPlan from "@/lib/plans/downgradeToDefaultPlan";
import { Webhook } from "standardwebhooks";

class DodoPaymentsWebhookHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private data: any;
  private eventType: string;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(data: any, eventType: string) {
    this.data = data;
    this.eventType = eventType;
  }

  async handleOutsidePlanManagementProductPaid() {
    // TODO: Implement your own logic here
  }

  // Payment Events
  async onPaymentSucceeded() {
    const payment = this.data;
    
    if (!payment?.customer?.email) {
      return;
    }

    try {
      const { user } = await getOrCreateUser({
        emailId: payment.customer.email,
        name: payment.customer.name,
      });

      // For one-time payments
      const productId = payment.product_cart?.[0]?.product_id;

      if (!productId) {
        // Must be a subscription payment, so we don't need to handle this
        throw new APIError("No product found in payment");
      }

      // Update user's Dodo customer ID if not set
      if (!user.dodoCustomerId && payment.customer.customer_id) {
        await db
          .update(users)
          .set({
            dodoCustomerId: payment.customer.customer_id,
          })
          .where(eq(users.id, user.id));
      }

      const dbPlan = await this._getPlanFromDodoProductId(productId);

      if (!dbPlan) {
        await this.handleOutsidePlanManagementProductPaid();
      } else {
        await updatePlan({
          userId: user.id,
          newPlanId: dbPlan.id,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async onPaymentFailed() {
    // Payment failed, no action needed
  }

  async onPaymentProcessing() {
    // Payment is in process, no action needed
  }

  async onPaymentCancelled() {
    // Payment was cancelled, no plan updates needed
  }

  // Refund Events
  async onRefundSucceeded() {
    // No specific action needed for refunds
  }

  async onRefundFailed() {
    // No action needed
  }

  // Dispute Events
  async onDisputeOpened() {
    // Flag the account, may want to notify admin
  }

  async onDisputeExpired() {
    // No action needed
  }

  async onDisputeAccepted() {
    // May need to downgrade the user's plan if dispute was about payment
  }

  async onDisputeCancelled() {
    // No action needed
  }

  async onDisputeChallenged() {
    // No action needed
  }

  async onDisputeWon() {
    // Ensure user's plan is correct
  }

  async onDisputeLost() {
    // May need to downgrade the user's plan
  }

  async _getPlanFromDodoProductId(productId: string) {
    try {
      const plan = await db
        .select()
        .from(plans)
        .where(
          or(
            eq(plans.monthlyDodoProductId, productId),
            eq(plans.yearlyDodoProductId, productId),
            eq(plans.onetimeDodoProductId, productId)
          )
        )
        .limit(1);

      if (plan.length === 0) {
        return null;
      }

      return plan[0];
    } catch (error) {
      throw error;
    }
  }

  // Subscription Events
  async onSubscriptionCreated() {
    const subscription = this.data;

    if (!subscription?.customer?.email) {
      return;
    }

    try {
      const { user } = await getOrCreateUser({
        emailId: subscription.customer.email,
        name: subscription.customer.name,
      });

      // Update user's Dodo customer ID if not set
      if (!user.dodoCustomerId && subscription.customer.customer_id) {
        await db
          .update(users)
          .set({
            dodoCustomerId: subscription.customer.customer_id,
            dodoSubscriptionId: subscription.subscription_id,
          })
          .where(eq(users.id, user.id));
      } else {
        // Just update subscription ID
        await db
          .update(users)
          .set({
            dodoSubscriptionId: subscription.subscription_id,
          })
          .where(eq(users.id, user.id));
      }

      // Get the product ID from the subscription
      const productId = subscription.product_id;
      if (!productId) {
        throw new APIError("No product found in subscription");
      }

      const dbPlan = await this._getPlanFromDodoProductId(productId);
      if (!dbPlan) {
        // Handle outside plan management subscription
        return;
      }

      await updatePlan({ userId: user.id, newPlanId: dbPlan.id });
    } catch (error) {
      throw error;
    }
  }

  async onSubscriptionActive() {
    // Same handling as created since it's also an active subscription
    await this.onSubscriptionCreated();
  }

  async onSubscriptionOnHold() {
    const subscription = this.data;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.dodoSubscriptionId, subscription.subscription_id))
        .limit(1);

      if (!user?.[0]) {
        return;
      }

      // You may want to notify the user that their subscription is on hold
      // TODO: Send notification to user
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }

  async onSubscriptionRenewed() {
    const subscription = this.data;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.dodoSubscriptionId, subscription.subscription_id))
        .limit(1);

      if (!user?.[0]) {
        return;
      }

      // Ensure the plan is still correctly set
      const productId = subscription.product_id;
      if (!productId) {
        return;
      }

      const dbPlan = await this._getPlanFromDodoProductId(productId);
      if (!dbPlan) {
        return;
      }

      await updatePlan({ userId: user[0].id, newPlanId: dbPlan.id });
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }

  async onSubscriptionPaused() {
    const subscription = this.data;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.dodoSubscriptionId, subscription.subscription_id))
        .limit(1);

      if (!user?.[0]) {
        return;
      }

      // You may want to update the user's access or notify them
      // TODO: Consider updating user access or sending notification
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }

  async onSubscriptionCancelled() {
    const subscription = this.data;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.dodoSubscriptionId, subscription.subscription_id))
        .limit(1);

      if (!user?.[0]) {
        return;
      }

      await downgradeToDefaultPlan({ userId: user[0].id });
    } catch (error) {
      // Handle error
      console.error(error);
    }
  }

  async onSubscriptionFailed() {
    // You may want to notify the user or admin
  }

  async onSubscriptionExpired() {
    // Handle similar to cancellation
    await this.onSubscriptionCancelled();
  }

  // License Key Events
  async onLicenseKeyCreated() {
    const licenseKey = this.data;
    console.log("License key created", licenseKey);
    // Store the license key info if needed
  }

  async onCustomerCreated() {
    const customer = this.data;

    if (!customer?.email) {
      return;
    }

    try {
      const { user } = await getOrCreateUser({
        emailId: customer.email,
        name: customer.name,
      });

      await db
        .update(users)
        .set({
          dodoCustomerId: customer.customer_id,
        })
        .where(eq(users.id, user.id));
    } catch (error) {
      console.error(error);
    }
  }
}

async function handler(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const bodyText = await req.text();
      // Check if webhook signing is configured
      const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
      
      if (webhookSecret) {
        // Retrieve the event by verifying the signature using the raw body and secret
        try {
          const webhook = new Webhook(webhookSecret);
          const headers = {
            "webhook-id": req.headers.get("webhook-id") as string,
            "webhook-signature": req.headers.get("webhook-signature") as string,
            "webhook-timestamp": req.headers.get("webhook-timestamp") as string,
          };
          
          await webhook.verify(bodyText, headers);
        } catch (err) {
          console.error(err);
          return NextResponse.json({
            received: true,
            error: "Webhook signature verification failed",
          }, { status: 401 });
        }
      } else {
        if (process.env.NODE_ENV !== "development") {
          return NextResponse.json(
            {
              received: true,
              error: "Webhook secret not configured",
            },
            { status: 500 }
          );
        }
      }

      const data = JSON.parse(bodyText);
      const eventType = data.type;
      const eventData = data.data;
      
      const handler = new DodoPaymentsWebhookHandler(eventData, eventType);
      try {
        switch (eventType) {
          // Payment Events
          case "payment.succeeded":
            await handler.onPaymentSucceeded();
            break;
          case "payment.failed":
            await handler.onPaymentFailed();
            break;
          case "payment.processing":
            await handler.onPaymentProcessing();
            break;
          case "payment.cancelled":
            await handler.onPaymentCancelled();
            break;

          // Refund Events
          case "refund.succeeded":
            await handler.onRefundSucceeded();
            break;
          case "refund.failed":
            await handler.onRefundFailed();
            break;

          // Dispute Events
          case "dispute.opened":
            await handler.onDisputeOpened();
            break;
          case "dispute.expired":
            await handler.onDisputeExpired();
            break;
          case "dispute.accepted":
            await handler.onDisputeAccepted();
            break;
          case "dispute.cancelled":
            await handler.onDisputeCancelled();
            break;
          case "dispute.challenged":
            await handler.onDisputeChallenged();
            break;
          case "dispute.won":
            await handler.onDisputeWon();
            break;
          case "dispute.lost":
            await handler.onDisputeLost();
            break;

          // Subscription Events
          case "subscription.created": // This is for backward compatibility
          case "subscription.active":
            await handler.onSubscriptionActive();
            break;
          case "subscription.on_hold":
            await handler.onSubscriptionOnHold();
            break;
          case "subscription.renewed":
            await handler.onSubscriptionRenewed();
            break;
          case "subscription.paused":
            await handler.onSubscriptionPaused();
            break;
          case "subscription.cancelled":
            await handler.onSubscriptionCancelled();
            break;
          case "subscription.failed":
            await handler.onSubscriptionFailed();
            break;
          case "subscription.expired":
            await handler.onSubscriptionExpired();
            break;

          // License Key Events
          case "license_key.created":
            await handler.onLicenseKeyCreated();
            break;

          // Customer Events
          case "customer.created":
            await handler.onCustomerCreated();
            break;

          default:
            break;
        }
        
        return NextResponse.json({ received: true });
      } catch (error) {
        if (error instanceof APIError) {
          return NextResponse.json({
            received: true,
            message: error.message,
          });
        }
        return NextResponse.json({
          received: true,
          error: "Unexpected error processing webhook",
        }, { status: 500 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        received: false,
        error: "Invalid webhook payload",
      }, { status: 400 });
    }
  } else {
    return NextResponse.json({
      received: false,
      error: "Method not allowed",
    }, { status: 405 });
  }
}

export const POST = handler;

export const maxDuration = 20;
