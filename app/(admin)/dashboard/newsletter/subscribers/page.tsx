"use client";

import { useState, useEffect } from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definir interfaces
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

  // Função para buscar subscribers
  const fetchSubscribers = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        // Construir URL com filtros
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

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Falha na resposta do servidor");
        }

        const data = await response.json();

        setSubscribers(data.subscribers);
        setStats(data.stats);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Erro ao buscar subscribers", error);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, sourceFilter, searchTerm]
  );

  // Carregar subscribers na montagem
  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);
  // Funções de navegação de página
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

  // Pesquisar
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers(1);
  };

  // Selecionar/deselecionar todos
  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    }
  };

  // Selecionar/deselecionar um subscriber
  const toggleSelectSubscriber = (id: number) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter((s) => s !== id));
    } else {
      setSelectedSubscribers([...selectedSubscribers, id]);
    }
  };

  // Exportar subscribers selecionados
  const exportSelectedSubscribers = () => {
    const selectedData = subscribers.filter((s) =>
      selectedSubscribers.includes(s.id)
    );

    // Criar CSV
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

    // Download do arquivo
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

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
          Gestão de Subscritores
        </h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Subscritor
        </Button>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-400" />
                Total de Subscritores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <UserPlus className="h-4 w-4 mr-2 text-green-400" />
                Novos Subscritores (30 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {stats.recentSubscribers}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <UserMinus className="h-4 w-4 mr-2 text-red-400" />
                Cancelamentos (30 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                {stats.unsubscribedRecently}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                Taxa de Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {stats.activeRatio}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros e Pesquisa */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Pesquisar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="border-gray-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="manual">
                      Adicionado Manualmente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações em Massa */}
      {selectedSubscribers.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex justify-between items-center">
          <div className="text-white">
            <span className="font-medium">{selectedSubscribers.length}</span>{" "}
            subscritores selecionados
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-700"
              onClick={exportSelectedSubscribers}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-red-400 hover:bg-red-900/30 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Excluir
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Subscritores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedSubscribers.length === subscribers.length &&
                        subscribers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded bg-gray-900 border-gray-700 text-purple-600"
                    />
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Data de Inscrição
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-400"
                    >
                      Nenhum subscritor encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={() => toggleSelectSubscriber(subscriber.id)}
                          className="rounded bg-gray-900 border-gray-700 text-purple-600"
                        />
                      </TableCell>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {subscriber.source || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`
                            px-2 py-1 rounded text-xs
                            ${subscriber.active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}
                          `}
                        >
                          {subscriber.active ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-gray-700 hover:bg-gray-700"
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          {/* Controles de Paginação */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-400">
              Página {pagination.page} de {pagination.totalPages} (Total:{" "}
              {pagination.total} subscritores)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={pagination.page <= 1}
                className="border-gray-700 text-white disabled:text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pagination.page >= pagination.totalPages}
                className="border-gray-700 text-white disabled:text-gray-500"
              >
                Próximo <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
