import { Smartphone, Cloud, Wifi, Zap, Shield, Activity } from 'lucide-react';
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
    <section id="producto" className="relative py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-block px-3 py-1.5 bg-cyan-50 rounded-full mb-4">
            <span className="text-xs font-semibold text-cyan-700">EL PRODUCTO</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            La Potencia de la PWA de RetiScan
          </SplitText>
          <p className="text-lg text-slate-600">
            Una plataforma diagnóstica basada en la nube que transforma cualquier dispositivo
            en una estación profesional de screening de retinopatía. Despliega al instante, escala sin esfuerzo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left - Mobile App Mockup */}
          <div ref={phone.ref} style={phone.style} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl blur-3xl"></div>

            {/* Phone Frame */}
            <div className="relative max-w-[220px] sm:max-w-[250px] mx-auto">
              <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 md:border-8 border-slate-800 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-slate-900 h-8 flex items-center justify-center">
                    <div className="w-32 h-5 bg-slate-800 rounded-full"></div>
                  </div>

                  {/* App Content */}
                  <div className="bg-gradient-to-br from-slate-50 to-white">
                    {/* App Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Activity className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-[10px] opacity-80">RetiScan PWA</div>
                            <div className="font-bold text-sm">Panel de Control</div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-white/20 rounded-xl backdrop-blur-sm"></div>
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                          <div className="text-xl font-bold">127</div>
                          <div className="text-[10px] opacity-80">Escaneos Hoy</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
                          <div className="text-xl font-bold">8</div>
                          <div className="text-[10px] opacity-80">Alto Riesgo</div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Scans */}
                    <div className="p-4 space-y-2">
                      <div className="text-xs font-semibold text-slate-900 mb-2">Análisis Recientes</div>

                      {[
                        { id: '4721', time: '2 min', risk: 'Bajo Riesgo', riskColor: 'green', barGradient: 'from-green-400 to-emerald-500', imgGradient: 'from-cyan-100 to-blue-100' },
                        { id: '4720', time: '5 min', risk: 'Alto Riesgo', riskColor: 'orange', barGradient: 'from-orange-400 to-red-500', imgGradient: 'from-orange-100 to-red-100' },
                      ].map((scan) => (
                        <div key={scan.id} className="bg-white rounded-xl p-3 shadow border border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 bg-gradient-to-br ${scan.imgGradient} rounded-lg flex-shrink-0`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-900">Paciente #{scan.id}</div>
                              <div className="text-[10px] text-slate-500">Hace {scan.time}</div>
                            </div>
                            <div className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-${scan.riskColor}-100 text-${scan.riskColor}-700 whitespace-nowrap`}>
                              {scan.risk}
                            </div>
                          </div>
                          <div className={`h-1.5 bg-gradient-to-r ${scan.barGradient} rounded-full`}></div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Nav */}
                    <div className="border-t border-slate-200 p-4">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg"></div>
                          <div className="w-8 h-1 bg-cyan-500 rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Cloud className="w-8 h-8 text-cyan-600" />
                  <div>
                    <div className="text-xs text-slate-500">En la Nube</div>
                    <div className="text-sm font-bold text-slate-900">Siempre Activo</div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 top-2/3 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Wifi className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-xs text-slate-500">Funciona Offline</div>
                    <div className="text-sm font-bold text-slate-900">Tecnología PWA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Features */}
          <div className="space-y-8">
            <div ref={features.ref} style={features.style}>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Poder Diagnóstico Empresarial en Tu Bolsillo
              </h3>
              <p className="text-lg text-slate-600 leading-relaxed">
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
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                      <p className="text-slate-600">{feat.desc}</p>
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