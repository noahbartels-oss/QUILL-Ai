import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPayPalOrder, PAYPAL_PLANS } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = PAYPAL_PLANS[planId as keyof typeof PAYPAL_PLANS];

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const order = await createPayPalOrder(plan.price, plan.currency);
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
