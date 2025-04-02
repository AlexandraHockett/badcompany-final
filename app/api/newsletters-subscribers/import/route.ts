// app/api/newsletter-subscribers/import/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";
import Papa from "papaparse";

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" &&
        session.user.role !== "newsletter_manager")
    ) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403 }
      );
    }

    // Obter o formData com o arquivo
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Verificar extensão do arquivo
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Apenas arquivos CSV são permitidos" },
        { status: 400 }
      );
    }

    // Ler o conteúdo do arquivo
    const fileContent = await file.text();

    // Parsear o CSV
    const result = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        { error: "Erro ao processar o arquivo CSV", details: result.errors },
        { status: 400 }
      );
    }

    const data = result.data as {
      email: string;
      name?: string;
      source?: string;
    }[];

    // Validar os dados
    if (data.length === 0) {
      return NextResponse.json(
        { error: "O arquivo não contém dados" },
        { status: 400 }
      );
    }

    // Verificar se todos os registros têm email
    const missingEmails = data.filter((row) => !row.email || !row.email.trim());
    if (missingEmails.length > 0) {
      return NextResponse.json(
        { error: `${missingEmails.length} registros não possuem email válido` },
        { status: 400 }
      );
    }

    // Estatísticas de importação
    let inserted = 0;
    let updated = 0;
    let failed = 0;
    const errors: { email: string; error: string }[] = [];

    // Processar cada registro
    for (const row of data) {
      try {
        const email = row.email.trim().toLowerCase();

        // Validar email com regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push({ email, error: "Email inválido" });
          failed++;
          continue;
        }

        // Verificar se o assinante já existe
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique(
          {
            where: { email },
          }
        );

        if (existingSubscriber) {
          // Atualizar assinante existente
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
              name: row.name || existingSubscriber.name,
              source: row.source || existingSubscriber.source || "CSV Import",
              updatedAt: new Date(),
            },
          });
          updated++;
        } else {
          // Criar novo assinante
          await prisma.newsletterSubscriber.create({
            data: {
              email,
              name: row.name || null,
              source: row.source || "CSV Import",
              active: true,
            },
          });
          inserted++;
        }
      } catch (error) {
        console.error(`Erro ao processar linha com email ${row.email}:`, error);
        errors.push({ email: row.email, error: "Erro interno ao processar" });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: data.length,
        inserted,
        updated,
        failed,
      },
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error("Erro ao importar assinantes:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar importação" },
      { status: 500 }
    );
  }
}
