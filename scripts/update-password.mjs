// scripts/update-password.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function updatePassword() {
  try {
    console.log("\n=== ATUALIZAR SENHA DE USUÁRIO ===\n");
    
    const email = await prompt("Email do usuário: ");
    const newPassword = await prompt("Nova senha (mínimo 8 caracteres): ");
    
    if (!email || !newPassword) {
      console.error("Erro: Email e nova senha são obrigatórios");
      return;
    }
    
    if (newPassword.length < 8) {
      console.error("Erro: A senha deve ter pelo menos 8 caracteres");
      return;
    }
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.error(`Erro: Usuário com email ${email} não encontrado`);
      return;
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Atualizar a senha
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log(`\n✅ Senha atualizada com sucesso para ${email}`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

updatePassword();