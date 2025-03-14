import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const uniqueDevices = await prisma.visitor.count();

    return NextResponse.json({ count: uniqueDevices });
  } catch (error) {
    console.error("Erro ao obter contagem de dispositivos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
