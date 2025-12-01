import { Metadata } from "next";
import { ArrowLeft, Shield, Lock, Eye, Server, Mail, UserCheck } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t("title")}
            </h1>
          </div>
          <p className="text-gray-600">
            {t("lastUpdate")}: {new Date().toLocaleDateString()}
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              {t("alert")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          {/* 1. Introducción */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Eye className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("sections.introduction.title")}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.introduction.text1")}</p>
              <p>{t("sections.introduction.text2")}</p>
            </div>
          </section>

          {/* 2. Información que Recopilamos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Server className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("sections.collection.title")}
              </h2>
            </div>
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("sections.usage.title")}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.usage.intro")}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t("sections.usage.operation.title")}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i}>• {t(`sections.usage.operation.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t("sections.usage.communications.title")}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i}>• {t(`sections.usage.communications.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t("sections.usage.improvement.title")}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i}>• {t(`sections.usage.improvement.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t("sections.usage.security.title")}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {[0, 1, 2, 3].map((i) => (
                      <li key={i}>• {t(`sections.usage.security.items.${i}`)}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-900" dangerouslySetInnerHTML={{ __html: t.raw("sections.usage.commitment") }} />
              </div>
            </div>
          </section>

          {/* 4. Almacenamiento y Seguridad */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lock className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("sections.storage.title")}
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>{t("sections.storage.intro")}</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("sections.storage.encryption.title")}</h4>
                    <p className="text-sm">{t("sections.storage.encryption.text")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("sections.storage.infrastructure.title")}</h4>
                    <p className="text-sm">{t("sections.storage.infrastructure.text")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("sections.storage.access.title")}</h4>
                    <p className="text-sm">{t("sections.storage.access.text")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("sections.storage.minimization.title")}</h4>
                    <p className="text-sm">{t("sections.storage.minimization.text")}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4" dangerouslySetInnerHTML={{ __html: t.raw("sections.storage.important") }} />
            </div>
          </section>

          {/* 5. Compartir Información */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {t("sections.sharing.title")}
              </h2>
            </div>
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
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t("sections.rights.access.title")}</h4>
                  <p className="text-sm">{t("sections.rights.access.desc")}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t("sections.rights.rectification.title")}</h4>
                  <p className="text-sm">{t("sections.rights.rectification.desc")}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t("sections.rights.deletion.title")}</h4>
                  <p className="text-sm">{t("sections.rights.deletion.desc")}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t("sections.rights.portability.title")}</h4>
                  <p className="text-sm">{t("sections.rights.portability.desc")}</p>
                </div>
              </div>
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
          <section className="border-t border-gray-200 pt-6">
            <div className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t("commitment.title")}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {t("commitment.text")}
              </p>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {t("footer.back")}
          </Link>
          <p className="text-sm text-gray-600">
            {t("footer.question")}{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              {t("footer.terms")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
