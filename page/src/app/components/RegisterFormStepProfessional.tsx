import React from 'react';
import { Control } from 'react-hook-form';
import { CreditCard, Stethoscope, Building2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { FormDataType } from './RegisterFormTypes';

interface RegisterFormStepProfessionalProps {
    control: Control<FormDataType>;
}

export function RegisterFormStepProfessional({ control }: RegisterFormStepProfessionalProps) {
    const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, '');

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="licenseNumber"
                rules={{ required: "La cédula profesional es requerida" }}
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Cédula Profesional</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...field}
                                    onChange={(e) => field.onChange(onlyNumbers(e.target.value))}
                                    type="tel"
                                    maxLength={30}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Número de cédula (solo números)"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="specialty"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Especialidad (Opcional)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        {...field}
                                        type="text"
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Oftalmología"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="institution"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Institución (Opcional)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        {...field}
                                        type="text"
                                        maxLength={150}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Nombre de clínica u hospital"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
