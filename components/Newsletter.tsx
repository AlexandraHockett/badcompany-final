// components/Newsletter.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

interface NewsletterProps {
  title?: string;
  subtitle?: string;
  position?: "left" | "center" | "right";
  variant?: "default" | "minimal" | "expanded";
  className?: string;
}

export default function Newsletter({
  title = "Receba Novidades da BadCompany",
  subtitle = "Inscreva-se para receber em primeira mão todas as novidades sobre eventos, pré-vendas e conteúdo exclusivo",
  position = "center",
  variant = "default",
  className = "",
}: NewsletterProps) {
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
      // Chamada real da API
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar inscrição");
      }

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

  // Text alignment based on position prop
  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[position];

  // Determine content layout based on variant
  const renderContent = () => {
    if (variant === "minimal") {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus === "success"}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
              />
              {errorMessage && (
                <p className="absolute -bottom-6 left-0 text-xs text-red-400">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>
          <Button
            title={isSubmitting ? "A inscrever..." : "Subscrever"}
            type="submit"
            disabled={isSubmitting || subscriptionStatus === "success"}
            onClick={handleSubmit}
            rightIcon={
              subscriptionStatus === "success" ? (
                <svg
                  className="w-5 h-5 text-green-400"
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
              ) : undefined
            }
          />
        </div>
      );
    }

    if (variant === "expanded") {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-3">{title}</h2>
            <p className="text-gray-300 mb-2">{subtitle}</p>
            <p className="text-sm text-gray-400">Receba informações sobre:</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm text-gray-300">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pré-vendas exclusivas
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Eventos futuros
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Promoções especiais
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Conteúdos exclusivos
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 w-full relative">
                <input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting || subscriptionStatus === "success"}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                />
                {errorMessage && (
                  <p className="absolute -bottom-6 left-0 text-xs text-red-400">
                    {errorMessage}
                  </p>
                )}
              </div>
              <Button
                title={isSubmitting ? "A inscrever..." : "Subscrever"}
                type="submit"
                disabled={isSubmitting || subscriptionStatus === "success"}
                rightIcon={
                  subscriptionStatus === "success" ? (
                    <svg
                      className="w-5 h-5 text-green-400"
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
                  ) : undefined
                }
              />
            </div>
            <p className="text-xs text-gray-500">
              Ao subscrever, você concorda em receber emails da BadCompany. Você
              pode cancelar a subscrição a qualquer momento.
            </p>
          </form>
        </div>
      );
    }

    // Default variant
    return (
      <>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">{subtitle}</p>

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
              disabled={isSubmitting || subscriptionStatus === "success"}
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
            disabled={isSubmitting || subscriptionStatus === "success"}
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
            ) : subscriptionStatus === "success" ? (
              "Subscrição Confirmada!"
            ) : (
              "Subscrever"
            )}
          </button>
        </form>
      </>
    );
  };

  return (
    <motion.section
      className={`mb-16 bg-gradient-to-r from-purple-900/30 to-black/30 backdrop-blur-sm rounded-xl p-8 ${textAlignment} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
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
            Inscrição realizada com sucesso! Obrigado pelo seu interesse. Fique
            atento ao seu email para novidades exclusivas.
          </p>
        </motion.div>
      ) : (
        renderContent()
      )}
    </motion.section>
  );
}
