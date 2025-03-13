"use client";

import React from "react";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Termos e Condições
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-12 rounded-full"></div>
      </section>

      <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10 text-gray-200 space-y-6">
        <p className="text-lg">
          Ao aceder e utilizar o website da BadCompany e os nossos serviços,
          concorda com estes Termos e Condições. Por favor, leia-os atentamente.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          1. Aceitação dos Termos
        </h2>
        <p>
          Ao aceder ou utilizar o nosso website e os nossos serviços, está a
          aceitar e concordar em ficar vinculado pelos seguintes termos e
          condições. Se não concordar com qualquer parte destes termos, não
          deverá utilizar o nosso website ou serviços.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          2. Alterações aos Termos
        </h2>
        <p>
          Reservamo-nos o direito de modificar estes termos a qualquer momento.
          As alterações entrarão em vigor imediatamente após a sua publicação no
          website. É da sua responsabilidade rever regularmente estes termos.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          3. Utilização do Website
        </h2>
        <p>Ao utilizar o nosso website, concorda em:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Não utilizar o website de forma ilegal ou que possa causar danos ao
            website ou a terceiros
          </li>
          <li>Não tentar aceder a áreas restritas do website</li>
          <li>
            Não submeter conteúdo falso, ofensivo, ou que viole direitos de
            terceiros
          </li>
          <li>
            Não utilizar o website para distribuir material publicitário não
            solicitado
          </li>
          <li>
            Não utilizar software ou dispositivos que possam interferir com o
            funcionamento adequado do website
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          4. Compra de Bilhetes
        </h2>
        <p>
          Ao adquirir bilhetes através do nosso website, concorda com as
          seguintes condições:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Os bilhetes são válidos apenas para o evento e data especificados
          </li>
          <li>
            A revenda de bilhetes não é permitida sem o nosso consentimento
            prévio por escrito
          </li>
          <li>
            Reservamo-nos o direito de cancelar bilhetes adquiridos em violação
            destes termos
          </li>
          <li>
            A idade mínima para acesso a eventos depende da classificação etária
            de cada evento
          </li>
          <li>
            Os bilhetes perdidos ou roubados não serão reembolsados ou
            substituídos
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          5. Política de Reembolso
        </h2>
        <p>
          Bilhetes para eventos são geralmente não reembolsáveis, exceto nos
          seguintes casos:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cancelamento do evento (reembolso total)</li>
          <li>
            Adiamento significativo (poderá solicitar reembolso no prazo de 14
            dias)
          </li>
          <li>Alteração significativa de programa (a avaliar caso a caso)</li>
        </ul>
        <p>
          Todos os reembolsos estão sujeitos às taxas de serviço aplicáveis, que
          não são reembolsáveis.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          6. Propriedade Intelectual
        </h2>
        <p>
          Todo o conteúdo do website, incluindo textos, gráficos, logótipos,
          ícones, imagens, clips de áudio, downloads digitais e compilações de
          software, é propriedade da BadCompany ou dos seus fornecedores de
          conteúdo e está protegido pelas leis de direitos autorais nacionais e
          internacionais.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          7. Limitação de Responsabilidade
        </h2>
        <p>
          A BadCompany não será responsável por quaisquer danos diretos,
          indiretos, incidentais, consequenciais ou punitivos resultantes do uso
          ou incapacidade de usar os nossos serviços ou conteúdo.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          8. Eventos e Conduta
        </h2>
        <p>Nos nossos eventos, reservamo-nos o direito de:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Recusar entrada ou expulsar qualquer pessoa que esteja a demonstrar
            comportamento disruptivo, ameaçador ou ofensivo
          </li>
          <li>Proibir a entrada de objetos potencialmente perigosos</li>
          <li>Conduzir revistas de segurança como condição de entrada</li>
          <li>Proibir gravações não autorizadas dos eventos</li>
          <li>Alterar o programa, data ou local do evento quando necessário</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          9. Lei Aplicável
        </h2>
        <p>
          Estes termos serão regidos e interpretados de acordo com as leis de
          Portugal, sem consideração aos seus princípios de conflitos de leis.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          10. Contacte-nos
        </h2>
        <p>
          Se tiver dúvidas sobre estes termos e condições, por favor
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

export default TermsPage;
