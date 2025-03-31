// app/api/newsletter-analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

// Função para tentar operações do Prisma com retentativa
const result = await withRetry(() => prisma.newsletterCampaign.findMany());

export async function POST(request: NextRequest) {
  try {
    const { campaignId, timeframe } = await request.json();

    // Buscar a campanha
    const campaign = await withRetry(() =>
      prisma.newsletterCampaign.findUnique({
        where: { id: parseInt(campaignId) },
      })
    );

    if (!campaign) {
      return NextResponse.json(
        { error: "Campanha não encontrada" },
        { status: 404 }
      );
    }

    // Calcular data de início baseado no timeframe
    const getStartDate = () => {
      const now = new Date();
      switch (timeframe) {
        case "day":
          return new Date(now.setDate(now.getDate() - 1));
        case "week":
          return new Date(now.setDate(now.getDate() - 7));
        case "month":
          return new Date(now.setMonth(now.getMonth() - 1));
        case "year":
          return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return new Date(0); // Início dos tempos
      }
    };

    // Buscar estatísticas detalhadas
    const recipientStats = await withRetry(() =>
      prisma.newsletterCampaignRecipient.findMany({
        where: {
          campaignId: parseInt(campaignId),
          sentAt: { gte: getStartDate() },
        },
      })
    );

    // Calcular métricas
    const totalSent = recipientStats.length;
    const totalOpened = recipientStats.filter((r) => r.openedAt).length;
    const totalClicked = recipientStats.filter((r) => r.clickedAt).length;

    const openRate =
      totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : "0.00";

    const clickRate =
      totalOpened > 0
        ? ((totalClicked / totalOpened) * 100).toFixed(2)
        : "0.00";

    // Calcular tempo médio de abertura
    const openTimes = recipientStats
      .filter((r) => r.openedAt && r.sentAt)
      .map((r) => {
        // Adicionar verificação explícita de nulidade
        if (!r.sentAt || !r.openedAt) return 0;
        return (r.openedAt.getTime() - r.sentAt.getTime()) / (1000 * 60 * 60); // em horas
      });

    const avgTimeToOpen =
      openTimes.length > 0
        ? (openTimes.reduce((a, b) => a + b, 0) / openTimes.length).toFixed(1)
        : "0.0";

    // Preparar dados de análise
    const analytics = {
      campaign: {
        id: campaign.id,
        title: campaign.title,
        // Adicionar fallback para caso sentAt seja nulo
        sentAt: campaign.sentAt?.toISOString() || new Date().toISOString(),
        status: campaign.status,
      },
      stats: {
        totalSent,
        totalOpened,
        totalClicked,
        openRate,
        clickRate,
        avgTimeToOpen,
      },
      timeframe,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Erro na rota de análises:", error);
    return NextResponse.json(
      { error: "Erro ao processar estatísticas" },
      { status: 500 }
    );
  }
}
