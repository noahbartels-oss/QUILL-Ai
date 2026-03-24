import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, PlanKey } from "@/lib/anthropic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usage: true, subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = (user.plan as PlanKey) in PLAN_LIMITS ? (user.plan as PlanKey) : "TRIAL";
    const limits = PLAN_LIMITS[plan];

    return NextResponse.json({
      plan: user.plan,
      usage: {
        generationsUsed: user.usage?.generationsUsed ?? 0,
        generationsMax: limits.generationsPerMonth,
        wordsGenerated: user.usage?.wordsGenerated ?? 0,
        resetAt: user.usage?.resetAt,
      },
      subscription: user.subscription,
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
