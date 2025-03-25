import {
  getSubscriberStats,
  getSubscribersList,
} from "@/services/subscriberService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);
  const active = searchParams.get("active") === "true";
  const source = searchParams.get("source") || undefined;

  try {
    const stats = await getSubscriberStats();
    const { subscribers, pagination } = await getSubscribersList(
      page,
      pageSize,
      { active, source }
    );

    // Adicionar log de depuração
    console.log("Dados retornados:", {
      stats,
      subscribers: subscribers.length,
      pagination,
    });

    return new Response(
      JSON.stringify({
        stats,
        subscribers,
        pagination,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    // Log de erro mais detalhado
    console.error("Erro completo:", error);

    return new Response(
      JSON.stringify({
        error: "Erro ao buscar subscribers",
        detailedError: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
}
