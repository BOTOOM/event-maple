import type { MetadataRoute } from "next";
import { Event } from "@/lib/types/event";

const baseUrl = "https://event-maple.edwardiaz.dev";
const locales = ["en", "es", "fr", "pt"] as const;
const defaultLocale = "en";

// Helper para generar alternates para cada URL
function generateAlternates(path: string) {
	const languages: Record<string, string> = {};
	for (const locale of locales) {
		languages[locale] = `${baseUrl}/${locale}${path}`;
	}
	// Añadir x-default apuntando al idioma por defecto
	languages["x-default"] = `${baseUrl}/${defaultLocale}${path}`;
	return { languages };
}

// Rutas estáticas que deben estar en el sitemap
const staticRoutes = [
	{ path: "", changeFrequency: "daily" as const, priority: 1 },
	{ path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
	{ path: "/events", changeFrequency: "daily" as const, priority: 0.9 },
	{ path: "/contact", changeFrequency: "yearly" as const, priority: 0.6 },
	{ path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
	{ path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	// Generar rutas estáticas con alternates para cada idioma
	const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
		url: `${baseUrl}/${defaultLocale}${route.path}`,
		lastModified: now,
		changeFrequency: route.changeFrequency,
		priority: route.priority,
		alternates: generateAlternates(route.path),
	}));

	// Rutas dinámicas (Eventos)
	let eventSitemapEntries: MetadataRoute.Sitemap = [];

	try {
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (supabaseUrl && supabaseKey) {
			const response = await fetch(`${supabaseUrl}/rest/v1/events?select=id,start_date`, {
				headers: {
					apikey: supabaseKey,
					Authorization: `Bearer ${supabaseKey}`,
				},
				next: { revalidate: 3600 }, // Revalidar cada hora
			});

			if (response.ok) {
				const events: Partial<Event>[] = await response.json();

				eventSitemapEntries = events.map((event) => ({
					url: `${baseUrl}/${defaultLocale}/events/${event.id}`,
					lastModified: new Date(event.start_date || now),
					changeFrequency: "weekly" as const,
					priority: 0.7,
					alternates: generateAlternates(`/events/${event.id}`),
				}));
			}
		}
	} catch (error) {
		console.error("Error generating sitemap for events:", error);
	}

	return [...staticSitemapEntries, ...eventSitemapEntries];
}
