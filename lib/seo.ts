import type { Metadata } from "next";
import { routing } from "@/lib/i18n/routing";

export const siteConfig = {
	name: "EventMaple",
	url: "https://event-maple.edwardiaz.dev",
	authorName: "Edward Díaz",
	authorUrl: "https://edwardiaz.dev",
	twitterHandle: "@edwardiaz",
};

export type AppLocale = (typeof routing.locales)[number];

export function normalizeSeoPath(path: string = ""): string {
	if (!path || path === "/") {
		return "";
	}

	return path.startsWith("/") ? path : `/${path}`;
}

export function getLocalizedPath(locale: string, path: string = ""): string {
	return `/${locale}${normalizeSeoPath(path)}`;
}

export function getLocalizedUrl(locale: string, path: string = ""): string {
	return new URL(getLocalizedPath(locale, path), siteConfig.url).toString();
}

export function getLanguageAlternates(path: string = ""): Record<string, string> {
	const alternates = Object.fromEntries(
		routing.locales.map((locale) => [locale, getLocalizedPath(locale, path)]),
	) as Record<string, string>;

	alternates["x-default"] = getLocalizedPath(routing.defaultLocale, path);

	return alternates;
}

export function buildPageMetadata({
	locale,
	path = "",
	title,
	description,
	image = "/opengraph-image",
	keywords,
}: {
	locale: string;
	path?: string;
	title: string;
	description: string;
	image?: string;
	keywords?: string[];
}): Metadata {
	const localizedUrl = getLocalizedUrl(locale, path);
	const imageUrl = new URL(image, siteConfig.url).toString();

	return {
		title,
		description,
		keywords,
		alternates: {
			canonical: getLocalizedPath(locale, path),
			languages: getLanguageAlternates(path),
		},
		openGraph: {
			type: "website",
			locale,
			url: localizedUrl,
			siteName: siteConfig.name,
			title,
			description,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: siteConfig.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [imageUrl],
			creator: siteConfig.twitterHandle,
		},
	};
}

export function sanitizeJsonLd(data: unknown): string {
	return JSON.stringify(data).replace(/</g, "\\u003c");
}
