import { Download, RefreshCw, Wifi, Zap, Shield, Globe } from 'lucide-react';
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
    description: 'Análisis en tiempo real con tecnología de optimización PWA'
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
            <span className="text-xs sm:text-sm font-semibold text-cyan-400">PROGRESSIVE WEB APP</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold mb-4">
            Tecnología PWA al Servicio de la Salud
          </SplitText>
          <p className="text-lg text-white">
            Experiencia de aplicación nativa con la flexibilidad de la web. Lo mejor de ambos mundos.
          </p>
        </div>

        {/* Device Mockup Section */}
        <div ref={mockups.ref} style={mockups.style} className="mb-12 lg:mb-16">
          <div className="relative max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Mobile mockup */}
              <div className="relative group max-w-[260px] md:max-w-none mx-auto md:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative bg-slate-800 rounded-[3rem] p-3 border-8 border-slate-700 shadow-2xl group-hover:shadow-[0_30px_60px_-15px_rgba(0,204,255,0.2)] transition-shadow duration-500">
                  <div className="bg-slate-900 rounded-[2.3rem] overflow-hidden">
                    <div className="h-6 bg-slate-900 flex items-center justify-center">
                      <div className="w-24 h-4 bg-slate-800 rounded-full"></div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 min-h-[400px]">
                      <div className="space-y-4">
                        <div className="h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          RetiScan Móvil
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-lg">
                          <div className="w-full h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mb-3"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="bg-white rounded-xl p-3 shadow-lg">
                          <div className="h-2.5 bg-slate-200 rounded w-full mb-2"></div>
                          <div className="h-2.5 bg-slate-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop mockup */}
              <div className="relative group hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative bg-slate-800 rounded-2xl p-2 border-4 border-slate-700 shadow-2xl group-hover:shadow-[0_30px_60px_-15px_rgba(0,204,255,0.2)] transition-shadow duration-500">
                  <div className="bg-slate-900 rounded-xl overflow-hidden">
                    <div className="h-6 bg-slate-800 flex items-center px-3 gap-2 border-b border-slate-700">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 bg-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-400">
                        retiscan.app
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 min-h-[300px]">
                      <div className="space-y-4">
                        <div className="h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center px-4 text-white font-bold text-lg shadow-lg">
                          RetiScan Dashboard
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white rounded-xl p-3 shadow-lg">
                            <div className="w-full h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg mb-3"></div>
                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                          </div>
                          <div className="bg-white rounded-xl p-3 shadow-lg">
                            <div className="w-full h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-3"></div>
                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seamless badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-300">
                <span className="font-bold text-white">Experiencia Perfecta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const reveal = benefitReveals[index];
            return (
              <div key={index} ref={reveal.ref} style={reveal.style} className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-slate-900">{benefit.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
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