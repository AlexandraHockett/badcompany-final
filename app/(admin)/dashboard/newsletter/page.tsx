// app/(admin)/dashboard/newsletter/page.tsx - Redesenhado para responsividade
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Users,
  MousePointerClick,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart2,
  MailOpen,
  Loader2,
  ChevronUp,
  ChevronDown,
  Download,
  Send,
  Check,
  AlertCircle,
  Edit,
  Clock,
} from "lucide-react";

// Type definitions
interface StatCardProps {
  title: string;
  icon: React.ReactElement;
  value: string | number;
  description: string;
  valueClassName?: string;
  isLoading?: boolean;
}

interface NewsletterCardProps {
  campaign: Campaign | null;
  isSelected: boolean;
  onClick: (campaign: Campaign) => void;
  isLoading: boolean;
}

interface Campaign {
  id: number;
  title: string;
  totalRecipients: number;
  openRate: string;
  opened: number;
  clickRate: string;
  clicked: number;
  sentAt: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed" | string;
}

// Componente de Card de Estatísticas
const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  value,
  description,
  valueClassName = "",
  isLoading = false,
}) => {
  return (
    <div className="border border-gray-700 bg-gray-800/30 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-10">{icon}</div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 bg-gray-700/50 rounded-full flex items-center justify-center text-white">
            {icon}
          </div>
          <h3 className="font-medium text-sm text-gray-300">{title}</h3>
        </div>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-700/50 animate-pulse rounded mt-1"></div>
        ) : (
          <div className="mt-2">
            <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Cartão de Newsletter
const NewsletterCard: React.FC<NewsletterCardProps> = ({
  campaign,
  isSelected,
  onClick,
  isLoading,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusInfo = (
    status: string
  ): { label: string; icon: React.ReactElement; color: string } => {
    switch (status) {
      case "draft":
        return {
          label: "Rascunho",
          icon: <Edit className="h-3 w-3" />,
          color: "text-amber-400 bg-amber-500/10",
        };
      case "scheduled":
        return {
          label: "Agendada",
          icon: <Calendar className="h-3 w-3" />,
          color: "text-blue-400 bg-blue-500/10",
        };
      case "sending":
        return {
          label: "Enviando",
          icon: <Send className="h-3 w-3" />,
          color: "text-purple-400 bg-purple-500/10",
        };
      case "sent":
        return {
          label: "Enviada",
          icon: <Check className="h-3 w-3" />,
          color: "text-green-400 bg-green-500/10",
        };
      case "failed":
        return {
          label: "Falha",
          icon: <AlertCircle className="h-3 w-3" />,
          color: "text-red-400 bg-red-500/10",
        };
      default:
        return {
          label: status,
          icon: <Mail className="h-3 w-3" />,
          color: "text-gray-400 bg-gray-500/10",
        };
    }
  };

  if (isLoading || !campaign) {
    return (
      <div className="bg-gray-800/20 border border-gray-700/50 rounded-lg p-4 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-700/50 rounded mb-2"></div>
        <div className="h-4 w-1/3 bg-gray-700/30 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-gray-700/30 rounded"></div>
          <div className="h-8 w-20 bg-gray-700/30 rounded"></div>
        </div>
      </div>
    );
  }

  const status = getStatusInfo(campaign.status);

  return (
    <div
      className={`cursor-pointer transition-all duration-200 p-4 rounded-lg ${
        isSelected
          ? "border-purple-500 bg-gray-800/50"
          : "border border-gray-700/50 bg-gray-800/20 hover:border-gray-600"
      }`}
      onClick={() => onClick(campaign)}
    >
      <h3 className="font-medium text-base text-white mb-1 truncate">
        {campaign.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {formatDate(campaign.sentAt)}
      </p>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${status.color}`}
        >
          {status.icon}
          <span>{status.label}</span>
        </span>
        <Link
          href={`/dashboard/newsletter/${campaign.id}`}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          Ver Detalhes
          <ChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default function NewsletterDashboard() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "name" | "openRate">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "sent" | "draft" | "scheduled"
  >("all");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/newsletter-campaigns");

        if (!response.ok) {
          throw new Error("Failed to load campaigns");
        }

        const data: Campaign[] = await response.json();
        setCampaigns(data);

        if (data.length > 0) {
          setSelectedCampaign(data[0]);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        setError("Falha ao carregar campanhas");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadCampaigns();
  }, []);

  const toggleSort = (field: "date" | "name" | "openRate") => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedCampaigns = () => {
    let result = [...campaigns];

    if (searchTerm) {
      result = result.filter((campaign) =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((campaign) => campaign.status === filterStatus);
    }

    switch (sortBy) {
      case "name":
        result.sort((a, b) =>
          sortDirection === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        );
        break;
      case "openRate":
        result.sort((a, b) => {
          const rateA = parseFloat(a.openRate);
          const rateB = parseFloat(b.openRate);
          return sortDirection === "asc" ? rateA - rateB : rateB - rateA;
        });
        break;
      default: // date
        result.sort((a, b) => {
          const dateA = new Date(a.sentAt).getTime();
          const dateB = new Date(b.sentAt).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    return result;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Newsletter
            </h1>
            <p className="text-gray-400 mt-1">
              Gerencie suas campanhas de email marketing
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Search size={16} />
              <span className="text-sm">Buscar</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/newsletter/enviar")}
              className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm">Nova Campanha</span>
            </button>
          </div>
        </motion.div>

        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar campanhas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-2 pl-10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="min-w-[150px]">
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "sent" | "draft" | "scheduled"
                      )
                    }
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="sent">Enviadas</option>
                    <option value="draft">Rascunhos</option>
                    <option value="scheduled">Agendadas</option>
                  </select>
                </div>
                <div className="min-w-[150px]">
                  <select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [field, direction] = e.target.value.split("-");
                      setSortBy(field as "date" | "name" | "openRate");
                      setSortDirection(direction as "asc" | "desc");
                    }}
                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date-desc">Data (recente primeiro)</option>
                    <option value="date-asc">Data (antiga primeiro)</option>
                    <option value="name-asc">Nome (A-Z)</option>
                    <option value="name-desc">Nome (Z-A)</option>
                    <option value="openRate-desc">
                      Taxa de abertura (maior)
                    </option>
                    <option value="openRate-asc">
                      Taxa de abertura (menor)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            variants={itemVariants}
            className="bg-red-900/30 text-red-300 border border-red-500/30 rounded-lg p-4 flex items-center gap-2"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-md text-sm transition-colors"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
              <div className="border-b border-gray-800 p-4">
                <h2 className="font-bold text-lg">Campanhas</h2>
              </div>
              <div className="max-h-[650px] overflow-y-auto p-4 space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <NewsletterCard
                      key={i}
                      campaign={null}
                      isSelected={false}
                      onClick={() => {}}
                      isLoading={true}
                    />
                  ))
                ) : filteredAndSortedCampaigns().length > 0 ? (
                  filteredAndSortedCampaigns().map((campaign) => (
                    <NewsletterCard
                      key={campaign.id}
                      campaign={campaign}
                      isSelected={selectedCampaign?.id === campaign.id}
                      onClick={setSelectedCampaign}
                      isLoading={false}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Mail className="h-10 w-10 mx-auto text-gray-500 mb-3" />
                    <p className="text-gray-400">Nenhuma campanha encontrada</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                      >
                        Limpar busca
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            {selectedCampaign ? (
              <div className="space-y-6">
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {selectedCampaign.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(selectedCampaign.sentAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {selectedCampaign.totalRecipients.toLocaleString()}{" "}
                            destinatários
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors">
                        Duplicar
                      </button>
                      <Link
                        href={`/dashboard/newsletter/${selectedCampaign.id}`}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-sm transition-colors text-white"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    title="Destinatários"
                    icon={<Users className="h-6 w-6" />}
                    value={selectedCampaign.totalRecipients.toLocaleString()}
                    description="Total de envios"
                    isLoading={loading}
                  />
                  <StatCard
                    title="Taxa de Abertura"
                    icon={<MailOpen className="h-6 w-6" />}
                    value={`${selectedCampaign.openRate}%`}
                    description={`${selectedCampaign.opened} de ${selectedCampaign.totalRecipients}`}
                    valueClassName="text-green-400"
                    isLoading={loading}
                  />
                  <StatCard
                    title="Taxa de Cliques"
                    icon={<MousePointerClick className="h-6 w-6" />}
                    value={`${selectedCampaign.clickRate}%`}
                    description={`${selectedCampaign.clicked} cliques`}
                    valueClassName="text-purple-400"
                    isLoading={loading}
                  />
                  <StatCard
                    title="Data de Envio"
                    icon={<Clock className="h-6 w-6" />}
                    value={formatDate(selectedCampaign.sentAt)}
                    description={new Date(
                      selectedCampaign.sentAt
                    ).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    valueClassName="text-yellow-300"
                    isLoading={loading}
                  />
                </div>

                <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="border-b border-gray-800 p-4 flex justify-between items-center">
                    <h2 className="font-bold">Desempenho da Campanha</h2>
                    <div className="flex gap-2">
                      <select className="bg-gray-800 border border-gray-700 text-sm rounded-md px-2 py-1">
                        <option value="7days">Últimos 7 dias</option>
                        <option value="30days">Últimos 30 dias</option>
                        <option value="alltime">Todo o período</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-4 h-64 flex items-center justify-center">
                    {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    ) : (
                      <div className="text-center">
                        <BarChart2 className="h-20 w-20 mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-400 mb-3">
                          Gráficos de performance detalhados
                        </p>
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors">
                          Ver análise completa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-8 h-[400px] flex flex-col items-center justify-center">
                {loading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                ) : (
                  <>
                    <Mail className="h-16 w-16 text-gray-700 mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">
                      Nenhuma campanha selecionada
                    </h3>
                    <p className="text-gray-400 text-center max-w-md mb-6">
                      Selecione uma campanha para ver suas estatísticas
                      detalhadas ou crie uma nova campanha.
                    </p>
                    <button
                      onClick={() =>
                        router.push("/dashboard/newsletter/enviar")
                      }
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      Criar Nova Campanha
                    </button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Link
            href="/dashboard/newsletter/subscribers"
            className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 hover:from-blue-900/50 hover:to-blue-900/20 border border-blue-500/20 p-4 rounded-xl transition-all hover:-translate-y-1 group"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-blue-900/40 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Assinantes</h3>
                <p className="text-sm text-gray-400">
                  Gerencie sua lista de contatos
                </p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-all" />
            </div>
          </Link>

          <Link
            href="/dashboard/newsletter/enviar"
            className="bg-gradient-to-br from-purple-900/40 to-purple-900/10 hover:from-purple-900/50 hover:to-purple-900/20 border border-purple-500/20 p-4 rounded-xl transition-all hover:-translate-y-1 group"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-purple-900/40 p-3 rounded-xl">
                <Send className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Nova Campanha</h3>
                <p className="text-sm text-gray-400">
                  Crie e envie uma nova newsletter
                </p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-all" />
            </div>
          </Link>

          <Link
            href="/dashboard/newsletter/analytics"
            className="bg-gradient-to-br from-green-900/40 to-green-900/10 hover:from-green-900/50 hover:to-green-900/20 border border-green-500/20 p-4 rounded-xl transition-all hover:-translate-y-1 group"
          >
            <div className="flex gap-4 items-center">
              <div className="bg-green-900/40 p-3 rounded-xl">
                <BarChart2 className="h-6 w-6 text-green-300" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Análises</h3>
                <p className="text-sm text-gray-400">
                  Ver métricas detalhadas e relatórios
                </p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-all" />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
