"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

type FormData = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guestCount: string;
  details: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

interface BudgetFormProps {
  selectedEventType?: string;
}

export default function BudgetForm({
  selectedEventType = "",
}: BudgetFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    eventType: selectedEventType, // Inicializa com o tipo selecionado
    date: "",
    guestCount: "",
    details: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Atualiza o eventType quando selectedEventType muda
  useEffect(() => {
    if (selectedEventType) {
      setFormData((prev) => ({
        ...prev,
        eventType: selectedEventType,
      }));
    }
  }, [selectedEventType]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.eventType) {
      newErrors.eventType = "Tipo de evento é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/budget-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro ao enviar");

      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          date: "",
          guestCount: "",
          details: "",
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Falha ao enviar orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função simplificada de handleChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 p-6 rounded-lg max-w-md mx-auto"
        >
          <h3 className="text-xl font-bold mb-2">Pedido Enviado!</h3>
          <p>
            Entraremos em contato em breve para discutir seu evento
            personalizado.
          </p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4 p-6 bg-gray-900/50 rounded-lg shadow-lg"
        >
          <div>
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.name ? "border-red-500" : "border-gray-700"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email para contato"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.email ? "border-red-500" : "border-gray-700"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Telefone (opcional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleSelectChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.eventType ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Selecione o tipo de evento</option>
              <option value="bclandia">BCLândia</option>
              <option value="white-emotion">White Emotion</option>
              <option value="bc-best">BC Best</option>
              <option value="casa-assombrada">A Casa Assombrada</option>
              <option value="monsanto-fest">Monsanto Fest</option>
              <option value="aniversario">
                Festa de Aniversário Personalizada
              </option>
              <option value="casamento">Casamento Temático</option>
              <option value="corporativo">Evento Corporativo</option>
              <option value="formatura">Formatura Exclusiva</option>
              <option value="outro">Outro</option>
            </select>
            {errors.eventType && (
              <p className="text-red-500 text-sm mt-1 text-left">
                {errors.eventType}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                name="date"
                placeholder="Data do evento"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              />
            </div>

            <div>
              <input
                type="number"
                name="guestCount"
                placeholder="Nº de convidados"
                value={formData.guestCount}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              />
            </div>
          </div>

          <div>
            <textarea
              name="details"
              placeholder="Detalhes do evento (tema, estilo, preferências, etc.)"
              value={formData.details}
              onChange={handleTextareaChange}
              rows={4}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              title={isSubmitting ? "Enviando..." : "Pedir Orçamento"}
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : undefined
              }
              containerClass="w-full max-w-xs"
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Ao enviar, você concorda em ser contactado pela BadCompany para
            discutir seu evento.
          </p>
        </motion.form>
      )}
    </>
  );
}
