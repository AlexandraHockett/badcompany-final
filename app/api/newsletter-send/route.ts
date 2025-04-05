import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { withRetry } from "@/utils/rentry";

export async function POST(request: Request) {
  console.log(
    "Início do processamento da newsletter - Timestamp:",
    new Date().toISOString()
  );

  try {
    const { subject, content, preview, audienceType } = await request.json();

    if (!subject || !content) {
      console.warn("Validação de dados falhou: Assunto ou conteúdo ausente");
      return NextResponse.json(
        { error: "Assunto e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.hostinger.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("Configuração de audiência:", {
      type: audienceType,
      timestamp: new Date().toISOString(),
    });

    let subscribersWhere = {};

    switch (audienceType) {
      case "engaged":
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
        subscribersWhere = {
          active: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      default:
        subscribersWhere = {
          active: true,
        };
    }

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

    console.log(
      `Encontrados ${subscribers.length} assinantes - Timestamp: ${new Date().toISOString()}`
    );

    if (subscribers.length === 0) {
      console.warn("Nenhum assinante encontrado para a campanha");
      return NextResponse.json(
        { error: "Nenhum assinante encontrado para esta campanha" },
        { status: 400 }
      );
    }

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

    console.log(
      `Campanha criada - ID: ${campaign.id}, Timestamp: ${new Date().toISOString()}`
    );

    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-track-open?cid=${campaign.id}&sid={{subscriberId}}" width="1" height="1" alt="" style="display:none;" />`;

    const addTrackingToLinks = (htmlContent: string, subscriberId: number) => {
      return htmlContent.replace(
        /<a\s+(?:[^>]*?\s+)?href="([^"]*)"([^>]*)>/gi,
        (match, url, rest) => {
          const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-track-click?cid=${campaign.id}&sid=${subscriberId}&url=${encodeURIComponent(url)}`;
          return `<a href="${trackingUrl}"${rest}>`;
        }
      );
    };

    let successCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        let personalizedContent = content;

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

        personalizedContent =
          personalizedContent +
          trackingPixel.replace("{{subscriberId}}", subscriber.id.toString());

        personalizedContent = addTrackingToLinks(
          personalizedContent,
          subscriber.id
        );

        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/newsletter-unsubscribe?sid=${subscriber.id}&cid=${campaign.id}`;
        const unsubscribeLink = `<p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          Não desejas mais receber as nossas newsletters? <a href="${unsubscribeUrl}" style="color: #999;">Cancelar inscrição</a>
        </p>`;

        personalizedContent = personalizedContent + unsubscribeLink;

        const mailOptions = {
          from: `"BadCompany" <newsletter@badcompany.pt>`,
          to: subscriber.email,
          subject: subject,
          html: personalizedContent,
          text: preview || subject,
          headers: {
            "X-Campaign-ID": campaign.id.toString(),
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
          },
        };

        console.log(
          `Enviando email para ${subscriber.email} - Timestamp: ${new Date().toISOString()}`
        );

        await transporter.sendMail(mailOptions);

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
      }
    }

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

    console.log(
      `Processamento da newsletter concluído - Sucesso: ${successCount}, Falhas: ${errorCount}, Timestamp: ${new Date().toISOString()}`
    );

    return NextResponse.json({
      success: true,
      message: `Newsletter enviada com sucesso para ${successCount} assinantes. Falhas: ${errorCount}.`,
      campaignId: campaign.id,
      totalRecipients: subscribers.length,
    });
  } catch (error: unknown) {
    let errorMessage = "Erro interno do servidor";
    let errorDetails: string; // Ensure errorDetails is always a string

    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = JSON.stringify({
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString(),
      }); // Convert object to string
    } else if (typeof error === "string") {
      errorMessage = error;
      errorDetails = error; // error is already a string
    } else {
      errorMessage = "Erro desconhecido";
      errorDetails = "Ocorreu um erro desconhecido"; // Default string
    }

    console.error("Erro completo ao enviar newsletter:", errorDetails);

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails, // Now consistently a string
      },
      { status: 500 }
    );
  }
}
