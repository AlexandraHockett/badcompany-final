// app\(admin)\dashboard\newsletter\page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

// Tipagem para Campaign (pode ser movida para um arquivo separado: types/newsletter.ts)
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
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
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

// Componente para exibir mensagem de erro
function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-500">
      <div className="text-center p-6 bg-gray-800 rounded-lg border border-red-500/30">
        <p className="text-lg">{message}</p>
        <Button onClick={onRetry} className="mt-4">
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
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
    new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Carregar campanhas com cancelamento de requisição
  useEffect(() => {
    const controller = new AbortController();
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/newsletter-campaigns", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Falha ao carregar campanhas");
        const data: Campaign[] = await response.json();
        setCampaigns(data);
        if (data.length > 0) setSelectedCampaign(data[0]);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
    return () => controller.abort(); // Cleanup para evitar memory leaks
  }, []);

  // Renderização condicional para loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Renderização condicional para erro
  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Estatísticas da Newsletter
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedCampaign?.id.toString() || ""}
            onValueChange={(value) =>
              setSelectedCampaign(
                campaigns.find((c) => c.id.toString() === value) || null
              )
            }
          >
            <SelectTrigger className="w-full sm:w-[280px] rounded-md border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-purple-500">
              <SelectValue placeholder="Selecione uma campanha" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800 text-white">
              {campaigns.map((campaign) => (
                <SelectItem
                  key={campaign.id}
                  value={campaign.id.toString()}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push("/dashboard/newsletter/enviar")}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white focus:ring-2 focus:ring-purple-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Destinatários"
                icon={<Users className="h-5 w-5 text-blue-400" />}
                value={selectedCampaign.totalRecipients.toLocaleString()}
                description="Total de envios"
              />
              <StatCard
                title="Taxa de Abertura"
                icon={<MailOpen className="h-5 w-5 text-green-400" />}
                value={`${selectedCampaign.openRate}%`}
                description={`${selectedCampaign.opened} de ${selectedCampaign.totalRecipients}`}
                valueClassName="text-green-400"
              />
              <StatCard
                title="Taxa de Cliques"
                icon={<MousePointerClick className="h-5 w-5 text-purple-400" />}
                value={`${selectedCampaign.clickRate}%`}
                description={`${selectedCampaign.clicked} cliques`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <p className="text-sm text-gray-400">
                    {formatDate(campaign.sentAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-medium capitalize">
                        {campaign.status}
                      </p>
                    </div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
