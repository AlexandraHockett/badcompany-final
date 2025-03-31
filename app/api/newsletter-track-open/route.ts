import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

// Função para tentar operações do Prisma com retentativa

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
