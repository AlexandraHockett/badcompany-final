// app/api/user/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

/**
 * GET handler to fetch user orders
 * This is a placeholder implementation that should be expanded with real database queries
 */
export async function GET(request: Request) {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // In a real implementation, you would fetch orders from your database
    // For example:
    // const orders = await prisma.order.findMany({
    //   where: { userId: session.user.id },
    //   include: {
    //     items: {
    //       include: { product: true }
    //     }
    //   },
    //   orderBy: { createdAt: "desc" }
    // });

    // For now, we'll return mock data
    const mockOrders = [
      {
        id: "ORD-2025-0001",
        date: "2025-03-15",
        total: "75.00€",
        status: "delivered",
        items: [
          {
            id: 1,
            title: "T-Shirt BadCompany",
            price: "25.00€",
            quantity: 2,
            image: "/images/eventos/bclandia.jpg",
          },
          {
            id: 4,
            title: "Vinil Omah Lay",
            price: "50.00€",
            quantity: 1,
            image: "/images/eventos/bclandia.jpg",
          },
        ],
      },
      {
        id: "ORD-2025-0002",
        date: "2025-03-28",
        total: "30.00€",
        status: "processing",
        items: [
          {
            id: 2,
            title: "Boné BadCompany",
            price: "15.00€",
            quantity: 2,
            image: "/images/eventos/bclandia.jpg",
          },
        ],
      },
      {
        id: "TIC-2025-0003",
        date: "2025-04-10",
        total: "60.00€",
        status: "pending",
        items: [
          {
            id: 6,
            title: "BC Fest 2025",
            price: "30.00€",
            quantity: 2,
            image: "/images/eventos/bclandia.jpg",
          },
        ],
      },
    ];

    return NextResponse.json(mockOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Erro ao carregar pedidos" },
      { status: 500 }
    );
  }
}
