// app/(admin)/dashboard/newsletter/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Users,
  Calendar,
  Clock,
  MousePointerClick,
  BarChart2,
  MailOpen,
  Eye,
  Globe,
  Smartphone, // Substitua 'Device' por isso
  Laptop, // Adicione este
  Tablet, // Adicione este
  Loader2,
  AlertCircle,
  ChevronRight,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/administracao/StatsCard";

interface CampaignDetails {
  id: number;
  title: string;
  subject: string;
  content: string;
  sentAt: string;
  status: string;
  totalRecipients: number;
  opened: number;
  clicked: number;
  openRate: string;
  clickRate: string;
}

interface ClickData {
  url: string;
  count: number;
  percentage: string;
}

interface DeviceData {
  type: string;
  count: number;
  percentage: string;
}

interface CountryData {
  name: string;
  count: number;
  percentage: string;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id;

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("alltime");

  // Mock data para demonstração
  const [clickData, setClickData] = useState<ClickData[]>([
    { url: "https://badcompany.pt/eventos", count: 125, percentage: "45.2%" },
    { url: "https://badcompany.pt/loja", count: 87, percentage: "31.5%" },
    { url: "https://badcompany.pt/media", count: 64, percentage: "23.3%" },
  ]);

  const [deviceData, setDeviceData] = useState<DeviceData[]>([
    { type: "Mobile", count: 1850, percentage: "62.3%" },
    { type: "Desktop", count: 980, percentage: "33.0%" },
    { type: "Tablet", count: 140, percentage: "4.7%" },
  ]);

  const [countryData, setCountryData] = useState<CountryData[]>([
    { name: "Portugal", count: 2450, percentage: "82.5%" },
    { name: "Brasil", count: 320, percentage: "10.8%" },
    { name: "Angola", count: 120, percentage: "4.0%" },
    { name: "Outros", count: 80, percentage: "2.7%" },
  ]);

  useEffect(() => {
    // Função para carregar os dados da campanha
    const loadCampaignData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulação de carregamento da API
        setTimeout(() => {
          // Dados mockados para demonstração
          setCampaign({
            id: Number(campaignId),
            title: "Newsletter Verão 2025",
            subject: "Novidades da BadCompany para o Verão",
            content: "<p>Conteúdo da newsletter...</p>",
            sentAt: "2025-03-15T14:30:00Z",
            status: "sent",
            totalRecipients: 3250,
            opened: 1560,
            clicked: 276,
            openRate: "48.0",
            clickRate: "17.6",
          });

          setLoading(false);
        }, 1500);

        // Aqui seria a chamada real à API:
        /*
        const response = await fetch(`/api/newsletter-campaigns/${campaignId}`);
        
        if (!response.ok) {
          throw new Error("Falha ao carregar dados da campanha");
        }
        
        const data = await response.json();
        setCampaign(data);
        */
      } catch (error) {
        console.error("Erro ao carregar campanha:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
        setLoading(false);
      }
    };

    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId, timeframe]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados da campanha...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Erro ao carregar dados
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Campanha não encontrada
          </h3>
          <p className="text-gray-400 mb-6">
            Não foi possível encontrar a campanha solicitada.
          </p>
          <Button onClick={() => router.push("/dashboard/newsletter")}>
            Voltar para Newsletters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4 bg-gray-800 border-gray-700 hover:bg-gray-700"
            onClick={() => router.push("/dashboard/newsletter")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {campaign.title}
            </h1>
            <p className="text-gray-400 mt-1">
              Enviada em {formatDate(campaign.sentAt)} às{" "}
              {formatTime(campaign.sentAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver newsletter
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar relatório
          </Button>
        </div>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Destinatários"
          value={campaign.totalRecipients.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
          description="Total de envios"
          variant="default"
        />
        <StatsCard
          title="Taxa de Abertura"
          value={`${campaign.openRate}%`}
          icon={<MailOpen className="h-4 w-4" />}
          description={`${campaign.opened.toLocaleString()} aberturas`}
          variant="green"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Taxa de Cliques"
          value={`${campaign.clickRate}%`}
          icon={<MousePointerClick className="h-4 w-4" />}
          description={`${campaign.clicked.toLocaleString()} cliques`}
          variant="purple"
          trend={{ value: 2.8, isPositive: true }}
        />
        <StatsCard
          title="Data de Envio"
          value={formatDate(campaign.sentAt)}
          icon={<Calendar className="h-4 w-4" />}
          description={formatTime(campaign.sentAt)}
          variant="blue"
        />
      </div>

      {/* Seletor de período */}
      <div className="flex justify-end">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="24h">Últimas 24 horas</option>
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="alltime">Todo o período</option>
        </select>
      </div>

      {/* Gráficos e estatísticas detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Links mais clicados */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white">Links mais clicados</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {clickData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 truncate max-w-[70%]">
                      {item.url}
                    </span>
                    <span className="text-white font-medium">
                      {item.count} cliques
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: item.percentage }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">
                      {index + 1}º mais clicado
                    </span>
                    <span className="text-gray-400">
                      {item.percentage} dos cliques
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link
                href={`/dashboard/newsletter/${campaignId}/clicks`}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
              >
                Ver todos os links
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Taxa de abertura ao longo do tempo */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white">Tempo até abertura</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-[230px]">
              <div className="text-center">
                <BarChart2 className="h-16 w-16 mx-auto text-gray-700 mb-4" />
                <p className="text-gray-400 mb-1">
                  Tempo médio até a primeira abertura
                </p>
                <p className="text-3xl font-bold text-white mb-4">1.2 horas</p>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Primeira abertura</p>
                    <p className="font-medium">2 minutos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Última abertura</p>
                    <p className="font-medium">26 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispositivos */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white">Dispositivos</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {deviceData.map((device, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full mb-2">
                    {device.type === "Mobile" ? (
                      <Smartphone className="h-6 w-6 text-gray-300" />
                    ) : device.type === "Desktop" ? (
                      <Laptop className="h-6 w-6 text-gray-300" />
                    ) : (
                      <Tablet className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <h4 className="font-medium">{device.type}</h4>
                  <p className="text-2xl font-bold text-white">
                    {device.percentage}
                  </p>
                  <p className="text-xs text-gray-400">
                    {device.count} usuários
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Localização geográfica */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="border-b border-gray-800">
            <CardTitle className="text-white">
              Localização dos leitores
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {countryData.map((country, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full mr-3">
                    <Globe className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium">{country.name}</h4>
                      <span className="text-gray-400 text-sm">
                        {country.percentage}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: country.percentage }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo da newsletter */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-white">Conteúdo da Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-white text-black p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">{campaign.subject}</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: campaign.content || "<p>Conteúdo não disponível</p>",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
