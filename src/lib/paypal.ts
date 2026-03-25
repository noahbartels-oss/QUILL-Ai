// Use sandbox by default. Set PAYPAL_LIVE_MODE=true in Vercel env vars only
// when you have approved live PayPal credentials.
const PAYPAL_API_BASE =
  process.env.PAYPAL_LIVE_MODE === "true"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export const PAYPAL_MODE = process.env.PAYPAL_LIVE_MODE === "true" ? "live" : "sandbox";

// Revenue-optimized pricing:
// Starter $9/mo — impulse-buy price point, 3-5x conversion vs $19
// Pro $29/mo — main revenue plan, strong value vs Starter
// Agency $89/mo — anchor plan, makes Pro look affordable
// Yearly discounts ~28-30% to lock in LTV and reduce churn
export const PAYPAL_PLANS = {
  STARTER_MONTHLY: {
    id: "STARTER_MONTHLY",
    name: "QUILL Starter Monthly",
    price: "9.00",
    currency: "USD",
    interval: "MONTH",
    plan: "STARTER",
    description: "60 AI generations/month, up to 1,000 words each",
  },
  STARTER_YEARLY: {
    id: "STARTER_YEARLY",
    name: "QUILL Starter Yearly",
    price: "79.00",
    currency: "USD",
    interval: "YEAR",
    plan: "STARTER",
    description: "60 AI generations/month, up to 1,000 words each — save $29",
  },
  PRO_MONTHLY: {
    id: "PRO_MONTHLY",
    name: "QUILL Pro Monthly",
    price: "29.00",
    currency: "USD",
    interval: "MONTH",
    plan: "PRO",
    description: "500 AI generations/month, up to 3,000 words each",
  },
  PRO_YEARLY: {
    id: "PRO_YEARLY",
    name: "QUILL Pro Yearly",
    price: "249.00",
    currency: "USD",
    interval: "YEAR",
    plan: "PRO",
    description: "500 AI generations/month, up to 3,000 words each — save $99",
  },
  AGENCY_MONTHLY: {
    id: "AGENCY_MONTHLY",
    name: "QUILL Agency Monthly",
    price: "89.00",
    currency: "USD",
    interval: "MONTH",
    plan: "AGENCY",
    description: "Unlimited generations, up to 6,000 words each",
  },
  AGENCY_YEARLY: {
    id: "AGENCY_YEARLY",
    name: "QUILL Agency Yearly",
    price: "749.00",
    currency: "USD",
    interval: "YEAR",
    plan: "AGENCY",
    description: "Unlimited generations, up to 6,000 words each — save $319",
  },
};

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret || clientId === "your-paypal-client-id") {
    throw new Error("PayPal credentials not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.");
  }

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("PayPal returned no access token — check your credentials.");
  }
  return data.access_token;
}

export async function createPayPalOrder(amount: string, currency = "USD") {
  const accessToken = await getPayPalAccessToken();

  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

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
          description: "QUILL AI Subscription",
        },
      ],
      application_context: {
        return_url: `${baseUrl}/dashboard/settings?payment=success`,
        cancel_url: `${baseUrl}/pricing?payment=cancelled`,
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
