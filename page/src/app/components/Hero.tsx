import { useState } from 'react';
import { Sparkles, Eye, ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useCountUp } from '@/hooks/useCountUp';
import { SplitText } from '@/app/components/SplitText';
import { MagneticButton } from '@/app/components/MagneticButton';
import { DemoModal } from '@/app/components/DemoModal';

export function Hero() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const accuracy = useCountUp(94.7, { decimals: 1, suffix: '%', duration: 2000 });
  const scans = useCountUp(50, { suffix: 'K+', duration: 1800 });

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
    >
      <div
        className="absolute inset-0 animated-gradient"
        style={{
          background: 'linear-gradient(135deg, #001a4d 0%, #003399 15%, #0066cc 30%, #00ccff 50%, #0066cc 70%, #003399 85%, #001a4d 100%)',
          backgroundSize: '300% 300%',
        }}
      />

      {/* Subtle tech pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300/10 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content — dramatic staggered entrance */}
        <div className="space-y-6">
          {/* Badge — slides up with blur */}
          <div className="animate-blur-in delay-300">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-xs sm:text-sm font-medium text-white">Detección de Retinopatía Diabética por IA</span>
            </div>
          </div>

          {/* WORD BY WORD animated title */}
          <SplitText
            as="h1"
            className="text-4xl lg:text-5xl font-bold leading-tight text-balance text-white max-w-4xl mx-auto lg:mx-0"
            baseDelay={500}
            stagger={80}
          >
            Potencia Tu Clínica con Detección por IA
          </SplitText>

          {/* Subtitle with shimmer gradient */}
          <div className="animate-slide-up delay-800">
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
              Preciso, rápido y accesible desde cualquier dispositivo.
              <span className="font-bold text-shimmer bg-gradient-to-r from-amber-100 via-white to-amber-100 bg-clip-text text-transparent drop-shadow-sm">
                {' '}Screening de nivel empresarial{' '}
              </span>
              con análisis de aprendizaje profundo.
            </p>
          </div>

          {/* Buttons — dramatic slide up */}
          <div className="animate-slide-up delay-1000 flex flex-col sm:flex-row gap-3 pt-2">
            <MagneticButton
              className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:-translate-y-2 active:translate-y-0 transition-all duration-500 flex items-center justify-center gap-3 text-base sm:w-auto w-full"
              href="#suscripcion"
            >
              <Eye className="w-5 h-5" />
              <span>Ver Planes</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </MagneticButton>

            <MagneticButton
              className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-900 shadow-xl hover:shadow-2xl rounded-xl font-bold hover:-translate-y-2 active:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 text-base sm:w-auto w-full"
              onClick={() => setIsDemoOpen(true)}
            >
              <Play className="w-5 h-5" />
              Ver Demo Interactiva
            </MagneticButton>
          </div>

          {/* Stats — counter animation */}
          <div className="animate-slide-up delay-1200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <div className="text-center sm:text-left py-2 sm:py-0">
              <div ref={accuracy.ref as React.RefObject<HTMLDivElement>} className="text-3xl font-bold text-white mb-0.5 tabular-nums">
                {accuracy.display}
              </div>
              <div className="text-xs text-white/80">Precisión Diagnóstica</div>
            </div>
            <div className="text-center sm:text-center py-4 sm:py-0">
              <div ref={scans.ref as React.RefObject<HTMLDivElement>} className="text-3xl font-bold text-white mb-0.5 tabular-nums">
                {scans.display}
              </div>
              <div className="text-xs text-white/80">Análisis Procesados</div>
            </div>
            <div className="text-center sm:text-right py-4 sm:py-0">
              <div className="text-3xl font-bold text-white mb-0.5">&lt;2m</div>
              <div className="text-xs text-white/80">Tiempo Promedio</div>
            </div>
          </div>
        </div>

        {/* Right — Image with dramatic scale entrance */}
        <div className="relative animate-scale-in delay-700">
          <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl animate-float-slow"></div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 hover:shadow-[0_40px_80px_-20px_rgba(0,204,255,0.3)] transition-shadow duration-700">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1080"
              alt="Doctora amigable revisando análisis médicos en tablet"
              className="w-full h-auto object-cover aspect-video max-h-[400px]"
            />

            {/* Floating AI card */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-slate-200/50 animate-float">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">IA</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Estado del Análisis</div>
                  <div className="text-sm font-bold text-slate-900">Procesando...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating orbs with continuous animation */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm animate-float">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 -right-6 w-12 h-12 bg-white/10 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm animate-float-delayed">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  );
}