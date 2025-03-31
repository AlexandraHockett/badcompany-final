import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

// Função para tentar operações do Prisma com retentativa

export async function GET(request: Request) {
  // Obter parâmetros da URL
  const url = new URL(request.url);
  const campaignId = url.searchParams.get("cid");
  const subscriberId = url.searchParams.get("sid");
  const targetUrl = url.searchParams.get("url");

  if (!campaignId || !subscriberId || !targetUrl) {
    return NextResponse.redirect(targetUrl || "/");
  }

  try {
    // Registrar clique
    await withRetry(() =>
      prisma.newsletterCampaignRecipient.updateMany({
        where: {
          campaignId: parseInt(campaignId),
          subscriberId: parseInt(subscriberId),
        },
        data: {
          clickedAt: new Date(),
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
          clicked: {
            increment: 1,
          },
        },
      })
    );

    // Registrar o link específico que foi clicado
    await withRetry(() =>
      prisma.newsletterLinkClick.create({
        data: {
          campaignId: parseInt(campaignId),
          subscriberId: parseInt(subscriberId),
          url: targetUrl,
          clickedAt: new Date(),
        },
      })
    );
  } catch (error) {
    console.error("Erro ao registrar clique em email:", error);
  }

  // Redirecionar para a URL de destino
  return NextResponse.redirect(targetUrl);
}
