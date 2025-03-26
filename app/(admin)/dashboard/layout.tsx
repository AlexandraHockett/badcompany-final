// app/(admin)/dashboard/layout.tsx
"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  BarChart2,
  Calendar,
  ShoppingBag,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Edit,
  Send,
  Eye,
  Image,
  CreditCard,
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  text: string;
  active: boolean | undefined;
  onClick?: () => void;
  subLinks?: {
    href: string;
    text: string;
    icon: ReactNode;
  }[];
}

function SidebarLink({
  href,
  icon,
  text,
  active,
  onClick,
  subLinks,
}: SidebarLinkProps) {
  const [expanded, setExpanded] = useState(active && subLinks ? true : false);

  const toggleExpand = (e: React.MouseEvent) => {
    if (subLinks && subLinks.length > 0) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  return (
    <div className="mb-1">
      <Link
        href={href}
        className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
          active
            ? "bg-purple-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        } ${subLinks && subLinks.length > 0 ? "justify-between" : ""}`}
        onClick={(e) => {
          if (subLinks && subLinks.length > 0) {
            toggleExpand(e);
          } else if (onClick) {
            onClick();
          }
        }}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span>{text}</span>
        </div>
        {subLinks && subLinks.length > 0 && (
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      {subLinks && subLinks.length > 0 && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 pl-4 border-l border-gray-700 mt-1">
                {subLinks.map((subLink, idx) => {
                  const subActive = usePathname() === subLink.href;
                  return (
                    <Link
                      key={idx}
                      href={subLink.href}
                      className={`flex items-center px-4 py-2 text-sm rounded-lg mb-1 ${
                        subActive
                          ? "bg-purple-700/50 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="mr-3">{subLink.icon}</span>
                      <span>{subLink.text}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Create an array of navigation items
  const navItems = [
    {
      href: "/dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
      text: "Dashboard",
    },
    {
      href: "/dashboard/newsletter",
      icon: <Mail className="h-5 w-5" />,
      text: "Newsletter",
      subLinks: [
        {
          href: "/dashboard/newsletter",
          icon: <Eye className="h-4 w-4" />,
          text: "Visão Geral",
        },
        {
          href: "/dashboard/newsletter/subscribers",
          icon: <Users className="h-4 w-4" />,
          text: "Subscritores",
        },
        {
          href: "/dashboard/newsletter/enviar",
          icon: <Send className="h-4 w-4" />,
          text: "Enviar",
        },
      ],
    },
    {
      href: "/dashboard/eventos",
      icon: <Calendar className="h-5 w-5" />,
      text: "Eventos",
      subLinks: [
        {
          href: "/dashboard/eventos/listar",
          icon: <Eye className="h-4 w-4" />,
          text: "Listar Eventos",
        },
        {
          href: "/dashboard/eventos/adicionar",
          icon: <Edit className="h-4 w-4" />,
          text: "Adicionar Evento",
        },
        {
          href: "/dashboard/eventos/bilhetes",
          icon: <CreditCard className="h-4 w-4" />,
          text: "Bilhetes Vendidos",
        },
      ],
    },
    {
      href: "/dashboard/media",
      icon: <Image className="h-5 w-5" />,
      text: "Media",
    },
    {
      href: "/dashboard/loja",
      icon: <ShoppingBag className="h-5 w-5" />,
      text: "Loja",
    },
    {
      href: "/dashboard/configuracoes",
      icon: <Settings className="h-5 w-5" />,
      text: "Configurações",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              BadCompany
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navItems.map((item, idx) => (
            <SidebarLink
              key={idx}
              href={item.href}
              icon={item.icon}
              text={item.text}
              active={
                pathname === item.href ||
                (item.subLinks &&
                  item.subLinks.some((subLink) => pathname === subLink.href))
              }
              subLinks={item.subLinks}
              onClick={
                item.subLinks && item.subLinks.length > 0
                  ? undefined
                  : () => {
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }
              }
            />
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button className="flex items-center justify-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-gray-800 border-b border-gray-700 h-16 flex items-center">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-400 hover:text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-sm text-gray-400">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="container mx-auto py-6 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
