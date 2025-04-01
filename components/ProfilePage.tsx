// components/ProfilePage.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  ShoppingBag,
  CreditCard,
  Edit,
  LogOut,
  ChevronRight,
  Clock,
  Check,
  Truck,
  AlertTriangle,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

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

  // Mock orders data - in a real app, you would fetch this from your API
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);

    // In a real implementation, fetch orders from your API
    // Example: fetch('/api/user/orders').then(res => res.json()).then(data => setOrders(data))

    // For now, we'll use mock data
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
    }, 1000);
  }, []);

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  // If no session, don't render anything (redirect will happen)
  if (status === "unauthenticated" || !session) {
    return null;
  }

  // Get status badge color and icon
  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 mr-1" />,
          color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          text: "Pendente",
        };
      case "processing":
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          text: "Em Processamento",
        };
      case "shipped":
        return {
          icon: <Truck className="h-4 w-4 mr-1" />,
          color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          text: "Enviado",
        };
      case "delivered":
        return {
          icon: <Check className="h-4 w-4 mr-1" />,
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          text: "Entregue",
        };
      case "cancelled":
        return {
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          color: "bg-red-500/20 text-red-300 border-red-500/30",
          text: "Cancelado",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 mr-1" />,
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
    <div className="min-h-screen bg-gray-900 text-white pb-16">
      {/* Header section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 z-0"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
              {session.user && "image" in session.user && session.user.image ? (
                <Image
                  src={session.user.image as string}
                  alt={session.user.name || "Profile"}
                  width={96}
                  height={96}
                  className="rounded-full h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold">
              {session.user.name || "Utilizador"}
            </h1>
            <p className="text-gray-300">{session.user.email}</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto flex bg-gray-800/80 backdrop-blur-md rounded-full p-1 mb-10">
            <TabsTrigger
              value="overview"
              className="flex-1 rounded-full data-[state=active]:bg-purple-600"
            >
              Geral
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 rounded-full data-[state=active]:bg-purple-600"
            >
              Pedidos
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 rounded-full data-[state=active]:bg-purple-600"
            >
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-purple-400" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">Nome</p>
                        <p className="font-medium">
                          {session.user.name || "Não definido"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-medium">{session.user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Membro desde</p>
                        <p className="font-medium">2023</p>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center mt-4"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-purple-400" />
                      Resumo de Compras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-400">
                            Total de Pedidos
                          </p>
                          <p className="text-2xl font-bold">{orders.length}</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                          <p className="text-sm text-gray-400">
                            Em Processamento
                          </p>
                          <p className="text-2xl font-bold">
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
                              className="bg-gray-700/30 p-3 rounded-lg flex justify-between items-center"
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
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="link"
                          className="text-purple-400 px-0 mt-2"
                          onClick={() => setActiveTab("orders")}
                        >
                          Ver todos os pedidos
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-purple-400" />
                      Métodos de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-700/30 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-purple-600 h-10 w-16 rounded-md flex items-center justify-center mr-4">
                            <span className="font-bold text-white">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Visa terminado em 4242
                            </p>
                            <p className="text-sm text-gray-400">
                              Expira em 12/2029
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" className="flex items-center">
                        <span className="mr-2">+</span> Adicionar Método de
                        Pagamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-purple-400" />
                    Histórico de Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">
                        Você ainda não realizou nenhum pedido
                      </p>
                      <Link href="/loja">
                        <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                          Ir para a Loja
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="border border-gray-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-700/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-medium text-lg">{order.id}</p>
                              <p className="text-sm text-gray-400">
                                Pedido em {formatDate(order.date)}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div
                                className={`${getStatusInfo(order.status).color} border px-3 py-1 rounded-full text-xs flex items-center justify-center`}
                              >
                                {getStatusInfo(order.status).icon}
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
                                  <p className="font-medium truncate">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    Qtd: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{item.price}</p>
                                  <p className="text-sm text-gray-400">{`${item.quantity} x ${item.price.replace("€", "")}€`}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gray-700/30 p-4 flex justify-between">
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                            {(order.status === "processing" ||
                              order.status === "pending") && (
                              <Button variant="destructive" size="sm">
                                Cancelar Pedido
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-purple-400" />
                      Editar Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          defaultValue={session.user.name || ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          defaultValue={session.user.email || ""}
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          O email não pode ser alterado
                        </p>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 mt-2">
                        Salvar Alterações
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-purple-400" />
                      Alterar Senha
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Senha Atual
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700 mt-2">
                        Atualizar Senha
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6"
                >
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-red-400 flex items-center">
                        <LogOut className="h-5 w-5 mr-2" />
                        Conta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <LogoutButton
                        variant="full"
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                      />
                      <Button
                        variant="outline"
                        className="w-full text-red-400 border-red-500/30 hover:bg-red-900/20"
                      >
                        Desativar Conta
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
