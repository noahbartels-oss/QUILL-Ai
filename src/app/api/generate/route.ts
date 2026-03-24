import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContent, PLAN_LIMITS } from "@/lib/anthropic";
import { z } from "zod";
import { countWords } from "@/lib/utils";

const generateSchema = z.object({
  type: z.enum([
    "BLOG_POST",
    "SOCIAL_MEDIA",
    "EMAIL",
    "AD_COPY",
    "PRODUCT_DESCRIPTION",
    "LANDING_PAGE",
    "CUSTOM",
  ]),
  topic: z.string().min(3).max(500),
  tone: z.string().min(1),
  language: z.string().min(2).max(5),
  additionalContext: z.string().max(1000).optional(),
  title: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usage: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = user.plan as keyof typeof PLAN_LIMITS;
    const limits = PLAN_LIMITS[plan];

    // Check language restriction for TRIAL plan
    if (
      plan === "TRIAL" &&
      parsed.data.language !== "en"
    ) {
      return NextResponse.json(
        { error: "Language not available on Trial. Upgrade to Starter or higher.", code: "UPGRADE_REQUIRED" },
        { status: 403 }
      );
    }

    const currentUsed = user.usage?.generationsUsed ?? 0;

    if (limits.isLifetimeCap) {
      // TRIAL: lifetime cap, never resets
      if (currentUsed >= limits.generationsPerMonth) {
        return NextResponse.json(
          {
            error: "Trial limit reached. Upgrade to continue.",
            code: "LIMIT_REACHED",
            limit: limits.generationsPerMonth,
            isLifetime: true,
          },
          { status: 429 }
        );
      }
    } else {
      // Paid plans: monthly reset
      if (user.usage) {
        const now = new Date();
        const resetAt = new Date(user.usage.resetAt);
        const monthPassed =
          now.getMonth() !== resetAt.getMonth() ||
          now.getFullYear() !== resetAt.getFullYear();

        if (monthPassed) {
          await prisma.usage.update({
            where: { userId: user.id },
            data: { generationsUsed: 0, wordsGenerated: 0, resetAt: now },
          });
        } else if (currentUsed >= limits.generationsPerMonth) {
          return NextResponse.json(
            {
              error: "Monthly generation limit reached. Upgrade for more.",
              code: "LIMIT_REACHED",
              limit: limits.generationsPerMonth,
              isLifetime: false,
            },
            { status: 429 }
          );
        }
      }
    }

    const { type, topic, tone, language, additionalContext } = parsed.data;

    const { content, tokens } = await generateContent({
      type,
      topic,
      tone,
      language,
      additionalContext,
      maxTokens: limits.maxTokens,
    });

    const wordCount = countWords(content);
    const title = parsed.data.title || topic.slice(0, 80);

    const [savedContent] = await prisma.$transaction([
      prisma.content.create({
        data: {
          userId: user.id,
          type,
          title,
          prompt: topic,
          output: content,
          language,
          wordCount,
          tokens,
        },
      }),
      prisma.usage.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          generationsUsed: 1,
          generationsMax: limits.generationsPerMonth,
          wordsGenerated: wordCount,
        },
        update: {
          generationsUsed: { increment: 1 },
          wordsGenerated: { increment: wordCount },
        },
      }),
    ]);

    // Return remaining uses for trial users
    const remaining = limits.isLifetimeCap
      ? limits.generationsPerMonth - (currentUsed + 1)
      : null;

    return NextResponse.json({
      content,
      wordCount,
      tokens,
      contentId: savedContent.id,
      remaining,
      isLifetimeCap: limits.isLifetimeCap,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
