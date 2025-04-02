"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/layout/Button";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/autenticacao/LogoutButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define types for orders and user
interface Order {
  id: string;
  date: string;
  total: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    id: number;
    title: string;
    price: string;
    quantity: number;
    image: string;
  }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  // Fetch orders data
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setOrders([
        {
          id: "ORD-2025-0001",
          date: "2025-03-15",
          total: "75.00€",
          status: "delivered",
          items: [
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
          ],
        },
        {
          id: "ORD-2025-0002",
          date: "2025-03-28",
          total: "30.00€",
          status: "processing",
          items: [
            {
              id: 2,
              title: "Boné BadCompany",
              price: "15.00€",
              quantity: 2,
              image: "/images/eventos/bclandia.jpg",
            },
          ],
        },
        {
          id: "TIC-2025-0003",
          date: "2025-04-10",
          total: "60.00€",
          status: "pending",
          items: [
            {
              id: 6,
              title: "BC Fest 2025",
              price: "30.00€",
              quantity: 2,
              image: "/images/eventos/bclandia.jpg",
            },
          ],
        },
      ]);
      setIsLoading(false);
      setTimeout(() => setIsAnimated(true), 300);
    }, 1000);
  }, []); // Adicionado array de dependências vazio

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: "⏱️",
          color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          text: "Pendente",
        };
      case "processing":
        return {
          icon: "⚙️",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          text: "Em Processamento",
        };
      case "shipped":
        return {
          icon: "🚚",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          text: "Enviado",
        };
      case "delivered":
        return {
          icon: "✅",
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          text: "Entregue",
        };
      case "cancelled":
        return {
          icon: "❌",
          color: "bg-red-500/20 text-red-300 border-red-500/30",
          text: "Cancelado",
        };
      default:
        return {
          icon: "❓",
          color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
          text: "Desconhecido",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="text-white relative">
      {/* Header section */}
      <header className="relative pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : -20 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 text-center"
        >
          <div className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-md border border-purple-500/30 shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-semibold">
              Área do Cliente
            </span>
          </div>

          <div className="flex flex-col items-center">
            <motion.div
              className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-1 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isAnimated ? 1 : 0.8,
                opacity: isAnimated ? 1 : 0,
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="h-full w-full rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                {session.user &&
                "image" in session.user &&
                session.user.image ? (
                  <Image
                    src={session.user.image as string}
                    alt={session.user.name || "Profile"}
                    width={96}
                    height={96}
                    className="rounded-full h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {session.user.name || "Utilizador"}
            </motion.h1>

            <motion.p
              className="text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnimated ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {session.user.email}
            </motion.p>
          </div>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimated ? 1 : 0, y: isAnimated ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <TabsList className="w-full max-w-md mx-auto flex bg-gray-900/30 backdrop-blur-md rounded-full p-1 mb-10 border border-white/10">
              <TabsTrigger
                value="overview"
                className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                Geral
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                Pedidos
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600"
              >
                Configurações
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Informações Pessoais
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Nome</p>
                    <p className="font-medium text-white">
                      {session.user.name || "Não definido"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">
                      {session.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Membro desde</p>
                    <p className="font-medium text-white">2023</p>
                  </div>

                  <div className="pt-2">
                    <Button
                      title="Editar Perfil"
                      leftIcon={<span className="text-lg">✏️</span>}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🛍️</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Resumo de Compras
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center border border-white/5">
                      <p className="text-sm text-gray-400">Total de Pedidos</p>
                      <p className="text-2xl font-bold text-purple-300">
                        {orders.length}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center border border-white/5">
                      <p className="text-sm text-gray-400">Em Processamento</p>
                      <p className="text-2xl font-bold text-blue-300">
                        {
                          orders.filter(
                            (order) =>
                              order.status === "processing" ||
                              order.status === "pending"
                          ).length
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">
                      Pedidos Recentes
                    </p>
                    <div className="space-y-2">
                      {orders.slice(0, 2).map((order) => (
                        <div
                          key={order.id}
                          className="bg-gray-800/30 p-3 rounded-lg flex justify-between items-center border border-white/5 hover:border-purple-500/30 transition-colors duration-300 cursor-pointer"
                          onClick={() => setActiveTab("orders")}
                        >
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-400">
                              {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-300 mr-2">
                              {order.total}
                            </span>
                            <span className="text-sm">▶️</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="text-purple-400 hover:text-purple-300 text-sm flex items-center mt-3 transition-colors duration-300"
                      onClick={() => setActiveTab("orders")}
                    >
                      Ver todos os pedidos
                      <span className="ml-1">→</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="md:col-span-2 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">💳</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Métodos de Pagamento
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800/30 p-4 rounded-lg flex items-center justify-between border border-white/5">
                    <div className="flex items-center">
                      <div className="bg-purple-600 h-10 w-16 rounded-md flex items-center justify-center mr-4">
                        <span className="font-bold text-white">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          Visa terminado em 4242
                        </p>
                        <p className="text-sm text-gray-400">
                          Expira em 12/2029
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
                      <span className="text-lg">✏️</span>
                    </button>
                  </div>

                  <div>
                    <Button
                      title="Adicionar Método de Pagamento"
                      leftIcon={<span>+</span>}
                      containerClass="bg-gradient-to-r from-gray-800 to-gray-700"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isAnimated ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📦</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Histórico de Pedidos
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-800/20 rounded-lg border border-white/5">
                  <span className="text-4xl mb-4 block">🛒</span>
                  <p className="text-gray-400 mb-4">
                    Você ainda não realizou nenhum pedido
                  </p>
                  <Link href="/loja">
                    <Button title="Ir para a Loja" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isAnimated ? 1 : 0,
                        y: isAnimated ? 0 : 20,
                      }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="border border-white/10 rounded-lg overflow-hidden bg-gray-800/30 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-lg text-white">
                            {order.id}
                          </p>
                          <p className="text-sm text-gray-400">
                            Pedido em {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div
                            className={`${getStatusInfo(order.status).color} border px-3 py-1 rounded-full text-xs flex items-center justify-center`}
                          >
                            <span className="mr-1">
                              {getStatusInfo(order.status).icon}
                            </span>
                            {getStatusInfo(order.status).text}
                          </div>
                          <p className="text-lg font-semibold text-white">
                            {order.total}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="flex items-center gap-4"
                          >
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-white">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                Qtd: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-white">
                                {item.price}
                              </p>
                              <p className="text-sm text-gray-400">{`${item.quantity} x ${item.price.replace("€", "")}€`}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-4 flex justify-between">
                        <Button
                          title="Ver Detalhes"
                          containerClass="bg-gradient-to-r from-gray-800 to-gray-700"
                        />

                        {(order.status === "processing" ||
                          order.status === "pending") && (
                          <button className="px-4 py-2 bg-red-700/70 hover:bg-red-700 text-white rounded-full text-sm transition-colors duration-300">
                            Cancelar Pedido
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Editar Perfil
                  </h2>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                      defaultValue={session.user.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg text-white cursor-not-allowed opacity-70"
                      defaultValue={session.user.email || ""}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      title="Salvar Alterações"
                      rightIcon={<span className="text-sm">💾</span>}
                    />
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🔒</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Alterar Senha
                  </h2>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-gray-800/80 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <Button title="Atualizar Senha" />
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isAnimated ? 1 : 0,
                  y: isAnimated ? 0 : 20,
                }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="md:col-span-2 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🚪</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Conta</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-white/5">
                    <h3 className="text-lg font-medium text-red-400 mb-2">
                      Área de perigo
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Estas ações afetam a sua conta e não podem ser desfeitas.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <LogoutButton
                          variant="full"
                          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white py-2 px-4 rounded-full flex items-center justify-center"
                        />
                      </div>
                      <div>
                        <button className="w-full bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500/30 py-2 px-4 rounded-full transition-colors duration-300">
                          Desativar Conta
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 p-4 rounded-lg border border-white/5">
                    <h3 className="text-lg font-medium text-white mb-2">
                      Privacidade e Segurança
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          Ativar verificação em dois passos
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="two-factor"
                            className="sr-only"
                          />
                          <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                          <div className="dot absolute w-3 h-3 bg-white rounded-full -left-1 top-1 transition"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          Receber emails promocionais
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="promo-emails"
                            className="sr-only"
                            defaultChecked
                          />
                          <div className="w-10 h-5 bg-purple-600 rounded-full shadow-inner"></div>
                          <div className="dot absolute w-3 h-3 bg-white rounded-full -left-1 top-1 transition translate-x-6"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">
                          Permitir notificações no navegador
                        </span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="browser-notifications"
                            className="sr-only"
                          />
                          <div className="w-10 h-5 bg-gray-700 rounded-full shadow-inner"></div>
                          <div className="dot absolute w-3 h-3 bg-white rounded-full -left-1 top-1 transition"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
