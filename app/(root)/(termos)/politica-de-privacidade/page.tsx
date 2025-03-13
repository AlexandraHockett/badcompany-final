"use client";

import React from "react";

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Política de Privacidade
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-12 rounded-full"></div>
      </section>

      <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-white/10 text-gray-200 space-y-6">
        <p className="text-lg">
          A BadCompany está comprometida em proteger a sua privacidade. Esta
          política explica como recolhemos, utilizamos e protegemos os seus
          dados pessoais quando utiliza o nosso website e os nossos serviços.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Informações que recolhemos
        </h2>
        <p>Podemos recolher os seguintes tipos de informação:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-purple-300">
              Informações de identificação pessoal:
            </strong>{" "}
            Nome, endereço de email, número de telefone, endereço postal, quando
            fornecidos voluntariamente.
          </li>
          <li>
            <strong className="text-purple-300">
              Informações de pagamento:
            </strong>{" "}
            Dados de cartão de crédito ou outras informações financeiras quando
            adquire bilhetes para os nossos eventos.
          </li>
          <li>
            <strong className="text-purple-300">
              Informações de utilização:
            </strong>{" "}
            Como interage com o nosso website, incluindo páginas visitadas,
            tempo de permanência e outras estatísticas.
          </li>
          <li>
            <strong className="text-purple-300">
              Informações do dispositivo:
            </strong>{" "}
            Tipo de dispositivo, sistema operativo, tipo de navegador e outros
            dados técnicos.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Como utilizamos os seus dados
        </h2>
        <p>Utilizamos os seus dados pessoais para:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fornecer os nossos serviços e processar as suas transações</li>
          <li>Comunicar consigo sobre os nossos eventos e serviços</li>
          <li>Personalizar e melhorar a sua experiência no nosso website</li>
          <li>Enviar informações promocionais (caso tenha consentido)</li>
          <li>Cumprir com as nossas obrigações legais</li>
          <li>Prevenir fraudes e atividades ilegais</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Partilha de dados
        </h2>
        <p>Podemos partilhar os seus dados pessoais com:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Prestadores de serviços que nos ajudam a operar o nosso negócio
          </li>
          <li>Parceiros de marketing (apenas com o seu consentimento)</li>
          <li>Autoridades legais quando exigido por lei</li>
        </ul>
        <p>Não vendemos os seus dados pessoais a terceiros.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Segurança dos dados
        </h2>
        <p>
          Implementamos medidas de segurança técnicas e organizacionais para
          proteger os seus dados pessoais contra acessos não autorizados, perda
          ou alteração. No entanto, a transmissão de informações pela internet
          não é completamente segura, pelo que não podemos garantir a segurança
          dos dados enviados para o nosso website.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Os seus direitos
        </h2>
        <p>
          Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), tem
          os seguintes direitos:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Direito de acesso aos seus dados pessoais</li>
          <li>Direito de retificação de dados incorretos</li>
          <li>Direito ao apagamento dos seus dados</li>
          <li>Direito à limitação do tratamento</li>
          <li>Direito à portabilidade dos dados</li>
          <li>Direito de oposição ao tratamento</li>
        </ul>
        <p>
          Para exercer qualquer um destes direitos, por favor contacte-nos
          através do email{" "}
          <a
            href="mailto:geral@badcompany.pt"
            className="text-purple-400 hover:underline"
          >
            geral@badcompany.pt
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Atualizações à política de privacidade
        </h2>
        <p>
          Podemos atualizar esta política periodicamente. Recomendamos que a
          consulte regularmente para se manter informado sobre quaisquer
          alterações.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-3">
          Contacte-nos
        </h2>
        <p>
          Se tiver dúvidas sobre a nossa política de privacidade, por favor
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

export default PrivacyPage;
