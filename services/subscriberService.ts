import prisma from "@/lib/prisma";

export async function getSubscriberStats() {
  const [totalSubscribers, recentSubscribers, unsubscribedRecently] =
    await Promise.all([
      prisma.newsletterSubscriber.count({
        where: { active: true },
      }),
      prisma.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
          },
          active: true,
        },
      }),
      prisma.newsletterUnsubscribe.count({
        where: {
          unsubscribedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

  const activeRatio =
    totalSubscribers > 0
      ? (
          (totalSubscribers / (totalSubscribers + unsubscribedRecently)) *
          100
        ).toFixed(2)
      : "0.00";

  return {
    totalSubscribers,
    recentSubscribers,
    unsubscribedRecently,
    activeRatio,
  };
}

export async function getSubscribersList(
  page = 1,
  pageSize = 10,
  filter?: {
    active?: boolean;
    source?: string;
  }
) {
  const where = filter
    ? {
        active: filter.active,
        source: filter.source ? { contains: filter.source } : undefined,
      }
    : {};

  const [subscribers, total] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.count({ where }),
  ]);

  return {
    subscribers,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
