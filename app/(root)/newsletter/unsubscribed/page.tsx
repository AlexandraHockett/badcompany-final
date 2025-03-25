import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnsubscribedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="max-w-md w-full p-8 rounded-lg bg-gray-900 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Inscrição Cancelada
          </h1>
          <div className="mb-6 text-gray-300">
            <p className="mb-4">
              Sua inscrição em nossa newsletter foi cancelada com sucesso.
            </p>
            <p>
              Sentimos muito ver você partir. Se mudar de ideia, você pode se
              inscrever novamente a qualquer momento.
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/" legacyBehavior>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Voltar para o início
              </Button>
            </Link>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <a href="/politica-de-cookies" className="hover:text-gray-300">
                Cookies
              </a>
              <span>•</span>
              <a
                href="/politica-de-privacidade"
                className="hover:text-gray-300"
              >
                Privacidade
              </a>
              <span>•</span>
              <a href="/termos-e-condicoes" className="hover:text-gray-300">
                Termos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
