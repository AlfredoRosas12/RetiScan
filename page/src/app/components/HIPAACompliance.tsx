import { ArrowLeft } from 'lucide-react';

interface HIPAAComplianceProps {
  onBack: () => void;
}

export function HIPAACompliance({ onBack }: HIPAAComplianceProps) {
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 text-slate-300 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Cumplimiento HIPAA</h1>
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
          {/* 1. ¿Qué es HIPAA? */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. ¿Qué es HIPAA?</h2>
            <p>
              HIPAA (Health Insurance Portability and Accountability Act) es una ley federal
              de Estados Unidos que establece estándares para la protección de la información
              de salud personal (PHI — Protected Health Information). Su objetivo es garantizar
              la confidencialidad, integridad y disponibilidad de los datos de salud de los pacientes.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 2. Cómo cumple RetiScan */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Cómo RetiScan Cumple con HIPAA</h2>
            <p className="mb-4">RetiScan implementa las siguientes medidas para garantizar el cumplimiento:</p>

            <div className="space-y-6">
              {/* PHI */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <h3 className="text-base font-semibold text-white mb-2">Protección de Datos de Salud (PHI)</h3>
                <p>
                  Toda información de salud identificable, incluyendo imágenes retinianas,
                  resultados de análisis y datos de diagnóstico, es tratada como PHI y está
                  sujeta a las protecciones más estrictas de la normativa.
                </p>
              </div>

              {/* Encriptación */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <h3 className="text-base font-semibold text-white mb-2">Encriptación</h3>
                <p>
                  Los datos se encriptan tanto en tránsito (TLS 1.3) como en reposo (AES-256).
                  Las imágenes retinianas y los resultados de análisis son encriptados antes de
                  ser almacenados en nuestra infraestructura.
                </p>
              </div>

              {/* Controles */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <h3 className="text-base font-semibold text-white mb-2">Controles de Acceso</h3>
                <p>
                  Solo el personal autorizado y los profesionales de salud vinculados a la cuenta
                  pueden acceder a los datos de PHI. Se implementan autenticación multifactor
                  y controles de acceso basados en roles.
                </p>
              </div>

              {/* Auditorías */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <h3 className="text-base font-semibold text-white mb-2">Auditorías de Seguridad</h3>
                <p>
                  Se realizan auditorías periódicas de seguridad para verificar el cumplimiento
                  continuo de las políticas de protección de datos y detectar posibles vulnerabilidades.
                </p>
              </div>

              {/* Acuerdos */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <h3 className="text-base font-semibold text-white mb-2">Acuerdos de Confidencialidad</h3>
                <p>
                  Todo el personal con acceso a PHI firma acuerdos de confidencialidad y recibe
                  capacitación periódica sobre las mejores prácticas de protección de datos de salud.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 3. Derechos del paciente */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Derechos del Paciente bajo HIPAA</h2>
            <p className="mb-4">Los pacientes tienen los siguientes derechos:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li><strong className="text-slate-200">Derecho de acceso:</strong> obtener una copia de su información de salud</li>
              <li><strong className="text-slate-200">Derecho de enmienda:</strong> solicitar correcciones a información inexacta</li>
              <li><strong className="text-slate-200">Derecho de restricción:</strong> limitar ciertos usos o divulgaciones de su PHI</li>
              <li><strong className="text-slate-200">Derecho de contabilidad:</strong> recibir un registro de divulgaciones de su PHI</li>
              <li><strong className="text-slate-200">Derecho de notificación:</strong> ser notificado en caso de violación de seguridad</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 4. Responsabilidades del usuario */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Responsabilidades del Usuario</h2>
            <p className="mb-4">Como profesional de salud que utiliza RetiScan, eres responsable de:</p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Obtener el consentimiento informado del paciente antes de procesar sus imágenes</li>
              <li>Utilizar la información de diagnóstico de manera ética y profesional</li>
              <li>Reportar inmediatamente cualquier incidente de seguridad o acceso no autorizado</li>
              <li>Cumplir con las políticas de tu institución sobre el uso de herramientas de IA</li>
              <li>Garantizar que los datos de PHI se manejen conforme a la normativa aplicable</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 5. Incidentes de seguridad */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Incidentes de Seguridad</h2>
            <p className="mb-4">
              Si sospechas o detectas un incidente de seguridad que pueda comprometer datos de PHI,
              debes reportarlo inmediatamente a través de:
            </p>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <p>
                <strong className="text-white">Correo de reporte:</strong>{' '}
                <a href="mailto:retiscan2026@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  retiscan2026@gmail.com
                </a>
              </p>
              <p className="mt-2">
                Incluye una descripción detallada del incidente, los datos potencialmente afectados
                y las acciones que ya hayas tomado.
              </p>
            </div>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 6. Nota */}
          <section>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-300 leading-relaxed">
                <strong className="text-amber-200">Nota importante:</strong>{' '}
                El cumplimiento con HIPAA está siendo verificado y auditado independientemente
                por terceros especializados. RetiScan se compromete a mantener y mejorar
                continuamente sus estándares de protección de datos de salud.
              </p>
            </div>
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
