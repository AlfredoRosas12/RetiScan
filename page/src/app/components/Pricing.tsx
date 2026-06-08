import { Check, X, Zap, Building, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';
import { SubscriptionToggle } from '@/app/components/SubscriptionToggle';

const plans = [
  {
    name: 'Especialista',
    billing: 'Mensual',
    icon: Zap,
    description: 'Para oftalmólogos independientes y consultorios pequeños con un solo profesional',
    monthlyPrice: 299,
    annualPrice: 239,
    popular: false,
    gradient: 'from-slate-600 to-slate-700',
    features: [
      { name: 'Escaneos de IA ilimitados', included: true },
      { name: 'Almacenamiento cifrado de expedientes (PHI)', included: true },
      { name: 'Reportes diagnósticos en PDF estándar', included: true },
      { name: 'Cumplimiento HIPAA/NOM-024 garantizado', included: true },
      { name: 'Soporte por email (respuesta < 48h)', included: true },
      { name: '1 cuenta de especialista', included: true },
      { name: 'Multi-usuario (hasta 10 cuentas)', included: false },
      { name: 'Reportes con marca de la clínica', included: false },
      { name: 'Integración PACS / EHR', included: false },
      { name: 'Auditoría de acceso a expedientes', included: false },
      { name: 'Gestor de cuenta dedicado', included: false }
    ],
    freeFeatures: [
      { name: '5 escaneos de IA al mes', included: true },
      { name: 'Resultados en tiempo real (sin almacenamiento)', included: true },
      { name: 'Cumplimiento HIPAA/NOM-024 garantizado', included: true },
      { name: 'Reportes diagnósticos en PDF', included: false },
      { name: 'Almacenamiento cifrado de expedientes', included: false },
      { name: 'Soporte técnico', included: false },
      { name: 'Multi-usuario', included: false }
    ]
  },
  {
    name: 'Clínica',
    billing: 'Anual',
    icon: Building,
    description: 'Para centros médicos y hospitales que requieren acceso multi-profesional y funciones avanzadas',
    monthlyPrice: 899,
    annualPrice: 719,
    popular: true,
    gradient: 'from-cyan-500 to-blue-600',
    features: [
      { name: 'Escaneos de IA ilimitados', included: true },
      { name: 'Almacenamiento cifrado ilimitado', included: true },
      { name: 'Reportes PDF personalizables con marca', included: true },
      { name: 'Cumplimiento HIPAA/NOM-024 garantizado', included: true },
      { name: 'Soporte prioritario 24/7 (teléfono y chat)', included: true },
      { name: 'Hasta 10 cuentas de especialistas', included: true },
      { name: 'Prioridad en procesamiento de IA', included: true },
      { name: 'Integración PACS / EHR', included: true },
      { name: 'Auditoría de acceso a expedientes', included: true },
      { name: 'Panel de analítica clínica avanzada', included: true },
      { name: 'Gestor de cuenta dedicado', included: true }
    ],
    freeFeatures: [
      { name: '5 escaneos de IA al mes', included: true },
      { name: 'Resultados en tiempo real (sin almacenamiento)', included: true },
      { name: 'Cumplimiento HIPAA/NOM-024 garantizado', included: true },
      { name: 'Acceso a documentación médica', included: true },
      { name: 'Reportes PDF personalizables', included: false },
      { name: 'Multi-usuario', included: false },
      { name: 'Integración PACS / EHR', included: false },
      { name: 'Soporte técnico', included: false }
    ]
  }
];

interface PricingProps {
  onSelectPlan?: (plan: string) => void;
}

export function Pricing({ onSelectPlan }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'gratis' | 'mensual' | 'anual'>('gratis');
  const savingsPercentage = 20;

  const title = useScrollReveal('fade-up');
  const toggle = useScrollReveal('fade-up', { delay: 200 });
  const cardLeft = useScrollReveal('fade-right', { delay: 300 });
  const cardRight = useScrollReveal('fade-left', { delay: 500 });
  const bottomInfo = useScrollReveal('fade-up', { delay: 300 });

  return (
    <section
      id="suscripcion"
      className="relative py-16 lg:py-20 text-white overflow-hidden noise-overlay animated-gradient"
      style={{
        background: 'linear-gradient(110deg, #001a4d 0%, #0044cc 25%, #00ccff 50%, #0044cc 75%, #001a4d 100%)',
        backgroundSize: '300% 300%',
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-block px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
            <span className="text-xs font-semibold text-cyan-300">MODELO DE NEGOCIO</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Planes de Suscripción Transparentes
          </SplitText>
          <p className="text-lg text-white">
            Modelos de suscripción flexibles diseñados para prácticas de todos los tamaños.
            Escala según creces con capacidades diagnósticas de nivel empresarial.
          </p>
        </div>

        {/* Billing Toggle - Liquid Morphing */}
        <div ref={toggle.ref} style={toggle.style} className="flex justify-center mb-12 lg:mb-16">
          <SubscriptionToggle billingCycle={billingCycle} onChange={setBillingCycle} />
        </div>

        {/* Pricing Cards — Premium White & Compact Design */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto relative z-10 items-center">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isFree = billingCycle === 'gratis';
            const price = isFree ? 0 : (billingCycle === 'anual' ? plan.annualPrice : plan.monthlyPrice);
            const savings = billingCycle === 'anual' ? (plan.monthlyPrice - plan.annualPrice) : 0;
            const isAnnual = billingCycle === 'anual';

            // En modo gratis usamos el array dedicado de features limitadas
            const features = isFree ? plan.freeFeatures : plan.features;

            return (
              <div
                key={index}
                ref={index === 0 ? cardLeft.ref : cardRight.ref}
                style={index === 0 ? cardLeft.style : cardRight.style}
                className={`relative group flex flex-col ${plan.popular ? 'lg:-mt-4 lg:mb-[-1rem] z-20' : 'z-10'}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 rounded-full shadow-md ring-1 ring-white/60 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-white animate-pulse" />
                      <span className="text-[10px] md:text-[11px] font-extrabold text-white tracking-widest uppercase">Mejor Valor</span>
                    </div>
                  </div>
                )}

                <div
                  className={`relative flex-1 bg-white/95 backdrop-blur-xl rounded-3xl transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col ${plan.popular
                    ? 'border-2 border-cyan-400 shadow-[0_15px_40px_-10px_rgba(6,182,212,0.25)] hover:shadow-[0_20px_50px_-10px_rgba(6,182,212,0.35)] lg:scale-[1.03]'
                    : 'border border-slate-200/80 shadow-lg hover:shadow-xl hover:border-slate-300'
                    }`}
                >
                  {/* Spotlight Hover Effect */}
                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(6,182,212,0.03), transparent 40%)' }}>
                  </div>

                  <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10 w-full">
                    {/* Billing Badge */}
                    <div className="inline-flex self-start items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full mb-5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{isFree ? 'Plan Gratuito' : `Facturación ${plan.billing}`}</span>
                      {plan.popular && billingCycle === 'anual' && (
                        <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-700 text-[10px] font-bold rounded-full">
                          -{savingsPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Icon and Name */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${plan.popular ? 'from-cyan-400 to-blue-600 shadow-md' : plan.gradient} rounded-[14px] flex items-center justify-center border border-white/50 transform group-hover:scale-105 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-2xl font-extrabold tracking-tight ${plan.popular ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600' : 'text-slate-900'}`}>{plan.name}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-6 min-h-[2.5rem] leading-snug">{plan.description}</p>

                    {/* Price Section */}
                    <div className="mb-6 relative">
                      <div className="flex items-end gap-1.5 mb-1.5">
                        {price === 0 ? (
                          <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Gratis</span>
                        ) : (
                          <>
                            <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">${price}</span>
                            <span className="text-lg text-slate-500 mb-1 font-medium">/mes</span>
                          </>
                        )}

                      </div>
                      {isAnnual && savings > 0 && price !== 0 && (
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 line-through decoration-slate-300">${plan.monthlyPrice}/mes</span>
                            <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                              Ahorras ${savings * 12}/año
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-500">
                            Facturado ${price * 12} anual • {savingsPercentage}% desc.
                          </p>
                        </div>
                      )}
                      {!isAnnual && price !== 0 && (
                        <p className="text-[11px] font-medium text-slate-500 mt-1">
                          Facturado mensual • Sin compromiso
                        </p>
                      )}
                      {price === 0 && (
                        <p className="text-[11px] font-medium text-slate-500 mt-1">
                          Acceso básico para evaluar plataforma
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => onSelectPlan?.(isFree ? 'Gratis' : plan.name)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 mb-6 hover:-translate-y-0.5 relative overflow-hidden group/btn ${plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_15px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_20px_rgba(6,182,212,0.5)] border border-cyan-400/50'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                        }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isFree ? 'Comenzar Gratis' : 'Comprar Suscripción'}
                      </span>
                      {plan.popular && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-no-repeat bg-[position:-100%_0] group-hover/btn:bg-[position:200%_0] transition-[background-position] duration-700 ease-in-out"></div>
                      )}
                    </button>

                    {/* Features List */}
                    <div className="space-y-3 mt-auto">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        Qué Incluye
                        <div className="flex-1 h-px bg-slate-100"></div>
                      </div>
                      <div className="space-y-2.5">
                        {features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-3 group/feature">
                            {feature.included ? (
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300 ${plan.popular ? 'bg-cyan-100 text-cyan-600 group-hover/feature:bg-cyan-200' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Check className="w-3 h-3" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-slate-100">
                                <X className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
                              </div>
                            )}
                            <span className={`text-[13px] md:text-sm leading-snug transition-colors duration-300 ${feature.included ? 'text-slate-700 font-medium' : 'text-slate-400 font-normal grayscale opacity-70'}`}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom info */}
        <div ref={bottomInfo.ref} style={bottomInfo.style} className="mt-16 text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-cyan-300" />
              <span>Cancela en cualquier momento, sin preguntas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-cyan-300" />
              <span>Onboarding personalizado incluido</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-cyan-300" />
              <span>Cumplimiento HIPAA garantizado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
