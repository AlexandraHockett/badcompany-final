"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Users,
  MailOpen,
  MousePointerClick,
  Clock,
} from "lucide-react";

// Tipagem para Campaign
interface Campaign {
  id: number;
  title: string;
  totalRecipients: number;
  openRate: string;
  opened: number;
  clickRate: string;
  clicked: number;
  sentAt: string;
  status: string;
}

export default function NewsletterDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar data
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Função para formatar hora
  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("pt-BR");

  // Carregar campanhas
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/newsletter-campaigns");
        if (!response.ok) throw new Error("Falha ao carregar campanhas");
        const data: Campaign[] = await response.json();
        setCampaigns(data);
        if (data.length > 0) setSelectedCampaign(data[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  // Renderização condicional para loading e erro
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-purple-800">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-purple-800 text-red-500">
        <div className="text-center">
          {error}
          <Button onClick={() => window.location.reload()} className="ml-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 bg-purple-800 p-6 pt-28">
      {/* Cabeçalho */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Estatísticas da Newsletter
        </h1>
        <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Select
            value={selectedCampaign?.id.toString() || ""}
            onValueChange={(value) =>
              setSelectedCampaign(
                campaigns.find((c) => c.id.toString() === value) || null
              )
            }
          >
            <SelectTrigger className="w-full rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 sm:w-[280px]">
              <SelectValue placeholder="Selecione uma campanha" />
            </SelectTrigger>
            <SelectContent className="rounded-md border border-gray-700 bg-gray-800 text-white">
              {campaigns.map((campaign) => (
                <SelectItem
                  key={campaign.id}
                  value={campaign.id.toString()}
                  className="hover:bg-purple-700 focus:bg-purple-700"
                >
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push("/dashboard/newsletter/enviar")}
            className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Newsletter
          </Button>
        </div>
      </header>

      {/* Conteúdo principal */}
      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center text-gray-400">
          Nenhuma campanha de newsletter encontrada
        </div>
      ) : (
        <div className="space-y-6">
          {/* Estatísticas da campanha selecionada */}
          {selectedCampaign && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Destinatários"
                icon={<Users className="h-5 w-5 text-blue-400" />}
                value={selectedCampaign.totalRecipients || 0}
                description="Total de envios"
              />
              <StatCard
                title="Taxa de Abertura"
                icon={<MailOpen className="h-5 w-5 text-green-400" />}
                value={`${selectedCampaign.openRate || "0.00"}%`}
                description={`${selectedCampaign.opened || 0} de ${selectedCampaign.totalRecipients || 0}`}
                valueClassName="text-green-400"
              />
              <StatCard
                title="Taxa de Cliques"
                icon={<MousePointerClick className="h-5 w-5 text-purple-400" />}
                value={`${selectedCampaign.clickRate || "0.00"}%`}
                description={`${selectedCampaign.clicked || 0} cliques`}
                valueClassName="text-purple-400"
              />
              <StatCard
                title="Data de Envio"
                icon={<Clock className="h-5 w-5 text-yellow-400" />}
                value={formatDate(selectedCampaign.sentAt)}
                description={formatTime(selectedCampaign.sentAt)}
              />
            </div>
          )}

          {/* Lista de campanhas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`cursor-pointer border-gray-700 bg-gray-800 text-white transition-colors ${
                  selectedCampaign?.id === campaign.id
                    ? "border-purple-500"
                    : "hover:border-purple-500"
                }`}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CardHeader>
                  <CardTitle>{campaign.title}</CardTitle>
                  <p className="text-sm text-gray-400">
                    {formatDate(campaign.sentAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-bold capitalize">{campaign.status}</p>
                    </div>
                    <div className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/dashboard/newsletter/${campaign.id}`)
                        }
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente reutilizável para estatísticas
interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
  valueClassName?: string;
}

function StatCard({
  title,
  icon,
  value,
  description,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className="border-gray-700 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${valueClassName || ""}`}>{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
