import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Landing.Hero");

  return (
    <section className="relative pt-20 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 sm:from-gray-900 sm:via-gray-800 sm:to-gray-900 shadow-2xl">
          {/* Background Image Overlay - Solo en desktop */}
          <div
            className="absolute inset-0 opacity-0 sm:opacity-40"
            style={{
              backgroundImage: 'url("https://tfpdrgwwxdexsflpxmce.supabase.co/storage/v1/object/sign/event-images/banners/venue.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wODc1NTFjNy05YzA1LTQ2ZWQtOTAzNC04NmI1ZWFiNTUzNTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmFubmVycy92ZW51ZS5qcGciLCJpYXQiOjE3NTk3NzIyMTgsImV4cCI6MTc5MTMwODIxOH0.hdzTkJWumQFp3fiVw3UR2BQAlJFFitaDEh8kT9HrMVw")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-8 lg:px-20 py-16 sm:py-20 lg:py-32 text-center sm:text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              <span className="hidden sm:inline">
                {t("title")}
              </span>
              <span className="sm:hidden">
                {t("titleMobile")}
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 sm:text-gray-200 mb-8 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto">
              <span className="hidden sm:inline">
                {t("subtitle")}
              </span>
              <span className="sm:hidden">
                {t("subtitleMobile")}
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 sm:bg-primary sm:text-white sm:hover:bg-primary/90">
                  <span className="hidden sm:inline">{t("cta")}</span>
                  <span className="sm:hidden">{t("ctaMobile")}</span>
              </Button>
                </Link>
              {/* <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 sm:bg-white sm:text-gray-900 sm:hover:bg-gray-100 sm:border-0"
              >
                <Link href="#features">
                  <span className="hidden sm:inline">Crea tu agenda de evento</span>
                  <span className="sm:hidden">Ver más</span>
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
