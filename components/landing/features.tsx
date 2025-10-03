import { MapPin } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Agenda Personalizada",
    description: "Crea y gestiona tu propia agenda personalizada con las sesiones que más te interesen.",
    badge: null,
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&auto=format&fit=crop",
    alt: "Agenda móvil personalizada",
  },
  {
    title: "Notificaciones en Tiempo Real",
    description: "Recibe actualizaciones y recordatorios instantáneos sobre tus sesiones y cambios del evento.",
    badge: "PRÓXIMAMENTE",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop",
    alt: "Panel de notificaciones",
  },
  {
    title: "Mapas del Evento",
    description: "Navega por el recinto del evento con nuestros mapas interactivos y encuentra tu camino fácilmente.",
    badge: "PRÓXIMAMENTE",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop",
    alt: "Mapa interactivo del evento",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Características Principales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora las funcionalidades que hacen de nuestra app la mejor opción para tu evento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover"
                />
                {feature.badge && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {feature.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
