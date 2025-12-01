import { Metadata } from "next";
import { ArrowLeft, Target, Users, Calendar, Heart, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Static.About.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AboutPage() {
  const t = useTranslations("Static.About");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{t("back")}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("header.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("header.subtitle")}
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("mission.title")}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p dangerouslySetInnerHTML={{ __html: t.raw("mission.text1") }} />
            <p>{t("mission.text2")}</p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl shadow-lg border border-primary/10 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("offer.title")}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Para Organizadores */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("offer.organizers.title")}
                </h3>
              </div>
              <ul className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {t(`offer.organizers.items.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Para Asistentes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("offer.attendees.title")}
                </h3>
              </div>
              <ul className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {t(`offer.attendees.items.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {t("vision.title")}
            </h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: t.raw("vision.text1") }} />
            <p className="text-lg">{t("vision.text2")}</p>
            <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-6 mt-6 border border-primary/20">
              <p className="text-base text-gray-800 font-medium" dangerouslySetInnerHTML={{ __html: t.raw("vision.highlight") }} />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t("values.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("values.community.title")}</h3>
              <p className="text-gray-300 text-sm">
                {t("values.community.desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("values.simplicity.title")}</h3>
              <p className="text-gray-300 text-sm">
                {t("values.simplicity.desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("values.free.title")}</h3>
              <p className="text-gray-300 text-sm">
                {t("values.free.desc")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg mb-8 opacity-95">
            {t("cta.text")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t("cta.createAccount")}
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              {t("cta.explore")}
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
