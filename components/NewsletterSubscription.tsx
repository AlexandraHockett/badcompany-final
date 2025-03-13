"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Validate email using regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setSubscriptionStatus("idle");
    setErrorMessage("");

    // Validate email
    if (!email.trim()) {
      setErrorMessage("Por favor, insira seu email.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }

    // Show submitting state
    setIsSubmitting(true);

    try {
      // Simulate API call - in a real app, replace with your actual API endpoint
      // const response = await fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // if (!response.ok) throw new Error('Erro ao processar sua inscrição');

      // Simulating a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success state
      setSubscriptionStatus("success");
      setEmail("");
    } catch (error) {
      // Error state
      setSubscriptionStatus("error");
      setErrorMessage("Ocorreu um erro. Por favor, tente novamente.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      className="mb-16 bg-gradient-to-r from-purple-900/30 to-black/30 backdrop-blur-sm rounded-xl p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-3">
        Fique por dentro das novidades
      </h2>
      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
        Subscreva a nossa newsletter para receber em primeira mão informações
        sobre lançamentos de produtos exclusivos e promoções especiais.
      </p>

      {subscriptionStatus === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto"
        >
          <svg
            className="w-6 h-6 text-green-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-green-300">
            Inscrição realizada com sucesso! Obrigado pelo seu interesse.
          </p>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
            />
            {errorMessage && (
              <p className="absolute -bottom-6 left-0 text-xs text-red-400">
                {errorMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : subscriptionStatus === "error" ? (
              "Tentar novamente"
            ) : (
              "Subscrever"
            )}
          </button>
        </form>
      )}
    </motion.section>
  );
}
