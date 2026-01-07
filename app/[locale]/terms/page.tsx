// Metadata type is used via generateMetadata return type inference
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout } from "@/components/ui/legal-page-layout";
import {
	LegalAlert,
	LegalContactBox,
	LegalFooterSection,
	LegalList,
	LegalSection,
} from "@/components/ui/legal-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Terms.metadata" });
	return {
		title: t("title"),
		description: t("description"),
	};
}

export default function TermsPage() {
	const t = useTranslations("Terms");

	return (
		<LegalPageLayout
			backHref="/register"
			backText={t("back")}
			title={t("title")}
			lastUpdateText={t("lastUpdate")}
			lastUpdateDate={new Date().toLocaleDateString()}
			footer={{ backText: t("footer.back") }}
		>
			{/* 1. Aceptación de los Términos */}
			<LegalSection title={t("sections.acceptance.title")}>
				<p>{t("sections.acceptance.text1")}</p>
				<p>{t("sections.acceptance.text2")}</p>
			</LegalSection>

			{/* 2. Descripción del Servicio */}
			<LegalSection title={t("sections.description.title")}>
				<p>{t("sections.description.intro")}</p>
				<LegalList items={[0, 1, 2, 3, 4].map((i) => t(`sections.description.items.${i}`))} />
				<p>{t("sections.description.text")}</p>
			</LegalSection>

			{/* 3. Registro y Cuenta de Usuario */}
			<LegalSection title={t("sections.account.title")}>
				<p>{t("sections.account.intro")}</p>
				<LegalList items={[0, 1, 2, 3].map((i) => t(`sections.account.items.${i}`))} />
				<p>{t("sections.account.text")}</p>
			</LegalSection>

			{/* 4. Recopilación y Uso de Datos */}
			<LegalSection title={t("sections.data.title")}>
				<p>{t("sections.data.intro")}</p>
				<LegalList items={[0, 1, 2].map((i) => t.raw(`sections.data.items.${i}`))} useHtml />
				<p>{t("sections.data.usageIntro")}</p>
				<LegalList items={[0, 1, 2, 3].map((i) => t(`sections.data.usageItems.${i}`))} />
				<LegalAlert>
					<span dangerouslySetInnerHTML={{ __html: t.raw("sections.data.communications") }} />
				</LegalAlert>
				<p
					className="mt-4"
					dangerouslySetInnerHTML={{
						__html: t
							.raw("sections.data.privacyLink")
							.replace(
								"<link>",
								'<a href="/privacy" class="text-primary hover:underline font-medium">',
							)
							.replace("</link>", "</a>"),
					}}
				/>
			</LegalSection>

			{/* 5. Conducta del Usuario */}
			<LegalSection title={t("sections.conduct.title")}>
				<p>{t("sections.conduct.intro")}</p>
				<LegalList items={[0, 1, 2, 3, 4, 5].map((i) => t(`sections.conduct.items.${i}`))} />
			</LegalSection>

			{/* 6. Contenido de Eventos e Imágenes */}
			<LegalSection title={t("sections.eventContent.title")}>
				<p>{t("sections.eventContent.intro")}</p>
				<h4 className="font-semibold mt-4">{t("sections.eventContent.disclaimer.title")}</h4>
				<LegalList
					items={[0, 1, 2, 3].map((i) => t(`sections.eventContent.disclaimer.items.${i}`))}
				/>
				<h4 className="font-semibold mt-4">{t("sections.eventContent.prohibited.title")}</h4>
				<p>{t("sections.eventContent.prohibited.intro")}</p>
				<LegalList
					items={[0, 1, 2, 3, 4, 5].map((i) => t(`sections.eventContent.prohibited.items.${i}`))}
				/>
				<h4 className="font-semibold mt-4">{t("sections.eventContent.enforcement.title")}</h4>
				<p>{t("sections.eventContent.enforcement.text")}</p>
			</LegalSection>

			{/* 7. Propiedad Intelectual */}
			<LegalSection title={t("sections.ip.title")}>
				<p>{t("sections.ip.text1")}</p>
				<p>{t("sections.ip.text2")}</p>
			</LegalSection>

			{/* 8. Limitación de Responsabilidad */}
			<LegalSection title={t("sections.liability.title")}>
				<p>{t("sections.liability.intro")}</p>
				<LegalList items={[0, 1, 2, 3].map((i) => t(`sections.liability.items.${i}`))} />
				<p>{t("sections.liability.text")}</p>
			</LegalSection>

			{/* 9. Modificaciones del Servicio */}
			<LegalSection title={t("sections.modifications.title")}>
				<p>{t("sections.modifications.text1")}</p>
				<p>{t("sections.modifications.text2")}</p>
			</LegalSection>

			{/* 10. Terminación */}
			<LegalSection title={t("sections.termination.title")}>
				<p>{t("sections.termination.text1")}</p>
				<p>{t("sections.termination.text2")}</p>
			</LegalSection>

			{/* 11. Ley Aplicable */}
			<LegalSection title={t("sections.law.title")}>
				<p>{t("sections.law.text1")}</p>
				<p>{t("sections.law.text2")}</p>
			</LegalSection>

			{/* 12. Cambios a los Términos */}
			<LegalSection title={t("sections.changes.title")}>
				<p>{t("sections.changes.text1")}</p>
				<p>{t("sections.changes.text2")}</p>
			</LegalSection>

			{/* 13. Contacto */}
			<LegalSection title={t("sections.contact.title")}>
				<p>{t("sections.contact.intro")}</p>
				<LegalContactBox
					title="EventMaple"
					email="edwardiaz.dev@gmail.com"
					emailLabel={t("sections.contact.email")}
				/>
			</LegalSection>

			{/* Agradecimiento */}
			<LegalFooterSection>
				<p className="text-gray-600 text-sm">{t("footer.text")}</p>
			</LegalFooterSection>
		</LegalPageLayout>
	);
}
