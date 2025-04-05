import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Configura o transporter do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Constrói o email
    const mailOptions = {
      from: process.env.BOOKINGS_USER,
      to: "bookings@badcompany.pt", // Email que receberá os pedidos de orçamento
      subject: "Novo Pedido de Orçamento - BadCompany",
      html: `
        <h2>Novo Pedido de Orçamento</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || "Não fornecido"}</p>
        <p><strong>Tipo de Evento:</strong> ${data.eventType}</p>
        <p><strong>Data do Evento:</strong> ${data.date || "Não especificada"}</p>
        <p><strong>Número de Convidados:</strong> ${data.guestCount || "Não especificado"}</p>
        <p><strong>Detalhes:</strong> ${data.details || "Sem detalhes adicionais"}</p>
      `,
    };

    // Envia o email
    await transporter.sendMail(mailOptions);

    // Retorna sucesso
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Falha ao enviar o pedido de orçamento." },
      { status: 500 }
    );
  }
}
