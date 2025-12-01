import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones - EventMaple",
  description: "Términos y condiciones de uso de EventMaple",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Última actualización: {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
          {/* 1. Aceptación de los Términos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Aceptación de los Términos
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Al acceder y utilizar EventMaple (en adelante, &ldquo;la Plataforma&rdquo; o &ldquo;el Servicio&rdquo;), 
                usted acepta cumplir y estar vinculado por estos Términos y Condiciones. 
                Si no está de acuerdo con alguna parte de estos términos, por favor no utilice 
                nuestros servicios.
              </p>
              <p>
                EventMaple es un proyecto personal sin fines comerciales que proporciona herramientas 
                para la gestión de eventos y agendas de forma gratuita.
              </p>
            </div>
          </section>

          {/* 2. Descripción del Servicio */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Descripción del Servicio
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple es una plataforma digital que permite a los usuarios:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crear y gestionar su perfil de usuario</li>
                <li>Explorar y visualizar eventos disponibles</li>
                <li>Registrarse en eventos de su interés</li>
                <li>Marcar y gestionar charlas o sesiones específicas dentro de eventos</li>
                <li>Crear y personalizar su agenda personal de eventos</li>
              </ul>
              <p>
                El servicio se proporciona &ldquo;tal cual&rdquo; y puede estar sujeto a modificaciones, 
                mejoras o interrupciones sin previo aviso.
              </p>
            </div>
          </section>

          {/* 3. Registro y Cuenta de Usuario */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Registro y Cuenta de Usuario
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Para utilizar ciertas funciones de la Plataforma, deberá crear una cuenta 
                proporcionando información precisa y completa. Usted se compromete a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Proporcionar información verdadera, actual y completa durante el proceso 
                  de registro
                </li>
                <li>
                  Mantener y actualizar su información de registro para que permanezca 
                  verdadera, actual y completa
                </li>
                <li>
                  Mantener la confidencialidad de su contraseña y ser responsable de todas 
                  las actividades que ocurran bajo su cuenta
                </li>
                <li>
                  Notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta
                </li>
              </ul>
              <p>
                Nos reservamos el derecho de suspender o terminar su cuenta si la información 
                proporcionada es incorrecta, inexacta o incompleta.
              </p>
            </div>
          </section>

          {/* 4. Recopilación y Uso de Datos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Recopilación y Uso de Datos
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Al utilizar EventMaple, usted acepta que recopilemos y procesemos los 
                siguientes datos personales:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Información de cuenta:</strong> Nombre completo y dirección de 
                  correo electrónico
                </li>
                <li>
                  <strong>Datos de eventos:</strong> Información sobre los eventos a los 
                  que se registra
                </li>
                <li>
                  <strong>Preferencias de agenda:</strong> Charlas y sesiones que marca 
                  como favoritas o de interés
                </li>
              </ul>
              <p>
                Estos datos se utilizan exclusivamente para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Gestionar su cuenta y preferencias</li>
                <li>Enviar notificaciones relacionadas con eventos y actualizaciones del servicio</li>
                <li>Personalizar su experiencia en la Plataforma</li>
              </ul>
              <p>
                Para más información sobre cómo manejamos sus datos, consulte nuestra{" "}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Política de Privacidad
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 5. Conducta del Usuario */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Conducta del Usuario
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Usted acepta utilizar la Plataforma únicamente para fines legales y de 
                acuerdo con estos Términos. Está prohibido:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Utilizar el Servicio de manera que pueda dañar, deshabilitar, sobrecargar 
                  o perjudicar la Plataforma
                </li>
                <li>
                  Intentar obtener acceso no autorizado a cualquier parte de la Plataforma
                </li>
                <li>
                  Usar el Servicio para transmitir contenido ilegal, ofensivo o inapropiado
                </li>
                <li>
                  Interferir con el uso y disfrute de la Plataforma por parte de otros usuarios
                </li>
                <li>
                  Utilizar bots, scrapers u otras herramientas automatizadas sin autorización
                </li>
                <li>
                  Copiar, reproducir o distribuir contenido de la Plataforma sin permiso
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Propiedad Intelectual */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Propiedad Intelectual
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Todo el contenido de la Plataforma, incluyendo pero no limitado a texto, 
                gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y 
                compilaciones de datos, es propiedad de EventMaple o sus proveedores de 
                contenido y está protegido por las leyes internacionales de derechos de autor.
              </p>
              <p>
                La información sobre eventos específicos puede ser propiedad de los organizadores 
                respectivos y se muestra con fines informativos.
              </p>
            </div>
          </section>

          {/* 7. Limitación de Responsabilidad */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Limitación de Responsabilidad
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                EventMaple se proporciona como un proyecto personal sin garantías de ningún tipo. 
                En la máxima medida permitida por la ley aplicable:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  No garantizamos que el Servicio será ininterrumpido, oportuno, seguro o 
                  libre de errores
                </li>
                <li>
                  No nos hacemos responsables de la precisión o actualización de la información 
                  sobre eventos proporcionada por terceros
                </li>
                <li>
                  No seremos responsables de ningún daño directo, indirecto, incidental, 
                  especial o consecuente que surja del uso o la imposibilidad de usar el Servicio
                </li>
                <li>
                  No garantizamos que los eventos listados se llevarán a cabo según lo programado
                </li>
              </ul>
              <p>
                El usuario es responsable de verificar directamente con los organizadores 
                de eventos cualquier información crítica antes de tomar decisiones basadas 
                en la información mostrada en la Plataforma.
              </p>
            </div>
          </section>

          {/* 8. Modificaciones del Servicio */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Modificaciones del Servicio
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio 
                (o cualquier parte del mismo) en cualquier momento, con o sin previo aviso. 
                No seremos responsables ante usted o terceros por cualquier modificación, 
                suspensión o interrupción del Servicio.
              </p>
              <p>
                Como proyecto personal, EventMaple puede experimentar períodos de inactividad 
                o cambios significativos en su funcionalidad sin previo aviso.
              </p>
            </div>
          </section>

          {/* 9. Terminación */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Terminación
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Podemos terminar o suspender su acceso a la Plataforma inmediatamente, sin 
                previo aviso o responsabilidad, por cualquier motivo, incluyendo sin limitación 
                si usted incumple estos Términos.
              </p>
              <p>
                Usted puede cerrar su cuenta en cualquier momento contactándonos o eliminando 
                su perfil desde la configuración de su cuenta. Tras la terminación, su derecho 
                a usar el Servicio cesará inmediatamente.
              </p>
            </div>
          </section>

          {/* 10. Ley Aplicable */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Ley Aplicable y Jurisdicción
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables, 
                sin tener en cuenta sus disposiciones sobre conflictos de leyes.
              </p>
              <p>
                Cualquier disputa relacionada con estos Términos o el uso de la Plataforma 
                se resolverá mediante negociación de buena fe entre las partes.
              </p>
            </div>
          </section>

          {/* 11. Cambios a los Términos */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Cambios a los Términos
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Nos reservamos el derecho de modificar estos Términos en cualquier momento. 
                Cuando realicemos cambios, actualizaremos la fecha de &ldquo;última actualización&rdquo; 
                en la parte superior de esta página.
              </p>
              <p>
                Su uso continuado de la Plataforma después de cualquier cambio constituye 
                su aceptación de los nuevos Términos. Le recomendamos revisar periódicamente 
                estos Términos para estar al tanto de cualquier actualización.
              </p>
            </div>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Información de Contacto
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Si tiene preguntas, comentarios o inquietudes sobre estos Términos y Condiciones, 
                puede contactarnos a través de:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p className="font-medium text-gray-900">EventMaple</p>
                <p className="text-gray-700 mt-2">
                  Email:{" "}
                  <a
                    href="mailto:edwardiaz.dev@gmail.com"
                    className="text-primary hover:underline"
                  >
                    edwardiaz.dev@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Agradecimiento */}
          <section className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm">
              Gracias por utilizar EventMaple. Esperamos que nuestra plataforma le ayude 
              a gestionar y disfrutar de sus eventos de manera más eficiente.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Volver al Registro
          </Link>
        </div>
      </div>
    </div>
  );
}
