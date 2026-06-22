import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Building, Users, ChevronDown } from 'lucide-react';
import { SplitText } from '@/app/components/SplitText';
import { MagneticButton } from '@/app/components/MagneticButton';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ContactForm() {
    const leftContent = useScrollReveal('fade-right', { delay: 100 });
    const rightContent = useScrollReveal('fade-left', { delay: 300 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        }, 1500);
    };

    return (
        <section
            id="contacto"
            className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-background dark:to-slate-900 transition-colors duration-500"
        >

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }}></div>
            </div>

            {/* Floating Gradient Orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 dark:bg-white/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-300/10 dark:bg-cyan-300/5 rounded-full blur-3xl animate-float-delayed"></div>

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left Content: Persuasive Text & Info */}
                    <div ref={leftContent.ref} style={leftContent.style} className="space-y-8 lg:space-y-10">
                        <div>
                            <div className="inline-block px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">CONTÁCTANOS</span>
                            </div>
                            <SplitText as="h2" className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-balance" baseDelay={200}>
                                Digitaliza tu diagnóstico hoy mismo
                            </SplitText>
                            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                                Alcanza el siguiente nivel en precisión y eficiencia. Déjanos tus datos
                                y uno de nuestros especialistas en implementación médica te contactará.
                            </p>
                        </div>

                        {/* Contact Info Cards (Solid White) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Escríbenos</h4>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">especialistas@retiscan.app</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Llámanos</h4>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">+52 (55) 1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Soporte y Ventas</h4>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg">Lunes a Viernes, 9am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: The Form */}
                    <div ref={rightContent.ref} style={rightContent.style}>
                        <div className="bg-white dark:bg-slate-900/95 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300">
                            {/* Decorative inner glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/5 rounded-full blur-3xl -z-10"></div>

                            <h3 className="text-xl sm:text-2xl font-bold text-black/90 dark:text-white mb-6 sm:mb-8">Solicitud de Información</h3>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-black/90 dark:text-white/90">Nombre Completo</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Dr. Juan Pérez"
                                            className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-black/90 dark:text-white/90">Correo Profesional</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="juan.perez@clinica.com"
                                            className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Clinic / Organization */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-black/90 dark:text-white/90">Institución o Clínica</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Hospital de la Luz..."
                                            className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Volume (B2B Qualification) */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-black/90 dark:text-white/90">Volumen Anual Promedio</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Users className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <select required defaultValue="" className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none [&>option]:text-slate-900 [&>option]:dark:text-white font-medium cursor-pointer">
                                                <option value="" disabled>Selecciona...</option>
                                                <option value="low">1 - 500 pacientes</option>
                                                <option value="medium">501 - 2,000 pacientes</option>
                                                <option value="high">Más de 2,000 pacientes</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <ChevronDown className="h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interest */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-black/90 dark:text-white/90">¿Qué te interesa?</label>
                                        <div className="relative">
                                            <select required defaultValue="" className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 pr-10 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none [&>option]:text-slate-900 [&>option]:dark:text-white font-medium cursor-pointer">
                                                <option value="" disabled>Selecciona...</option>
                                                <option value="info">Más información</option>
                                                <option value="plan_specialist">Contratar Plan Especialista</option>
                                                <option value="plan_clinic">Contratar Plan Clínica/Enterprise</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <ChevronDown className="h-4 w-4 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional notes */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-black/90 dark:text-white/90">Mensaje Adicional <span className="text-black/50 dark:text-white/40 text-xs">(Opcional)</span></label>
                                    <textarea
                                        rows={3}
                                        placeholder="Cuéntanos más sobre tus necesidades actuales..."
                                        className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none font-medium"
                                    ></textarea>
                                </div>

                                {/* Submit button */}
                                <div className="pt-2 sm:pt-4">
                                    <MagneticButton
                                        className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 ${isSuccess ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' : 'bg-white dark:bg-blue-600 hover:bg-slate-50 dark:hover:bg-blue-500 text-blue-900 dark:text-white shadow-xl hover:shadow-2xl'}`}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-blue-900/30 dark:border-white/30 border-t-blue-900 dark:border-t-white rounded-full animate-spin"></div>
                                        ) : isSuccess ? (
                                            <>
                                                <span>Solicitud Enviada</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>Comenzar Implementación</span>
                                            </>
                                        )}
                                    </MagneticButton>
                                    <p className="text-center text-white/50 dark:text-white/40 text-[10px] sm:text-xs mt-4">
                                        Al enviar este formulario aceptas nuestra política de privacidad HIPAA.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
