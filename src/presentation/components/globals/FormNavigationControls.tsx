/**
 * CONTROLES DE NAVEGACIÓN DEL FORMULARIO
 * ======================================
 * Componente especializado para manejar la navegación entre secciones
 * Incluye tabs de secciones, botones de navegación y barra de progreso
 */

import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import type { MedicalHistorySection } from "../../../core/types/medicalHistory";

export interface SectionConfig {
    id: MedicalHistorySection;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    isRequired: boolean;
    order: number;
}

interface FormNavigationControlsProps {
    // Configuración de secciones
    sections: SectionConfig[];
    currentSection: MedicalHistorySection;
    
    // Estado del formulario
    isProcessing?: boolean;
    hasErrors?: boolean;
    showValidationErrors?: boolean;
    formErrors?: Record<string, string>;
    
    // Navegación
    onSectionClick: (section: MedicalHistorySection) => void;
    onNext: () => void;
    onPrevious: () => void;
    onSave: () => void;
    
    // Personalización
    title?: string;
    saveButtonText?: string;
    nextButtonText?: string;
    previousButtonText?: string;
    disabled?: boolean;
}

/**
 * Componente reutilizable para navegación de formularios multi-sección
 * Incluye tabs, botones de navegación y barra de progreso
 */
export function FormNavigationControls({
    sections,
    currentSection,
    isProcessing = false,
    hasErrors = false,
    showValidationErrors = false,
    formErrors = {},
    onSectionClick,
    onNext,
    onPrevious,
    onSave,
    title = "Formulario",
    saveButtonText = "Guardar",
    nextButtonText = "Siguiente",
    previousButtonText = "Anterior",
    disabled = false
}: FormNavigationControlsProps) {

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    const currentSectionIndex = sections.findIndex(
        section => section.id === currentSection
    );

    const currentSectionConfig = sections[currentSectionIndex];
    
    const canGoNext = currentSectionIndex < sections.length - 1;
    const canGoPrevious = currentSectionIndex > 0;
    
    const isInteractionDisabled = disabled || isProcessing;
    
    const progressPercentage = sections.length > 0 
        ? ((currentSectionIndex + 1) / sections.length) * 100 
        : 0;

    // ========================================================================
    // HELPERS
    // ========================================================================

    const getSectionState = (section: SectionConfig, index: number) => {
        const isActive = section.id === currentSection;
        const isCompleted = index < currentSectionIndex;
        const hasErrorsInSection = showValidationErrors && Object.keys(formErrors).some(
            key => key.startsWith(section.id)
        );

        return {
            isActive,
            isCompleted,
            hasErrorsInSection,
            isDisabled: isInteractionDisabled
        };
    };

    const getSectionClassName = (section: SectionConfig, index: number) => {
        const { isActive, isCompleted, hasErrorsInSection, isDisabled } = getSectionState(section, index);
        
        const baseClasses = [
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
            "transition-colors whitespace-nowrap border"
        ];

        if (isDisabled) {
            baseClasses.push("opacity-50 cursor-not-allowed");
        }

        if (isActive) {
            baseClasses.push("bg-blue-100 text-blue-700 border-blue-200");
        } else if (isCompleted) {
            baseClasses.push("bg-green-100 text-green-700 border-green-200");
        } else if (hasErrorsInSection) {
            baseClasses.push("bg-red-100 text-red-700 border-red-200");
        } else {
            baseClasses.push("bg-gray-100 text-gray-600 border-gray-200");
            if (!isDisabled) {
                baseClasses.push("hover:bg-gray-200");
            }
        }

        return baseClasses.filter(Boolean).join(" ");
    };

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    const handleSectionClick = (section: SectionConfig) => {
        if (!isInteractionDisabled) {
            onSectionClick(section.id);
        }
    };

    const handleNext = () => {
        if (!isInteractionDisabled && canGoNext) {
            onNext();
        }
    };

    const handlePrevious = () => {
        if (!isInteractionDisabled && canGoPrevious) {
            onPrevious();
        }
    };

    const handleSave = () => {
        if (!isInteractionDisabled) {
            onSave();
        }
    };

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    return (
        <>
            {/* Header with Title and Progress */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <div className="text-sm text-gray-500">
                        Paso {currentSectionIndex + 1} de {sections.length}
                    </div>
                </div>

                {/* Section Tabs */}
                <div className="overflow-x-auto">
                    <div className="flex items-center space-x-2 min-w-max">
                        {sections.map((section, index) => {
                            const { hasErrorsInSection } = getSectionState(section, index);
                            
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section)}
                                    disabled={isInteractionDisabled}
                                    className={getSectionClassName(section, index)}
                                    title={`${section.title} - ${section.description}`}
                                >
                                    <section.icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{section.title}</span>
                                    {section.isRequired && (
                                        <span className="text-red-500 text-xs">*</span>
                                    )}
                                    {hasErrorsInSection && showValidationErrors && (
                                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Current Section Info */}
                {currentSectionConfig && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <currentSectionConfig.icon className="w-4 h-4 text-gray-600" />
                            <div>
                                <span className="text-sm font-medium text-gray-900">
                                    {currentSectionConfig.title}
                                </span>
                                {currentSectionConfig.isRequired && (
                                    <span className="text-red-500 text-xs ml-1">*</span>
                                )}
                                <p className="text-xs text-gray-600">
                                    {currentSectionConfig.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    {/* Navigation Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={!canGoPrevious || isInteractionDisabled}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
                                canGoPrevious && !isInteractionDisabled
                                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {previousButtonText}
                        </button>

                        {canGoNext && (
                            <button
                                onClick={handleNext}
                                disabled={isInteractionDisabled}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                    !isInteractionDisabled
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                            >
                                {nextButtonText}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isInteractionDisabled}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                            !isInteractionDisabled
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {saveButtonText}
                            </>
                        )}
                    </button>
                </div>

                {/* Status Messages */}
                {hasErrors && showValidationErrors && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-sm text-red-800">
                            <span className="font-medium">⚠️ Hay errores en el formulario</span>
                            <p className="text-xs mt-1">
                                Por favor, revise los campos marcados en rojo antes de continuar.
                            </p>
                        </div>
                    </div>
                )}

                {/* Progress Summary */}
                <div className="mt-3 text-xs text-gray-500 text-center">
                    Sección {currentSectionIndex + 1} de {sections.length} •{' '}
                    {Math.round(progressPercentage)}% completado
                    {currentSectionConfig?.isRequired && (
                        <span className="text-red-500 ml-1">(requerida)</span>
                    )}
                </div>
            </div>
        </>
    );
}