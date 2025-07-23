import { db } from "@/db";
import { paypalContext } from "@/db/schema/paypal";
import { eq } from "drizzle-orm";
import { addSeconds } from "date-fns";
import { paypalAccessTokens } from "@/db/schema/paypal";
import { plans } from "@/db/schema/plans";
import { appConfig } from "../config";
import { users } from "@/db/schema/user";
import { randomUUID } from "crypto";

export const PAYPAL_BASE_URL =
  process.env.NEXT_PUBLIC_PAYPAL_IS_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const base64EncodedCredentials = Buffer.from(
  `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
).toString("base64");

async function fetchNewToken() {
  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${base64EncodedCredentials}`,
    },
    body: formData,
  });

  const tokenData = await response.json();
  if (!tokenData.access_token) {
    console.error("Failed to get access token", tokenData);
    throw new Error("Failed to get access token");
  }

  const expiresAt = addSeconds(new Date(), tokenData.expires_in);
  return { token: tokenData.access_token, expiresAt };
}

export async function getPaypalAuthToken(forceRefresh = false) {
  let authToken = null;

  try {
    const [token] = await db.select().from(paypalAccessTokens).limit(1);
    authToken = token;
  } catch (error) {
    console.error("Error fetching token from database:", error);
  }

  if (
    !authToken ||
    forceRefresh ||
    new Date(authToken.expiresAt) < new Date()
  ) {
    try {
      const newTokenData = await fetchNewToken();

      if (authToken) {
        await db
          .delete(paypalAccessTokens)
          .where(eq(paypalAccessTokens.id, authToken.id));
      }

      // Let Drizzle handle the id generation
      const [newAuthToken] = await db
        .insert(paypalAccessTokens)
        .values({
          token: newTokenData.token,
          expiresAt: newTokenData.expiresAt,
        })
        .returning();

      authToken = newAuthToken;
    } catch (error) {
      console.error("Error fetching or creating new token:", error);
      throw error;
    }
  }

  return authToken.token;
}

export async function cancelPaypalSubscription(contextId: string) {
  // Find the context
  const [context] = await db.select().from(paypalContext).where(eq(paypalContext.id, contextId)).limit(1);
  if (!context || !context.paypalSubscriptionId) throw new Error("Subscription not found");
  // Cancel on PayPal
  const authToken = await getPaypalAuthToken();
  const res = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${context.paypalSubscriptionId}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({ reason: "User requested cancellation" }),
  });
  if (!res.ok) throw new Error("Failed to cancel subscription on PayPal");
  // Update status in DB
  await db.update(paypalContext).set({ status: "cancelled" }).where(eq(paypalContext.id, contextId));
  return true;
}

export const createPaypalOrderLink = async (planId: string, userId: string) => {
  const authToken = await getPaypalAuthToken();
  const contextId = randomUUID();
  const plan = await db
    .select()
    .from(plans)
    .where(eq(plans.id, planId))
    .limit(1)
    .then((res) => res[0]);
  const price = plan?.onetimePrice;
  if (!price) {
    throw new Error("Price not found");
  }
  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: price / 100,
          },
        },
      ],
      application_context: {
        brand_name: appConfig.projectName,
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/success?provider=paypal&paypalContextId=${contextId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?provider=paypal&code=PAYPAL_CANCELLED&paypalContextId=${contextId}`,
      },
    }),
  });
  const data = await response.json();
  const approvalUrl = data.links.find((link: { rel: string; href: string }) => link.rel === "approve")?.href;
  if (!approvalUrl) throw new Error("PayPal order approval URL not found. Something went wrong calling paypal api.");
  // Insert context row in DB
  await db.insert(paypalContext).values({
    id: contextId,
    planId,
    userId,
    frequency: "onetime",
    paypalOrderId: data.id,
    status: "pending",
  });
  return approvalUrl;
};

export const createPaypalSubscriptionLink = async (
  planId: string,
  userId: string,
  frequency: string
) => {
  const authToken = await getPaypalAuthToken();
  const contextId = randomUUID();
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(res => res[0]);
  const plan = await db.select().from(plans).where(eq(plans.id, planId)).limit(1).then(res => res[0]);
  let paypalPlanId = null;
  if (frequency === "monthly") {
    paypalPlanId = plan?.monthlyPaypalPlanId;
  } else if (frequency === "yearly") {
    paypalPlanId = plan?.yearlyPaypalPlanId;
  }
  if (!paypalPlanId) {
    throw new Error("Price ID not configured for this plan");
  }
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      plan_id: paypalPlanId,
      quantity: 1,
      subscriber: {
        email_address: user?.email,
      },
      application_context: {
        brand_name: appConfig.projectName,
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/success?provider=paypal&paypalContextId=${contextId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/error?provider=paypal&code=PAYPAL_CANCELLED&paypalContextId=${contextId}`,
      },
      payment_method: {
        payer_selected: "CREDIT_CARD",
        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
      },
    }),
  });
  const data = await response.json();
  const approvalUrl = data.links.find((link: { rel: string; href: string }) => link.rel === "approve")?.href;
  if (!approvalUrl) throw new Error("PayPal subscription approval URL not found. Something went wrong calling paypal api.");
  // Insert context row in DB
  await db.insert(paypalContext).values({
    id: contextId,
    planId,
    userId,
    frequency,
    paypalSubscriptionId: data.id,
    status: "pending",
  });
  return approvalUrl;
};
