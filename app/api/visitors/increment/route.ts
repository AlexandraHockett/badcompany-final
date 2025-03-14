import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { visitorId, userAgent } = data;

    if (!visitorId) {
      return NextResponse.json(
        { error: "ID do visitante é obrigatório" },
        { status: 400 }
      );
    }

    const visitor = await prisma.visitor.upsert({
      where: { visitorId },
      update: {
        lastVisit: new Date(),
        visitCount: { increment: 1 },
      },
      create: {
        visitorId,
        userAgent,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar visitante:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
