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

export async function GET(request: Request) {
  // Obter parâmetros da URL
  const url = new URL(request.url);
  const campaignId = url.searchParams.get("cid");
  const subscriberId = url.searchParams.get("sid");
  const reason = url.searchParams.get("reason") || "user_request";

  if (!subscriberId) {
    return NextResponse.redirect("/");
  }

  try {
    // Atualizar o status do assinante para inativo
    await withRetry(() =>
      prisma.newsletterSubscriber.update({
        where: {
          id: parseInt(subscriberId),
        },
        data: {
          active: false,
          unsubscribedAt: new Date(),
          unsubscribeReason: reason,
        },
      })
    );

    // Se temos o ID da campanha, registrar que o cancelamento veio desta campanha
    if (campaignId) {
      await withRetry(() =>
        prisma.newsletterUnsubscribe.create({
          data: {
            subscriberId: parseInt(subscriberId),
            campaignId: parseInt(campaignId),
            reason: reason,
            unsubscribedAt: new Date(),
          },
        })
      );
    }

    // Redirecionar para uma página de confirmação
    return NextResponse.redirect("/newsletter/unsubscribed");
  } catch (error) {
    console.error("Erro ao processar cancelamento de inscrição:", error);
    return NextResponse.redirect("/");
  }
}
