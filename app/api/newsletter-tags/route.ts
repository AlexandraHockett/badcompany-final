// app/api/newsletter-tags/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

export async function GET() {
  try {
    const tags = await withRetry(() =>
      prisma.newsletterTag.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { subscribers: true },
          },
        },
      })
    );

    return NextResponse.json(
      tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        description: tag.description,
        subscriberCount: tag._count.subscribers,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return NextResponse.json({ error: "Erro ao buscar tags" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, color, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome da tag é obrigatório" },
        { status: 400 }
      );
    }

    const existingTag = await prisma.newsletterTag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Já existe uma tag com esse nome" },
        { status: 409 }
      );
    }

    const tag = await prisma.newsletterTag.create({
      data: {
        name,
        color: color || "#6366F1",
        description,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Erro ao criar tag:", error);
    return NextResponse.json({ error: "Erro ao criar tag" }, { status: 500 });
  }
}
