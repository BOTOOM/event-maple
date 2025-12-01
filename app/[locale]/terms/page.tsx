import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{t("back")}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600">
            {t("lastUpdate")}: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          {/* 1. Aceptación de los Términos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.acceptance.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.acceptance.text1")}</p>
              <p>{t("sections.acceptance.text2")}</p>
            </div>
          </section>

          {/* 2. Descripción del Servicio */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.description.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.description.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i}>{t(`sections.description.items.${i}`)}</li>
                ))}
              </ul>
              <p>{t("sections.description.text")}</p>
            </div>
          </section>

          {/* 3. Registro y Cuenta de Usuario */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.account.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.account.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i}>{t(`sections.account.items.${i}`)}</li>
                ))}
              </ul>
              <p>{t("sections.account.text")}</p>
            </div>
          </section>

          {/* 4. Recopilación y Uso de Datos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.data.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.data.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: t.raw(`sections.data.items.${i}`) }} />
                ))}
              </ul>
              <p>{t("sections.data.usageIntro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i}>{t(`sections.data.usageItems.${i}`)}</li>
                ))}
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-900" dangerouslySetInnerHTML={{ __html: t.raw("sections.data.communications") }} />
              </div>

              <p className="mt-4" dangerouslySetInnerHTML={{ 
                __html: t.raw("sections.data.privacyLink").replace('<link>', '<a href="/privacy" class="text-primary hover:underline font-medium">').replace('</link>', '</a>') 
              }} />
            </div>
          </section>

          {/* 5. Conducta del Usuario */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.conduct.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.conduct.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>{t(`sections.conduct.items.${i}`)}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 6. Propiedad Intelectual */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.ip.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.ip.text1")}</p>
              <p>{t("sections.ip.text2")}</p>
            </div>
          </section>

          {/* 7. Limitación de Responsabilidad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.liability.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.liability.intro")}</p>
              <ul className="list-disc pl-6 space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i}>{t(`sections.liability.items.${i}`)}</li>
                ))}
              </ul>
              <p>{t("sections.liability.text")}</p>
            </div>
          </section>

          {/* 8. Modificaciones del Servicio */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.modifications.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.modifications.text1")}</p>
              <p>{t("sections.modifications.text2")}</p>
            </div>
          </section>

          {/* 9. Terminación */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.termination.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.termination.text1")}</p>
              <p>{t("sections.termination.text2")}</p>
            </div>
          </section>

          {/* 10. Ley Aplicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.law.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.law.text1")}</p>
              <p>{t("sections.law.text2")}</p>
            </div>
          </section>

          {/* 11. Cambios a los Términos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.changes.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.changes.text1")}</p>
              <p>{t("sections.changes.text2")}</p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t("sections.contact.title")}
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.contact.intro")}</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="font-medium text-gray-900">EventMaple</p>
                <p className="text-gray-700 mt-2">
                  {t("sections.contact.email")}{" "}
                  <a
                    href="mailto:edwardiaz.dev@gmail.com"
                    className="text-primary hover:underline"
                  >
                    edwardiaz.dev@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Agradecimiento */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm">
              {t("footer.text")}
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {t("footer.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
