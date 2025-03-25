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

  if (!campaignId || !subscriberId) {
    // Retornar imagem transparente de 1x1 pixel mesmo com erro
    return new NextResponse(
      Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
      ),
      {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }

  try {
    // Verificar se já temos um registro de abertura para este assinante e campanha
    const existingOpen = await withRetry(() =>
      prisma.newsletterCampaignRecipient.findFirst({
        where: {
          campaignId: parseInt(campaignId),
          subscriberId: parseInt(subscriberId),
          openedAt: {
            not: null,
          },
        },
      })
    );

    if (!existingOpen) {
      // Registrar abertura
      await withRetry(() =>
        prisma.newsletterCampaignRecipient.updateMany({
          where: {
            campaignId: parseInt(campaignId),
            subscriberId: parseInt(subscriberId),
          },
          data: {
            openedAt: new Date(),
          },
        })
      );

      // Incrementar contador na campanha
      await withRetry(() =>
        prisma.newsletterCampaign.update({
          where: {
            id: parseInt(campaignId),
          },
          data: {
            opened: {
              increment: 1,
            },
          },
        })
      );
    }
  } catch (error) {
    console.error("Erro ao registrar abertura de email:", error);
  }

  // Retornar imagem transparente de 1x1 pixel
  return new NextResponse(
    Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    ),
    {
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
