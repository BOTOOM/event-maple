import type { Metadata, ResolvingMetadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { JsonLd } from "@/components/json-ld";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
 
  return {
    metadataBase: new URL("https://event-maple.edwardiaz.dev"),
    title: {
      default: t('title'),
      template: "%s | EventMaple",
    },
    description: t('description'),
    manifest: '/manifest.webmanifest',
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
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'es': '/es',
        'fr': '/fr',
        'pt': '/pt',
      },
    },
    openGraph: {
      type: "website",
      locale: locale,
      url: "https://event-maple.edwardiaz.dev/",
      siteName: "EventMaple",
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "EventMaple",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <JsonLd />
          <ServiceWorkerRegister />
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
