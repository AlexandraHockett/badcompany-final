"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

// Definir interfaces (mantidas do exemplo anterior)
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

  // Função para buscar subscribers
  const fetchSubscribers = async (page = 1) => {
    try {
      const response = await fetch(`/api/newsletter-subscribe?page=${page}`);

      // Log do status da resposta
      console.log("Status da resposta:", response.status);

      // Verificar o tipo de conteúdo
      const contentType = response.headers.get("content-type");
      console.log("Tipo de conteúdo:", contentType);

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor");
      }

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Resposta não é JSON:", text);
        throw new Error("Resposta não é JSON válido");
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
  };

  // Carregar subscribers na montagem
  useEffect(() => {
    fetchSubscribers();
  }, []);

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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Estatísticas (mantidas do exemplo anterior) */}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Inscrição</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>{subscriber.email}</TableCell>
                  <TableCell>{subscriber.name || "-"}</TableCell>
                  <TableCell>
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{subscriber.source || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`
                      px-2 py-1 rounded text-xs
                      ${subscriber.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    `}
                    >
                      {subscriber.active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Controles de Paginação */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages} (Total:{" "}
              {pagination.total} subscribers)
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pagination.page >= pagination.totalPages}
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
