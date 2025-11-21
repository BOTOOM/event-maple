import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventMaple - La forma más inteligente de organizar tu evento",
  description: "Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin complicaciones.",
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://event-maple.edwardiaz.dev/",
    siteName: "EventMaple",
    title: "EventMaple - La forma más inteligente de organizar tu evento",
    description: "Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin complicaciones.",
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
    title: "EventMaple - La forma más inteligente de organizar tu evento",
    description: "Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin complicaciones.",
    images: ["/opengraph-image"],
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
        <ServiceWorkerRegister />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
