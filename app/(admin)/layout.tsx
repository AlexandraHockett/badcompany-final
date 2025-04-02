// app/(admin)/layout.tsx - Versão melhorada e responsiva
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  Image,
  LogOut,
  Mail,
  Menu,
  Settings,
  ShoppingBag,
  User,
  Users,
  X,
  Edit,
  CreditCard,
  Bell,
  Search,
  Send,
  Eye,
} from "lucide-react";

// Type definitions
interface NavItem {
  href: string;
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  subItems?: SubItem[];
}

interface SubItem {
  href: string;
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
}

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  label: string;
  isActive: boolean;
  subItems?: SubItem[];
  mobileMode?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  label,
  isActive,
  subItems = [],
  mobileMode = false,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (mobileMode) {
      setIsOpen(false);
    }
  }, [mobileMode]);

  const toggleSubmenu = (e: React.MouseEvent) => {
    if (subItems.length > 0) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1 w-full">
      <Link
        href={subItems.length > 0 ? "#" : href}
        onClick={(e) => {
          if (subItems.length > 0) {
            toggleSubmenu(e);
          } else if (onClick) {
            // Changed from `onClick && onClick()` to explicit if
            onClick();
          }
        }}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg w-full transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-purple-900/70 to-purple-800/40 text-white font-medium"
            : "text-gray-400 hover:bg-gray-800/40 hover:text-white"
        }`}
      >
        <span className="inline-flex items-center justify-center w-7 h-7">
          {icon}
        </span>
        <span className="flex-1">{label}</span>
        {subItems.length > 0 && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      <AnimatePresence>
        {isOpen && subItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-10 mt-1"
          >
            <div className="border-l border-gray-700 pl-2 py-1 space-y-1">
              {subItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClick}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                    item.isActive
                      ? "bg-purple-900/30 text-purple-300"
                      : "text-gray-400 hover:bg-gray-800/40 hover:text-white"
                  }`}
                >
                  <span className="text-[0.8rem]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [unseenNotifications, setUnseenNotifications] = useState(3);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const isRouteActive = (route: string) => {
    if (route === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(route) && route !== "/dashboard";
  };

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/newsletter",
      icon: <Mail className="h-5 w-5" />,
      label: "Newsletter",
      isActive: isRouteActive("/dashboard/newsletter"),
      subItems: [
        {
          href: "/dashboard/newsletter",
          icon: <Eye className="h-4 w-4" />,
          label: "Visão Geral",
          isActive: pathname === "/dashboard/newsletter",
        },
        {
          href: "/dashboard/newsletter/subscribers",
          icon: <Users className="h-4 w-4" />,
          label: "Subscritores",
          isActive: pathname === "/dashboard/newsletter/subscribers",
        },
        {
          href: "/dashboard/newsletter/enviar",
          icon: <Send className="h-4 w-4" />,
          label: "Enviar Newsletter",
          isActive: pathname === "/dashboard/newsletter/enviar",
        },
      ],
    },
    {
      href: "/dashboard/eventos",
      icon: <Calendar className="h-5 w-5" />,
      label: "Eventos",
      isActive: isRouteActive("/dashboard/eventos"),
      subItems: [
        {
          href: "/dashboard/eventos",
          icon: <Eye className="h-4 w-4" />,
          label: "Ver Eventos",
          isActive: pathname === "/dashboard/eventos",
        },
        {
          href: "/dashboard/eventos/adicionar",
          icon: <Edit className="h-4 w-4" />,
          label: "Adicionar Evento",
          isActive: pathname === "/dashboard/eventos/adicionar",
        },
        {
          href: "/dashboard/eventos/bilhetes",
          icon: <CreditCard className="h-4 w-4" />,
          label: "Bilhetes",
          isActive: pathname === "/dashboard/eventos/bilhetes",
        },
      ],
    },
    {
      href: "/dashboard/loja",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Loja",
      isActive: isRouteActive("/dashboard/loja"),
    },
    {
      href: "/dashboard/media",
      icon: <Image className="h-5 w-5" />,
      label: "Media",
      isActive: isRouteActive("/dashboard/media"),
    },
    {
      href: "/dashboard/configuracoes",
      icon: <Settings className="h-5 w-5" />,
      label: "Configurações",
      isActive: isRouteActive("/dashboard/configuracoes"),
    },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-purple-300 text-sm">
            carregando
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-900/70 backdrop-blur-md border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-md h-8 w-8 flex items-center justify-center font-bold text-white text-lg">
              BC
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              BadCompany
            </h1>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-white">
                {session?.user?.name || "Administrador"}
              </p>
              <p className="text-xs truncate text-gray-400">
                {session?.user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {navItems.map((item, idx) => (
            <NavItem
              key={idx}
              {...item}
              mobileMode={false}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""}`}
      >
        <header className="sticky top-0 z-30 bg-gray-900/80 border-b border-gray-800 backdrop-blur-md">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="p-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-1 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:flex items-center gap-1 text-sm">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white"
                >
                  Dashboard
                </Link>
                {pathname !== "/dashboard" && (
                  <>
                    <span className="text-gray-600">/</span>
                    <span className="text-white font-medium">
                      {pathname.split("/")[2]?.charAt(0).toUpperCase() +
                        pathname.split("/")[2]?.slice(1) || ""}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              <div className="relative">
                <button className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Bell className="h-5 w-5" />
                  {unseenNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unseenNotifications}
                    </span>
                  )}
                </button>
              </div>

              <Link
                href="/"
                className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <span>Ver site</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-gray-800"
              >
                <div className="p-3">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Pesquisar..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={toggleMobileMenu}
              ></div>

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative w-72 max-w-[80vw] h-full bg-gray-900 shadow-xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-md h-8 w-8 flex items-center justify-center font-bold text-white">
                      BC
                    </div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      BadCompany
                    </h1>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-white">
                        {session?.user?.name || "Administrador"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session?.user?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="p-4 space-y-1">
                  {navItems.map((item, idx) => (
                    <NavItem
                      key={idx}
                      {...item}
                      mobileMode={true}
                      onClick={toggleMobileMenu}
                    />
                  ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                  <Link
                    href="/"
                    className="flex items-center gap-2 w-full px-3 py-2 mb-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>Ver site</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="p-4 sm:p-6 min-h-[calc(100vh-4rem)]">{children}</main>

        <footer className="bg-gray-900/50 border-t border-gray-800 py-4 px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} BadCompany. Todos os direitos
              reservados.
            </p>
            <p className="text-xs text-gray-500">
              Desenvolvido por{" "}
              <a
                href="https://alexandrahockett.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                AHockett
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ChevronRight({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
