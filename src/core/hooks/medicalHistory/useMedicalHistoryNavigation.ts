/**
 * HOOK DE NAVEGACIÓN DE HISTORIA MÉDICA
 * Gestiona únicamente la navegación entre secciones del formulario
 * Incluye validaciones para permitir/denegar navegación
 */

import { useCallback } from "react";
import type { 
    MedicalHistorySection, 
    MedicalHistoryFormData 
} from "../../types/medicalHistory";
import { MedicalHistoryFormValidator } from "../../validators/medicalHistoryFormValidator";

interface UseMedicalHistoryNavigationOptions {
    currentSection: MedicalHistorySection;
    formData: Partial<MedicalHistoryFormData>;
    onSectionChange: (section: MedicalHistorySection) => void;
    onNavigationError?: (error: string) => void;
}

interface UseMedicalHistoryNavigationReturn {
    goToSection: (section: MedicalHistorySection) => boolean;
    nextSection: () => boolean;
    previousSection: () => boolean;
    canNavigateToSection: (section: MedicalHistorySection) => boolean;
    canNavigateNext: () => boolean;
    canNavigatePrevious: () => boolean;
    getSectionOrder: () => MedicalHistorySection[];
    getCurrentSectionIndex: () => number;
    getNextSectionName: () => MedicalHistorySection | null;
    getPreviousSectionName: () => MedicalHistorySection | null;
}

export function useMedicalHistoryNavigation(
    options: UseMedicalHistoryNavigationOptions
): UseMedicalHistoryNavigationReturn {
    const { 
        currentSection, 
        formData, 
        onSectionChange, 
        onNavigationError 
    } = options;

    // Obtener orden de secciones
    const getSectionOrder = useCallback(() => {
        return MedicalHistoryFormValidator.SECTION_ORDER;
    }, []);

    // Obtener índice de la sección actual
    const getCurrentSectionIndex = useCallback(() => {
        return MedicalHistoryFormValidator.SECTION_ORDER.indexOf(currentSection);
    }, [currentSection]);

    // Obtener nombre de la siguiente sección
    const getNextSectionName = useCallback(() => {
        return MedicalHistoryFormValidator.getNextSection(currentSection);
    }, [currentSection]);

    // Obtener nombre de la sección anterior
    const getPreviousSectionName = useCallback(() => {
        return MedicalHistoryFormValidator.getPreviousSection(currentSection);
    }, [currentSection]);

    // Verificar si se puede navegar a una sección específica
    const canNavigateToSection = useCallback((targetSection: MedicalHistorySection) => {
        return MedicalHistoryFormValidator.canNavigateToSection(
            targetSection,
            currentSection,
            formData
        );
    }, [currentSection, formData]);

    // Verificar si se puede navegar a la siguiente sección
    const canNavigateNext = useCallback(() => {
        const nextSection = getNextSectionName();
        if (!nextSection) return false;
        return canNavigateToSection(nextSection);
    }, [getNextSectionName, canNavigateToSection]);

    // Verificar si se puede navegar a la sección anterior
    const canNavigatePrevious = useCallback(() => {
        const previousSection = getPreviousSectionName();
        return previousSection !== null;
    }, [getPreviousSectionName]);

    // Navegar a una sección específica
    const goToSection = useCallback((targetSection: MedicalHistorySection): boolean => {
        if (!canNavigateToSection(targetSection)) {
            const targetIndex = MedicalHistoryFormValidator.SECTION_ORDER.indexOf(targetSection);
            const currentIndex = getCurrentSectionIndex();
            
            if (targetIndex > currentIndex) {
                // Intentando navegar hacia adelante sin completar secciones
                const incompleteSections: string[] = [];
                
                for (let i = currentIndex; i < targetIndex; i++) {
                    const section = MedicalHistoryFormValidator.SECTION_ORDER[i];
                    if (!MedicalHistoryFormValidator.isSectionComplete(section, formData)) {
                        incompleteSections.push(section);
                    }
                }
                
                const errorMessage = incompleteSections.length > 0
                    ? `Complete las siguientes secciones antes de continuar: ${incompleteSections.join(', ')}`
                    : "No se puede navegar a esta sección en este momento";
                    
                onNavigationError?.(errorMessage);
            }
            return false;
        }

        onSectionChange(targetSection);
        return true;
    }, [
        canNavigateToSection, 
        getCurrentSectionIndex, 
        formData, 
        onSectionChange, 
        onNavigationError
    ]);

    // Navegar a la siguiente sección
    const nextSection = useCallback((): boolean => {
        const nextSectionName = getNextSectionName();
        
        if (!nextSectionName) {
            onNavigationError?.("Ya está en la última sección");
            return false;
        }

        return goToSection(nextSectionName);
    }, [getNextSectionName, goToSection, onNavigationError]);

    // Navegar a la sección anterior
    const previousSection = useCallback((): boolean => {
        const previousSectionName = getPreviousSectionName();
        
        if (!previousSectionName) {
            onNavigationError?.("Ya está en la primera sección");
            return false;
        }

        // La navegación hacia atrás siempre está permitida
        onSectionChange(previousSectionName);
        return true;
    }, [getPreviousSectionName, onSectionChange, onNavigationError]);

    return {
        goToSection,
        nextSection,
        previousSection,
        canNavigateToSection,
        canNavigateNext,
        canNavigatePrevious,
        getSectionOrder,
        getCurrentSectionIndex,
        getNextSectionName,
        getPreviousSectionName
    };
}