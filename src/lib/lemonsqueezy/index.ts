interface CreateCheckoutSessionResponse {
  data: {
    id: string;
    url: string;
  };
}
export const createCheckoutSession = async (params: {
  variantId: string;
  customerEmail: string;
}): Promise<CreateCheckoutSessionResponse> => {
  const { variantId, customerEmail } = params;

  const response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          test_mode: process.env.LEMONSQUEEZY_TEST_MODE === "true",
          checkout_data: {
            email: customerEmail,
            variant_quantities: [
              {
                variant_id: variantId,
                quantity: 1,
              },
            ],
          },
        },
      },
    }),
  });

  const data = (await response.json()) as CreateCheckoutSessionResponse;

  return data;
};
