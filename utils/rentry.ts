// utils/retry.ts

/**
 * Função genérica para retentativa com backoff exponencial
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 5
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      console.log(`Tentativa ${attempt} falhou:`, error);
      lastError = error;

      // Se for último attempt, não espere mais
      if (attempt === maxRetries) throw lastError;

      // Determinar se é um erro de conexão
      const isConnectionError =
        // Para erros do Prisma
        (error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2024") ||
        // Para erros com mensagem de texto
        (error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string" &&
          ((error.message as string).includes("connection") ||
            (error.message as string).includes("timeout") ||
            (error.message as string).includes("failed to fetch")));

      // Backoff exponencial com jitter (variação aleatória)
      const baseDelay = 1000 * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000; // adiciona até 1s de variação
      const delay = Math.min(baseDelay + jitter, 30000); // máximo 30s

      console.log(`Aguardando ${delay}ms antes da próxima tentativa...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
