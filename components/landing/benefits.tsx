import { Clock, Calendar } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Ahorra Tiempo",
    description:
      "Optimiza tu tiempo con nuestras herramientas de programación intuitivas y crea un calendario.",
  },
  {
    icon: Calendar,
    title: "Mantente Organizado",
    description:
      "Mantén todo en orden y no te pierdas ninguna sesión o evento importante.",
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Beneficios Clave
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre las ventajas de usar nuestra plataforma para una experiencia de evento inigualable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
