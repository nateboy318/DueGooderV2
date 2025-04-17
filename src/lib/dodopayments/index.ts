import client from "./client";
import { countries } from "countries-list";
interface CreateCheckoutSessionResponse {
  payment_link: string;
  client_secret?: string;
  payment_id?: string;
  subscription_id?: string;
}

// For now, using a simplified interface for billing information
interface BillingInfo {
  country: string;
  state: string;
  city: string;
  street: string;
  zipcode: string;
}

export const createOneTimePaymentCheckout = async (params: {
  productId: string;
  customerEmail: string;
  customerId?: string;
  billing: BillingInfo;
  taxId?: string;
}): Promise<CreateCheckoutSessionResponse> => {
  const { productId, customerEmail, customerId, billing, taxId } = params;
  const currency =
    countries[billing.country as keyof typeof countries].currency?.[0] ?? "USD";
  try {
    // If there's a customerId, use it, otherwise create a new customer
    const customer = customerId
      ? { customer_id: customerId }
      : {
          name: customerEmail.split("@")[0], // Simple name extraction from email
          email: customerEmail,
          create_new_customer: true,
        };

    const response = await client.payments.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer,
      // @ts-expect-error - DodoPayments types are not updated
      billing: billing,
      payment_link: true,
      tax_id: taxId,
      // @ts-expect-error - DodoPayments types are not updated
      billing_currency: currency,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/success?provider=dodo`,
    });

    return {
      payment_link: response.payment_link || "",
      client_secret: response.client_secret,
      payment_id: response.payment_id,
    };
  } catch (error) {
    console.error("Error creating DodoPayments one-time payment:", error);
    throw error;
  }
};

export const createSubscriptionCheckout = async (params: {
  productId: string;
  customerEmail: string;
  customerId?: string;
  trialPeriodDays?: number;
  billing: BillingInfo;
  taxId?: string;
}): Promise<CreateCheckoutSessionResponse> => {
  const {
    productId,
    customerEmail,
    customerId,
    trialPeriodDays,
    billing,
    taxId,
  } = params;
  try {
    // If there's a customerId, use it, otherwise create a new customer
    const customer = customerId
      ? { customer_id: customerId }
      : {
          name: customerEmail.split("@")[0], // Simple name extraction from email
          email: customerEmail,
          create_new_customer: true,
        };

    const response = await client.subscriptions.create({
      product_id: productId,
      quantity: 1,
      customer,
      // @ts-expect-error - DodoPayments types are not updated
      billing: billing,
      payment_link: true,
      tax_id: taxId,
      //   NON-USD subscriptions are not supported yet
      trial_period_days: trialPeriodDays ? trialPeriodDays : undefined,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/subscribe/success?provider=dodo`,
    });

    return {
      payment_link: response.payment_link || "",
      client_secret: response.client_secret || "",
      subscription_id: response.subscription_id,
    };
  } catch (error) {
    console.error("Error creating DodoPayments subscription:", error);
    throw error;
  }
};
