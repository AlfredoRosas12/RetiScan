import { Award, Users, LineChart, Shield } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';
import { SplitText } from '@/app/components/SplitText';

export function TrustSection() {
  const image = useScrollReveal('fade-right', { delay: 100 });
  const content = useScrollReveal('fade-left', { delay: 200 });
  const s0 = useScrollReveal('zoom-in', { delay: 300 });
  const s1 = useScrollReveal('zoom-in', { delay: 450 });
  const s2 = useScrollReveal('zoom-in', { delay: 600 });
  const s3 = useScrollReveal('zoom-in', { delay: 750 });
  const statReveals = [s0, s1, s2, s3];

  const patients = useCountUp(50, { suffix: 'K+', duration: 1800 });
  const accuracy = useCountUp(94.7, { decimals: 1, suffix: '%', duration: 2200 });
  const satisfaction = useCountUp(98, { suffix: '%', duration: 2000 });

  const stats = [
    { icon: Users, displayValue: patients.display, displayRef: patients.ref, label: 'Pacientes Analizados' },
    { icon: Award, displayValue: accuracy.display, displayRef: accuracy.ref, label: 'Precisión del Modelo' },
    { icon: LineChart, displayValue: satisfaction.display, displayRef: satisfaction.ref, label: 'Satisfacción de Usuarios' },
    { icon: Shield, displayValue: 'HIPAA', displayRef: null, label: 'Certificado de Seguridad' }
  ];

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left - Image */}
          <div ref={image.ref} style={image.style} className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] transition-shadow duration-500">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjkzMTIxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Profesional médico usando RetiScan"
                className="w-full h-auto object-cover aspect-video max-h-[360px]"
              />
            </div>

            {/* Floating credential badge */}
            <div className="absolute -bottom-6 -right-6 lg:-right-4 bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-slate-200 hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">Certificación</div>
                  <div className="text-sm font-bold text-slate-900">FDA Aprobado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div ref={content.ref} style={content.style}>
              <div className="inline-block px-3 py-1.5 bg-blue-50 rounded-full mb-4">
                <span className="text-xs font-semibold text-blue-700">CONFIANZA MÉDICA</span>
              </div>
              <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Respaldado por Profesionales de la Salud
              </SplitText>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                RetiScan ha sido desarrollado en colaboración con oftalmólogos líderes
                y entrenado con millones de imágenes retinales validadas clínicamente.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Nuestra tecnología de inteligencia artificial ha demostrado resultados
                comparables a especialistas en la detección temprana de retinopatía diabética,
                ayudando a prevenir la pérdida de visión en miles de pacientes.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 pt-2">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const reveal = statReveals[index];
                return (
                  <div key={index} ref={reveal.ref} style={reveal.style} className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <Icon className="w-8 h-8 text-cyan-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <div
                      ref={stat.displayRef as React.RefObject<HTMLDivElement> | null}
                      className="text-3xl font-bold text-slate-900 mb-1 tabular-nums"
                    >
                      {stat.displayValue}
                    </div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
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