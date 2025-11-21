import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { JsonLd } from "@/components/json-ld";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://event-maple.edwardiaz.dev"),
  title: {
    default: "EventMaple - La forma más inteligente de organizar tu evento",
    template: "%s | EventMaple",
  },
  description: "Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin complicaciones. Plataforma gratuita para organizadores y asistentes.",
  keywords: [
    "Gestión de eventos",
    "Agenda de conferencias",
    "Organización de eventos gratis",
    "Comunidad tecnológica",
    "Talleres",
    "Software para eventos",
    "EventMaple",
    "Open Source",
  ],
  authors: [{ name: "Edward Díaz", url: "https://edwardiaz.dev" }],
  creator: "Edward Díaz",
  publisher: "EventMaple",
  icons: {
    icon: [
      { url: "/icon?size=32", type: "image/png", sizes: "32x32" },
      { url: "/icon?size=192", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icon?size=180", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://event-maple.edwardiaz.dev/",
    siteName: "EventMaple",
    title: "EventMaple - Gestión de Eventos Gratuita y Simple",
    description: "Plataforma gratuita para organizar y asistir a eventos. Crea agendas personalizadas, descubre charlas y conecta con la comunidad.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "EventMaple - Gestiona tu evento",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventMaple - Gestión de Eventos Gratuita",
    description: "Organiza y participa en eventos de forma sencilla y gratuita. Tu agenda personalizada te espera.",
    images: ["/opengraph-image"],
    creator: "@edwardiaz", 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <JsonLd />
        <ServiceWorkerRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
