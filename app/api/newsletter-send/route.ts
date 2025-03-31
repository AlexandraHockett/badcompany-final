import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

// Função para tentar operações do Prisma com retentativa
const result = await withRetry(() => prisma.newsletterCampaign.findMany());

export async function POST(request: Request) {
  try {
    const { subject, content, preview, audienceType } = await request.json();

    // Validar dados
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Assunto e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Configurar o transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Determinar a audiência com base no tipo selecionado
    let subscribersWhere = {};

    switch (audienceType) {
      case "engaged":
        // Assinantes que abriram um email nos últimos 30 dias
        subscribersWhere = {
          active: true,
          campaigns: {
            some: {
              openedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        };
        break;
      case "inactive":
        // Assinantes que não abriram emails nos últimos 30 dias
        subscribersWhere = {
          active: true,
          campaigns: {
            none: {
              openedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        };
        break;
      case "new":
        // Assinantes que se inscreveram nos últimos 7 dias
        subscribersWhere = {
          active: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      default:
        // Todos os assinantes ativos
        subscribersWhere = {
          active: true,
        };
    }

    // Buscar os assinantes
    const subscribers = await withRetry(() =>
      prisma.newsletterSubscriber.findMany({
        where: subscribersWhere,
        select: {
          id: true,
          email: true,
          name: true,
        },
      })
    );

    // Criar a campanha
    const campaign = await withRetry(() =>
      prisma.newsletterCampaign.create({
        data: {
          title: subject,
          subject,
          content,
          status: "sending",
          sentAt: new Date(),
          totalRecipients: subscribers.length,
          opened: 0,
          clicked: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    );

    // Gerar um pixel de rastreamento único para esta campanha
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-track-open?cid=${campaign.id}&sid={{subscriberId}}" width="1" height="1" alt="" style="display:none;" />`;

    // Função para substituir links com links de rastreamento
    const addTrackingToLinks = (htmlContent: string, subscriberId: number) => {
      return htmlContent.replace(
        /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi,
        (match, url, rest) => {
          const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-track-click?cid=${campaign.id}&sid=${subscriberId}&url=${encodeURIComponent(url)}`;
          return `<a href="${trackingUrl}"${rest}>`;
        }
      );
    };

    // Contador de emails enviados com sucesso
    let successCount = 0;
    let errorCount = 0;

    // Loop através dos assinantes e enviar o email
    for (const subscriber of subscribers) {
      try {
        // Personalizar o conteúdo para o assinante
        let personalizedContent = content;

        // Adicionar personalização básica (nome, etc)
        if (subscriber.name) {
          personalizedContent = personalizedContent.replace(
            /{{name}}/g,
            subscriber.name
          );
        } else {
          personalizedContent = personalizedContent.replace(
            /{{name}}/g,
            "assinante"
          );
        }

        // Adicionar pixel de rastreamento ao final do conteúdo
        personalizedContent =
          personalizedContent +
          trackingPixel.replace("{{subscriberId}}", subscriber.id.toString());

        // Adicionar rastreamento de cliques aos links
        personalizedContent = addTrackingToLinks(
          personalizedContent,
          subscriber.id
        );

        // Link de cancelamento de inscrição
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-unsubscribe?sid=${subscriber.id}&cid=${campaign.id}`;
        const unsubscribeLink = `<p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          Não desejas mais receber as nossas newsletters? <a href="${unsubscribeUrl}" style="color: #999;">Cancelar inscrição</a>
        </p>`;

        personalizedContent = personalizedContent + unsubscribeLink;

        // Configurar o email
        const mailOptions = {
          from: `"BadCompany" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: subject,
          html: personalizedContent,
          text: preview || subject, // Versão de texto para clientes que não suportam HTML
          headers: {
            "X-Campaign-ID": campaign.id.toString(),
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        };

        // Enviar o email
        await transporter.sendMail(mailOptions);

        // Registrar o envio para este assinante
        await withRetry(() =>
          prisma.newsletterCampaignRecipient.create({
            data: {
              campaignId: campaign.id,
              subscriberId: subscriber.id,
              sentAt: new Date(),
            },
          })
        );

        successCount++;
      } catch (err) {
        console.error(`Erro ao enviar email para ${subscriber.email}:`, err);
        errorCount++;
        // Continuar com os próximos envios mesmo se este falhar
      }
    }

    // Atualizar o status da campanha
    await withRetry(() =>
      prisma.newsletterCampaign.update({
        where: {
          id: campaign.id,
        },
        data: {
          status: "sent",
          totalRecipients: successCount,
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: `Newsletter enviada com sucesso para ${successCount} assinantes. Falhas: ${errorCount}.`,
      campaignId: campaign.id,
    });
  } catch (error) {
    console.error("Erro ao enviar newsletter:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
