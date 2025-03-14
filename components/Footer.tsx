"use client";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { ReactElement, useEffect, useMemo } from "react";
import Button from "./Button";
import Link from "next/link";

interface SocialLink {
  href: string;
  icon: ReactElement;
  hoverColor: string;
}

// Moved outside component to prevent recreation on each render
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

// Calculate current year once, outside the component
const currentYear = new Date().getFullYear();

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    controls.start({ opacity: 1, y: 0 });
  }, []); // Fixed to run once

  // Memoize the Legal Links to prevent unnecessary re-renders
  const legalLinks = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <footer
      className={`relative bg-gradient-to-t from-black to-gray-900 py-8 text-white w-full z-10 ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Top Section: Logo/Branding + Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold text-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ duration: 0.5 }}
              style={{ willChange: "transform, opacity" }}
            >
              BadCompany
            </motion.span>
            <span className="text-sm">Experiências que Marcam</span>
          </div>
          <div className="flex gap-6">
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white transition-all duration-300 ${link.hoverColor}`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                style={{ willChange: "transform" }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Middle Section: Contact + CTA */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <p className="text-sm">
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

        {/* Bottom Section: Legal + Credits + Socials */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
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
            </div>
          </div>

          <p>
            Desenvolvido por{" "}
            <a
              href="https://www.alexandrahockett.com/"
              className="text-white hover:text-purple-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              AHockett
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
