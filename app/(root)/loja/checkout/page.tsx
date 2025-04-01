"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/loja/checkout")}`);
    } else if (status === "authenticated") {
      // Additional check for admin role
      if (
        session?.user?.role === "admin" ||
        session?.user?.role === "newsletter_manager"
      ) {
        // If admin, show warning and provide logout option
        setIsLoading(false);
      } else {
        // Regular user can proceed
        setIsLoading(false);
      }
    }
  }, [status, session, router]);

  // Show loading state while checking authentication
  if (isLoading || status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Special handling for admin users
  if (
    session?.user?.role === "admin" ||
    session?.user?.role === "newsletter_manager"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-8 bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/30"
        >
          <div className="text-center">
            <div className="mx-auto text-red-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white">Acesso Restrito</h1>
            <p className="mt-4 text-gray-400">
              Você está conectado como administrador. Para fazer uma compra, por
              favor faça logout e entre com uma conta de cliente.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <LogoutButton
              variant="full"
              redirectUrl="/login"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            />

            <Link
              href="/login"
              className="text-center bg-transparent hover:bg-gray-700 text-gray-300 px-4 py-3 rounded-md border border-gray-600 transition-colors"
            >
              Entrar com Conta de Cliente
            </Link>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Se você precisar fazer uma compra, por favor use uma conta de
            cliente separada.
          </p>
        </motion.div>
      </div>
    );
  }

  // If authenticated as a regular user, show checkout form
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">Finalizar Compra</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Detalhes do Pedido
        </h2>

        {/* User greeting */}
        <p className="text-gray-300 mb-4">
          Olá, {session?.user?.name || session?.user?.email}
        </p>

        {/* Checkout form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-white">
              Informações de Envio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-white">
              Informações de Pagamento
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data de Validade
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Concluir Pedido
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link href="/loja" className="text-purple-400 hover:text-purple-300">
          ← Voltar para a Loja
        </Link>
      </div>
    </div>
  );
}
