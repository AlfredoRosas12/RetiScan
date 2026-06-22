import { Camera, Brain, FileText } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';
import { GlowCard } from '@/app/components/GlowCard';

const steps = [
  {
    icon: Camera,
    step: '01',
    title: 'Captura de Imagen Retinal',
    description: 'Captura imágenes de fondo de ojo de alta resolución usando cámaras de smartphone, cámaras de fondo de ojo o dispositivos de imagen integrados. Nuestra aplicación web es compatible con múltiples dispositivos y asegura la mejor calidad de imagen.',
    gradient: 'from-cyan-500 to-cyan-600',
    glowColor: 'rgba(0, 204, 255, 0.12)'
  },
  {
    icon: Brain,
    step: '02',
    title: 'Análisis Inteligente Avanzado',
    description: 'Nuestra inteligencia artificial, entrenada con más de 1.2M de imágenes validadas, analiza automáticamente señales críticas como microaneurismas y hemorragias para evaluar el estado de la salud visual.',
    gradient: 'from-blue-600 to-blue-700',
    glowColor: 'rgba(37, 99, 235, 0.12)'
  },
  {
    icon: FileText,
    step: '03',
    title: 'Generación de Reporte Clínico',
    description: 'Recibe reportes diagnósticos completos con gradación de severidad ETDRS, hallazgos anotados, recomendaciones de referencia e historial de paciente rastreable—todo conforme a HIPAA y listo para auditoría.',
    gradient: 'from-orange-500 to-orange-600',
    glowColor: 'rgba(249, 115, 22, 0.12)'
  }
];

export function HowItWorks() {
  const card0 = useScrollReveal('fade-up', { delay: 100 });
  const card1 = useScrollReveal('fade-up', { delay: 300 });
  const card2 = useScrollReveal('fade-up', { delay: 500 });
  const cardReveals = [card0, card1, card2];
  const trust = useScrollReveal('zoom-in', { delay: 200 });

  return (
    <section id="como-funciona" className="relative py-16 lg:py-20 bg-white dark:bg-background overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-block px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">FLUJO CLÍNICO</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Proceso Diagnóstico Optimizado
          </SplitText>
          <SplitText as="p" className="text-lg text-slate-600 dark:text-slate-400" baseDelay={200} stagger={50}>
            Desde la captura de imagen hasta el apoyo en decisiones clínicas en menos de 2 minutos. Integra evaluaciones inteligentes sin interrupciones en tu flujo de trabajo existente.
          </SplitText>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const reveal = cardReveals[index];
            return (
              <div key={index} ref={reveal.ref} style={reveal.style} className="relative group h-full">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 lg:top-20 left-[60%] w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 z-0"></div>
                )}

                <GlowCard glowColor={step.glowColor} className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 lg:p-8 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default h-full backdrop-blur-sm">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg group-hover:scale-110 transition-transform duration-300 z-20">
                    <span className="text-xs lg:text-sm font-bold text-slate-700 dark:text-slate-300">{step.step}</span>
                  </div>

                  {/* Icon with glow */}
                  <div className="relative mb-5 lg:mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                    <div className={`relative w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2.5 lg:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm lg:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </GlowCard>
              </div>
            );
          })}
        </div>

        {/* Trust indicator */}
        <div ref={trust.ref} style={trust.style} className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-full transition-colors duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            <span className="text-xs md:text-sm font-medium text-green-900 dark:text-green-400 text-left">
              Dispositivo Médico FDA Clase II • 94.7% Sensibilidad • 97.3% Especificidad
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}