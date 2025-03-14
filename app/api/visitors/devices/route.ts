import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Esta rota retorna o número de dispositivos únicos (contagem de registros na tabela)
export async function GET() {
  try {
    // Conta o número de registros na tabela visitor (cada um é um dispositivo único)
    const uniqueDevices = await prisma.visitor.count();

    return NextResponse.json({ count: uniqueDevices });
  } catch (error) {
    console.error("Erro ao obter contagem de dispositivos únicos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
