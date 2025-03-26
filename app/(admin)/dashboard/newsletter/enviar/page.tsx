"use client";

import { useState } from "react";
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
import { Loader2, Send, Calendar, Users, AlertCircle } from "lucide-react";

// Editor de Rich Text com carregamento dinâmico para evitar erros de SSR
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-800 rounded-md animate-pulse" />,
});

export default function NewsletterSender() {
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [audienceType, setAudienceType] = useState<string>("all");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [sentMessage, setSentMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Opções de modelos
  const templates = [
    { id: "blank", name: "Em branco" },
    { id: "event", name: "Anúncio de evento" },
    { id: "promo", name: "Promoção" },
    { id: "update", name: "Atualização" },
  ];

  // Validação simples
  const validateForm = () => {
    if (!subject.trim()) {
      setError("O assunto é obrigatório");
      return false;
    }

    if (!content.trim()) {
      setError("O conteúdo é obrigatório");
      return false;
    }

    return true;
  };

  // Função para carregar modelo
  const loadTemplate = (templateId: string) => {
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

  // Tratar submissão
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSent(false);

    if (!validateForm()) {
      return;
    }

    setIsSending(true);

    try {
      // Construir objeto de dados
      const newsletterData = {
        subject,
        content,
        preview,
        audienceType,
        scheduledDate: scheduledDate || undefined,
      };

      // Enviar para a API
      const response = await fetch("/api/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletterData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar newsletter");
      }

      const data = await response.json();
      setIsSent(true);
      setSentMessage(
        scheduledDate
          ? `Newsletter agendada com sucesso para ${new Date(scheduledDate).toLocaleString()}!`
          : `Newsletter enviada com sucesso para ${data.recipients || 0} subscritores!`
      );

      // Limpar os campos após envio bem-sucedido
      if (!scheduledDate) {
        setSubject("");
        setContent("");
        setPreview("");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao enviar a newsletter"
      );
      console.error("Erro ao enviar newsletter:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Pré-visualização de audiência
  const audiencePreview = {
    all: {
      count: 3450,
      description: "Todos os subscritores ativos",
    },
    engaged: {
      count: 2150,
      description:
        "Subscritores que abriram pelo menos um email nos últimos 30 dias.",
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Enviar Newsletter</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
            <TabsTrigger value="schedule">Agendamento</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Conteúdo da Newsletter</CardTitle>
                <CardDescription className="text-gray-400">
                  Crie o conteúdo da sua newsletter ou escolha um modelo para
                  começar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template">Modelo</Label>
                  <Select onValueChange={loadTemplate} defaultValue="blank">
                    <SelectTrigger className="bg-gray-900 border-gray-700">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Assunto do email"
                    className="bg-gray-900 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preview">Texto de pré-visualização</Label>
                  <Input
                    id="preview"
                    value={preview}
                    onChange={(e) => setPreview(e.target.value)}
                    placeholder="Texto que aparece na pré-visualização do email (opcional)"
                    className="bg-gray-900 border-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Este texto será mostrado como pré-visualização em clientes
                    de email
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    className="min-h-[300px] bg-gray-900 border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Audiência</CardTitle>
                <CardDescription className="text-gray-400">
                  Selecione qual grupo de subscritores receberá esta newsletter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(audiencePreview).map(([key, data]) => (
                    <div
                      key={key}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        audienceType === key
                          ? "border-purple-500 bg-purple-900/20"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setAudienceType(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">
                          {key === "all"
                            ? "Todos"
                            : key === "engaged"
                              ? "Ativos"
                              : key === "inactive"
                                ? "Inativos"
                                : "Novos"}
                        </h3>
                        <div className="flex items-center space-x-1 text-purple-400">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Pré-visualização</CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize como a sua newsletter será exibida para os
                  destinatários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-900 p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">De:</span>
                      <span>BadCompany &lt;newsletter@badcompany.pt&gt;</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mt-2">
                      <span className="text-gray-400">Assunto:</span>
                      <span className="font-medium">
                        {subject || "Sem assunto"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mt-2">
                      <span className="text-gray-400">Pré-visualização:</span>
                      <span className="text-gray-500 italic">
                        {preview || "Sem texto de pré-visualização"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 min-h-[400px]">
                    {content ? (
                      <div
                        className="text-black"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Sem conteúdo para exibir. Adicione conteúdo no separador
                        "Conteúdo".
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    className="border-gray-700"
                    onClick={() => {
                      alert(
                        "Função de envio de teste será implementada em breve."
                      );
                    }}
                  >
                    Enviar teste para o meu email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Agendamento</CardTitle>
                <CardDescription className="text-gray-400">
                  Defina quando a newsletter será enviada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Data e Hora de Envio</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <Input
                      type="datetime-local"
                      id="schedule"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="bg-gray-900 border-gray-700"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Deixe em branco para enviar imediatamente
                  </p>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-300 font-medium mb-1">
                      Agendamento de Newsletters
                    </p>
                    <p className="text-xs text-blue-200">
                      As newsletters agendadas serão enviadas automaticamente na
                      data e hora especificadas. Você pode cancelar ou editar
                      uma newsletter agendada a qualquer momento através da
                      lista de campanhas programadas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {isSent && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 p-4 rounded-lg">
            {sentMessage}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" className="border-gray-700">
            Guardar como rascunho
          </Button>

          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSending}
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
        </div>
      </form>
    </div>
  );
}
