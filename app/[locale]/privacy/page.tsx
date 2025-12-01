import { Metadata } from "next";
import { ArrowLeft, Shield, Lock, Eye, Server, Mail, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad - EventMaple",
  description: "Política de privacidad y protección de datos de EventMaple",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al registro</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Política de Privacidad
            </h1>
          </div>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tu privacidad es importante para nosotros.</strong> Esta política 
              describe cómo recopilamos, usamos y protegemos tu información personal 
              cuando utilizas EventMaple.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          {/* 1. Introducción */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Eye className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Introducción
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple es un proyecto personal desarrollado con el objetivo de facilitar 
                la gestión de eventos y agendas. Esta Política de Privacidad explica qué 
                información personal recopilamos, cómo la usamos, cómo la protegemos y 
                cuáles son tus derechos respecto a ella.
              </p>
              <p>
                Al utilizar nuestro servicio, aceptas las prácticas descritas en esta política. 
                Si no estás de acuerdo con estas prácticas, por favor no utilices EventMaple.
              </p>
            </div>
          </section>

          {/* 2. Información que Recopilamos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Server className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                2. Información que Recopilamos
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Recopilamos únicamente la información necesaria para proporcionar y mejorar 
                nuestro servicio. Esta información incluye:
              </p>

              <div className="space-y-4">
                {/* Información de Cuenta */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2.1. Información de Cuenta
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Nombre completo:</strong> Para personalizar tu experiencia 
                      y mostrarte como usuario registrado
                    </li>
                    <li>
                      <strong>Dirección de correo electrónico:</strong> Para crear tu 
                      cuenta, autenticación, comunicaciones importantes y recuperación 
                      de contraseña
                    </li>
                    <li>
                      <strong>Contraseña cifrada:</strong> Almacenada de forma segura 
                      mediante hash para proteger tu cuenta
                    </li>
                  </ul>
                </div>

                {/* Datos de Uso */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2.2. Datos de Uso del Servicio
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Eventos registrados:</strong> Lista de eventos en los que 
                      te has registrado o mostrado interés
                    </li>
                    <li>
                      <strong>Charlas marcadas:</strong> Sesiones, talleres o charlas 
                      específicas que has marcado como favoritas o de interés
                    </li>
                    <li>
                      <strong>Preferencias de agenda:</strong> Tu configuración personal 
                      de visualización y organización de eventos
                    </li>
                    <li>
                      <strong>Fechas de actividad:</strong> Registro de cuándo te registras 
                      en eventos o modificas tu agenda
                    </li>
                  </ul>
                </div>

                {/* Datos Técnicos */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2.3. Información Técnica Básica
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Datos de sesión:</strong> Información necesaria para 
                      mantener tu sesión activa de forma segura
                    </li>
                    <li>
                      <strong>Tipo de navegador y dispositivo:</strong> Para optimizar 
                      la experiencia de usuario
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Nota:</strong> No utilizamos cookies de seguimiento ni 
                    herramientas de análisis de terceros.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Cómo Usamos tu Información */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                3. Cómo Usamos tu Información
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Utilizamos la información recopilada exclusivamente para los siguientes 
                propósitos:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Operación del Servicio
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Crear y gestionar tu cuenta</li>
                    <li>• Autenticar tu acceso</li>
                    <li>• Procesar tus registros a eventos</li>
                    <li>• Guardar tus preferencias</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Comunicaciones
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Confirmaciones de registro</li>
                    <li>• Recuperación de contraseña</li>
                    <li>• Notificaciones de eventos</li>
                    <li>• Actualizaciones importantes</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Mejora del Servicio
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Entender patrones de uso</li>
                    <li>• Optimizar funcionalidades</li>
                    <li>• Solucionar problemas técnicos</li>
                    <li>• Desarrollar nuevas características</li>
                  </ul>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Seguridad
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Prevenir uso no autorizado</li>
                    <li>• Detectar actividad sospechosa</li>
                    <li>• Proteger tu cuenta</li>
                    <li>• Cumplir obligaciones legales</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-900">
                  <strong>Compromiso:</strong> NUNCA vendemos, alquilamos ni compartimos 
                  tu información personal con terceros con fines comerciales o de marketing.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Almacenamiento y Seguridad */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lock className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                4. Almacenamiento y Seguridad de Datos
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                La seguridad de tu información es una prioridad para nosotros. Implementamos 
                medidas técnicas y organizativas para proteger tus datos:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cifrado</h4>
                    <p className="text-sm">
                      Todas las contraseñas se almacenan utilizando algoritmos de hash 
                      seguros. Las conexiones a nuestra plataforma utilizan HTTPS.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Infraestructura Segura</h4>
                    <p className="text-sm">
                      Utilizamos servicios de hosting confiables (Supabase) que cumplen 
                      con estándares de seguridad de la industria.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Acceso Restringido</h4>
                    <p className="text-sm">
                      El acceso a los datos está limitado y protegido. Solo el administrador 
                      del proyecto tiene acceso para mantenimiento y soporte técnico.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-green-100 rounded">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Minimización de Datos</h4>
                    <p className="text-sm">
                      Solo recopilamos y almacenamos la información estrictamente necesaria 
                      para el funcionamiento del servicio.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Importante:</strong> Ningún método de transmisión por Internet es 
                100% seguro. Aunque nos esforzamos por proteger tus datos, no podemos 
                garantizar su seguridad absoluta.
              </p>
            </div>
          </section>

          {/* 5. Compartir Información */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail className="h-5 w-5 text-gray-700" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                5. Compartir y Divulgación de Información
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple no comparte tu información personal con terceros, excepto en 
                las siguientes circunstancias limitadas:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Proveedores de servicios:</strong> Utilizamos Supabase como 
                  proveedor de backend y autenticación. Estos proveedores tienen acceso 
                  a tu información solo para realizar tareas en nuestro nombre y están 
                  obligados a no divulgarla ni usarla para otros fines.
                </li>
                <li>
                  <strong>Requisitos legales:</strong> Si la ley lo requiere o en respuesta 
                  a solicitudes válidas de autoridades públicas.
                </li>
                <li>
                  <strong>Protección de derechos:</strong> Para proteger y defender nuestros 
                  derechos o propiedad, investigar posibles violaciones o proteger la 
                  seguridad de los usuarios.
                </li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-900">
                  <strong>Garantía:</strong> NUNCA vendemos tu información personal. 
                  NUNCA usamos tus datos para publicidad dirigida. NUNCA compartimos 
                  tu información con terceros para marketing.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Retención de Datos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Retención de Datos
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Conservamos tu información personal solo durante el tiempo necesario para 
                cumplir los propósitos descritos en esta política, a menos que la ley 
                requiera o permita un período de retención más largo.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Datos de cuenta activa:</strong> Se mantienen mientras tu cuenta 
                  esté activa y uses el servicio
                </li>
                <li>
                  <strong>Datos tras eliminación de cuenta:</strong> Se eliminan 
                  permanentemente dentro de los 30 días posteriores a la solicitud de 
                  eliminación
                </li>
                <li>
                  <strong>Copias de seguridad:</strong> Pueden conservarse temporalmente 
                  en sistemas de backup, pero se eliminarán en el siguiente ciclo de 
                  limpieza
                </li>
              </ul>
            </div>
          </section>

          {/* 7. Tus Derechos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Tus Derechos de Privacidad
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Tienes los siguientes derechos respecto a tu información personal:
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Derecho de Acceso</h4>
                  <p className="text-sm">
                    Solicitar una copia de los datos personales que tenemos sobre ti
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Derecho de Rectificación</h4>
                  <p className="text-sm">
                    Corregir información inexacta o incompleta
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Derecho de Eliminación</h4>
                  <p className="text-sm">
                    Solicitar la eliminación de tus datos personales
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Derecho de Portabilidad</h4>
                  <p className="text-sm">
                    Recibir tus datos en un formato estructurado y legible
                  </p>
                </div>
              </div>
              <p className="mt-4">
                Para ejercer cualquiera de estos derechos, por favor contáctanos a través 
                de los medios indicados al final de esta política.
              </p>
            </div>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Cookies y Tecnologías Similares
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple utiliza cookies esenciales únicamente para el funcionamiento 
                básico del servicio:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies de sesión:</strong> Necesarias para mantener tu sesión 
                  activa y asegurar que permaneces autenticado mientras navegas
                </li>
                <li>
                  <strong>Cookies de autenticación:</strong> Para verificar tu identidad 
                  de manera segura
                </li>
              </ul>
              <p>
                <strong>No utilizamos:</strong> Cookies de seguimiento, cookies de 
                publicidad, herramientas de análisis de terceros (como Google Analytics), 
                ni píxeles de seguimiento.
              </p>
            </div>
          </section>

          {/* 9. Menores de Edad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Privacidad de Menores
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple no está dirigido a menores de 16 años. No recopilamos 
                intencionalmente información personal de menores de 16 años.
              </p>
              <p>
                Si eres padre o tutor y descubres que tu hijo nos ha proporcionado 
                información personal, contáctanos inmediatamente para que podamos 
                eliminarla de nuestros sistemas.
              </p>
            </div>
          </section>

          {/* 10. Cambios a esta Política */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Cambios a esta Política de Privacidad
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. 
                Te notificaremos cualquier cambio publicando la nueva política en esta 
                página y actualizando la fecha de &ldquo;última actualización&rdquo;.
              </p>
              <p>
                Te recomendamos revisar periódicamente esta Política para estar informado 
                sobre cómo protegemos tu información. Los cambios son efectivos cuando se 
                publican en esta página.
              </p>
            </div>
          </section>

          {/* 11. Transferencias Internacionales */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Transferencias Internacionales
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Tu información puede ser transferida y mantenida en servidores ubicados 
                fuera de tu país de residencia. Estos servidores pueden estar en países 
                con leyes de protección de datos diferentes a las de tu jurisdicción.
              </p>
              <p>
                Al usar EventMaple, consientes la transferencia de tu información a estos 
                servidores. Nos aseguramos de que nuestros proveedores de servicios cumplan 
                con estándares adecuados de protección de datos.
              </p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contáctanos
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Si tienes preguntas, inquietudes o solicitudes sobre esta Política de 
                Privacidad o el manejo de tus datos personales, no dudes en contactarnos:
              </p>
              <div className="bg-gradient-to-br from-primary/10 to-blue-50 border border-primary/20 rounded-lg p-6 mt-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Proyecto:</strong> EventMaple
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:edwardiaz.dev@gmail.com"
                      className="text-primary hover:underline font-medium"
                    >
                      edwardiaz.dev@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Responderemos a tu solicitud lo antes posible, generalmente dentro 
                    de 7 días hábiles.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compromiso Final */}
          <section className="border-t border-gray-200 pt-6">
            <div className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Nuestro Compromiso con tu Privacidad
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                En EventMaple, entendemos que tu confianza es fundamental. Nos comprometemos 
                a ser transparentes sobre cómo manejamos tus datos, a proteger tu información 
                con las mejores prácticas de seguridad disponibles, y a respetar tus derechos 
                de privacidad en todo momento. Tu privacidad no es negociable.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Volver al Registro
          </Link>
          <p className="text-sm text-gray-600">
            ¿Tienes preguntas?{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              Ver Términos y Condiciones
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
