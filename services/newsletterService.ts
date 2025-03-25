import prisma from "@/lib/prisma";

export async function fetchNewsletterCampaigns() {
  try {
    const campaigns = await prisma.newsletterCampaign.findMany({
      orderBy: { sentAt: "desc" },
      select: {
        id: true,
        title: true,
        sentAt: true,
        status: true,
        totalRecipients: true,
        opened: true,
        clicked: true,
        _count: {
          select: {
            recipients: {
              where: { sentAt: { not: null } },
            },
          },
        },
      },
    });

    return campaigns.map((campaign) => {
      const totalRecipients =
        campaign.totalRecipients || campaign._count.recipients;
      const opened = campaign.opened || 0;
      const clicked = campaign.clicked || 0;

      return {
        id: campaign.id,
        title: campaign.title,
        sentAt: campaign.sentAt?.toISOString() || new Date().toISOString(),
        status: campaign.status,
        totalRecipients,
        opened,
        clicked,
        openRate:
          totalRecipients > 0
            ? ((opened / totalRecipients) * 100).toFixed(2)
            : "0.00",
        clickRate: opened > 0 ? ((clicked / opened) * 100).toFixed(2) : "0.00",
      };
    });
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    throw error;
  }
}
