import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalVisits = await prisma.visitor.aggregate({
      _sum: {
        visitCount: true,
      },
    });

    return NextResponse.json({
      count: totalVisits._sum.visitCount || 0,
    });
  } catch (error) {
    console.error("Erro ao obter contagem de visitantes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
