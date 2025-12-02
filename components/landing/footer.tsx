import { Link } from "@/lib/i18n/navigation";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Landing.Footer");

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Calendar className="h-6 w-6" />
              <span className="font-bold text-xl">EventMaple</span>
            </Link>
            <p className="text-sm text-gray-400">
              {t("brand.tagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("columns.product")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#benefits" className="text-sm hover:text-white transition-colors">
                  {t("links.benefits")}
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm hover:text-white transition-colors">
                  {t("links.features")}
                </Link>
              </li>
              {/* <li>
                <Link href="#pricing" className="text-sm hover:text-white transition-colors">
                  Precios
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("columns.project")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t("columns.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  {t("links.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  {t("links.privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            {t("copyright", { year: currentYear })}{" "}
            <a 
              href="https://edwardiaz.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Edwar Diaz 
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
