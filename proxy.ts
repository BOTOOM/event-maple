import { type NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from "@/lib/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // 1. Ejecutar next-intl middleware primero para manejar el routing de idiomas
  const response = intlMiddleware(request);
  
  // 2. Ejecutar lógica de Supabase Auth
  // Pasamos la respuesta de intl para que Supabase pueda adjuntar sus cookies a ella
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // Matcher optimizado para excluir archivos estáticos, rutas de API, manifest, sitemap, robots y generador de iconos
    // eslint-disable-next-line no-useless-escape
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|manifest.webmanifest|sitemap.xml|robots.txt|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ],
};
