import type { Metadata, ResolvingMetadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { Toaster } from "@/components/ui/toaster";
import { routing } from "@/lib/i18n/routing";
import { getLocalizedUrl, siteConfig } from "@/lib/seo";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

type Props = {
	params: Promise<{ locale: string }>;
};

export async function generateMetadata(
	{ params }: Props,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata" });

	return {
		metadataBase: new URL(siteConfig.url),
		title: {
			default: t("title"),
			template: `%s | ${siteConfig.name}`,
		},
		description: t("description"),
		manifest: "/manifest.webmanifest",
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
		authors: [{ name: siteConfig.authorName, url: siteConfig.authorUrl }],
		creator: siteConfig.authorName,
		publisher: siteConfig.name,
		openGraph: {
			type: "website",
			locale: locale,
			url: getLocalizedUrl(locale),
			siteName: siteConfig.name,
			title: t("title"),
			description: t("description"),
			images: [
				{
					url: "/opengraph-image",
					width: 1200,
					height: 630,
					alt: siteConfig.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
			images: ["/opengraph-image"],
			creator: siteConfig.twitterHandle,
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
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	if (!(routing.locales as readonly string[]).includes(locale)) {
		notFound();
	}

	// Providing all messages to the client
	const messages = await getMessages();

	return (
		<html lang={locale} className={inter.className} suppressHydrationWarning>
			<body className="antialiased">
				<a href="#main-content" className="skip-to-main">
					Skip to main content
				</a>
				<NextIntlClientProvider messages={messages}>
					<JsonLd locale={locale} />
					<ServiceWorkerRegister />
					{children}
					<Toaster />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
