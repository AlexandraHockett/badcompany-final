"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  // Estado para mock do carrinho
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "T-Shirt BadCompany",
      price: "25.00€",
      quantity: 2,
      image: "/images/eventos/bclandia.jpg",
    },
    {
      id: 4,
      title: "Vinil Omah Lay",
      price: "50.00€",
      quantity: 1,
      image: "/images/eventos/bclandia.jpg",
    },
  ]);

  // Calcular total
  const cartTotal = cartItems.reduce(
    (acc, item) =>
      acc + parseFloat(item.price.replace("€", "")) * item.quantity,
    0
  );

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

        // Trigger animations after content loads
        setTimeout(() => {
          setIsAnimated(true);
        }, 300);
      }
    }
  }, [status, session, router]);

  // Show loading state while checking authentication
  if (isLoading || status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-8 bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-red-500/30"
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
    <div className="min-h-screen text-white relative">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden ">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Grade de pontos decorativa */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10 pt-12 sm:pt-16 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-md border border-purple-500/30 shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-semibold">
              Finalizar Compra
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Checkout
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Detalhes do Pedido - 3 colunas */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isAnimated ? 1 : 0, x: isAnimated ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Saudação */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">👋</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Olá, {session?.user?.name || session?.user?.email}
                </h2>
              </div>
              <p className="text-gray-300">
                Está quase a finalizar a sua compra. Por favor, preencha os
                detalhes abaixo.
              </p>
            </div>

            {/* Informações de Envio */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📦</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Informações de Envio
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                      defaultValue={session?.user?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Apelido
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    defaultValue={session?.user?.email || ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    placeholder="Rua, número, apartamento"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Telemóvel
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    placeholder="+351 xxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">💳</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Método de Pagamento
                </h2>
              </div>

              <div className="grid gap-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-purple-500/20 relative">
                  <input
                    type="radio"
                    id="payment-card"
                    name="payment-method"
                    className="absolute top-5 left-4 h-4 w-4 accent-purple-500"
                    defaultChecked
                  />
                  <div className="ml-6">
                    <label
                      htmlFor="payment-card"
                      className="text-white font-medium"
                    >
                      Cartão de Crédito/Débito
                    </label>
                    <div className="mt-4 space-y-4 pl-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                          placeholder="xxxx xxxx xxxx xxxx"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-white/10 relative">
                  <input
                    type="radio"
                    id="payment-mb"
                    name="payment-method"
                    className="absolute top-5 left-4 h-4 w-4 accent-purple-500"
                  />
                  <div className="ml-6">
                    <label
                      htmlFor="payment-mb"
                      className="text-white font-medium"
                    >
                      MB Way
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Pague com o seu número de telemóvel
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-white/10 relative">
                  <input
                    type="radio"
                    id="payment-paypal"
                    name="payment-method"
                    className="absolute top-5 left-4 h-4 w-4 accent-purple-500"
                  />
                  <div className="ml-6">
                    <label
                      htmlFor="payment-paypal"
                      className="text-white font-medium"
                    >
                      PayPal
                    </label>
                    <p className="text-sm text-gray-400 mt-1">
                      Pague com a sua conta PayPal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resumo do Pedido - 2 colunas */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isAnimated ? 1 : 0, x: isAnimated ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl sticky top-24">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🛒</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Resumo do Pedido
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">
                    Itens (
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h3>
                  <div className="divide-y divide-gray-700/50">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex">
                        <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden mr-3">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-400">
                            Qtd: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{item.price}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity > 1
                              ? `${item.quantity} x ${parseFloat(item.price.replace("€", "")).toFixed(2)}€`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>{cartTotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Envio</span>
                    <span>5.00€</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>IVA</span>
                    <span>{(cartTotal * 0.23).toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-2 mt-2 flex justify-between font-bold text-white">
                    <span>Total</span>
                    <span className="text-purple-300">
                      {(cartTotal + 5 + cartTotal * 0.23).toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Código Promocional */}
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 bg-gray-800/80 border border-white/10 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                      placeholder="Código promocional"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-r-lg">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Botão de Confirmação */}
                <div className="pt-4">
                  <Button
                    title="Confirmar Pedido"
                    containerClass="w-full group transform transition-transform duration-200 hover:scale-[1.02]"
                    rightIcon={
                      <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">
                        🔒
                      </span>
                    }
                  />
                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Ao concluir este pedido, você concorda com os nossos
                  <Link
                    href="/termos-e-condicoes"
                    className="text-purple-400 hover:text-purple-300 mx-1"
                  >
                    Termos e Condições
                  </Link>
                  e
                  <Link
                    href="/politica-de-privacidade"
                    className="text-purple-400 hover:text-purple-300 ml-1"
                  >
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Botão de Voltar */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/loja"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para a Loja
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
