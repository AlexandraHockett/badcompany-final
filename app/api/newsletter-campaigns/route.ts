import { NextResponse } from "next/server";
import { fetchNewsletterCampaigns } from "@/services/newsletterService";

export async function GET() {
  try {
    const campaigns = await fetchNewsletterCampaigns();
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar campanhas" },
      { status: 500 }
    );
  }
}
