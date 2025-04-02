// app/(admin)/dashboard/page.tsx - Dashboard principal melhorado
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart,
  TrendingUp,
  Users,
  Mail,
  Calendar,
  Eye,
  ChevronRight,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  BarChart2,
  Loader2,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

// Type definitions
interface Trend {
  direction: "up" | "down";
  value: string;
  period: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<React.ComponentProps<LucideIcon>>; // More specific typing
  trend?: Trend;
  color?: "purple" | "blue" | "green" | "amber";
  isLoading?: boolean;
}

interface ActionListItemProps {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactElement;
  color: string;
  action: React.ReactElement;
  loading?: boolean;
}

interface ActionCardProps {
  title: string;
  icon: React.ReactElement;
  description: string;
  buttonText: string;
  color: string;
  onClick: () => void;
}

interface Campaign {
  id: number;
  title: string;
  date: string;
  status: string;
  openRate: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "purple",
  isLoading = false,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          text: "text-blue-400",
          icon: "bg-blue-500/20 text-blue-500",
          uptrend: "text-blue-400",
          downtrend: "text-red-400",
        };
      case "green":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-400",
          icon: "bg-green-500/20 text-green-500",
          uptrend: "text-green-400",
          downtrend: "text-red-400",
        };
      case "amber":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          text: "text-amber-400",
          icon: "bg-amber-500/20 text-amber-500",
          uptrend: "text-green-400",
          downtrend: "text-red-400",
        };
      default:
        return {
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          text: "text-purple-400",
          icon: "bg-purple-500/20 text-purple-500",
          uptrend: "text-green-400",
          downtrend: "text-red-400",
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div
      className={`${colorClasses.bg} border ${colorClasses.border} rounded-xl p-5 backdrop-blur-sm relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 -m-6 transform rotate-12 opacity-30">
        {React.cloneElement(icon, { className: "w-full h-full" })}
      </div>

      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          {isLoading ? (
            <div className="mt-1 h-8 w-20 bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <h3 className={`text-2xl font-bold mt-1 ${colorClasses.text}`}>
              {value}
            </h3>
          )}
        </div>
        <div className={`rounded-full p-2 ${colorClasses.icon}`}>
          {React.cloneElement(icon, { size: 18 })}
        </div>
      </div>

      {trend && !isLoading && (
        <div className="flex items-center mt-3 text-xs">
          {trend.direction === "up" ? (
            <ArrowUpRight size={14} className="text-green-400 mr-1" />
          ) : (
            <ArrowDownRight size={14} className="text-red-400 mr-1" />
          )}
          <span
            className={
              trend.direction === "up"
                ? colorClasses.uptrend
                : colorClasses.downtrend
            }
          >
            {trend.value}
          </span>
          <span className="text-gray-500 ml-1">{trend.period}</span>
        </div>
      )}
    </div>
  );
};

const ActionListItem: React.FC<ActionListItemProps> = ({
  title,
  subtitle,
  value,
  icon,
  color,
  action,
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-800/30 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center">
        <div
          className={`h-9 w-9 rounded-full ${color} flex items-center justify-center mr-3 flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-sm truncate">{title}</h4>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center">
        {loading ? (
          <div className="h-4 w-14 bg-gray-700 animate-pulse rounded"></div>
        ) : (
          <span className="text-sm font-medium mr-2">{value}</span>
        )}
        {action}
      </div>
    </div>
  );
};

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  description,
  buttonText,
  color,
  onClick,
}) => {
  return (
    <div
      className={`${color} rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-3">
          <div className="p-2 bg-white/10 rounded-lg mr-3">{icon}</div>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-white/80 mb-4 flex-1">{description}</p>
        <button
          onClick={onClick}
          className="w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueDevices: 0,
    subscribers: 3452,
    activeEvents: 8,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitorsResponse = await fetch("/api/visitors/count");
        const visitorData = await visitorsResponse.json();

        const devicesResponse = await fetch("/api/visitors/devices");
        const deviceData = await devicesResponse.json();

        setStats({
          ...stats,
          totalVisits: visitorData.count,
          uniqueDevices: deviceData.count,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchData();
  }, [stats]); // Added stats to dependency array to satisfy ESLint

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const recentCampaigns: Campaign[] = [
    {
      id: 1,
      title: "Newsletter de Verão",
      date: "15/03/2025",
      status: "Enviada",
      openRate: "32.5%",
    },
    {
      id: 2,
      title: "Promoção de Bilhetes",
      date: "01/03/2025",
      status: "Enviada",
      openRate: "41.2%",
    },
    {
      id: 3,
      title: "Novos Eventos",
      date: "20/02/2025",
      status: "Enviada",
      openRate: "28.7%",
    },
  ];

  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: "Festa de Verão",
      date: "15/06/2025",
      location: "Clube XYZ",
      ticketsSold: 350,
      totalTickets: 500,
    },
    {
      id: 2,
      title: "Workshop de DJ",
      date: "10/04/2025",
      location: "Estúdio ABC",
      ticketsSold: 45,
      totalTickets: 60,
    },
    {
      id: 3,
      title: "Festival de Música",
      date: "22/07/2025",
      location: "Parque Municipal",
      ticketsSold: 1200,
      totalTickets: 5000,
    },
  ];

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
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Bem-vindo à área administrativa da BadCompany
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
            <Activity size={16} />
            <span className="text-sm">Relatórios</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Plus size={16} />
            <span className="text-sm">Novo</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Visitas Totais"
          value={loading ? "" : stats.totalVisits.toLocaleString()}
          icon={<Eye />}
          trend={{
            direction: "up",
            value: "12.5%",
            period: "desde o mês passado",
          }}
          color="purple"
          isLoading={loading}
        />
        <StatCard
          title="Dispositivos Únicos"
          value={loading ? "" : stats.uniqueDevices.toLocaleString()}
          icon={<Users />}
          trend={{
            direction: "up",
            value: "5.2%",
            period: "desde o mês passado",
          }}
          color="blue"
          isLoading={loading}
        />
        <StatCard
          title="Subscritores"
          value={stats.subscribers.toLocaleString()}
          icon={<Mail />}
          trend={{
            direction: "up",
            value: "28.4%",
            period: "desde o mês passado",
          }}
          color="green"
          isLoading={loading}
        />
        <StatCard
          title="Eventos Ativos"
          value={stats.activeEvents.toString()}
          icon={<Calendar />}
          trend={{
            direction: "up",
            value: "+2",
            period: "desde o mês passado",
          }}
          color="amber"
          isLoading={loading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Campanhas Recentes</h2>
            <Link
              href="/dashboard/newsletter"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
            >
              Ver todas
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="p-2">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-3 mb-1">
                      <div className="flex justify-between mb-2">
                        <div className="h-5 w-40 bg-gray-700/70 rounded animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-700/70 rounded animate-pulse"></div>
                      </div>
                      <div className="h-4 w-60 bg-gray-700/50 rounded animate-pulse"></div>
                    </div>
                  ))
              : recentCampaigns.map((campaign) => (
                  <ActionListItem
                    key={campaign.id}
                    title={campaign.title}
                    subtitle={`${campaign.date} • ${campaign.status}`}
                    value={campaign.openRate}
                    icon={<Mail size={18} />}
                    color="bg-purple-600/20 text-purple-400"
                    action={
                      <ChevronRight size={16} className="text-gray-500" />
                    }
                  />
                ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4"
        >
          <ActionCard
            title="Enviar Newsletter"
            icon={<Mail size={20} className="text-white" />}
            description="Crie e envie uma newsletter para seus subscritores"
            buttonText="Criar Newsletter"
            color="bg-gradient-to-br from-purple-800 to-indigo-900 text-white"
            onClick={() => router.push("/dashboard/newsletter/enviar")}
          />
          <ActionCard
            title="Adicionar Evento"
            icon={<Calendar size={20} className="text-white" />}
            description="Crie um novo evento e gerencie bilhetes"
            buttonText="Criar Evento"
            color="bg-gradient-to-br from-blue-800 to-cyan-900 text-white"
            onClick={() => router.push("/dashboard/eventos/adicionar")}
          />
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Próximos Eventos</h2>
          <Link
            href="/dashboard/eventos"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center"
          >
            Ver todos
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                  >
                    <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-700/70 rounded animate-pulse mb-4"></div>
                    <div className="h-2.5 w-full bg-gray-700/50 rounded animate-pulse mt-6 mb-1"></div>
                    <div className="flex justify-between mt-1.5">
                      <div className="h-3 w-12 bg-gray-700/50 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-gray-700/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
            : upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:border-purple-500/30 transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/eventos/${event.id}`)}
                >
                  <h3 className="font-medium text-white truncate">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={14} />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{
                          width: `${(event.ticketsSold / event.totalTickets) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-gray-500">Vendas</span>
                      <span className="text-xs text-white">
                        {event.ticketsSold} / {event.totalTickets}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">Atividade Recente</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Atualizar
            </button>
          </div>
          <div className="p-5 space-y-4">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-gray-700/80 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="bg-green-600/20 text-green-500 rounded-full p-1.5 flex-shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      Novo subscritor registrado
                    </p>
                    <p className="text-xs text-gray-400">Há 5 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600/20 text-purple-500 rounded-full p-1.5 flex-shrink-0">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      Novo pedido #5423 recebido
                    </p>
                    <p className="text-xs text-gray-400">Há 12 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600/20 text-blue-500 rounded-full p-1.5 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      Campanha "Novos Eventos" completada
                    </p>
                    <p className="text-xs text-gray-400">Há 45 minutos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-amber-600/20 text-amber-500 rounded-full p-1.5 flex-shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      Evento "Workshop de DJ" criado
                    </p>
                    <p className="text-xs text-gray-400">Há 1 hora</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">
              Métricas de Desempenho
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                7 dias
              </button>
              <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full">
                30 dias
              </button>
              <button className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded-full transition-colors">
                1 ano
              </button>
            </div>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="h-64 w-full flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-purple-500" />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <BarChart2 size={120} className="text-gray-700" />
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Gráficos interativos</p>
                  <button
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
                    onClick={() => router.push("/dashboard/analytics")}
                  >
                    Ver análises detalhadas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
