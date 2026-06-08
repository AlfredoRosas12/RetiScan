import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface VerifyEmailProps {
    token: string;
    onBack: () => void;
}

export function VerifyEmail({ token, onBack }: VerifyEmailProps) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || '¡Tu cuenta ha sido verificada correctamente!');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'El enlace es inválido o ha expirado.');
                }
            } catch {
                setStatus('error');
                setMessage('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
            }
        };

        verify();
    }, [token]);

    // Handle automatic redirect after success
    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onBack(); // Volver al Home de la Landing
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [status, onBack]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div
                className="absolute inset-0 animated-gradient"
                style={{
                    background: 'linear-gradient(135deg, #001a4d 0%, #003399 15%, #0066cc 30%, #00ccff 50%, #0066cc 70%, #003399 85%, #001a4d 100%)',
                    backgroundSize: '300% 300%',
                }}
            />
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.05]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }}></div>
            </div>
            {/* Floating orbs */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300/10 rounded-full blur-3xl animate-float-delayed"></div>

            <div className="relative z-10 max-w-md w-full mx-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-blue-900/10 p-10 text-center">

                    {status === 'loading' && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Verificando tu cuenta...</h2>
                            <p className="text-slate-500">Estamos activando tu acceso a RetiScan. Esto solo toma unos segundos.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-200">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">¡Cuenta Verificada!</h2>
                            <p className="text-slate-600">{message}</p>
                            <div className="pt-4 space-y-4">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                    <p className="text-sm font-medium text-blue-600">
                                        Redirigiendo al inicio en {countdown}s...
                                    </p>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Verificación Fallida</h2>
                            <p className="text-slate-600">{message}</p>
                            <div className="pt-4">
                                <button
                                    onClick={onBack}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-base transition-all"
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                <p className="text-center text-white/40 text-xs mt-6">
                    RetiScan — Detección de Retinopatía Diabética con IA
                </p>
            </div>
        </div>
    );
}
