// app/(admin)/dashboard/newsletter/enviar/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Loader2,
  Send,
  Calendar,
  Users,
  AlertCircle,
  Check,
  Save,
  ArrowRight,
  MailCheck,
} from "lucide-react";

// Editor de Rich Text com carregamento dinâmico
const RichTextEditor = dynamic(
  () => import("@/components/administracao/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-gray-900/50 border border-gray-800 rounded-lg animate-pulse" />
    ),
  }
);

// Type Definitions
interface Template {
  id: string;
  name: string;
}

interface AudienceOption {
  count: number;
  description: string;
}

export default function NewsletterSender() {
  // Estado da interface
  const [activeTab, setActiveTab] = useState("content");

  // Estado do formulário
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [audienceType, setAudienceType] = useState<string>("all");
  const [scheduledDate, setScheduledDate] = useState<string>("");

  // Estado de processamento
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // Estado de feedback
  const [isSent, setIsSent] = useState<boolean>(false);
  const [sentMessage, setSentMessage] = useState<string>("");
  const [testSent, setTestSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);

  // Modal de confirmação
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Dados da sessão
  const { data: session } = useSession();

  const templates: Template[] = [
    { id: "blank", name: "Em branco" },
    { id: "event", name: "Anúncio de evento" },
    { id: "promo", name: "Promoção" },
    { id: "update", name: "Atualização" },
  ];

  const audiencePreview: Record<string, AudienceOption> = {
    all: { count: 3450, description: "Todos os subscritores ativos" },
    engaged: {
      count: 2150,
      description:
        "Subscritores que abriram pelo menos um email nos últimos 30 dias",
    },
    inactive: {
      count: 1300,
      description: "Subscritores que não abriram emails nos últimos 30 dias",
    },
    new: {
      count: 320,
      description: "Subscritores que se inscreveram nos últimos 7 dias",
    },
  };

  // Reset de feedback após certo tempo
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (testSent || isDraftSaved || error) {
      timeoutId = setTimeout(() => {
        if (testSent) setTestSent(false);
        if (isDraftSaved) setIsDraftSaved(false);
        if (error) setError(null);
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [testSent, isDraftSaved, error]);

  const validateForm = (): boolean => {
    if (!subject.trim()) {
      setError("O assunto é obrigatório");
      return false;
    }
    if (!content.trim()) {
      setError("O conteúdo é obrigatório");
      return false;
    }

    // Remover erros se tudo estiver correto
    setError(null);
    return true;
  };

  const loadTemplate = (templateId: string) => {
    // Reset mensagens de feedback
    setError(null);
    setIsSent(false);
    setTestSent(false);
    setIsDraftSaved(false);

    // Usar o template "Event"
    switch (templateId) {
      case "event":
        setSubject("Não perca o nosso próximo evento!");
        setContent(`<h1 style="color: #8b5cf6; font-size: 24px; margin-bottom: 15px;">Evento imperdível a chegar!</h1>
          <p style="margin-bottom: 15px;">Olá {{name}},</p>
          <p style="margin-bottom: 20px;">Estamos entusiasmados por anunciar o nosso próximo evento da BadCompany. Não perca esta oportunidade incrível de fazer parte de um momento que ficará na história!</p>
          <div style="background-color: #2d3748; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #a78bfa; font-size: 18px; margin-bottom: 10px;">Detalhes do Evento</h2>
            <p style="margin-bottom: 5px;"><strong>Data:</strong> 15 de Julho de 2025</p>
            <p style="margin-bottom: 5px;"><strong>Local:</strong> BadCompany Club, Lisboa</p>
            <p style="margin-bottom: 5px;"><strong>Portas:</strong> 22:00</p>
            <p style="margin-bottom: 15px;"><strong>Bilhetes:</strong> A partir de €15</p>
            <p style="margin-bottom: 0;"><strong>Lineup:</strong> DJ Marcus, DJ Sophie, Live Act BadCompany</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://badcompany.pt/eventos" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">COMPRAR BILHETES</a>
          </div>
          <p style="margin-bottom: 15px;">Os bilhetes estão a vender rapidamente, por isso garante já o teu lugar. Como subscritor da nossa newsletter, tens acesso antecipado antes que os bilhetes sejam disponibilizados ao público geral.</p>`);
        setPreview(
          "Estamos entusiasmados por anunciar o nosso próximo evento..."
        );
        break;
      case "promo":
        setSubject("Promoção exclusiva para subscritores!");
        setContent(`<h1 style="color: #8b5cf6; font-size: 24px; margin-bottom: 15px;">Oferta exclusiva para si!</h1>
          <p style="margin-bottom: 15px;">Olá {{name}},</p>
          <p style="margin-bottom: 20px;">Como um dos nossos subscritores mais valiosos, estamos a oferecer uma promoção especial só para si. Aproveite já!</p>
          <div style="background-color: #2d3748; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <h2 style="color: #a78bfa; font-size: 22px; margin-bottom: 10px;">25% DE DESCONTO</h2>
            <p style="font-size: 18px; margin-bottom: 15px;">Em todos os produtos da loja BadCompany</p>
            <div style="background-color: #4c1d95; padding: 10px; border-radius: 4px; display: inline-block;">
              <p style="margin: 0; font-weight: bold; letter-spacing: 2px;">CÓDIGO: BADNEWS25</p>
            </div>
            <p style="font-size: 14px; margin-top: 15px;">Válido até 30 de Abril de 2025</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://badcompany.pt/loja" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">IR PARA A LOJA</a>
          </div>
          <p style="margin-bottom: 15px;">Esta oferta é exclusiva para subscritores da nossa newsletter e não será divulgada publicamente. Aproveite enquanto ainda está disponível!</p>`);
        setPreview(
          "Como um dos nossos subscritores mais valiosos, estamos a oferecer..."
        );
        break;
      case "update":
        setSubject("Novidades da BadCompany");
        setContent(`<h1 style="color: #8b5cf6; font-size: 24px; margin-bottom: 15px;">Atualizações e novidades!</h1>
          <p style="margin-bottom: 15px;">Olá {{name}},</p>
          <p style="margin-bottom: 20px;">Gostaríamos de partilhar algumas atualizações recentes e novidades da BadCompany.</p>
          <h2 style="color: #a78bfa; font-size: 18px; margin-bottom: 10px; margin-top: 25px;">Novos Eventos Anunciados</h2>
          <p style="margin-bottom: 15px;">Acabámos de adicionar novos eventos ao nosso calendário de 2025. Fique atento para as datas e locais de algumas das festas mais esperadas do ano.</p>
          <h2 style="color: #a78bfa; font-size: 18px; margin-bottom: 10px; margin-top: 25px;">Nova Coleção na Loja</h2>
          <p style="margin-bottom: 15px;">Lançámos uma nova coleção de merchandise exclusivo na nossa loja online. Não perca a oportunidade de obter as peças mais exclusivas antes que esgotem.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://badcompany.pt/novidades" style="background-color: #8b5cf6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">VER TODAS AS NOVIDADES</a>
          </div>
          <p style="margin-bottom: 15px;">Fique atento à sua caixa de entrada. Mais novidades em breve!</p>`);
        setPreview("Gostaríamos de partilhar algumas atualizações recentes...");
        break;
      default:
        setSubject("");
        setContent("");
        setPreview("");
    }
  };

  const saveAsDraft = () => {
    // Validar se há algo para salvar
    if (subject.trim() === "" && content.trim() === "") {
      setError("Não há conteúdo para guardar como rascunho");
      return;
    }

    console.log("Guardando rascunho da newsletter");

    // Simulação de salvamento de rascunho para demonstração
    setTimeout(() => {
      console.log("Rascunho guardado com sucesso");
      setIsDraftSaved(true);
      setError(null);
      setIsSent(false);
      setTestSent(false);
    }, 500);

    /* CÓDIGO REAL PARA PRODUÇÃO:
    fetch("/api/newsletter-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        content,
        preview,
        audienceType,
        scheduledDate,
      }),
    })
      .then(response => {
        if (!response.ok) {
          const error = response.statusText || "Erro ao guardar rascunho";
          throw new Error(error);
        }
        return response.json();
      })
      .then(() => {
        console.log("Rascunho guardado com sucesso");
        setIsDraftSaved(true);
        setError(null);
      })
      .catch(err => {
        console.error("Erro ao guardar rascunho:", err);
        setError(err.message || "Ocorreu um erro ao guardar o rascunho");
      });
    */
  };

  // Função para enviar email de teste - separada do formulário principal
  const sendTestEmail = (e: React.MouseEvent) => {
    // Impedir que o evento se propague e acione o formulário
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      setError("Preencha o assunto e o conteúdo antes de enviar um teste");
      return;
    }

    console.log("Enviando email de teste para:", session?.user?.email);

    setIsSendingTest(true);
    setError(null);
    setTestSent(false);
    setIsSent(false);
    setIsDraftSaved(false);

    // Substituir placeholder de nome por um nome de teste
    const testContent = content.replace(/{{name}}/g, "Nome de Teste");

    // SIMULAÇÃO: Apenas para fins de demonstração
    // Em ambiente de produção, descomentar o código fetch abaixo
    setTimeout(() => {
      console.log("Email de teste enviado com sucesso");
      setIsSendingTest(false);
      setTestSent(true);
    }, 1500);

    /* CÓDIGO REAL PARA PRODUÇÃO: 
    fetch("/api/newsletter-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        content: testContent, // Usar conteúdo com placeholders substituídos
        preview,
        recipientEmail: session?.user?.email,
      }),
    })
      .then(response => {
        if (!response.ok) {
          const error = response.statusText || "Erro ao enviar email de teste";
          throw new Error(error);
        }
        return response.json();
      })
      .then(() => {
        console.log("Email de teste enviado com sucesso");
        setTestSent(true);
      })
      .catch(err => {
        console.error("Erro ao enviar teste:", err);
        setError(err.message || "Ocorreu um erro ao enviar o email de teste");
      })
      .finally(() => {
        setIsSendingTest(false);
      });
    */
  };

  // Função para preparar envio (exibe confirmação)
  const prepareSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      setActiveTab("content");
      return;
    }

    console.log(
      "Preparando envio de newsletter para",
      audiencePreview[audienceType]?.count || 0,
      "destinatários"
    );

    // Mostrar modal de confirmação
    setShowConfirmModal(true);
  };

  // Função para enviar a newsletter (após confirmação)
  const handleSubmit = () => {
    console.log("Confirmação recebida, enviando newsletter");

    setIsSending(true);
    setError(null);
    setIsSent(false);
    setTestSent(false);
    setIsDraftSaved(false);
    setShowConfirmModal(false);

    // Na API real, a substituição de {{name}} pelo nome real de cada subscritor
    // deve ser feita no servidor no momento do envio para cada destinatário individual

    // SIMULAÇÃO: Apenas para fins de demonstração
    // Em ambiente de produção, descomentar o código fetch abaixo
    setTimeout(() => {
      console.log("Newsletter enviada com sucesso");
      setIsSending(false);
      setIsSent(true);

      // Usar o número correto de destinatários
      const recipientCount = audiencePreview[audienceType]?.count || 0;

      setSentMessage(
        scheduledDate
          ? `Newsletter agendada com sucesso para ${new Date(
              scheduledDate
            ).toLocaleString("pt-PT")}!`
          : `Newsletter enviada com sucesso para ${recipientCount} subscritores!`
      );

      if (!scheduledDate) {
        // Limpar o formulário apenas depois de um envio real (não agendado)
        setSubject("");
        setContent("");
        setPreview("");
        setAudienceType("all");
        setScheduledDate("");
      }
    }, 2000);

    /* CÓDIGO REAL PARA PRODUÇÃO:
    fetch("/api/newsletter-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        content,  // Enviar com os placeholders {{name}} para o servidor substituir
        preview,
        audienceType,
        scheduledDate: scheduledDate || undefined,
      }),
    })
      .then(response => {
        if (!response.ok) {
          const error = response.statusText || "Erro ao enviar newsletter";
          throw new Error(error);
        }
        return response.json();
      })
      .then(data => {
        console.log("Newsletter enviada com sucesso:", data);
        setIsSent(true);
        
        const recipientCount = data.totalRecipients || audiencePreview[audienceType]?.count || 0;
        
        setSentMessage(
          scheduledDate
            ? `Newsletter agendada com sucesso para ${new Date(scheduledDate).toLocaleString('pt-PT')}!`
            : `Newsletter enviada com sucesso para ${recipientCount} subscritores!`
        );

        if (!scheduledDate) {
          // Limpar o formulário após envio
          setSubject("");
          setContent("");
          setPreview("");
          setAudienceType("all");
          setScheduledDate("");
        }
      })
      .catch(err => {
        console.error("Erro ao enviar newsletter:", err);
        setError(err.message || "Ocorreu um erro ao enviar a newsletter");
      })
      .finally(() => {
        setIsSending(false);
      });
    */
  };

  const handleContentChange = (value: string) => {
    if (!isSending && !isSendingTest) {
      setContent(value);
    }
  };

  // Navegação entre abas
  const goToNextTab = () => {
    if (activeTab === "content") {
      if (!validateForm()) {
        return;
      }
      setActiveTab("audience");
    } else if (activeTab === "audience") setActiveTab("preview");
    else if (activeTab === "preview") setActiveTab("schedule");
  };

  const goToPreviousTab = () => {
    if (activeTab === "audience") setActiveTab("content");
    else if (activeTab === "preview") setActiveTab("audience");
    else if (activeTab === "schedule") setActiveTab("preview");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  // Fechar o modal de confirmação
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <motion.div
      className="space-y-6 max-w-screen-2xl mx-auto p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Enviar Newsletter
          </h1>
          <p className="text-gray-400 mt-1">
            Crie e envie campanhas de email para seus subscritores
          </p>
        </div>
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          onClick={saveAsDraft}
          disabled={isSending || isSendingTest}
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar como rascunho
        </Button>
      </motion.div>

      {/* Status Messages */}
      {error && (
        <motion.div
          variants={itemVariants}
          className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {isSent && (
        <motion.div
          variants={itemVariants}
          className="bg-green-900/20 border border-green-800 text-green-400 p-4 rounded-lg flex items-center gap-2"
        >
          <MailCheck className="h-5 w-5" />
          <span>{sentMessage}</span>
        </motion.div>
      )}

      {isDraftSaved && (
        <motion.div
          variants={itemVariants}
          className="bg-blue-900/20 border border-blue-800 text-blue-400 p-4 rounded-lg flex items-center gap-2"
        >
          <Save className="h-5 w-5" />
          <span>Rascunho guardado com sucesso!</span>
        </motion.div>
      )}

      {/* Tabs e Form */}
      <form className="space-y-6">
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} className="w-full">
            <TabsList className="bg-gray-900/50 border border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-lg">
              <div
                className={`flex items-center justify-center px-3 py-1.5 rounded-md ${
                  activeTab === "content"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 bg-transparent"
                }`}
              >
                Conteúdo
              </div>
              <div
                className={`flex items-center justify-center px-3 py-1.5 rounded-md ${
                  activeTab === "audience"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 bg-transparent"
                }`}
              >
                Audiência
              </div>
              <div
                className={`flex items-center justify-center px-3 py-1.5 rounded-md ${
                  activeTab === "preview"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 bg-transparent"
                }`}
              >
                Pré-visualização
              </div>
              <div
                className={`flex items-center justify-center px-3 py-1.5 rounded-md ${
                  activeTab === "schedule"
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 bg-transparent"
                }`}
              >
                Agendamento
              </div>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Conteúdo da Newsletter
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Crie o conteúdo da sua newsletter ou escolha um modelo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="template" className="text-gray-300">
                      Modelo
                    </Label>
                    <Select onValueChange={loadTemplate} defaultValue="blank">
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 transition-colors">
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800 text-white">
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300">
                      Assunto
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Assunto do email"
                      className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                      disabled={isSending || isSendingTest}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preview" className="text-gray-300">
                      Texto de pré-visualização
                    </Label>
                    <Input
                      id="preview"
                      value={preview}
                      onChange={(e) => setPreview(e.target.value)}
                      placeholder="Texto que aparece na pré-visualização (opcional)"
                      className="bg-gray-800 border-gray-700 text-white focus:border-purple-500"
                      disabled={isSending || isSendingTest}
                    />
                    <p className="text-xs text-gray-400">
                      Mostrado na pré-visualização em clientes de email
                    </p>
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="content" className="text-gray-300">
                      Conteúdo
                    </Label>
                    <RichTextEditor
                      value={content}
                      onChange={handleContentChange}
                      className="min-h-[300px] bg-gray-900 border-gray-800 text-white"
                    />
                    {(isSending || isSendingTest) && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      onClick={goToNextTab}
                      disabled={!subject.trim() || !content.trim()}
                    >
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Audiência</CardTitle>
                  <CardDescription className="text-gray-400">
                    Selecione o grupo de subscritores que receberá esta
                    newsletter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(audiencePreview).map(([key, data]) => (
                      <div
                        key={key}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-purple-400 ${
                          audienceType === key
                            ? "border-purple-500 bg-purple-900/20"
                            : "border-gray-700 hover:bg-gray-800/50"
                        }`}
                        onClick={() => setAudienceType(key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white capitalize">
                            {key === "all"
                              ? "Todos"
                              : key === "engaged"
                                ? "Ativos"
                                : key === "inactive"
                                  ? "Inativos"
                                  : "Novos"}
                          </h3>
                          <div className="flex items-center text-purple-400">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{data.count.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {data.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      onClick={goToNextTab}
                    >
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Pré-visualização</CardTitle>
                  <CardDescription className="text-gray-400">
                    Veja como a newsletter será exibida aos destinatários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-900 p-4 border-b border-gray-800">
                      <div className="text-sm text-gray-300">
                        <span className="text-gray-400">De: </span>
                        BadCompany &lt;newsletter@badcompany.pt&gt;
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        <span className="text-gray-400">Assunto: </span>
                        <span className="font-medium">
                          {subject || "Sem assunto"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 mt-2">
                        <span className="text-gray-400">
                          Pré-visualização:{" "}
                        </span>
                        <span className="text-gray-500 italic">
                          {preview || "Sem texto de pré-visualização"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white p-4 min-h-[400px] text-black overflow-auto">
                      {content ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content.replace(
                              /{{name}}/g,
                              "Nome de Teste"
                            ),
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          Sem conteúdo para exibir. Adicione no separador
                          "Conteúdo".
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full sm:w-auto"
                      onClick={sendTestEmail}
                      disabled={isSendingTest || isSending}
                    >
                      {isSendingTest ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando teste...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Enviar teste para o meu email
                        </>
                      )}
                    </Button>

                    {testSent && (
                      <div className="text-green-400 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        <span>
                          Email de teste enviado com sucesso para{" "}
                          {session?.user?.email || "o teu email"}!
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={goToPreviousTab}
                    >
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      onClick={goToNextTab}
                    >
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="mt-6">
              <Card className="bg-gray-900/50 border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Agendamento</CardTitle>
                  <CardDescription className="text-gray-400">
                    Defina quando a newsletter será enviada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="schedule" className="text-gray-300">
                      Data e Hora de Envio
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="datetime-local"
                        id="schedule"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white pl-10 hover:border-gray-600 focus:border-purple-500"
                        min={new Date().toISOString().slice(0, 16)}
                        disabled={isSending || isSendingTest}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      Deixe em branco para enviar imediatamente
                    </p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium mb-1">
                        Agendamento de Newsletters
                      </p>
                      <p className="text-xs text-blue-200">
                        As newsletters agendadas serão enviadas automaticamente
                        na data e hora especificadas. Você pode cancelar ou
                        editar uma newsletter agendada a qualquer momento.
                      </p>
                    </div>
                  </div>

                  {/* Área do botão final de envio/agendamento */}
                  <div className="pt-4 mt-6">
                    <Button
                      type="button"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-base py-6 transition-colors"
                      disabled={isSending || isSendingTest}
                      onClick={prepareSubmit}
                    >
                      {isSending ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          <span>A processar...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="mr-2 h-5 w-5" />
                          <span>
                            {scheduledDate
                              ? "Agendar envio da newsletter"
                              : "Enviar newsletter agora"}
                          </span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Botão fixo de envio só aparece na última aba de pré-visualização */}
        {activeTab === "preview" && (
          <motion.div variants={itemVariants} className="flex justify-end mt-4">
            <Button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              disabled={isSending || isSendingTest}
              onClick={prepareSubmit}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />A enviar...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {scheduledDate ? "Agendar envio" : "Enviar newsletter"}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </form>

      {/* Modal de confirmação que aparece antes do envio */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="bg-purple-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {scheduledDate ? "Agendar Newsletter?" : "Enviar Newsletter?"}
              </h3>
              <p className="text-gray-300 mb-6">
                {scheduledDate
                  ? `Esta newsletter será agendada para envio em ${new Date(scheduledDate).toLocaleString("pt-PT")} para ${audiencePreview[audienceType]?.count || 0} destinatários.`
                  : `Esta newsletter será enviada imediatamente para ${audiencePreview[audienceType]?.count || 0} destinatários.`}
              </p>
              <div className="flex gap-3">
                <Button
                  className="bg-gray-800 hover:bg-gray-700 text-white transition-colors w-1/2"
                  onClick={closeConfirmModal}
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white transition-colors w-1/2"
                  onClick={handleSubmit}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />A
                      processar...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de sucesso que aparece após envio bem-sucedido */}
      {isSent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="bg-green-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailCheck className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Operação concluída!
              </h3>
              <p className="text-gray-300 mb-6">{sentMessage}</p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors w-full"
                onClick={() => setIsSent(false)}
              >
                Fechar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
