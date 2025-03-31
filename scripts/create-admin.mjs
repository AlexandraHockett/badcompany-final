import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as readline from "readline";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Configuração para arquivos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  try {
    console.log("\n=== CRIAR USUÁRIO ADMINISTRADOR ===\n");

    const name = await prompt("Nome do administrador: ");
    const email = await prompt("Email do administrador: ");
    const password = await prompt(
      "Senha do administrador (mínimo 8 caracteres): "
    );

    if (!name || !email || !password) {
      console.error("Erro: Todos os campos são obrigatórios");
      return;
    }

    if (password.length < 8) {
      console.error("Erro: A senha deve ter pelo menos 8 caracteres");
      return;
    }

    console.log("\nCriando usuário administrador...");

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

    // Criar usuário administrador
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("\n✅ Usuário administrador criado com sucesso!");
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Função: ${user.role}`);
    console.log(
      "\nAgora você pode fazer login no painel administrativo com essas credenciais."
    );
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Executar a função
createAdmin();
