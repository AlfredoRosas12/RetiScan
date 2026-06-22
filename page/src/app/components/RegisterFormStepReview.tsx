import React from 'react';
import { FormDataType } from './RegisterFormTypes';
import { User, CreditCard, Mail, Edit2 } from 'lucide-react';

interface RegisterFormStepReviewProps {
    formData: FormDataType;
    goToStep: (n: number) => void;
}

export function RegisterFormStepReview({ formData, goToStep }: RegisterFormStepReviewProps) {
    const sections = [
        {
            title: "Datos Personales",
            icon: User,
            step: 0,
            data: [
                { label: "Nombre", value: formData.firstName },
                { label: "Apellido Paterno", value: formData.paternalSurname },
                { label: "Apellido Materno", value: formData.maternalSurname || "No proporcionado" }
            ]
        },
        {
            title: "Datos Profesionales",
            icon: CreditCard,
            step: 1,
            data: [
                { label: "Cédula Profesional", value: formData.licenseNumber },
                { label: "Especialidad", value: formData.specialty || "No proporcionado" },
                { label: "Institución", value: formData.institution || "No proporcionado" }
            ]
        },
        {
            title: "Datos de Acceso",
            icon: Mail,
            step: 2,
            data: [
                { label: "Correo Electrónico", value: formData.email },
                { label: "Contraseña", value: "********" },
                { label: "Teléfono", value: formData.phone || "No proporcionado" }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="group overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl transition-all hover:border-blue-500/30">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white">{section.title}</h3>
                            </div>
                            <button
                                onClick={() => goToStep(section.step)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                Editar
                            </button>
                        </div>
                        <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {section.data.map((item, itemIdx) => (
                                <div key={itemIdx} className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Al completar el registro, confirmas que la información proporcionada es verídica y aceptas nuestros <a href="#" className="text-blue-600 underline">Términos de Servicio</a> y <a href="#" className="text-blue-600 underline">Aviso de Privacidad</a>.
                </p>
            </div>
        </div>
    );
}
