import { memo } from 'react';
import { cn } from '../../../../core/utils/cn';
import { 
    User, 
    FileText, 
    Stethoscope, 
    Pill, 
    ClipboardList, 
    CheckCircle,
    Check
} from 'lucide-react';
import type { ConsultationStep } from '../../../../core/types/consultation';

interface ConsultationStepsProps {
    currentStep: ConsultationStep;
    completedSteps?: ConsultationStep[];
    onStepClick?: (step: ConsultationStep) => void;
    className?: string;
}

const STEPS_CONFIG: Array<{
    step: ConsultationStep;
    label: string;
    icon: React.ElementType;
}> = [
    { step: 'patient-info', label: 'Paciente', icon: User },
    { step: 'medical-history', label: 'Historia', icon: FileText },
    { step: 'diagnostics', label: 'Diagnósticos', icon: Stethoscope },
    { step: 'prescriptions', label: 'Recetas', icon: Pill },
    { step: 'orders', label: 'Órdenes', icon: ClipboardList },
    { step: 'summary', label: 'Resumen', icon: CheckCircle },
];

/**
 * Componente que muestra los pasos de la consulta médica
 */
export const ConsultationSteps = memo(function ConsultationSteps({
    currentStep,
    completedSteps = [],
    onStepClick,
    className,
}: ConsultationStepsProps) {
    const currentIndex = STEPS_CONFIG.findIndex(s => s.step === currentStep);

    return (
        <nav className={cn("w-full", className)}>
            {/* Vista desktop */}
            <ol className="hidden md:flex items-center w-full">
                {STEPS_CONFIG.map((stepConfig, index) => {
                    const isActive = stepConfig.step === currentStep;
                    const isCompleted = completedSteps.includes(stepConfig.step) || index < currentIndex;
                    const isPast = index < currentIndex;
                    const Icon = stepConfig.icon;

                    return (
                        <li 
                            key={stepConfig.step}
                            className={cn(
                                "flex items-center",
                                index < STEPS_CONFIG.length - 1 && "flex-1"
                            )}
                        >
                            <button
                                onClick={() => onStepClick?.(stepConfig.step)}
                                disabled={!onStepClick}
                                className={cn(
                                    "flex flex-col items-center gap-1 transition-colors",
                                    onStepClick && "cursor-pointer hover:text-blue-600",
                                    !onStepClick && "cursor-default"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                                        isActive && "border-blue-600 bg-blue-600 text-white",
                                        isCompleted && !isActive && "border-green-500 bg-green-500 text-white",
                                        !isActive && !isCompleted && "border-slate-300 bg-white text-slate-500"
                                    )}
                                >
                                    {isCompleted && !isActive ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "text-xs font-medium",
                                        isActive && "text-blue-600",
                                        isCompleted && !isActive && "text-green-600",
                                        !isActive && !isCompleted && "text-slate-500"
                                    )}
                                >
                                    {stepConfig.label}
                                </span>
                            </button>

                            {index < STEPS_CONFIG.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-0.5 mx-2 transition-colors",
                                        isPast ? "bg-green-500" : "bg-slate-200"
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {/* Vista mobile */}
            <div className="md:hidden">
                <div className="flex items-center justify-between bg-slate-100 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                        {(() => {
                            const currentConfig = STEPS_CONFIG[currentIndex];
                            const Icon = currentConfig?.icon || User;
                            return (
                                <>
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {currentConfig?.label}
                                    </span>
                                </>
                            );
                        })()}
                    </div>
                    <span className="text-xs text-slate-500">
                        Paso {currentIndex + 1} de {STEPS_CONFIG.length}
                    </span>
                </div>

                {/* Progress bar móvil */}
                <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / STEPS_CONFIG.length) * 100}%` }}
                    />
                </div>
            </div>
        </nav>
    );
});
