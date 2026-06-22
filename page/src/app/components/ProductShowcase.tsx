import { Smartphone, Zap, Shield } from 'lucide-react';
import loginMockup from '@/assets/LOGIN_RETISCAN.png';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';

export function ProductShowcase() {
  const title = useScrollReveal('fade-up');
  const phone = useScrollReveal('fade-right', { delay: 200 });
  const features = useScrollReveal('fade-left', { delay: 300 });
  const feat0 = useScrollReveal('fade-left', { delay: 400 });
  const feat1 = useScrollReveal('fade-left', { delay: 600 });
  const feat2 = useScrollReveal('fade-left', { delay: 800 });
  const featReveals = [feat0, feat1, feat2];

  const featureItems = [
    {
      icon: Smartphone,
      gradient: 'from-cyan-500 to-blue-600',
      title: 'Accesibilidad Multiplataforma',
      desc: 'Despliega en smartphones, tablets y estaciones de trabajo. Una plataforma, dispositivos ilimitados. Perfecto para unidades móviles y prácticas multilocalización.',
    },
    {
      icon: Zap,
      gradient: 'from-blue-600 to-blue-700',
      title: 'Análisis por Aprendizaje Profundo en Tiempo Real',
      desc: 'Nuestra red neuronal convolucional procesa imágenes retinales en menos de 2 minutos, identificando microaneurismas, hemorragias y exudados con 94.7% de precisión.',
    },
    {
      icon: Shield,
      gradient: 'from-orange-500 to-orange-600',
      title: 'Infraestructura Cloud Conforme a HIPAA',
      desc: 'Almacenamiento seguro de expedientes clínicos con cifrado end-to-end, respaldos automáticos y registros de auditoría completos. Todos los centros de datos certificados SOC 2 Type II.',
    },
  ];

  return (
    <section id="producto" className="relative py-16 lg:py-20 bg-background overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-block px-3 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 rounded-full mb-4">
            <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">EL PRODUCTO</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Acceso Instantáneo y Potente
          </SplitText>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Una plataforma diagnóstica basada en la nube que transforma cualquier dispositivo
            en una estación profesional de evaluación. Sin descargas, sin esperas, directo en tu navegador.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left - App Mockup Image */}
          <div ref={phone.ref} style={phone.style} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl blur-3xl"></div>

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-900 dark:border-slate-800 transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={loginMockup}
                alt="Pantalla de inicio de RetiScan en dispositivo móvil"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right - Features */}
          <div className="space-y-8">
            <div ref={features.ref} style={features.style}>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Poder Diagnóstico Empresarial en Tu Bolsillo
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                RetiScan PWA ofrece screening de retinopatía diabética de grado clínico
                mediante una Progressive Web Application accesible desde cualquier dispositivo moderno.
                Sin descargas de tiendas de aplicaciones, sin instalaciones complejas.
              </p>
            </div>

            <div className="space-y-6">
              {featureItems.map((feat, index) => {
                const Icon = feat.icon;
                const reveal = featReveals[index];
                return (
                  <div key={index} ref={reveal.ref} style={reveal.style} className="flex items-start gap-4 group">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}