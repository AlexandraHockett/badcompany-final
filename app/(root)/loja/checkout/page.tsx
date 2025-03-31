"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent("/loja/checkout")}`);
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  // If still loading or not authenticated, show loading state
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

  // If authenticated, show checkout form
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">Finalizar Compra</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Detalhes do Pedido
        </h2>

        {/* Add order details here */}
        <p className="text-gray-300 mb-4">
          Olá, {session.user?.name || session.user?.email}
        </p>

        {/* Checkout form would go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-white">
              Informações de Envio
            </h3>
            {/* Shipping form fields */}
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
              {/* Add more shipping form fields here */}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-white">
              Informações de Pagamento
            </h3>
            {/* Payment form fields */}
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
              {/* Add more payment form fields here */}
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
