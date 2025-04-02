"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  UserPlus,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Download,
  Trash2,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";

// Interfaces
interface SubscriberStats {
  totalSubscribers: number;
  recentSubscribers: number;
  unsubscribedRecently: number;
  activeRatio: string;
}

interface Subscriber {
  id: number;
  email: string;
  name?: string | null;
  createdAt: string;
  source?: string | null;
  active: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface StatCardProps {
  title: string;
  icon: React.ReactElement;
  value: string | number;
  description?: string; // Made optional to match usage
  color?: "purple" | "green" | "red" | "blue";
}

interface SortableTableHeaderProps {
  title: string;
  field: string;
  currentSort: { field: string; direction: "asc" | "desc" };
  onSort: (field: string) => void;
}

interface SubscriberCardMobileProps {
  subscriber: Subscriber;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAction: (action: string, id: number) => void;
}

// Componente de Card de Estatísticas
const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  value,
  description,
  color = "purple",
}) => {
  const colors: Record<"purple" | "green" | "red" | "blue", string> = {
    purple: "bg-purple-900/20 text-purple-300 border-purple-500/30",
    green: "bg-green-900/20 text-green-300 border-green-500/30",
    red: "bg-red-900/20 text-red-300 border-red-500/30",
    blue: "bg-blue-900/20 text-blue-300 border-blue-500/30",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4 backdrop-blur-sm`}>
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className={`rounded-full p-3 bg-white/10 flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="flex items-baseline gap-1">
            <p className="text-xl md:text-2xl font-bold">{value}</p>
            {description && <p className="text-xs opacity-70">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Header de Tabela com Ordenação
const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  title,
  field,
  currentSort,
  onSort,
}) => {
  const isSorting = currentSort.field === field;

  return (
    <div
      className="flex items-center gap-1 cursor-pointer group"
      onClick={() => onSort(field)}
    >
      <span>{title}</span>
      {isSorting ? (
        currentSort.direction === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
      )}
    </div>
  );
};

// Componente de Card de Subscriber Mobile
const SubscriberCardMobile: React.FC<SubscriberCardMobileProps> = ({
  subscriber,
  isSelected,
  onSelect,
  onAction,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isSelected
          ? "bg-purple-900/20 border-purple-500"
          : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600"
      } transition-colors cursor-pointer`}
      onClick={() => onSelect(subscriber.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{subscriber.email}</h3>
          {subscriber.name && (
            <p className="text-sm text-gray-400">{subscriber.name}</p>
          )}
        </div>
        <div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              subscriber.active
                ? "bg-green-900/30 text-green-400"
                : "bg-red-900/30 text-red-400"
            }`}
          >
            {subscriber.active ? "Ativo" : "Inativo"}
          </span>
        </div>

        <div className="flex justify-between mt-3 text-xs text-gray-400">
          <div>
            <Calendar className="inline h-3 w-3 mr-1" />
            {new Date(subscriber.createdAt).toLocaleDateString()}
          </div>
          <div>{subscriber.source || "Direto"}</div>
        </div>

        <div className="mt-3 flex justify-between">
          <button
            className="text-purple-400 hover:text-purple-300 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onAction("details", subscriber.id);
            }}
          >
            Ver detalhes
          </button>
          <button
            className="text-gray-400 hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              onAction("menu", subscriber.id);
            }}
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SubscribersDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<SubscriberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({ field: "createdAt", direction: "desc" });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

  const fetchSubscribers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        let url = `/api/newsletter-subscribe?page=${page}`;
        if (statusFilter !== "all") {
          url += `&active=${statusFilter === "active"}`;
        }
        if (sourceFilter !== "all") {
          url += `&source=${sourceFilter}`;
        }
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }

        setTimeout(() => {
          const mockData = {
            subscribers: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              email: `user${i + 1}@example.com`,
              name: i % 3 === 0 ? `User ${i + 1}` : null,
              createdAt: new Date(
                Date.now() - Math.random() * 10000000000
              ).toISOString(),
              source:
                i % 4 === 0
                  ? "Website"
                  : i % 4 === 1
                    ? "Landing Page"
                    : i % 4 === 2
                      ? "Manual"
                      : null,
              active: Math.random() > 0.2,
            })),
            stats: {
              totalSubscribers: 3450,
              recentSubscribers: 123,
              unsubscribedRecently: 15,
              activeRatio: "98.5%",
            },
            pagination: {
              total: 3450,
              page: page,
              pageSize: 20,
              totalPages: 173,
            },
          };

          mockData.subscribers.sort((a, b) => {
            if (sort.field === "email") {
              return sort.direction === "asc"
                ? a.email.localeCompare(b.email)
                : b.email.localeCompare(a.email);
            } else if (sort.field === "createdAt") {
              return sort.direction === "asc"
                ? new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime();
            }
            return 0;
          });

          if (searchTerm) {
            mockData.subscribers = mockData.subscribers.filter(
              (s) =>
                s.email.includes(searchTerm) ||
                (s.name && s.name.includes(searchTerm))
            );
          }

          if (statusFilter !== "all") {
            mockData.subscribers = mockData.subscribers.filter((s) =>
              statusFilter === "active" ? s.active : !s.active
            );
          }

          if (sourceFilter !== "all") {
            mockData.subscribers = mockData.subscribers.filter(
              (s) => s.source === sourceFilter
            );
          }

          setSubscribers(mockData.subscribers);
          setStats(mockData.stats);
          setPagination(mockData.pagination);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erro ao buscar subscribers", error);
        setLoading(false);
      }
    },
    [statusFilter, sourceFilter, searchTerm, sort]
  );

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const goToNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      fetchSubscribers(pagination.page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pagination.page > 1) {
      fetchSubscribers(pagination.page - 1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers(1);
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    }
  };

  const toggleSelectSubscriber = (id: number) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter((s) => s !== id));
    } else {
      setSelectedSubscribers([...selectedSubscribers, id]);
    }
  };

  const exportSelectedSubscribers = () => {
    const selectedData = subscribers.filter((s) =>
      selectedSubscribers.includes(s.id)
    );

    const headers = [
      "ID",
      "Email",
      "Nome",
      "Data de Inscrição",
      "Origem",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedData.map((s) =>
        [
          s.id,
          s.email,
          s.name || "",
          new Date(s.createdAt).toLocaleDateString(),
          s.source || "",
          s.active ? "Ativo" : "Inativo",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "subscribers.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: string) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({
        field,
        direction: "asc",
      });
    }
  };

  const handleSubscriberAction = (action: string, id?: number) => {
    switch (action) {
      case "view":
        alert(`Ver detalhes do subscriber ${id}`);
        break;
      case "delete":
        alert(`Excluir subscriber(s): ${id || selectedSubscribers.join(", ")}`);
        break;
      case "export":
        exportSelectedSubscribers();
        break;
      default:
        console.log(`Ação ${action} para ${id || "selecionados"}`);
    }
  };

  return (
    <motion.div
      className="space-y-6 max-w-screen-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Subscritores
          </h1>
          <p className="text-gray-400 mt-1">
            Gerencie seus assinantes de newsletter
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Buscar</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <UserPlus className="h-4 w-4" />
            <span className="text-sm">Adicionar</span>
          </button>
        </div>
      </motion.div>

      {stats && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total de Subscritores"
            icon={<Users className="h-5 w-5" />}
            value={stats.totalSubscribers.toLocaleString()}
            color="purple"
          />
          <StatCard
            title="Novos Subscritores"
            icon={<UserPlus className="h-5 w-5" />}
            value={stats.recentSubscribers.toLocaleString()}
            description="últimos 30 dias"
            color="green"
          />
          <StatCard
            title="Cancelamentos"
            icon={<UserMinus className="h-5 w-5" />}
            value={stats.unsubscribedRecently.toLocaleString()}
            description="últimos 30 dias"
            color="red"
          />
          <StatCard
            title="Taxa de Ativos"
            icon={<Mail className="h-5 w-5" />}
            value={stats.activeRatio}
            color="blue"
          />
        </motion.div>
      )}

      {isSearchExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Email ou nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Origem
                  </label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todas</option>
                    <option value="Website">Website</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="Manual">Adicionado Manualmente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSourceFilter("all");
                    fetchSubscribers(1);
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {selectedSubscribers.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center gap-3"
        >
          <div className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-purple-400" />
            <span className="font-medium">{selectedSubscribers.length}</span>
            <span>subscritores selecionados</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
              onClick={() => handleSubscriberAction("export")}
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Exportar</span>
            </button>
            <button
              className="flex-1 sm:flex-none px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-colors flex items-center justify-center gap-1"
              onClick={() => handleSubscriberAction("delete")}
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm">Excluir</span>
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="border-b border-gray-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-bold text-lg">Lista de Subscritores</h2>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <span>Exibindo</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) =>
                    console.log("Mudando tamanho: " + e.target.value)
                  }
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 mx-1"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>por página</span>
              </div>
              <button
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => fetchSubscribers(pagination.page)}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
                <p className="text-gray-400">Carregando subscritores...</p>
              </div>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Nenhum subscritor encontrado
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Não foram encontrados subscritores com os critérios
                selecionados.
              </p>
              <div className="flex justify-center gap-3">
                {(searchTerm ||
                  statusFilter !== "all" ||
                  sourceFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setSourceFilter("all");
                      fetchSubscribers(1);
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Subscritor</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/70">
                    <tr>
                      <th className="w-12 p-3">
                        <input
                          type="checkbox"
                          checked={
                            selectedSubscribers.length === subscribers.length &&
                            subscribers.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded bg-gray-900 border-gray-700 text-purple-600"
                        />
                      </th>
                      <th className="p-3 text-left">
                        <SortableTableHeader
                          title="Email"
                          field="email"
                          currentSort={sort}
                          onSort={handleSort}
                        />
                      </th>
                      <th className="p-3 text-left">Nome</th>
                      <th className="p-3 text-left">
                        <SortableTableHeader
                          title="Data de Inscrição"
                          field="createdAt"
                          currentSort={sort}
                          onSort={handleSort}
                        />
                      </th>
                      <th className="p-3 text-left">Origem</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr
                        key={subscriber.id}
                        className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${
                          selectedSubscribers.includes(subscriber.id)
                            ? "bg-purple-900/10"
                            : ""
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(
                              subscriber.id
                            )}
                            onChange={() =>
                              toggleSelectSubscriber(subscriber.id)
                            }
                            className="rounded bg-gray-900 border-gray-700 text-purple-600"
                          />
                        </td>
                        <td className="p-3 font-medium">{subscriber.email}</td>
                        <td className="p-3">{subscriber.name || "-"}</td>
                        <td className="p-3">
                          {new Date(subscriber.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">{subscriber.source || "-"}</td>
                        <td className="p-3">
                          <span
                            className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs
                              ${
                                subscriber.active
                                  ? "bg-green-900/30 text-green-400"
                                  : "bg-red-900/30 text-red-400"
                              }
                            `}
                          >
                            {subscriber.active ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {subscriber.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              className="p-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                              title="Ver detalhes"
                              onClick={() =>
                                handleSubscriberAction("view", subscriber.id)
                              }
                            >
                              <Search className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 bg-red-900/20 hover:bg-red-900/30 rounded text-red-400 hover:text-red-300 transition-colors"
                              title="Excluir"
                              onClick={() =>
                                handleSubscriberAction("delete", subscriber.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden p-4 space-y-3">
                {subscribers.map((subscriber) => (
                  <SubscriberCardMobile
                    key={subscriber.id}
                    subscriber={subscriber}
                    isSelected={selectedSubscribers.includes(subscriber.id)}
                    onSelect={toggleSelectSubscriber}
                    onAction={handleSubscriberAction}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && subscribers.length > 0 && (
            <div className="border-t border-gray-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-gray-400">
                Mostrando{" "}
                <span className="font-medium text-white">
                  {(pagination.page - 1) * pagination.pageSize + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium text-white">
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                de{" "}
                <span className="font-medium text-white">
                  {pagination.total}
                </span>{" "}
                subscritores
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={pagination.page <= 1}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="bg-gray-800 rounded-lg flex items-center px-3 py-1.5">
                  <span className="text-sm">Página</span>
                  <input
                    type="number"
                    min="1"
                    max={pagination.totalPages}
                    value={pagination.page}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= pagination.totalPages) {
                        fetchSubscribers(page);
                      }
                    }}
                    className="w-12 bg-gray-900 border border-gray-700 rounded mx-2 px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <span className="text-sm">de {pagination.totalPages}</span>
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-5"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="bg-blue-900/30 p-3 rounded-full">
            <Mail className="h-6 w-6 text-blue-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">
              Gerencie seus subscritores de maneira eficiente
            </h3>
            <p className="text-gray-300 text-sm">
              Utilize os filtros para encontrar segmentos específicos, exporte
              listas para envios personalizados, e mantenha sua base de
              subscritores sempre atualizada para maximizar o engajamento das
              suas campanhas.
            </p>
          </div>
          <Link
            href="/dashboard/newsletter/enviar"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
          >
            Enviar newsletter
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
