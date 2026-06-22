import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SplitText } from '@/app/components/SplitText';

const faqs = [
    {
        question: "¿Qué es RetiScan?",
        answer: "RetiScan es una plataforma inteligente diseñada para ayudar a profesionales de la salud a detectar señales tempranas de daño en la retina (retinopatía diabética). Utilizamos inteligencia artificial avanzada para analizar imágenes del ojo en cuestión de minutos, permitiendo una detección temprana y efectiva."
    },
    {
        question: "¿Debo instalar alguna aplicación en mi teléfono o computadora?",
        answer: "No es necesario instalar nada desde tiendas de aplicaciones. RetiScan es una aplicación web moderna que funciona directamente en tu navegador (como Chrome o Safari). Puedes guardarla en tu pantalla de inicio para acceder a ella instantáneamente, ahorrando espacio en tu dispositivo."
    },
    {
        question: "¿Cómo se protegen los datos de mis pacientes?",
        answer: "La seguridad es nuestra prioridad. Utilizamos cifrado de grado médico y cumplimos con los estándares internacionales más estrictos de protección de datos de salud. Toda la información se almacena de forma segura y privada en la nube."
    },
    {
        question: "¿Es compatible con la cámara de mi smartphone?",
        answer: "Sí, RetiScan está diseñado para funcionar con la mayoría de las cámaras de smartphones modernos, así como con cámaras especializadas de fondo de ojo. Nuestra tecnología adapta el procesamiento para obtener el mejor análisis posible según el dispositivo."
    },
    {
        question: "¿Cuánto tiempo tarda el análisis inteligente?",
        answer: "Habitualmente, el análisis automático se completa en menos de 2 minutos. Esto te permite obtener una evaluación preliminar durante la misma consulta con el paciente."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const reveal = useScrollReveal('fade-up');

    return (
        <section
            id="faq"
            className="relative py-16 lg:py-24 overflow-hidden noise-overlay animated-gradient text-white"
            style={{
                background: 'linear-gradient(110deg, #001a4d 0%, #0044cc 25%, #00ccff 50%, #0044cc 75%, #001a4d 100%)',
                backgroundSize: '300% 300%',
            }}
        >
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }}></div>
            </div>
            <div className="max-w-4xl mx-auto px-6">
                <div ref={reveal.ref} style={reveal.style} className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm mb-4">
                        <HelpCircle className="w-4 h-4 text-cyan-300" />
                        <span className="text-xs font-semibold text-white">RESOLVEMOS TUS DUDAS</span>
                    </div>
                    <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Preguntas Frecuentes
                    </SplitText>
                    <p className="text-lg text-white/90">
                        Todo lo que necesitas saber sobre RetiScan y cómo puede optimizar tu práctica médica.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                            >
                                <span className="font-bold text-slate-900 dark:text-white leading-tight">
                                    {faq.question}
                                </span>
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    {openIndex === index ? (
                                        <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 text-slate-800 dark:text-slate-200 leading-relaxed">
                                            <div className="h-px bg-slate-100 dark:bg-slate-700 mb-6" />
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
