import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createNewsletterManager() {
  try {
    console.log("\n=== CRIAR USUÁRIO GERENTE DE NEWSLETTER ===\n");

    const name = "BadCompany";
    const email = "geral@badcompany.pt";
    const password = "B@dc0mp@ny@nyf@"; // Substitua por uma senha forte

    console.log(`Criando usuário para: ${email}`);

    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`Erro: Já existe um usuário com o email ${email}`);
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário gerente de newsletter
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "newsletter_manager",
      },
    });

    console.log("\n✅ Usuário gerente de newsletter criado com sucesso!");
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Função: ${user.role}`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar a função
createNewsletterManager();
