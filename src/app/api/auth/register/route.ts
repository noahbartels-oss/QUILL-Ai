import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Database not configured. Set DATABASE_URL in Vercel environment variables." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch {
      return NextResponse.json(
        { error: "Cannot connect to database. Check your DATABASE_URL environment variable and run: npx prisma db push" },
        { status: 503 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered. Try signing in instead." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        usage: {
          create: {
            generationsUsed: 0,
            generationsMax: 5,
            wordsGenerated: 0,
          },
        },
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
