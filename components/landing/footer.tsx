import Link from "next/link";
import { Calendar } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Calendar className="h-6 w-6" />
              <span className="font-bold text-xl">EventPlanner</span>
            </Link>
            <p className="text-sm text-gray-400">
              La forma más inteligente de organizar tu evento.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Producto</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#benefits" className="text-sm hover:text-white transition-colors">
                  Beneficios
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm hover:text-white transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {currentYear} EventPlanner. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
