import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Função para tentar operações do Prisma com retentativa
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Tentativa ${attempt} falhou:`, error);
      lastError = error;

      // Backoff exponencial (espera cada vez mais entre tentativas)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

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

    try {
      // Utiliza a função de retentativa com tipagem explícita
      const visitor = await withRetry<{
        visitorId: string;
        userAgent: string;
        firstVisit: Date;
        lastVisit: Date;
        visitCount: number;
      }>(() =>
        prisma.visitor.upsert({
          where: { visitorId },
          update: {
            lastVisit: new Date(),
            visitCount: { increment: 1 },
          },
          create: {
            visitorId,
            userAgent: userAgent || "Unknown",
            firstVisit: new Date(),
            lastVisit: new Date(),
            visitCount: 1,
          },
        })
      );

      return NextResponse.json({ success: true, visitorId: visitor.visitorId });
    } catch (dbError: any) {
      // Melhor tratamento de erro com informações específicas
      console.error("Erro detalhado no banco de dados:", dbError);

      // Verifica se é um erro de timeout ou conexão
      if (
        dbError.code === "P2024" ||
        dbError.message?.includes("connection pool")
      ) {
        return NextResponse.json(
          {
            error: "Erro de conexão com o banco de dados",
            details:
              "Timeout ou problema de pool de conexões. Por favor, tente novamente.",
            code: dbError.code || "CONNECTION_ISSUE",
          },
          { status: 503 } // Service Unavailable
        );
      }

      return NextResponse.json(
        {
          error: "Erro ao processar no banco de dados",
          details: String(dbError),
          code: dbError.code,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
