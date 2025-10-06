"use client";

import { ArrowLeft, Mail, Github, Globe, Code2, Coffee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
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
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contacto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes preguntas, sugerencias o simplemente quieres conversar? ¡Me encantaría escucharte!
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-12 text-white text-center">
            <div className="inline-block relative w-32 h-32 mb-4">
              <Image
                src="/avatar.png"
                alt="Edwar Díaz"
                width={128}
                height={128}
                className="rounded-full border-4 border-white/30 shadow-xl object-cover"
                priority
              />
            </div>
            <h2 className="text-3xl font-bold mb-2">Edwar Díaz</h2>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <Code2 className="h-5 w-5" />
              <p className="text-lg">Desarrollador de EventMaple</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            <div className="mb-8">
              <p className="text-gray-700 text-center leading-relaxed text-lg">
                Hola! 👋 Soy Edwar, el desarrollador detrás de EventMaple. Creé este 
                proyecto con el objetivo de ayudar a la comunidad a gestionar eventos 
                de manera más eficiente y accesible.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Formas de Contactarme
              </h3>

              {/* Email */}
              <a
                href="mailto:contact@edwardiaz.dev"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Mail className="h-7 w-7 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Correo Electrónico
                  </h4>
                  <p className="text-primary font-medium group-hover:underline">
                    contact@edwardiaz.dev
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Haz clic para enviar un email
                  </p>
                </div>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/BOTOOM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-800 hover:shadow-lg transition-all group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <Github className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    GitHub
                  </h4>
                  <p className="text-gray-700 font-medium group-hover:text-gray-900">
                    @BOTOOM
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Revisa mis proyectos y código
                  </p>
                </div>
              </a>

              {/* Portfolio */}
              <a
                href="https://edwardiaz.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Portafolio Web
                  </h4>
                  <p className="text-primary font-medium group-hover:underline">
                    edwardiaz.dev
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Conoce más sobre mi trabajo y experiencia
                  </p>
                </div>
              </a>
            </div>

            {/* Quick Copy Email */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <Coffee className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-gray-900">
                  ¿Prefieres copiar el email?
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <code className="flex-1 px-4 py-3 bg-white rounded-lg text-gray-800 font-mono text-sm border border-gray-200">
                  contact@edwardiaz.dev
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("contact@edwardiaz.dev");
                    const btn = document.getElementById("copy-btn");
                    if (btn) {
                      btn.textContent = "✓ Copiado";
                      setTimeout(() => {
                        btn.textContent = "Copiar";
                      }, 2000);
                    }
                  }}
                  id="copy-btn"
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Sobre el Proyecto
          </h3>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              EventMaple es un proyecto de código abierto creado con el propósito de ayudar 
              a la comunidad a gestionar eventos de manera más eficiente. Si tienes ideas, 
              encuentras algún problema o simplemente quieres contribuir, ¡tu feedback es 
              bienvenido!
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 ¿Tienes una idea?</h4>
                <p className="text-sm text-gray-600">
                  Comparte tus sugerencias para mejorar EventMaple
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">🐛 ¿Encontraste un bug?</h4>
                <p className="text-sm text-gray-600">
                  Ayúdame a mejorar reportando cualquier problema
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">🤝 ¿Quieres colaborar?</h4>
                <p className="text-sm text-gray-600">
                  Siempre estoy abierto a colaboraciones y contribuciones
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">📝 ¿Tienes preguntas?</h4>
                <p className="text-sm text-gray-600">
                  No dudes en contactarme por cualquier consulta
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-3">
            ¡Gracias por usar EventMaple!
          </h3>
          <p className="text-gray-300 mb-6">
            Tu apoyo y feedback son fundamentales para mejorar esta plataforma
          </p>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Conoce más sobre el proyecto
          </Link>
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
