//app\layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { helveticaNeue } from "./fonts";
import NewsletterModal from "@/components/layout/NewsletterModal";
import Providers from "@/components/layout/Providers";
import LayoutContent from "../components/layout/LayoutContent"; // Import the new client component

export const metadata: Metadata = {
  title: "BadCompany | Eventos Inovadores e Memoráveis",
  description:
    "Desde 2004, a BadCompany tem sido referência na organização de eventos inesquecíveis, destacando-se pela inovação e excelência no setor.",
  openGraph: {
    title: "BadCompany | Inovação e Excelência em Eventos",
    description:
      "Com mais de 20 anos de experiência, a BadCompany cria experiências únicas, desde festivais a eventos privados, com destaque para sonoridades africanas.",
    type: "website",
    locale: "pt_PT",
    url: "https://badcompany.pt",
    siteName: "BadCompany",
    images: [
      {
        url: "https://badcompany.pt/images/badcompany-og.jpg",
        width: 1200,
        height: 630,
        alt: "Logo da BadCompany",
      },
    ],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://badcompany.pt"
  ),
  robots: { index: true, follow: true },
  other: { google: "notranslate" },
  creator: "AHockett",
  authors: [
    { name: "Alexandra Hockett", url: "https://www.alexandrahockett.com" },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${helveticaNeue.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
