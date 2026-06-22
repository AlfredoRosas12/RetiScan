import React from 'react';
import { Control } from 'react-hook-form';
import { Mail, Lock, Phone } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/app/components/ui/form';
import { FormDataType } from './RegisterFormTypes';

interface RegisterFormStepCredentialsProps {
    control: Control<FormDataType>;
}

export function RegisterFormStepCredentials({ control }: RegisterFormStepCredentialsProps) {
    const onlyPhoneChars = (val: string) => {
        if (val.length > 0) {
            const firstChar = val.charAt(0);
            const rest = val.slice(1).replace(/[^0-9]/g, '');
            return (firstChar === '+' ? '+' : firstChar.replace(/[^0-9]/g, '')) + rest;
        }
        return val;
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={control}
                    name="email"
                    rules={{
                        required: "El correo electrónico es requerido",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Correo electrónico inválido"
                        }
                    }}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Correo Electrónico</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        {...field}
                                        type="email"
                                        maxLength={255}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="password"
                    rules={{
                        required: "La contraseña es requerida",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres"
                        }
                    }}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Contraseña</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        {...field}
                                        type="password"
                                        maxLength={100}
                                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                        placeholder="Mínimo 8 caracteres"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                    <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Teléfono (WhatsApp - Opcional)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...field}
                                    onChange={(e) => field.onChange(onlyPhoneChars(e.target.value))}
                                    type="tel"
                                    maxLength={20}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                                    placeholder="+52 123 456 7890"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
