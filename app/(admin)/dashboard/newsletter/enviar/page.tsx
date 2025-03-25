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
import { Loader2, Send } from "lucide-react";

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

  // Função para carregar modelo
  const loadTemplate = (templateId: string) => {
    switch (templateId) {
      case "event":
        setSubject("Não perca o nosso próximo evento!");
        setContent(`<h1>Evento imperdível a chegar!</h1>
          <p>Olá,</p>
          <p>Estamos entusiasmados por anunciar o nosso próximo evento da BadCompany...</p>`);
        setPreview(
          "Estamos entusiasmados por anunciar o nosso próximo evento..."
        );
        break;
      case "promo":
        setSubject("Promoção exclusiva para subscritores!");
        setContent(`<h1>Oferta exclusiva para si!</h1>
          <p>Olá,</p>
          <p>Como um dos nossos subscritores mais valiosos, estamos a oferecer...</p>`);
        setPreview(
          "Como um dos nossos subscritores mais valiosos, estamos a oferecer..."
        );
        break;
      case "update":
        setSubject("Novidades da BadCompany");
        setContent(`<h1>Atualizações e novidades!</h1>
          <p>Olá,</p>
          <p>Gostaríamos de partilhar algumas atualizações recentes...</p>`);
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

    if (!subject) {
      setError("O assunto é obrigatório");
      return;
    }

    if (!content) {
      setError("O conteúdo é obrigatório");
      return;
    }

    setIsSending(true);

    try {
      // Aqui faria a chamada real à API
      const response = await fetch("/api/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          content,
          preview,
          audienceType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar newsletter");
      }

      setIsSent(true);
      setSentMessage(`Newsletter enviada com sucesso para os subscritores!`);

      // Opcional: limpar os campos
      setSubject("");
      setContent("");
      setPreview("");
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
    <div className="p-6 text-white bg-purple-800 pt-30">
      <h1 className="text-3xl font-bold mb-6">Enviar Newsletter</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
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
                      <span>BadCompany &lt;newsletter@badcompany.com&gt;</span>
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
                Enviar newsletter
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
