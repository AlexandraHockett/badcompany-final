"use client";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { ReactElement, useEffect, useState } from "react";
import Button from "./Button";
import Link from "next/link";
import Newsletter from "../home/Newsletter";

interface SocialLink {
  href: string;
  icon: ReactElement;
  hoverColor: string;
}

const links: SocialLink[] = [
  {
    href: "https://www.instagram.com/badcompany_oficial",
    icon: <FaInstagram size={24} />,
    hoverColor: "hover:text-pink-500",
  },
  {
    href: "https://www.facebook.com/anyfa.badcompany/",
    icon: <FaFacebook size={24} />,
    hoverColor: "hover:text-blue-600",
  },
  {
    href: "https://www.youtube.com/@KanalBADCOMPANY",
    icon: <FaYoutube size={24} />,
    hoverColor: "hover:text-red-600",
  },
];

const currentYear = new Date().getFullYear();

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const clientOnlyStyles = isClient
    ? {
        transition: "opacity 0.5s, transform 0.5s",
        opacity: 1,
        transform: "translateY(0)",
      }
    : {};

  const legalLinks = [
    {
      href: "/politica-de-privacidade",
      label: "Política de Privacidade",
    },
    {
      href: "/termos-e-condicoes",
      label: "Termos e Condições",
    },
    {
      href: "/politica-de-cookies",
      label: "Política de Cookies",
    },
  ];

  return (
    <footer
      className={`bg-gradient-to-t from-black via-purple-950 to-gray-900 py-8 text-white w-full z-10 min-h-[200px] ${className}`}
      style={
        isClient
          ? {
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }
          : {}
      }
    >
      <div className="container mx-auto px-6">
        {/* Top Section: Logo/Branding + Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500"
              style={
                isClient
                  ? {
                      opacity: 1,
                      transform: "translateY(0)",
                      transition:
                        "opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s",
                    }
                  : {}
              }
            >
              BadCompany
            </span>
            <span className="text-sm text-gray-300">
              Experiências que Marcam
            </span>
          </div>
          <div className="flex gap-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white transition-all duration-300 ${link.hoverColor}`}
                style={
                  isClient
                    ? {
                        transform: "scale(1)",
                        transition: "transform 0.3s, rotate 0.3s",
                      }
                    : {}
                }
                onMouseEnter={
                  isClient
                    ? (e) => {
                        e.currentTarget.style.transform =
                          "scale(1.2) rotate(5deg)";
                      }
                    : undefined
                }
                onMouseLeave={
                  isClient
                    ? (e) => {
                        e.currentTarget.style.transform =
                          "scale(1) rotate(0deg)";
                      }
                    : undefined
                }
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Middle Section: Contact + CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <p className="text-sm text-gray-300">
            Contato:{" "}
            <a
              href="mailto:geral@badcompany.pt"
              className="text-purple-400 hover:underline"
            >
              geral@badcompany.pt
            </a>
          </p>
          <Button
            title="Junte-se à Festa"
            href="/eventos/proximos"
            leftIcon={<span>🎉</span>}
            containerClass="bg-gray-800 hover:bg-purple-600 z-10"
          />
        </div>
        <div className="border-t border-gray-800 pt-6 my-8">
          <Newsletter
            variant="minimal"
            title="Fique por dentro"
            subtitle="Receba novidades e conteúdo exclusivo"
            position="left"
            className="max-w-lg"
          />
        </div>

        {/* Bottom Section: Legal + Credits + Admin Link */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-400">
          <p>© {currentYear} BadCompany. Todos os direitos reservados.</p>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Legal Links */}
            <div className="flex gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="hover:text-purple-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {/* Admin Login Link - subtle in footer */}
              <div className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                <Link href="/newsletter-login">Área Administrativa</Link>
              </div>
            </div>
          </div>

          <div
            className="w-full md:w-auto flex flex-col items-center md:items-end pt-4 md:pt-0 font-audiowide"
            style={
              isClient
                ? {
                    opacity: 1,
                    transform: "translateY(0)",
                    transition:
                      "opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s",
                  }
                : {}
            }
          >
            <span className="mb-1 text-sm">Desenvolvido com ♥ por</span>
            <a
              href="https://www.alexandrahockett.com/"
              className="relative group inline-block overflow-hidden"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                className="relative z-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-lg md:text-xl tracking-wide"
                style={
                  isClient
                    ? {
                        transition: "transform 0.3s",
                      }
                    : {}
                }
                onMouseEnter={
                  isClient
                    ? (e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    : undefined
                }
                onMouseLeave={
                  isClient
                    ? (e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }
                    : undefined
                }
              >
                AHockett
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              {isClient && (
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              )}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
