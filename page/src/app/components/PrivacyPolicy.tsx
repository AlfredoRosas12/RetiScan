import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
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
          {/* 1. Responsable */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Información del Responsable</h2>
            <p>
              El responsable del tratamiento de los datos personales es RetiScan,
              herramienta de inteligencia artificial dedicada a la detección temprana
              de retinopatía diabética a través del análisis de imágenes retinianas.
            </p>
            <p className="mt-2">
              Para consultas relacionadas con esta política, puedes contactarnos a:{' '}
              <a href="mailto:retiscan2026@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                retiscan2026@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 2. Datos recopilados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Datos Personales Recopilados</h2>
            <p className="mb-4">RetiScan recopila los siguientes datos personales durante el registro y uso del servicio:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li><strong className="text-slate-200">Nombre completo:</strong> nombre, apellido paterno y materno</li>
              <li><strong className="text-slate-200">Correo electrónico</strong></li>
              <li><strong className="text-slate-200">Contraseña:</strong> almacenada de forma encriptada</li>
              <li><strong className="text-slate-200">Número de licencia médica</strong></li>
              <li><strong className="text-slate-200">Especialidad médica</strong></li>
              <li><strong className="text-slate-200">Institución o clínica</strong></li>
              <li><strong className="text-slate-200">Teléfono de contacto</strong></li>
              <li><strong className="text-slate-200">Imágenes retinianas:</strong> utilizadas exclusivamente para el análisis de IA</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 3. Finalidad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Finalidad del Tratamiento</h2>
            <p className="mb-4">Los datos personales son tratados para las siguientes finalidades:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Prestación del servicio de análisis de retinopatía diabética mediante inteligencia artificial</li>
              <li>Gestión de la cuenta de usuario profesional</li>
              <li>Comunicaciones relacionadas con el servicio, incluyendo actualizaciones y notificaciones</li>
              <li>Cumplimiento de obligaciones legales y regulatorias en materia de salud</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 4. Base legal */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Base Legal del Tratamiento</h2>
            <p>
              El tratamiento de datos se fundamenta en el consentimiento explícito del usuario
              al registrarse en la plataforma, así como en la relación contractual necesaria
              para la prestación del servicio de análisis diagnóstico asistido por IA.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 5. Derechos ARCO */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Derechos ARCO</h2>
            <p className="mb-4">
              Tienes derecho a ejercer tus derechos ARCO en cualquier momento:
            </p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li><strong className="text-slate-200">Acceso:</strong> conocer qué datos personales tenemos sobre ti</li>
              <li><strong className="text-slate-200">Rectificación:</strong> corregir datos inexactos o incompletos</li>
              <li><strong className="text-slate-200">Cancelación:</strong> solicitar la eliminación de tus datos cuando ya no sean necesarios</li>
              <li><strong className="text-slate-200">Oposición:</strong> oponerte al tratamiento de tus datos para fines específicos</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contacta a{' '}
              <a href="mailto:retiscan2026@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                retiscan2026@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 6. Medidas de seguridad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Medidas de Seguridad</h2>
            <p>
              RetiScan implementa medidas de seguridad técnicas y administrativas para proteger
              tus datos personales, incluyendo encriptación de datos en tránsito y en reposo,
              controles de acceso restringido, y auditorías periódicas de seguridad.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 7. Uso de IA */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Uso de Inteligencia Artificial</h2>
            <p className="mb-4">
              Las imágenes retinianas proporcionadas son procesadas por modelos de inteligencia
              artificial entrenados para detectar signos de retinopatía diabética. Es importante
              que sepas que:
            </p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Los resultados generados por la IA son orientativos y deben ser interpretados por un profesional certificado</li>
              <li>La inteligencia artificial asiste en el proceso diagnóstico pero no reemplaza el juicio clínico</li>
              <li>Los modelos de IA continúan en proceso de validación y mejora continua</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 8. Conservación */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Conservación de Datos</h2>
            <p>
              Los datos personales serán conservados mientras el usuario mantenga una cuenta activa
              en la plataforma, o mientras sea necesario para cumplir con las finalidades descritas
              en esta política y las obligaciones legales aplicables.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 9. Transferencias */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Transferencias Internacionales</h2>
            <p>
              En la actualidad, los datos se procesan en servidores dentro de la República Mexicana.
              En caso de que se requieran transferencias internacionales en el futuro, se solicitará
              tu consentimiento previo y se garantizarán las medidas de protección adecuadas.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 10. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Cookies y Tecnologías de Rastreo</h2>
            <p>
              RetiScan utiliza cookies y tecnologías similares para mejorar la experiencia del usuario,
              mantener sesiones activas y analizar el uso de la plataforma. Puedes configurar tus
              preferencias de cookies desde tu navegador.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 11. Cambios */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
              Los cambios serán publicados en esta página con la fecha de la última actualización.
              Te recomendamos revisar periódicamente esta política.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 12. Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad o sobre el tratamiento de tus
              datos personales, contáctanos a través de:{' '}
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
