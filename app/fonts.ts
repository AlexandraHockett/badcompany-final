// app/fonts.ts
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Audiowide } from "next/font/google";

export const helveticaNeue = localFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeue-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica-neue",
});

// Fontes do Google
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const audiowide = Audiowide({
  weight: "400",
  variable: "--font-audiowide",
  subsets: ["latin"],
  display: "swap",
});

// Fontes locais
export const generalFont = localFont({
  src: "../public/fonts/general.woff2",
  variable: "--font-general",
  display: "swap",
});

export const zentryFont = localFont({
  src: "../public/fonts/zentry-regular.woff2",
  variable: "--font-zentry",
  display: "swap",
});
