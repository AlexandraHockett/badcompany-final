// app/api/newsletter-test/route.ts
// Modificar a configuração do e-mail e otimizar o envio

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { withRetry } from "@/utils/rentry";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar se o usuário está autenticado e tem permissão
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

    const { subject, content, preview } = await request.json();

    // Validar dados
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Assunto e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Obter email do usuário atual para enviar o teste
    const recipientEmail = session.user.email;

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email do usuário não disponível" },
        { status: 400 }
      );
    }

    // Configurar o transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.NEWSLETTER_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Adicionar cabeçalho de teste
    const testBanner = `
      <div style="background-color: #8B5CF6; color: white; padding: 10px; margin-bottom: 20px; text-align: center; border-radius: 5px;">
        <strong>VERSÃO DE TESTE</strong> - Esta é uma prévia da newsletter. Enviada para: ${recipientEmail}
      </div>
    `;

    const personalizedContent = testBanner + content;

    // Configurar o email
    const mailOptions = {
      from: `"BadCompany (TESTE)" <newsletter@badcompany.pt>`, // Alterado para o novo e-mail
      to: recipientEmail,
      subject: `[TESTE] ${subject}`,
      html: personalizedContent,
      text: preview || subject,
    };

    // Enviar o email - Usado diretamente sem withRetry para melhorar o tempo de resposta
    // já que é apenas um e-mail, não precisamos da complexidade de retentativas
    const result = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Email de teste enviado com sucesso para ${recipientEmail}`,
    });
  } catch (error) {
    console.error("Erro ao enviar email de teste:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
