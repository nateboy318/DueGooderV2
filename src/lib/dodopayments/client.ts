import DodoPayments from "dodopayments";

const client = new DodoPayments({
  baseURL: process.env.DODO_PAYMENTS_API_URL!,
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
});

export default client;
