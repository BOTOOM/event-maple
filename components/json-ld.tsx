import { getLocalizedUrl, sanitizeJsonLd, siteConfig } from "@/lib/seo";

const localeDescriptions: Record<string, string> = {
	en: "Platform for managing public events, talks, and personal agendas. Currently free while we grow — affordable pricing coming soon for long-term sustainability.",
	es: "Plataforma para gestionar eventos públicos, charlas y agendas personales. Actualmente gratuita mientras crecemos — precios accesibles próximamente para asegurar la sostenibilidad a largo plazo.",
	fr: "Plateforme pour gérer des événements publics, des conférences et des agendas personnels. Actuellement gratuite pendant notre croissance — tarifs abordables à venir pour assurer la viabilité à long terme.",
	pt: "Plataforma para gerenciar eventos públicos, palestras e agendas pessoais. Atualmente gratuita enquanto crescemos — preços acessíveis em breve para garantir a sustentabilidade a longo prazo.",
};

interface JsonLdProps {
	readonly locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
	const description = localeDescriptions[locale] || localeDescriptions.en;
	const localizedUrl = getLocalizedUrl(locale);
	const organizationId = `${siteConfig.url}/#organization`;
	const websiteId = `${siteConfig.url}/#website`;
	const applicationId = `${siteConfig.url}/#application`;

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: sanitizeJsonLd({
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "Organization",
							"@id": organizationId,
							name: siteConfig.name,
							url: siteConfig.url,
							founder: {
								"@type": "Person",
								name: siteConfig.authorName,
								url: siteConfig.authorUrl,
							},
						},
						{
							"@type": "WebSite",
							"@id": websiteId,
							url: siteConfig.url,
							name: siteConfig.name,
							description,
							inLanguage: locale,
							publisher: {
								"@id": organizationId,
							},
						},
						{
							"@type": "SoftwareApplication",
							"@id": applicationId,
							name: siteConfig.name,
							url: localizedUrl,
							applicationCategory: "EventManagementApplication",
							operatingSystem: "Web",
							description,
							inLanguage: locale,
							offers: {
								"@type": "Offer",
								price: "0",
								priceCurrency: "USD",
							},
							publisher: {
								"@id": organizationId,
							},
							isPartOf: {
								"@id": websiteId,
							},
						},
					],
				}),
			}}
		/>
	);
}
