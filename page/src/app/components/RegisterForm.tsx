'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Stethoscope,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    ShieldCheck
} from 'lucide-react';
import { Form } from '@/app/components/ui/form';
import { RegisterFormProgress } from './RegisterFormProgress';
import { RegisterFormStepPersonal } from './RegisterFormStepPersonal';
import { RegisterFormStepProfessional } from './RegisterFormStepProfessional';
import { RegisterFormStepCredentials } from './RegisterFormStepCredentials';
import { RegisterFormStepReview } from './RegisterFormStepReview';
import { FormDataType } from './RegisterFormTypes';

interface RegisterFormProps {
    onBack: () => void;
    planName?: string;
}

const STEPS = [
    { label: "Personal", icon: User, title: "Datos Personales", description: "Ingresa tu información básica para comenzar." },
    { label: "Profesional", icon: Stethoscope, title: "Experiencia Profesional", description: "Platícanos sobre tu práctica médica." },
    { label: "Credenciales", icon: Mail, title: "Credenciales de Acceso", description: "Configura tu cuenta para ingresar a la plataforma." },
    { label: "Revisión", icon: ShieldCheck, title: "Revisión Final", description: "Verifica que todos tus datos sean correctos." }
];

export function RegisterForm({ onBack, planName = 'Especialista' }: RegisterFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<FormDataType>({
        defaultValues: {
            firstName: '',
            paternalSurname: '',
            maternalSurname: '',
            email: '',
            password: '',
            licenseNumber: '',
            specialty: '',
            institution: '',
            phone: ''
        },
        mode: 'onTouched'
    });

    const { control, trigger, handleSubmit, getValues } = form;

    const nextStep = async () => {
        const fieldsToValidate = getFieldsForStep(currentStep);
        const isValid = await trigger(fieldsToValidate as any);
        if (isValid) {
            setCurrentStep((prev: number) => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev: number) => Math.max(prev - 1, 0));
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    const getFieldsForStep = (step: number): string[] => {
        switch (step) {
            case 0: return ['firstName', 'paternalSurname'];
            case 1: return ['licenseNumber'];
            case 2: return ['email', 'password'];
            default: return [];
        }
    };

    const onSubmit = async (data: FormDataType) => {
        // If not on the last step, just go to the next one
        if (currentStep < STEPS.length - 1) {
            nextStep();
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(result.error || 'Ocurrió un error inesperado. Revisa los datos.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor. Por favor, asegúrate de que la API esté encendida.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver a planes
            </button>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-700/60 shadow-2xl shadow-blue-900/10 overflow-hidden transition-colors">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-8 lg:p-12 text-center space-y-8"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center border border-green-200 dark:border-green-800">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">¡Registro Exitoso!</h2>
                            <p className="text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                                Bienvenido a RetiScan, Dr. {getValues().paternalSurname}. <br />
                                Hemos enviado un enlace de activación a <strong className="text-slate-800 dark:text-slate-100">{getValues().email}</strong>.
                                Por favor, verifícalo para comenzar a usar tu plan <strong className="text-blue-600 dark:text-blue-400">{planName}</strong>.
                            </p>
                            <div className="pt-8">
                                <button
                                    onClick={onBack}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 lg:p-12"
                        >
                            {/* Header */}
                            <div className="mb-10 text-center">
                                <div className="inline-block px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full mb-4">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Plan Actual: {planName}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{STEPS[currentStep].title}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">{STEPS[currentStep].description}</p>
                            </div>

                            {/* Progress Indicator */}
                            <RegisterFormProgress currentStep={currentStep} steps={STEPS} />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                                </motion.div>
                            )}

                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            {currentStep === 0 && <RegisterFormStepPersonal control={control} />}
                                            {currentStep === 1 && <RegisterFormStepProfessional control={control} />}
                                            {currentStep === 2 && <RegisterFormStepCredentials control={control} />}
                                            {currentStep === 3 && <RegisterFormStepReview formData={getValues()} goToStep={goToStep} />}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Navigation Controls */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        {currentStep > 0 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="flex-1 py-4 px-6 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                                Atrás
                                            </button>
                                        )}

                                        {currentStep < STEPS.length - 1 ? (
                                            <button
                                                type="submit"
                                                className="flex-[2] py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                                            >
                                                Siguiente Paso
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="flex-[2] py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Procesando Registro...
                                                    </>
                                                ) : (
                                                    'Finalizar Registro'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400">
                Tu información está protegida mediante encriptación AES-256. <br />
                Al registrarte, confirmas tu cumplimiento con la normativa HIPAA y protección de datos médicos.
            </p>
        </div>
    );
}
