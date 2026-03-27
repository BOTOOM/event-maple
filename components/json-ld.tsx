import { getLocalizedUrl, sanitizeJsonLd, siteConfig } from "@/lib/seo";

const localeDescriptions: Record<string, string> = {
	en: "Free platform to manage public events, talks, and personal agendas in one place.",
	es: "Plataforma gratuita para gestionar eventos públicos, charlas y agendas personales en un solo lugar.",
	fr: "Plateforme gratuite pour gérer des événements publics, des conférences et des agendas personnels en un seul endroit.",
	pt: "Plataforma gratuita para gerenciar eventos públicos, palestras e agendas pessoais em um só lugar.",
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
