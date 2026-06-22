import React from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/app/components/ui/utils';

interface Step {
    label: string;
    icon: LucideIcon;
}

interface RegisterFormProgressProps {
    currentStep: number;
    steps: Step[];
}

export function RegisterFormProgress({ currentStep, steps }: RegisterFormProgressProps) {
    return (
        <div className="relative flex justify-between items-center w-full mb-12 px-2">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />

            {/* Active Progress Line */}
            <motion.div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <div key={index} className="relative z-10 flex flex-col items-center">
                        <motion.div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                isCompleted
                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : isActive
                                        ? "bg-white dark:bg-slate-900 border-blue-600 text-blue-600 ring-4 ring-blue-500/20 shadow-xl shadow-blue-500/10"
                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                            )}
                            initial={false}
                            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                        >
                            {isCompleted ? (
                                <Check className="w-5 h-5 stroke-[3px]" />
                            ) : (
                                <Icon className="w-5 h-5" />
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute -inset-1 rounded-full border-2 border-blue-600/30"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.div>
                        <span className={cn(
                            "absolute -bottom-7 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                        )}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
