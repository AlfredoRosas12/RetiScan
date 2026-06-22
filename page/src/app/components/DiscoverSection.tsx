import React from 'react';
import { Smartphone, Zap, Shield, Camera, Brain, FileText, Lock, Database, CheckCircle2 } from 'lucide-react';
import loginMockup from '@/assets/LOGIN_RETISCAN.png';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';
import { GlowCard } from '@/app/components/GlowCard';

const featureItems = [
    {
        icon: Smartphone,
        gradient: 'from-cyan-500 to-blue-600',
        title: 'Accesibilidad Multiplataforma',
        desc: 'Despliega en smartphones, tablets y estaciones de trabajo. Una plataforma, dispositivos ilimitados.',
    },
    {
        icon: Zap,
        gradient: 'from-blue-600 to-blue-700',
        title: 'Análisis en Tiempo Real',
        desc: 'Procesa imágenes retinales en menos de 2 minutos con un 94.7% de precisión diagnóstica.',
    },
    {
        icon: Shield,
        gradient: 'from-orange-500 to-orange-600',
        title: 'Conformidad HIPAA',
        desc: 'Almacenamiento seguro con cifrado end-to-end y auditoría de grado médico.',
    },
];

const steps = [
    {
        icon: Camera,
        step: '01',
        title: 'Captura',
        description: 'Imágenes de fondo de ojo desde cualquier dispositivo compatible.'
    },
    {
        icon: Brain,
        step: '02',
        title: 'Análisis',
        description: 'IA avanzada que detecta microaneurismas y hemorragias al instante.'
    },
    {
        icon: FileText,
        step: '03',
        title: 'Reporte',
        description: 'Resultados clínicos completos listos para la toma de decisiones.'
    }
];

export function DiscoverSection() {
    const title = useScrollReveal('fade-up');
    const mockup = useScrollReveal('fade-right', { delay: 200 });
    const features = useScrollReveal('fade-left', { delay: 300 });
    const stepsReveal = useScrollReveal('fade-up', { delay: 400 });
    const integrity = useScrollReveal('fade-up', { delay: 500 });

    return (
        <section id="descubre" className="relative py-20 lg:py-32 bg-background overflow-hidden transition-colors duration-500">
            {/* Decòr */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Intro */}
                <div ref={title.ref} style={title.style} className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <div className="inline-block px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">Nuestra Plataforma</span>
                    </div>
                    <SplitText as="h2" className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                        Descubre RetiScan
                    </SplitText>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Una solución integral que combina potencia diagnóstica, facilidad de uso y
                        seguridad inquebrantable en una sola plataforma web moderna.
                    </p>
                </div>

                {/* Core Showcase */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
                    <div ref={mockup.ref} style={mockup.style} className="relative">
                        {/* Subtle glow */}
                        <div className="absolute inset-0 bg-cyan-400/10 rounded-3xl blur-3xl animate-pulse"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                            <img
                                src={loginMockup}
                                alt="RetiScan Interface"
                                className="w-full h-auto"
                            />
                            {/* Removed heavy border, replaced with subtle ring via shadow or border-px */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-slate-900/5 dark:ring-white/10 rounded-[2rem] pointer-events-none"></div>
                        </div>
                    </div>

                    <div ref={features.ref} style={features.style} className="space-y-10">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Capacidades de Grado Clínico</h3>
                        <div className="space-y-8">
                            {featureItems.map((item, i) => (
                                <div key={i} className="flex gap-5 group">
                                    <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Process Steps */}
                <div ref={stepsReveal.ref} style={stepsReveal.style} className="mb-24 lg:mb-32">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
                            ¿Cómo funciona? Tres pasos hacia un diagnóstico preciso
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <GlowCard key={i} glowColor="rgba(0, 204, 255, 0.08)" className="bg-white dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                                        <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-xs font-black text-blue-600/50 dark:text-blue-400/50 mb-2 tracking-widest uppercase">Paso {step.step}</div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </div>

                {/* Integrity & Compliance */}
                <div ref={integrity.ref} style={integrity.style} className="max-w-5xl mx-auto">
                    <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
                        {/* Decor orbs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                        <div className="grid lg:grid-cols-2 gap-12 relative z-10 items-center">
                            <div>
                                <div className="flex items-center gap-3 text-cyan-400 mb-6">
                                    <Lock className="w-6 h-6" />
                                    <span className="font-bold tracking-widest text-xs uppercase">Seguridad Inquebrantable</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-6">Su Privacidad es Nuestra Prioridad</h3>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                    Implementamos cifrado AES-256 de grado bancario y cumplimos estrictamente
                                    con las normativas HIPAA y NOM. Los datos de sus pacientes están protegidos
                                    bajo una arquitectura de seguridad multi-capa.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {['HIPAA', 'Cifrado E2E', 'AES-256', 'SOC2'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Database, label: 'Backup Diario' },
                                    { icon: Shield, label: 'Audit Log' },
                                    { icon: CheckCircle2, label: 'Certificación' },
                                    { icon: Lock, label: 'Acceso Seguro' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <item.icon className="w-8 h-8 text-cyan-400 mb-3" />
                                        <span className="text-sm font-bold">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
