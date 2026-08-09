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
              El responsable del tratamiento de tus datos personales es RetiScan, una plataforma
              web para el análisis de imágenes de retina mediante inteligencia artificial, diseñada
              para apoyar a profesionales de la salud en la detección temprana de retinopatía diabética.
            </p>
            <p className="mt-2">
              Para consultas relacionadas con esta política, puedes contactarnos a:{' '}
              <a href="mailto:retiscan2026@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                retiscan2026@gmail.com
              </a>
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 2. Qué es RetiScan */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Qué es RetiScan</h2>
            <p>
              RetiScan es una aplicación web que utiliza inteligencia artificial para analizar
              imágenes de retina y detectar posibles signos de retinopatía diabética. Está dirigida
              a médicos que pueden capturar o subir imágenes de sus pacientes, y a pacientes que
              desean revisar su salud visual. La aplicación genera resultados orientativos que
              ayudan al médico a tomar decisiones, pero no reemplaza un diagnóstico profesional.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 3. Datos que recopilamos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Datos que Recopilamos</h2>
            <p className="mb-4">
              Recopilamos información dependiendo del tipo de usuario que seas:
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-200 mb-2">Si eres Médico:</p>
                <ul className="space-y-1 ml-4 list-disc list-outside">
                  <li>Nombre completo</li>
                  <li>Correo electrónico</li>
                  <li>Contraseña (almacenada de forma encriptada)</li>
                  <li>Cédula Profesional</li>
                  <li>Especialidad médica</li>
                  <li>Institución o clínica donde labora</li>
                  <li>Teléfono de contacto</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-200 mb-2">Si eres Paciente:</p>
                <ul className="space-y-1 ml-4 list-disc list-outside">
                  <li>Nombre completo</li>
                  <li>Fecha de nacimiento</li>
                  <li>Género</li>
                  <li>Correo electrónico</li>
                  <li>Teléfono de contacto</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-slate-200 mb-2">Para ambos usuarios:</p>
                <ul className="space-y-1 ml-4 list-disc list-outside">
                  <li>Imágenes de retina capturadas o subidas para su análisis</li>
                  <li>Resultados generados por la inteligencia artificial</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 4. Cómo usamos tus datos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Cómo Usamos tus Datos</h2>
            <p className="mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Analizar las imágenes de retina que subes para detectar signos de retinopatía diabética</li>
              <li>Generar resultados orientativos que ayuden al médico en su evaluación</li>
              <li>Crear reportes y expedientes de cada análisis realizado</li>
              <li>Gestionar tu cuenta y mantener tu sesión activa</li>
              <li>Enviarte notificaciones importantes sobre el servicio</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 5. Cómo protegemos tu información */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Cómo Protegemos tu Información</h2>
            <p>
              Tomamos medidas de seguridad para cuidar tus datos. Las contraseñas se guardan
              encriptadas, el acceso a la plataforma requiere iniciar sesión, y cada usuario
              solo puede ver la información que le corresponde. Almacenamos los datos en
              servidores seguros con protección de acceso.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 6. Inteligencia Artificial */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Inteligencia Artificial</h2>
            <p className="mb-4">
              Las imágenes de retina que subes son analizadas por un sistema de inteligencia
              artificial que hace lo siguiente:
            </p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Verifica que la imagen sea clara y esté bien enfocada</li>
              <li>Revisa la imagen buscando señales de retinopatía diabética</li>
              <li>Clasifica el grado de severidad detectado</li>
              <li>Identifica posibles lesiones como microaneurismas o hemorragias</li>
            </ul>
            <p className="mt-4">
              <strong className="text-slate-200">Es importante que sepas que:</strong>
            </p>
            <ul className="space-y-2 ml-4 list-disc list-outside">
              <li>Los resultados son <strong className="text-slate-200">orientativos</strong>, no un diagnóstico definitivo</li>
              <li>La inteligencia artificial <strong className="text-slate-200">no reemplaza</strong> la valoración de un médico</li>
              <li>El médico es quien debe interpretar y validar los resultados</li>
            </ul>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 7. Tus derechos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Tus Derechos (ARCO)</h2>
            <p className="mb-4">
              Tienes derecho a:
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

          {/* 8. Cuánto guardamos tus datos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Cuánto Guardamos tus Datos</h2>
            <p>
              Conservamos tu información mientras tu cuenta esté activa en la plataforma.
              Sieliminas tu cuenta, tus datos serán eliminados de manera segura.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 9. Dónde se almacenan */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Dónde se Almacenan los Datos</h2>
            <p>
              Todos los datos se almacenan en servidores ubicados dentro de la República
              Mexicana. No se transfieren a otros países.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 10. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Cookies</h2>
            <p>
              RetiScan utiliza cookies para mantener tu sesión activa, recordar tus preferencias
              y mejorar tu experiencia dentro de la plataforma. Puedes configurar las cookies
              desde tu navegador.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 11. Cambios */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Cambios en esta Política</h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier
              momento. Los cambios serán publicados en esta página con la fecha de la última
              actualización. Te recomendamos revisarla periódicamente.
            </p>
          </section>

          <div className="border-t border-slate-700/50" />

          {/* 12. Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">12. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política de privacidad o sobre el tratamiento de
              tus datos personales, contáctanos a través de:{' '}
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
