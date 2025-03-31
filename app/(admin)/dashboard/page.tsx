// app/(admin)/dashboard/page.tsx
// app/(admin)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Importação adicionada
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  Mail,
  Calendar,
  Eye,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession(); // Adicionado para obter a sessão do usuário
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [uniqueDevices, setUniqueDevices] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirecionar gerentes de newsletter para a seção apropriada
  useEffect(() => {
    if (session?.user?.role === "newsletter_manager") {
      router.push("/dashboard/newsletter");
    }
  }, [session, router]);

  // Fetch visitor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total visitor count
        const visitorResponse = await fetch("/api/visitors/count");
        const visitorData = await visitorResponse.json();

        // Fetch unique devices count
        const deviceResponse = await fetch("/api/visitors/devices");
        const deviceData = await deviceResponse.json();

        setTotalVisitors(visitorData.count);
        setUniqueDevices(deviceData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sample recent campaigns data
  const recentCampaigns = [
    {
      id: 1,
      title: "Newsletter de Verão",
      sentAt: "2025-03-15",
      openRate: "32.5%",
      status: "Enviada",
    },
    {
      id: 2,
      title: "Promoção de Bilhetes",
      sentAt: "2025-03-01",
      openRate: "41.2%",
      status: "Enviada",
    },
    {
      id: 3,
      title: "Novos Eventos",
      sentAt: "2025-02-20",
      openRate: "28.7%",
      status: "Enviada",
    },
  ];

  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Festa de Verão",
      date: "2025-06-15",
      location: "Clube XYZ",
      ticketsSold: 350,
      totalTickets: 500,
    },
    {
      id: 2,
      title: "Workshop de DJ",
      date: "2025-04-10",
      location: "Estúdio ABC",
      ticketsSold: 45,
      totalTickets: 60,
    },
    {
      id: 3,
      title: "Festival de Música",
      date: "2025-07-22",
      location: "Parque Municipal",
      ticketsSold: 1200,
      totalTickets: 5000,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            Exportar Dados
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Criar Novo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Visitas Totais
            </CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "Carregando..."
                : totalVisitors?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              +12.5% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Dispositivos Únicos
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "Carregando..."
                : uniqueDevices?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              +5.2% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Subscritores
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,452</div>
            <p className="text-xs text-gray-400 mt-1">
              +28.4% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Eventos Ativos
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-400 mt-1">+2 desde o mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Campaigns */}
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Campanhas Recentes
            </CardTitle>
            <CardDescription className="text-gray-400">
              Últimas newsletters enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {campaign.title}
                    </p>
                    <div className="flex items-center text-xs text-gray-400">
                      <span>
                        {new Date(campaign.sentAt).toLocaleDateString("pt-PT")}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{campaign.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="text-xs font-medium text-gray-400">
                        Taxa de Abertura
                      </div>
                      <div className="text-sm font-bold text-green-400">
                        {campaign.openRate}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/dashboard/newsletter" passHref>
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300 p-0"
                  >
                    Ver todas as campanhas →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Próximos Eventos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Eventos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b border-gray-700 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {event.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span>
                          {new Date(event.date).toLocaleDateString("pt-PT")}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 hover:bg-gray-700 hover:text-white"
                    >
                      Editar
                    </Button>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{
                        width: `${(event.ticketsSold / event.totalTickets) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      Bilhetes vendidos
                    </span>
                    <span className="text-xs font-medium text-white">
                      {event.ticketsSold} / {event.totalTickets}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/dashboard/eventos" passHref>
                  <Button
                    variant="link"
                    className="text-purple-400 hover:text-purple-300 p-0"
                  >
                    Ver todos os eventos →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 border-purple-500/30 text-white hover:from-purple-900/50 hover:to-purple-700/30 transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Mail className="h-10 w-10 mb-4 text-purple-400" />
            <h3 className="text-lg font-bold mb-2">Enviar Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Crie e envie uma newsletter para seus subscritores
            </p>
            <Link href="/dashboard/newsletter/enviar" passHref>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                Criar Newsletter
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 border-blue-500/30 text-white hover:from-blue-900/50 hover:to-blue-700/30 transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Calendar className="h-10 w-10 mb-4 text-blue-400" />
            <h3 className="text-lg font-bold mb-2">Adicionar Evento</h3>
            <p className="text-gray-300 text-sm mb-4">
              Crie um novo evento e gerencie bilhetes
            </p>
            <Link href="/dashboard/eventos/adicionar" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Criar Evento
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/40 to-green-700/20 border-green-500/30 text-white hover:from-green-900/50 hover:to-green-700/30 transition-colors cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <ShoppingBag className="h-10 w-10 mb-4 text-green-400" />
            <h3 className="text-lg font-bold mb-2">Adicionar Produto</h3>
            <p className="text-gray-300 text-sm mb-4">
              Adicione produtos à loja online
            </p>
            <Link href="/dashboard/loja/adicionar" passHref>
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                Criar Produto
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
