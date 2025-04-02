"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaRegCheckCircle,
} from "react-icons/fa";
import Button from "@/components/layout/Button";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";

// Define proper types for form state
interface FormState {
  nome: string;
  email: string;
  mensagem: string;
  [key: string]: string; // Index signature to allow string indexing
}

export default function ContactosPage() {
  const [formState, setFormState] = useState<FormState>({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitSuccess(true);
        setFormState({ nome: "", email: "", mensagem: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error("Erro ao enviar mensagem:", data.error);
        alert(
          "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      alert(
        "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = "CONTACTOS";
  const contactInfo = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: "geral@badcompany.pt",
      link: "mailto:geral@badcompany.pt",
    },
    {
      icon: <FaPhone />,
      label: "Telefone",
      value: "+351 926 036 987",
      link: "tel:+351926036987",
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Morada",
      value: "Praceta Major Aviador Humberto da Cruz, n°9\n2745-026 Queluz",
      link: "https://maps.google.com/?q=Praceta+Major+Aviador+Humberto+da+Cruz+9,+2745-026+Queluz,+Portugal",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: <SiInstagram className="w-6 h-6 sm:w-7 sm:h-7" />,
      url: "https://www.instagram.com/badcompany_oficial",
      color: "bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-500",
      shadow: "rgba(225, 48, 108, 0.3)",
    },
    {
      name: "Facebook",
      icon: <SiFacebook className="w-6 h-6 sm:w-7 sm:h-7" />,
      url: "https://www.facebook.com/anyfa.badcompany/",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      shadow: "rgba(24, 119, 242, 0.3)",
    },
    {
      name: "YouTube",
      icon: <SiYoutube className="w-6 h-6 sm:w-7 sm:h-7" />,
      url: "https://www.youtube.com/@KanalBADCOMPANY",
      color: "bg-gradient-to-r from-red-500 to-red-600",
      shadow: "rgba(255, 0, 0, 0.3)",
    },
  ];

  return (
    <div className="py-12 sm:py-16 relative z-10 min-h-screen">
      {/* Título da página */}
      <div className="mb-12 sm:mb-16 relative text-center">
        <motion.div
          className="relative inline-block"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={
            animateIn ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
          }
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 tracking-wide drop-shadow-[0_4px_12px_rgba(168,85,247,0.8)]"
            initial={{ filter: "blur(10px)" }}
            animate={
              animateIn ? { filter: "blur(0px)" } : { filter: "blur(10px)" }
            }
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.div
            className="h-1 w-48 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 rounded-full mx-auto mt-4 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            initial={{ scaleX: 0 }}
            animate={animateIn ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
          />
          <motion.p
            className="mt-4 text-lg text-white font-medium drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Conecte-se com a Bad Company!
          </motion.p>
        </motion.div>
      </div>

      {/* Layout Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Grid para Formulário e Informações (somente em md e acima) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Seção do Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="backdrop-blur-xl bg-black/40 border border-purple-500/50 rounded-2xl p-5 sm:p-6 md:p-5 lg:p-6 shadow-[0_0_25px_rgba(168,85,247,0.3)] self-start"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 35px rgba(168, 85, 247, 0.5)",
            }}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <motion.div
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.7)]"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <FaPaperPlane className="text-white w-4 h-4" />
              </motion.div>
              <h2 className="text-lg sm:text-xl font-bold text-white ml-2 sm:ml-3 drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]">
                Fale Connosco
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {["nome", "email", "mensagem"].map((field, index) => (
                <motion.div
                  key={field}
                  className="group relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    animateIn ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                >
                  <label
                    htmlFor={field}
                    className="block text-xs sm:text-sm font-medium text-gray-200 mb-1 sm:mb-2 drop-shadow-sm group-focus-within:text-purple-300 transition-all"
                  >
                    {field}
                  </label>
                  {field === "mensagem" ? (
                    <textarea
                      id={field}
                      name={field}
                      value={formState[field]}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black/60 border border-purple-500/70 rounded-lg focus:ring-2 focus:ring-purple-500/60 focus:border-purple-600 text-white placeholder-gray-500 text-sm sm:text-base transition-all duration-300 shadow-[inset_0_0_8px_rgba(168,85,247,0.2)]"
                      placeholder={`Sua ${field}`}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formState[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black/60 border border-purple-500/70 rounded-lg focus:ring-2 focus:ring-purple-500/60 focus:border-purple-600 text-white placeholder-gray-500 text-sm sm:text-base transition-all duration-300 shadow-[inset_0_0_8px_rgba(168,85,247,0.2)]"
                      placeholder={`Seu ${field}`}
                    />
                  )}
                </motion.div>
              ))}

              <motion.div
                className="pt-2 sm:pt-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center py-2 sm:py-3 px-8 sm:px-10 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2 sm:mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-sm sm:text-base font-medium">
                      Enviando...
                    </span>
                  </div>
                ) : (
                  <div className="w-auto">
                    <Button
                      title="Enviar Mensagem"
                      type="submit"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 sm:p-4 bg-gradient-to-r from-green-500/30 to-green-700/30 backdrop-blur-md border border-green-500/50 rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  >
                    <div className="flex items-center">
                      <FaRegCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2" />
                      <p className="text-green-100 text-xs sm:text-sm font-medium drop-shadow-sm">
                        Mensagem enviada! Responderemos em breve!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Seção de Informações (Contato + Redes Sociais) */}
          <div className="space-y-6">
            {/* Informações de Contato */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 1 }}
              className="backdrop-blur-xl bg-black/40 border border-purple-500/50 rounded-2xl p-5 sm:p-6 md:p-5 lg:p-6 shadow-[0_0_25px_rgba(168,85,247,0.3)]"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 35px rgba(168, 85, 247, 0.5)",
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]">
                <span className="inline-block w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-fuchsia-600 mr-2 sm:mr-3 rounded-full shadow-md" />
                Informações de Contacto
              </h3>
              <ul className="space-y-4 sm:space-y-5">
                {contactInfo.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    animate={
                      animateIn ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                    }
                    transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                    className="group"
                  >
                    <a
                      href={item.link}
                      target={item.label === "Morada" ? "_blank" : undefined}
                      rel={
                        item.label === "Morada"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center group"
                    >
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600/40 to-fuchsia-600/40 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:from-purple-600/60 group-hover:to-fuchsia-600/60 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="text-purple-300 group-hover:text-white transition-colors duration-300 text-lg sm:text-xl">
                          {item.icon}
                        </div>
                      </motion.div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-300 mb-1 group-hover:text-purple-300 transition-colors duration-300 drop-shadow-sm">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base text-white group-hover:text-purple-200 font-medium transition-colors duration-300 whitespace-pre-line drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Redes Sociais */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="backdrop-blur-xl bg-black/40 border border-purple-500/50 rounded-2xl p-5 sm:p-6 md:p-5 lg:p-6 shadow-[0_0_25px_rgba(168,85,247,0.3)]"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 35px rgba(168, 85, 247, 0.5)",
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]">
                Siga-nos nas Redes Sociais
              </h3>
              <div className="flex justify-center space-x-6 sm:space-x-8 md:space-x-10">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      animateIn
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: 1.6 + index * 0.2,
                      type: "spring",
                      stiffness: 150,
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: 5,
                      boxShadow: `0 0 25px ${social.shadow}`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${social.color} rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300`}
                  >
                    <div className="text-white drop-shadow-md">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mapa - Ocupa toda a largura em md e acima */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="backdrop-blur-xl bg-black/40 border border-purple-500/50 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.3)] mt-6 md:mt-0"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 35px rgba(168, 85, 247, 0.5)",
          }}
        >
          <div className="p-5 sm:p-6 md:p-8 pb-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 flex items-center drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)]">
              <FaMapMarkerAlt className="text-purple-400 mr-2 sm:mr-3 text-xl sm:text-2xl" />
              Localização
            </h3>
          </div>
          <div className="h-80 md:h-[500px] lg:h-[600px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.492990379808!2d-9.262929684686598!3d38.75797347959149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf4dc4cc10ed%3A0x2c4eb125bae35c2f!2sPraceta%20Major%20Aviador%20Humberto%20da%20Cruz%209%2C%202745-026%20Queluz!5e0!3m2!1spt-PT!2spt!4v1645724163125!5m2!1spt-PT!2spt"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "brightness(90%) contrast(110%)" }}
              allowFullScreen={false}
              loading="lazy"
              className="absolute inset-0 rounded-b-2xl"
            />
            <motion.a
              href="https://maps.google.com/?q=Praceta+Major+Aviador+Humberto+da+Cruz+9,+2745-026+Queluz,+Portugal"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.7)",
              }}
              className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex items-center shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            >
              <FaMapMarkerAlt className="w-4 h-4 mr-1 sm:mr-2" />
              Obter Direções
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
