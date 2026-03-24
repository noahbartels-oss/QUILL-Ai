import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const type = searchParams.get("type") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const favoritesOnly = searchParams.get("favorites") === "true";

    const where = {
      userId: session.user.id,
      ...(type ? { type: type as never } : {}),
      ...(favoritesOnly ? { isFavorite: true } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { output: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          output: true,
          language: true,
          wordCount: true,
          isFavorite: true,
          createdAt: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return NextResponse.json({
      contents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Content fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Content ID required" }, { status: 400 });
    }

    await prisma.content.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, isFavorite } = body;

    if (!id) {
      return NextResponse.json({ error: "Content ID required" }, { status: 400 });
    }

    const content = await prisma.content.updateMany({
      where: { id, userId: session.user.id },
      data: { isFavorite },
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
