import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { PLAN_LIMITS } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, planId } = await req.json();

    const captureResult = await capturePayPalOrder(orderId);

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Determine new plan based on planId
    const newPlan = planId?.includes("ENTERPRISE") ? "ENTERPRISE" : "PRO";
    const limits = PLAN_LIMITS[newPlan];

    const periodEnd = new Date();
    if (planId?.includes("YEARLY")) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Update user plan and create subscription record
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { plan: newPlan },
      }),
      prisma.subscription.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          paypalOrderId: orderId,
          plan: newPlan,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
        update: {
          paypalOrderId: orderId,
          plan: newPlan,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        },
      }),
      prisma.usage.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          generationsUsed: 0,
          generationsMax: limits.generationsPerMonth,
          wordsGenerated: 0,
        },
        update: {
          generationsMax: limits.generationsPerMonth,
        },
      }),
    ]);

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 });
  }
}
