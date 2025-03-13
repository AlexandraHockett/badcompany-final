"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      const elements =
        containerRef.current.querySelectorAll(".parallax-element");
      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "0.1");
        const moveX = x * speed * 50;
        const moveY = y * speed * 50;
        (el as HTMLElement).style.transform =
          `translate(${moveX}px, ${moveY}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div id="contact" className="mb-10 w-full px-10">
      <div
        ref={containerRef}
        className="relative rounded-2xl bg-gradient-to-br from-black to-gray-900 py-24 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Geometric shapes */}
          <div
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-purple-800/10 blur-3xl parallax-element"
            data-speed="0.05"
          ></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl parallax-element"
            data-speed="0.08"
          ></div>

          {/* Animated glowing orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-purple-400 parallax-element"
            data-speed="0.2"
            animate={{
              boxShadow: [
                "0 0 20px 0px #a855f7",
                "0 0 30px 5px #a855f7",
                "0 0 20px 0px #a855f7",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-3/4 right-1/3 w-3 h-3 rounded-full bg-blue-400 parallax-element"
            data-speed="0.15"
            animate={{
              boxShadow: [
                "0 0 20px 0px #60a5fa",
                "0 0 30px 5px #60a5fa",
                "0 0 20px 0px #60a5fa",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-pink-400 parallax-element"
            data-speed="0.25"
            animate={{
              boxShadow: [
                "0 0 20px 0px #f472b6",
                "0 0 30px 5px #f472b6",
                "0 0 20px 0px #f472b6",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        {/* 3D Card Elements */}
        <div
          className="absolute -left-20 top-20 transform rotate-12 w-64 h-80 rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-white/10 parallax-element hidden lg:block"
          data-speed="0.12"
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/50 flex items-center justify-center backdrop-blur-md">
              <span className="text-2xl">🎧</span>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-10 bottom-20 transform -rotate-6 w-72 h-64 rounded-2xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-white/10 parallax-element hidden lg:block"
          data-speed="0.08"
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/50 flex items-center justify-center backdrop-blur-md">
              <span className="text-2xl">🎵</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="font-general text-xs sm:text-sm uppercase bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent px-3 py-1 sm:px-4 rounded-full border border-blue-500/30 inline-block mb-4 sm:mb-6">
              Junta-te a Nós
            </p>
          </motion.div>

          <motion.p
            className="font-zentry mt-4 sm:mt-6 w-full text-4xl sm:text-5xl md:text-7xl leading-[1.1] font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Tens um evento <br /> para organizar?
          </motion.p>

          <motion.div
            className="mt-6 sm:mt-12 max-w-md text-gray-300 text-base sm:text-lg px-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              Deixa-nos ajudar a transformar a tua ideia em algo épico. Criamos
              experiências memoráveis para qualquer tipo de evento.
            </p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button
              title="Fala Connosco"
              href="mailto:geral@badcompany.pt"
              containerClass="scale-90 sm:scale-100 bg-gradient-to-br from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30" // Smaller on mobile, normal on larger screens
            />
          </motion.div>

          <motion.div
            className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-4 w-full max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: "📷",
                name: "Instagram",
                color: "pink",
                url: "https://www.instagram.com/badcompany_oficial",
              },
              {
                icon: "📱",
                name: "Facebook",
                color: "blue",
                url: "https://www.facebook.com/badcompany",
              },
              {
                icon: "🎬",
                name: "YouTube",
                color: "red",
                url: "https://www.youtube.com/channel/badcompany",
              },
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                className="flex items-center justify-center px-3 py-2 rounded-lg backdrop-blur-sm border border-white/10 bg-black/40 hover:bg-gray-800/40 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mr-2">{social.icon}</span>
                <span className="font-medium">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CSS for the grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </div>
  );
};

export default Contact;
