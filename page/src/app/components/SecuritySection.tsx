import { Shield, Lock, Database, FileCheck, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';
import { GlowCard } from '@/app/components/GlowCard';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Privacidad Total del Paciente',
    description: 'Toda la información médica está blindada bajo los más altos estándares éticos y legales, asegurando que solo tú y tu equipo autorizado tengan acceso.'
  },
  {
    icon: Lock,
    title: 'Bóveda de Datos Inviolable',
    description: 'Implementamos tecnología de protección avanzada para que los expedientes de tus pacientes estén tan seguros como en una caja fuerte digital de grado bancario.'
  },
  {
    icon: Database,
    title: 'Custodia Profesional de Datos',
    description: 'Vigilamos permanentemente la integridad de la información clínica, garantizando que los datos nunca sean alterados ni se pierdan en el tiempo.'
  },
  {
    icon: FileCheck,
    title: 'Tranquilidad Legal y Normativa',
    description: 'Olvídate de las preocupaciones regulatorias. RetiScan cumple plenamente con las normativas internacionales de protección de datos de salud (HIPAA) para tu respaldo.'
  }
];

const complianceBadges = [
  { name: 'HIPAA', status: 'Certificado' },
  { name: 'GDPR / NOM', status: 'Cumplimiento' },
  { name: 'DATOS PHI', status: 'Protegido' },
  { name: 'SEGURIDAD', status: 'Grado Médico' }
];

export function SecuritySection() {
  const title = useScrollReveal('fade-up');
  const c0 = useScrollReveal('fade-up', { delay: 100 });
  const c1 = useScrollReveal('fade-up', { delay: 250 });
  const c2 = useScrollReveal('fade-up', { delay: 400 });
  const c3 = useScrollReveal('fade-up', { delay: 550 });
  const cardReveals = [c0, c1, c2, c3];
  const promise = useScrollReveal('zoom-in', { delay: 200 });
  const badges = useScrollReveal('fade-up', { delay: 300 });

  return (
    <section id="seguridad" className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-4">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-semibold text-blue-700">CONFIANZA PROFESIONAL</span>
          </div>
          <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Tu Ética Médica, Respaldada por Nuestra Tecnología
          </SplitText>
          <p className="text-lg text-slate-700">
            En RetiScan, proteger la salud y privacidad del paciente no es solo una función técnica, es nuestro compromiso fundamental con tu práctica clínica.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const reveal = cardReveals[index];
            return (
              <div key={index} ref={reveal.ref} style={reveal.style} className="group">
                <GlowCard glowColor="rgba(0, 204, 255, 0.12)" className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 shadow-lg cursor-default h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </GlowCard>
              </div>
            );
          })}
        </div>

        {/* Commitment Highlight - Human Centered */}
        <div ref={promise.ref} style={promise.style} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 mb-12 shadow-xl relative overflow-hidden">
          {/* Subtle decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5}/>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-3">Nuestro Compromiso de Confidencialidad</h3>
              <p className="text-sm md:text-base text-blue-50/90 leading-relaxed max-w-3xl">
                Sabemos que la confianza paciente-médico es sagrada. Por eso, RetiScan ha sido construido sobre una base de ciberseguridad preventiva que garantiza que tú siempre seas el dueño absoluto de los datos clínicos.
              </p>
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                {[
                  'Búsqueda permanente de vulnerabilidades',
                  'Auditorías de seguridad trimestrales',
                  'Protección activa contra intrusiones',
                  'Firma digital de expedientes'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div ref={badges.ref} style={badges.style} className="text-center">
          <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-6 font-primary">Respaldado por Estándares Internacionales</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {complianceBadges.map((badge, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 lg:p-6 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:border-cyan-300 transition-all duration-500 group cursor-default">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <IconCheck badge={badge.name} />
                </div>
                <div className="font-bold text-sm lg:text-base text-slate-900 mb-0.5">{badge.name}</div>
                <div className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">{badge.status}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom Note */}
        <div className="mt-8 lg:mt-12 text-center">
          <p className="text-slate-600 text-sm max-w-3xl mx-auto">
            Todas las medidas de seguridad son verificadas independientemente mediante pruebas de penetración trimestrales
            por expertos certificados y auditorías de seguridad anuales por firmas líderes en ciberseguridad.
          </p>
        </div>
      </div>
    </section>
  );
}

function IconCheck({ badge }: { badge: string }) {
  if (badge === 'HIPAA') return <Lock className="w-5 h-5 text-white" />;
  return <CheckCircle2 className="w-5 h-5 text-white" />;
}