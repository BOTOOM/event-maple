import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
          {/* Background Image Overlay */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-12 lg:px-20 py-20 sm:py-28 lg:py-32 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              La forma más inteligente de organizar
              <br className="hidden sm:block" /> tu evento.
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Tu agenda de eventos, simplificada. Gestiona y disfruta de cada momento sin
              complicaciones.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/register">Empieza ahora gratis</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="#features">Crea tu agenda de evento</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
