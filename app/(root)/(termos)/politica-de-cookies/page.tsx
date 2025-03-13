"use client";

import React from "react";

const CookiesPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Política de Cookies
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-12 rounded-full"></div>
      </section>

      <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10 text-gray-200 space-y-6">
        <p className="text-lg">
          A BadCompany utiliza cookies para melhorar a sua experiência no nosso
          website. Esta política explica como utilizamos cookies e tecnologias
          semelhantes.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          O que são cookies?
        </h2>
        <p>
          Cookies são pequenos arquivos de texto que são armazenados no seu
          dispositivo quando visita o nosso website. Eles permitem que o site
          memorize as suas ações e preferências durante um determinado período.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Que tipos de cookies utilizamos?
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-purple-300">
              Cookies essenciais
            </h3>
            <p>
              Necessários para o funcionamento básico do website. Estes são
              sempre ativos e não podem ser desativados.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-300">
              Cookies de desempenho
            </h3>
            <p>
              Ajudam-nos a entender como os visitantes interagem com o nosso
              website, recolhendo informações anónimas que nos permitem melhorar
              o site.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-300">
              Cookies de funcionalidade
            </h3>
            <p>
              Permitem ao website lembrar-se das suas escolhas (como o seu nome
              de utilizador, idioma ou região) para proporcionar uma experiência
              mais personalizada.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-purple-300">
              Cookies de marketing
            </h3>
            <p>
              Utilizados para rastrear os visitantes em diferentes websites, com
              o objetivo de apresentar publicidade relevante aos interesses do
              utilizador.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Como gerir os cookies?
        </h2>
        <p>
          A maioria dos navegadores permite controlar os cookies através das
          suas configurações. Pode normalmente encontrar estas configurações na
          secção "Opções" ou "Preferências" do seu navegador. No entanto,
          lembre-se que desativar certos cookies pode afetar a funcionalidade do
          nosso website.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Cookies de terceiros
        </h2>
        <p>
          Em alguns casos, utilizamos serviços de terceiros que também podem
          utilizar cookies. Estes incluem ferramentas de análise como o Google
          Analytics, botões de partilha em redes sociais, e serviços de
          reprodução de vídeo.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Atualizações à política de cookies
        </h2>
        <p>
          Podemos atualizar esta política periodicamente. Recomendamos que
          verifique esta página regularmente para se manter informado sobre
          quaisquer alterações.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Contacte-nos
        </h2>
        <p>
          Se tiver dúvidas sobre a nossa política de cookies, por favor
          contacte-nos através do email{" "}
          <a
            href="mailto:geral@badcompany.pt"
            className="text-purple-400 hover:underline"
          >
            geral@badcompany.pt
          </a>
          .
        </p>

        <div className="text-sm text-gray-400 pt-6 border-t border-white/10 mt-8">
          <p>Última atualização: 11 de março de 2025</p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
