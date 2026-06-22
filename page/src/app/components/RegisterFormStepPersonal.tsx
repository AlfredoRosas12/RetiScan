import React from 'react';
import { Control } from 'react-hook-form';
import { User, CreditCard } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { FormDataType } from './RegisterFormTypes';

interface RegisterFormStepPersonalProps {
    control: Control<FormDataType>;
}

export function RegisterFormStepPersonal({ control }: RegisterFormStepPersonalProps) {
    const onlyLetters = (val: string) => val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');

    return (
        <div className="space-y-6">
            <FormField
                control={control}
                name="firstName"
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Nombre(s)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...field}
                                    onChange={(e) => field.onChange(onlyLetters(e.target.value))}
                                    type="text"
                                    maxLength={100}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ej. Juan"
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
                    name="paternalSurname"
                    rules={{ required: "El apellido paterno es requerido" }}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Apellido Paterno</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        {...field}
                                        onChange={(e) => field.onChange(onlyLetters(e.target.value))}
                                        type="text"
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Ej. Pérez"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="maternalSurname"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Apellido Materno (Opcional)</FormLabel>
                            <FormControl>
                                <input
                                    {...field}
                                    onChange={(e) => field.onChange(onlyLetters(e.target.value))}
                                    type="text"
                                    maxLength={100}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="Ej. García"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
