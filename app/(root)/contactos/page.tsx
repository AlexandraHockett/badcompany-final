"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaPaperPlane,
  FaRegCheckCircle,
  FaLongArrowAltRight,
} from "react-icons/fa";
import Button from "@/components/Button"; // Adjust path as needed

export default function ContactosPage() {
  const [formState, setFormState] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormState({ nome: "", email: "", mensagem: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error("Erro ao enviar mensagem:", data.error);
        // Opcional: mostrar mensagem de erro ao usuário
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

  // Data for the page
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
      icon: <FaInstagram />,
      url: "https://www.instagram.com/badcompany_oficial",
      color: "from-purple-600 to-pink-500",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      url: "https://www.facebook.com/anyfa.badcompany/",
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "YouTube",
      icon: <FaYoutube />,
      url: "https://www.youtube.com/@KanalBADCOMPANY",
      color: "from-red-600 to-red-400",
    },
  ];

  // Background style
  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1))",
    backdropFilter: "blur(10px)",
  };

  return (
    <div className="py-6 sm:py-8 relative z-10">
      {/* Background glowing elements */}
      <div className="absolute top-0 right-0 opacity-20 blur-xl pointer-events-none">
        <div
          className="w-64 h-64 rounded-full bg-blue-600"
          style={{ filter: "blur(60px)" }}
        />
      </div>
      <div className="absolute bottom-0 left-0 opacity-20 blur-xl pointer-events-none">
        <div
          className="w-72 h-72 rounded-full bg-purple-600"
          style={{ filter: "blur(70px)" }}
        />
      </div>

      {/* Animated heading */}
      <div className="mb-8 sm:mb-12 relative overflow-hidden">
        <div className="flex justify-center">
          {title.split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={animateIn ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + index * 0.05,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider inline-block mx-0.5 sm:mx-1"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={animateIn ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 1,
            delay: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-48 mx-auto mt-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={animateIn ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-black/50 border border-white/10 rounded-xl p-5 sm:p-6 shadow-lg"
          style={backgroundStyle}
        >
          <div className="flex items-center mb-5">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <FaPaperPlane className="text-white w-3 h-3" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white ml-3">
              Fale Connosco
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label
                htmlFor="nome"
                className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
              >
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formState.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="O seu nome"
              />
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="O seu email"
              />
            </div>

            <div className="group">
              <label
                htmlFor="mensagem"
                className="block text-xs sm:text-sm font-medium text-gray-300 mb-1"
              >
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formState.mensagem}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm bg-black/30 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="A sua mensagem"
              />
            </div>

            <div className="pt-2">
              {isSubmitting ? (
                <div className="flex items-center justify-center py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 sm:mr-3"
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
                    A processar...
                  </span>
                </div>
              ) : (
                <Button
                  title="Enviar Mensagem"
                  type="submit"
                  disabled={isSubmitting}
                  containerClass="w-full py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 transform hover:translate-y-[-2px]"
                />
              )}
            </div>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 sm:p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <FaRegCheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                    <p className="text-green-200 text-sm">
                      Mensagem enviada com sucesso! Entraremos em contacto
                      brevemente.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Info Section */}
        <div className="space-y-6 sm:space-y-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={animateIn ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-black/50 border border-white/10 rounded-xl p-5 sm:p-6 shadow-lg"
            style={backgroundStyle}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-5 flex items-center">
              <span className="inline-block w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 mr-3"></span>
              Informações de Contacto
            </h3>

            <ul className="space-y-4 sm:space-y-5">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    animateIn ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
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
                    className="flex items-start group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:from-blue-600/50 group-hover:to-purple-600/50 transition-all duration-300">
                      <div className="text-blue-400 group-hover:text-white transition-colors duration-300">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className="text-white text-sm sm:text-base group-hover:text-blue-300 transition-colors duration-300 whitespace-pre-line">
                        {item.value}
                      </p>
                    </div>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-black/50 border border-white/10 rounded-xl p-5 sm:p-6 shadow-lg"
            style={backgroundStyle}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 text-center">
              Siga-nos nas Redes Sociais
            </h3>

            <div className="flex justify-center space-x-4 sm:space-x-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    animateIn
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 1.0 + index * 0.15,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.15, y: -5 }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${social.color} rounded-full flex items-center justify-center shadow-lg`}
                  style={{
                    boxShadow: `0 0 15px rgba(79, 70, 229, 0.3)`,
                  }}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 text-white">
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-black/50 border border-white/10 rounded-xl overflow-hidden shadow-lg"
            style={backgroundStyle}
          >
            <div className="p-5 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                Localização
              </h3>
            </div>

            <div className="h-52 sm:h-64 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.492990379808!2d-9.262929684686598!3d38.75797347959149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf4dc4cc10ed%3A0x2c4eb125bae35c2f!2sPraceta%20Major%20Aviador%20Humberto%20da%20Cruz%209%2C%202745-026%20Queluz!5e0!3m2!1spt-PT!2spt!4v1645724163125!5m2!1spt-PT!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="absolute inset-0"
              />
              <motion.a
                href="https://maps.google.com/?q=Praceta+Major+Aviador+Humberto+da+Cruz+9,+2745-026+Queluz,+Portugal"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center shadow-lg"
              >
                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                Obter Direções
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
