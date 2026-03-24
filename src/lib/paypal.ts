const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export const PAYPAL_PLANS = {
  PRO_MONTHLY: {
    id: "PRO_MONTHLY",
    name: "QUILL Pro Monthly",
    price: "19.99",
    currency: "USD",
    interval: "MONTH",
    description: "200 AI generations per month, up to 2000 words each",
  },
  PRO_YEARLY: {
    id: "PRO_YEARLY",
    name: "QUILL Pro Yearly",
    price: "179.99",
    currency: "USD",
    interval: "YEAR",
    description: "200 AI generations per month, up to 2000 words each",
  },
  ENTERPRISE_MONTHLY: {
    id: "ENTERPRISE_MONTHLY",
    name: "QUILL Enterprise Monthly",
    price: "79.99",
    currency: "USD",
    interval: "MONTH",
    description: "Unlimited AI generations, up to 5000 words each",
  },
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: string, currency = "USD") {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: "QUILL AI Pro Subscription",
        },
      ],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/dashboard/settings?payment=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/pricing?payment=cancelled`,
        brand_name: "QUILL AI",
        user_action: "PAY_NOW",
      },
    }),
  });

  return response.json();
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
}
