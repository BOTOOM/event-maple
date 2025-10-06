import { Metadata } from "next";
import { ArrowLeft, Target, Users, Calendar, Heart, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de EventMaple - Gestiona tus eventos de forma inteligente",
  description: "Descubre cómo EventMaple ayuda a la comunidad a gestionar eventos y agendas personalizadas de manera eficiente y gratuita.",
};

export default function AboutPage() {
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
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Acerca de EventMaple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un proyecto creado con pasión para ayudar a la comunidad a gestionar sus eventos
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Nuestra Misión
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
            <p>
              EventMaple nació con un <strong>propósito claro y sencillo</strong>: empoderar 
              a la comunidad para que pueda crear, organizar y participar en eventos de 
              cualquier tipo, de forma completamente gratuita y accesible para todos.
            </p>
            <p>
              Ya sea un evento tecnológico, una conferencia, un taller comunitario, o 
              cualquier otro tipo de reunión, EventMaple te brinda las herramientas necesarias 
              para que tanto organizadores como asistentes puedan gestionar toda la información 
              en un solo lugar.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl shadow-lg border border-primary/10 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Qué Ofrecemos?
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
                  Para Organizadores
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Crea eventos de cualquier tipo, tecnológicos o no tecnológicos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Añade charlas, talleres y actividades dentro de cada evento
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Comparte toda la información del evento con la comunidad
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Facilita la organización y planificación de actividades
                  </span>
                </li>
              </ul>
            </div>

            {/* Para Asistentes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Para Asistentes
                </h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Explora eventos y descubre charlas que te interesen
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Gestiona tu agenda personal del evento a tu medida
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Marca las charlas y actividades a las que deseas asistir
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    Mantén todo organizado en un solo lugar, para múltiples eventos
                  </span>
                </li>
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
              Hecho para la Comunidad
            </h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              EventMaple está diseñado pensando en <strong>ti</strong> y en toda la comunidad. 
              Creemos que gestionar eventos no debería ser complicado ni costoso. Por eso, 
              ofrecemos una plataforma completamente gratuita que pone el poder de la 
              organización en tus manos.
            </p>
            <p className="text-lg">
              Ya seas un organizador que busca facilitar la experiencia de tus asistentes, 
              o un participante que quiere aprovechar al máximo cada evento, EventMaple 
              está aquí para ayudarte a mantener todo estructurado, accesible y bajo control.
            </p>
            <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-6 mt-6 border border-primary/20">
              <p className="text-base text-gray-800 font-medium">
                💡 <strong>Nuestra visión:</strong> Un mundo donde cualquier persona o grupo 
                pueda organizar y participar en eventos de forma simple, intuitiva y efectiva, 
                fortaleciendo los lazos de la comunidad y facilitando el acceso al conocimiento 
                y las experiencias compartidas.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidad Primero</h3>
              <p className="text-gray-300 text-sm">
                Todo lo que hacemos está pensado para servir y empoderar a la comunidad
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simplicidad</h3>
              <p className="text-gray-300 text-sm">
                Una herramienta fácil de usar, intuitiva y accesible para todos
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gratuito Siempre</h3>
              <p className="text-gray-300 text-sm">
                Creemos en el acceso libre al conocimiento y las herramientas digitales
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl p-8 md:p-12 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Empezar?
          </h2>
          <p className="text-lg mb-8 opacity-95">
            Únete a EventMaple y comienza a gestionar tus eventos de manera inteligente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Crear Cuenta Gratis
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Explorar Eventos
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
