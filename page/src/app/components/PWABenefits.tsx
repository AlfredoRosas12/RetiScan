import { Download, RefreshCw, Wifi, Zap, Shield, Globe } from 'lucide-react';
import devicesMockup from '@/assets/retiscan-both-mockup-sf.png';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';

const benefits = [
  {
    icon: Download,
    title: 'Sin Descarga',
    description: 'Accede directamente desde tu navegador sin ocupar espacio en tu dispositivo'
  },
  {
    icon: RefreshCw,
    title: 'Siempre Actualizado',
    description: 'Mejoras automáticas con las últimas características y modelos de IA'
  },
  {
    icon: Wifi,
    title: 'Funciona Offline',
    description: 'Captura y analiza incluso sin conexión a internet estable'
  },
  {
    icon: Zap,
    title: 'Ultra Rápido',
    description: 'Análisis en tiempo real con tecnología web moderna optimizada'
  },
  {
    icon: Shield,
    title: 'Seguro y Privado',
    description: 'Datos cifrados con estándares médicos HIPAA'
  },
  {
    icon: Globe,
    title: 'Multiplataforma',
    description: 'Funciona en cualquier dispositivo: móvil, tablet o desktop'
  }
];

export function PWABenefits() {
  const title = useScrollReveal('fade-up');
  const mockups = useScrollReveal('zoom-in', { delay: 200 });
  const b0 = useScrollReveal('fade-up', { delay: 100 });
  const b1 = useScrollReveal('fade-up', { delay: 200 });
  const b2 = useScrollReveal('fade-up', { delay: 300 });
  const b3 = useScrollReveal('fade-up', { delay: 400 });
  const b4 = useScrollReveal('fade-up', { delay: 500 });
  const b5 = useScrollReveal('fade-up', { delay: 600 });
  const benefitReveals = [b0, b1, b2, b3, b4, b5];

  return (
    <section
      id="beneficios"
      className="relative py-16 lg:py-20 text-white overflow-hidden noise-overlay animated-gradient"
      style={{
        background: 'linear-gradient(110deg, #001a4d 0%, #0044cc 25%, #00ccff 50%, #0044cc 75%, #001a4d 100%)',
        backgroundSize: '300% 300%',
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-block px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <span className="text-xs sm:text-sm font-semibold text-cyan-400">ACCESO INSTANTÁNEO</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold mb-4">
            Tecnología Moderna al Servicio de la Salud
          </SplitText>
          <p className="text-lg text-white">
            La agilidad de un sitio web con la potencia de una herramienta profesional. Sin instalaciones.
          </p>
        </div>

        {/* Unified Mockup Section */}
        <div ref={mockups.ref} style={mockups.style} className="mb-12 lg:mb-16 text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <img
              src={devicesMockup}
              alt="RetiScan funcionando en múltiples dispositivos"
              className="relative w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-700 hover:scale-[1.03]"
            />
            {/* Subtle ring overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none"></div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const reveal = benefitReveals[index];
            return (
              <div key={index} ref={reveal.ref} style={reveal.style} className="group relative bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-white dark:hover:border-slate-600 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{benefit.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}