import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Esta rota retorna o número total de visitas (soma de todos os visitCount)
export async function GET() {
  try {
    // Soma todos os visitCount para obter o total de visitas
    const totalVisits = await prisma.visitor.aggregate({
      _sum: {
        visitCount: true,
      },
    });

    return NextResponse.json({
      count: totalVisits._sum.visitCount || 0,
    });
  } catch (error) {
    console.error("Erro ao obter contagem total de visitas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
