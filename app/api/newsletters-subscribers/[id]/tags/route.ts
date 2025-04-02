// app/api/newsletter-subscribers/[id]/tags/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);

    if (isNaN(subscriberId)) {
      return NextResponse.json(
        { error: "ID de assinante inválido" },
        { status: 400 }
      );
    }

    const tags = await withRetry(() =>
      prisma.newsletterSubscriberTag.findMany({
        where: { subscriberId },
        include: { tag: true },
      })
    );

    return NextResponse.json(
      tags.map((item) => ({
        id: item.tag.id,
        name: item.tag.name,
        color: item.tag.color,
        addedAt: item.addedAt,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar tags do assinante:", error);
    return NextResponse.json({ error: "Erro ao buscar tags" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);
    const { tagId } = await request.json();

    if (isNaN(subscriberId) || !tagId) {
      return NextResponse.json(
        { error: "ID de assinante ou tag inválido" },
        { status: 400 }
      );
    }

    // Verificar se o assinante existe
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Assinante não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se a tag existe
    const tag = await prisma.newsletterTag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se a associação já existe
    const existingAssociation = await prisma.newsletterSubscriberTag.findUnique(
      {
        where: {
          subscriberId_tagId: {
            subscriberId,
            tagId,
          },
        },
      }
    );

    if (existingAssociation) {
      return NextResponse.json(
        { error: "O assinante já possui esta tag" },
        { status: 409 }
      );
    }

    // Criar a associação
    const association = await prisma.newsletterSubscriberTag.create({
      data: {
        subscriberId,
        tagId,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json({
      id: association.tag.id,
      name: association.tag.name,
      color: association.tag.color,
      addedAt: association.addedAt,
    });
  } catch (error) {
    console.error("Erro ao adicionar tag ao assinante:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);
    const url = new URL(request.url);
    const tagId = parseInt(url.searchParams.get("tagId") || "");

    if (isNaN(subscriberId) || isNaN(tagId)) {
      return NextResponse.json(
        { error: "ID de assinante ou tag inválido" },
        { status: 400 }
      );
    }

    // Remover a associação
    await prisma.newsletterSubscriberTag.delete({
      where: {
        subscriberId_tagId: {
          subscriberId,
          tagId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover tag do assinante:", error);
    return NextResponse.json({ error: "Erro ao remover tag" }, { status: 500 });
  }
}
