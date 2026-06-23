import { ArrowLeft } from 'lucide-react';

interface TermsOfUseProps {
  onBack: () => void;
}

export function TermsOfUse({ onBack }: TermsOfUseProps) {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Términos de Uso</h1>
          <p className="text-sm text-slate-500">Última actualización: 22 de junio de 2026</p>
        </div>

        {/* AI Notice */}
        <div className="mb-10 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-sm text-blue-300 leading-relaxed">
            <strong className="text-blue-200">Aviso de generación asistida por IA:</strong>{' '}
            Este documento ha sido generado con asistencia de inteligencia artificial y
            revisado por profesionales con conocimiento en la materia. Su contenido ofrece
            orientación general y no constituye asesoría legal definitiva.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm leading-relaxed">
          {/* 1. Aceptación */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar RetiScan, aceptas estos Términos de Uso en su totalidad.
              Si no estás de acuerdo con alguno de estos términos, no debes utilizar el servicio.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 2. Descripción del servicio */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Descripción del Servicio</h2>
            <p className="mb-4">RetiScan es una herramienta de apoyo diagnóstico basada en inteligencia artificial que ofrece:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Análisis de imágenes retinianas para la detección de signos de retinopatía diabética</li>
              <li>Generación de reportes orientativos de hallazgos clínicos</li>
              <li>Clasificación de severidad según criterios ETDRS</li>
              <li>Dispositivo médico clase II conforme a la normativa aplicable</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 3. Elegibilidad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Elegibilidad</h2>
            <p>
              RetiScan está diseñado para ser utilizado exclusivamente por profesionales de la salud
              con licencia médica activa. El registro requiere la verificación de credenciales
              profesionales antes de otorgar acceso completo a la plataforma.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 4. Registro */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Registro de Cuenta</h2>
            <p className="mb-4">
              Para utilizar RetiScan, debes crear una cuenta proporcionando información veraz y actualizada.
              Los datos solicitados durante el registro incluyen nombre completo, correo electrónico,
              número de licencia médica, especialidad, institución y teléfono de contacto.
            </p>
            <p>
              Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de
              todas las actividades que ocurran bajo tu cuenta.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 5. Uso aceptable */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Uso Aceptable</h2>
            <p className="mb-4">Al utilizar RetiScan, te comprometes a:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Utilizar el servicio únicamente para fines profesionales legítimos</li>
              <li>No utilizar los resultados como diagnóstico definitivo sin supervisión clínica</li>
              <li>No intentar acceder indebidamente a cuentas de otros usuarios</li>
              <li>No utilizar el servicio para fines diferentes a su propósito diseñado</li>
              <li>Cumplir con todas las leyes y regulaciones aplicables</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 6. Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Propiedad Intelectual</h2>
            <p>
              Todo el contenido, código fuente, modelos de IA, diseños y materiales de RetiScan
              son propiedad de sus desarrolladores y están protegidos por las leyes de propiedad
              intelectual aplicables. No está permitido copiar, modificar o distribuir ningún
              elemento sin autorización expresa.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 7. Descargo de responsabilidad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Descargo de Responsabilidad</h2>
            <p className="mb-4">Es fundamental que entiendas que:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Los resultados generados por RetiScan son <strong className="text-slate-200">orientativos</strong>, no definitivos</li>
              <li>El servicio <strong className="text-slate-200">no sustituye</strong> la consulta con un oftalmólogo certificado</li>
              <li>RetiScan <strong className="text-slate-200">no está destinado</strong> para emergencias médicas</li>
              <li>La precisión diagnóstica puede variar según la calidad de la imagen proporcionada</li>
              <li>Los profesionales de salud son responsables de validar los resultados antes de tomar decisiones clínicas</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 8. Disponibilidad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Disponibilidad del Servicio</h2>
            <p>
              Nos esforzamos por mantener RetiScan disponible de forma continua, pero no garantizamos
              la disponibilidad ininterrumpida. Nos reservamos el derecho de realizar mantenimientos
              programados o suspender el servicio temporalmente por razones técnicas.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 9. Modificaciones */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Modificaciones a los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento.
              Las modificaciones serán efectivas una vez publicadas en esta página. El uso continuado
              del servicio después de los cambios constituye la aceptación de los nuevos términos.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 10. Terminación */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Terminación</h2>
            <p>
              Podemos suspender o cancelar tu acceso a RetiScan si violas estos términos o si
              determinamos que tu uso del servicio representa un riesgo para la plataforma o
              para otros usuarios. También puedes solicitar la eliminación de tu cuenta en cualquier momento.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 11. Limitación */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Limitación de Responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley, RetiScan no será responsable por daños
              indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de usar
              el servicio, incluyendo pero no limitado a pérdidas de datos, diagnósticos incorrectos
              o interrupciones del servicio.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 12. Ley aplicable */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Ley Aplicable</h2>
            <p>
              Estos Términos de Uso se rigen por las leyes de los Estados Unidos Mexicanos.
              Cualquier controversia será resuelta por los tribunales competentes en la jurisdicción
              correspondiente.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 13. Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">13. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos de Uso, contáctanos a través de:{' '}
              <a href="mailto:retiscan2026@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                retiscan2026@gmail.com
              </a>
            </p>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-16 pt-8 border-t border-slate-700/50">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
