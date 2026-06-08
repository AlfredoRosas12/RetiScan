import React, { useState } from 'react';
import { User, Mail, Lock, CreditCard, Stethoscope, Building2, Phone, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegisterFormProps {
    onBack: () => void;
    planName?: string;
}

export function RegisterForm({ onBack, planName = 'Especialista' }: RegisterFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        paternalSurname: '',
        maternalSurname: '',
        email: '',
        password: '',
        licenseNumber: '',
        specialty: '',
        institution: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || 'Ocurrió un error inesperado. Revisa los datos.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor. Por favor, asegúrate de que la API esté encendida.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-md mx-auto py-24 px-6 text-center space-y-8">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-blue-900/10 p-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">¡Registro Exitoso!</h2>
                    <p className="text-base text-slate-600 mt-4 leading-relaxed">
                        Bienvenido a RetiScan, Dr. {formData.paternalSurname}. <br />
                        Hemos enviado un enlace de activación a <strong className="text-slate-800">{formData.email}</strong>.
                        Por favor, verifícalo para comenzar a usar tu plan <strong className="text-blue-600">{planName}</strong>.
                    </p>
                    <div className="pt-8">
                        <button
                            onClick={onBack}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver a planes
            </button>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-blue-900/10 overflow-hidden">
                <div className="p-8 lg:p-12">
                    <div className="mb-10 text-center">
                        <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-4">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Plan: {planName}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Crea tu Cuenta Profesional</h2>
                        <p className="text-slate-500 mt-2">Completa tus datos para activar tu infraestructura diagnóstica.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Nombre(s)</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text" required name="firstName" value={formData.firstName}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                            setFormData({ ...formData, firstName: val });
                                        }}
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Juan"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Apellido Paterno</label>
                                <input
                                    type="text" required name="paternalSurname" value={formData.paternalSurname}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                        setFormData({ ...formData, paternalSurname: val });
                                    }}
                                    maxLength={100}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ej. Pérez"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Apellido Materno (Opcional)</label>
                                <input
                                    type="text" name="maternalSurname" value={formData.maternalSurname}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                                        setFormData({ ...formData, maternalSurname: val });
                                    }}
                                    maxLength={100}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Cédula Profesional</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel" required name="licenseNumber" value={formData.licenseNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setFormData({ ...formData, licenseNumber: val });
                                        }}
                                        maxLength={30}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Número de cédula (solo números)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Especialidad (Opcional)</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text" name="specialty" value={formData.specialty} onChange={handleChange}
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Oftalmología"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Institución</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text" name="institution" value={formData.institution} onChange={handleChange}
                                        maxLength={150}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Nombre de clínica u hospital"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-200">
                            <label className="text-sm font-bold text-slate-800 ml-1">Datos de Acceso</label>
                            <div className="grid md:grid-cols-2 gap-6 mt-2">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email" required name="email" value={formData.email} onChange={handleChange}
                                        maxLength={255}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password" required name="password" value={formData.password} onChange={handleChange}
                                        minLength={8}
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Contraseña (mín 8)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Teléfono (WhatsApp)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel" name="phone" value={formData.phone}
                                    onChange={(e) => {
                                        // Allow numbers and an optional leading '+'
                                        let val = e.target.value;
                                        if (val.length > 0) {
                                            const firstChar = val.charAt(0);
                                            const rest = val.slice(1).replace(/[^0-9]/g, '');
                                            val = (firstChar === '+' ? '+' : firstChar.replace(/[^0-9]/g, '')) + rest;
                                        }
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    maxLength={20}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="+52 123 456 7890"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando Registro...
                                    </>
                                ) : (
                                    'Completar Registro Profesional'
                                )}
                            </button>
                            <p className="mt-4 text-center text-xs text-slate-400">
                                Al registrarte, aceptas nuestros <a href="#" className="underline text-slate-500 hover:text-blue-600">Términos de Servicio</a> y <a href="#" className="underline text-slate-500 hover:text-blue-600">Política de Privacidad conforme a HIPAA</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
