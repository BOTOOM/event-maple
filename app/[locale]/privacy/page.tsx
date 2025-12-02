// Metadata type is used via generateMetadata return type inference
import { Shield, Lock, Eye, Server, Mail, UserCheck } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";
import { LegalPageLayout } from "@/components/ui/legal-page-layout";
import { LegalFooterSection } from "@/components/ui/legal-section";
import { UsageGrid, RightsGrid } from "@/components/ui/usage-grid";
import { FeatureList } from "@/components/ui/feature-list";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <LegalPageLayout
      backHref="/register"
      backText={t("back")}
      title={t("title")}
      lastUpdateText={t("lastUpdate")}
      lastUpdateDate={new Date().toLocaleDateString()}
      headerIcon={Shield}
      headerAlert={t("alert")}
      footer={{
        backText: t("footer.back"),
        extraContent: (
          <p className="text-sm text-gray-600">
            {t("footer.question")}{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              {t("footer.terms")}
            </Link>
          </p>
        ),
      }}
    >
          {/* 1. Introducción */}
          <section>
            <SectionHeader
              icon={<Eye className="h-5 w-5 text-gray-700" />}
              title={t("sections.introduction.title")}
            />
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.introduction.text1")}</p>
              <p>{t("sections.introduction.text2")}</p>
            </div>
          </section>

          {/* 2. Información que Recopilamos */}
          <section>
            <SectionHeader
              icon={<Server className="h-5 w-5 text-gray-700" />}
              title={t("sections.collection.title")}
            />
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{t("sections.collection.intro")}</p>

              <div className="space-y-4">
                {/* Información de Cuenta */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("sections.collection.account.title")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {[0, 1, 2].map((i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.collection.account.items.${i}`) }} />
                    ))}
                  </ul>
                </div>

                {/* Datos de Uso */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("sections.collection.usage.title")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.collection.usage.items.${i}`) }} />
                    ))}
                  </ul>
                </div>

                {/* Datos Técnicos */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("sections.collection.technical.title")}
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {[0, 1].map((i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.collection.technical.items.${i}`) }} />
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: t.raw("sections.collection.technical.note") }} />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cómo Usamos tu Información */}
          <section>
            <SectionHeader
              icon={<UserCheck className="h-5 w-5 text-gray-700" />}
              title={t("sections.usage.title")}
            />
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.usage.intro")}</p>
              <UsageGrid
                items={[
                  {
                    title: t("sections.usage.operation.title"),
                    items: [0, 1, 2, 3].map((i) => t(`sections.usage.operation.items.${i}`)),
                  },
                  {
                    title: t("sections.usage.communications.title"),
                    items: [0, 1, 2, 3].map((i) => t(`sections.usage.communications.items.${i}`)),
                  },
                  {
                    title: t("sections.usage.improvement.title"),
                    items: [0, 1, 2, 3].map((i) => t(`sections.usage.improvement.items.${i}`)),
                  },
                  {
                    title: t("sections.usage.security.title"),
                    items: [0, 1, 2, 3].map((i) => t(`sections.usage.security.items.${i}`)),
                  },
                ]}
                className="mt-4"
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-900" dangerouslySetInnerHTML={{ __html: t.raw("sections.usage.commitment") }} />
              </div>
            </div>
          </section>

          {/* 4. Almacenamiento y Seguridad */}
          <section>
            <SectionHeader
              icon={<Lock className="h-5 w-5 text-gray-700" />}
              title={t("sections.storage.title")}
            />
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.storage.intro")}</p>
              <FeatureList
                items={[
                  { title: t("sections.storage.encryption.title"), description: t("sections.storage.encryption.text") },
                  { title: t("sections.storage.infrastructure.title"), description: t("sections.storage.infrastructure.text") },
                  { title: t("sections.storage.access.title"), description: t("sections.storage.access.text") },
                  { title: t("sections.storage.minimization.title"), description: t("sections.storage.minimization.text") },
                ]}
                className="mt-4"
              />
              <p className="text-sm text-gray-600 mt-4" dangerouslySetInnerHTML={{ __html: t.raw("sections.storage.important") }} />
            </div>
          </section>

          {/* 5. Compartir Información */}
          <section>
            <SectionHeader
              icon={<Mail className="h-5 w-5 text-gray-700" />}
              title={t("sections.sharing.title")}
            />
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.sharing.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.sharing.items.${i}`) }} />
                ))}
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-900" dangerouslySetInnerHTML={{ __html: t.raw("sections.sharing.guarantee") }} />
              </div>
            </div>
          </section>

          {/* 6. Retención de Datos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.retention.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.retention.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.retention.items.${i}`) }} />
                ))}
              </ul>
            </div>
          </section>

          {/* 7. Tus Derechos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.rights.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.rights.intro")}</p>
              <RightsGrid
                items={[
                  { title: t("sections.rights.access.title"), description: t("sections.rights.access.desc") },
                  { title: t("sections.rights.rectification.title"), description: t("sections.rights.rectification.desc") },
                  { title: t("sections.rights.deletion.title"), description: t("sections.rights.deletion.desc") },
                  { title: t("sections.rights.portability.title"), description: t("sections.rights.portability.desc") },
                ]}
                className="mt-4"
              />
              <p className="mt-4">{t("sections.rights.contact")}</p>
            </div>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.cookies.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.cookies.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1].map((i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.cookies.items.${i}`) }} />
                ))}
              </ul>
              <p dangerouslySetInnerHTML={{ __html: t.raw("sections.cookies.notUsed") }} />
            </div>
          </section>

          {/* 9. Menores de Edad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.minors.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.minors.text1")}</p>
              <p>{t("sections.minors.text2")}</p>
            </div>
          </section>

          {/* 10. Cambios a esta Política */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.changes.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.changes.text1")}</p>
              <p>{t("sections.changes.text2")}</p>
            </div>
          </section>

          {/* 11. Transferencias Internacionales */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.international.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.international.text1")}</p>
              <p>{t("sections.international.text2")}</p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.contact.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.contact.intro")}</p>
              <div className="bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/20 rounded-lg p-6 mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t("sections.contact.infoTitle")}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: t.raw("sections.contact.project") }} />
                  <p className="text-gray-700">
                    <strong dangerouslySetInnerHTML={{ __html: t.raw("sections.contact.email") }} />{" "}
                    <a
                      href="mailto:edwardiaz.dev@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      edwardiaz.dev@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    {t("sections.contact.response")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compromiso Final */}
      <LegalFooterSection>
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("commitment.title")}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {t("commitment.text")}
          </p>
        </div>
      </LegalFooterSection>
    </LegalPageLayout>
  );
}
