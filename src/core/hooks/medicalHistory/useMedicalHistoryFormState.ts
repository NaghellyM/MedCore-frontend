/**
 * HOOK DE ESTADO DEL FORMULARIO DE HISTORIA MÉDICA
 * Gestiona únicamente el estado del formulario de historia médica
 * Separado del hook principal para mejor mantenibilidad
 */

import { useState, useCallback } from "react";
import type { 
    MedicalHistoryFormData, 
    MedicalHistoryFormState, 
    MedicalHistorySection 
} from "../../types/medicalHistory";
import { MedicalHistoryFormValidator } from "../../validators/medicalHistoryFormValidator";

interface UseMedicalHistoryFormStateOptions {
    initialData?: Partial<MedicalHistoryFormData>;
    mode?: "create" | "edit";
    historyId?: string;
}

interface UseMedicalHistoryFormStateReturn {
    formData: Partial<MedicalHistoryFormData>;
    formState: MedicalHistoryFormState;
    updateFormData: (data: Partial<MedicalHistoryFormData>) => void;
    setFormState: React.Dispatch<React.SetStateAction<MedicalHistoryFormState>>;
    resetFormData: () => void;
    setIsLoading: (loading: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setIsDirty: (dirty: boolean) => void;
    setCurrentSection: (section: MedicalHistorySection) => void;
    setErrors: (errors: Record<string, string>) => void;
}

export function useMedicalHistoryFormState(
    options: UseMedicalHistoryFormStateOptions = {}
): UseMedicalHistoryFormStateReturn {
    const {
        mode = "create",
        historyId
    } = options;

    // Obtener datos por defecto usando el validador
    const defaultData = MedicalHistoryFormValidator.getDefaultFormData();
    const initialData = { ...defaultData, ...options.initialData };

    // Estado del formulario
    const [formData, setFormData] = useState<Partial<MedicalHistoryFormData>>(initialData);
    
    // Estado de la UI
    const [formState, setFormState] = useState<MedicalHistoryFormState>({
        mode,
        isLoading: false,
        isSaving: false,
        isDirty: false,
        errors: {},
        currentSection: "patient-search",
        historyId
    });

    // Función para actualizar datos del formulario
    const updateFormData = useCallback((newData: Partial<MedicalHistoryFormData>) => {
        setFormData(prev => {
            // Verificar si realmente hay cambios
            const hasChanges = Object.keys(newData).some(key => {
                const newValue = newData[key as keyof MedicalHistoryFormData];
                const currentValue = prev[key as keyof MedicalHistoryFormData];
                
                // Comparación simple para objetos básicos
                try {
                    return JSON.stringify(newValue) !== JSON.stringify(currentValue);
                } catch {
                    // Si hay problemas con JSON.stringify, asumir que hay cambios
                    return true;
                }
            });
            
            if (!hasChanges) return prev;
            
            const updatedData = { ...prev, ...newData };
            return updatedData;
        });
        
        // Marcar como modificado si no estaba ya (con callback para evitar loops)
        setFormState(prev => {
            if (prev.isDirty) return prev; // Ya está marcado como sucio
            return { ...prev, isDirty: true };
        });
    }, []);

    // Función para resetear el formulario
    const resetFormData = () => {
        const newDefaultData = MedicalHistoryFormValidator.getDefaultFormData();
        const resetData = { ...newDefaultData, ...options.initialData };
        
        setFormData(resetData);
        setFormState(prev => ({
            ...prev,
            isDirty: false,
            errors: {},
            mode: "create",
            currentSection: "patient-search"
        }));
    };

    // Funciones de conveniencia para actualizar estado
    const setIsLoading = useCallback((loading: boolean) => {
        setFormState(prev => {
            if (prev.isLoading === loading) return prev;
            return { ...prev, isLoading: loading };
        });
    }, []);

    const setIsSaving = useCallback((saving: boolean) => {
        setFormState(prev => {
            if (prev.isSaving === saving) return prev;
            return { ...prev, isSaving: saving };
        });
    }, []);

    const setIsDirty = useCallback((dirty: boolean) => {
        setFormState(prev => {
            if (prev.isDirty === dirty) return prev; // Evitar actualizaciones innecesarias
            return { ...prev, isDirty: dirty };
        });
    }, []);

    const setCurrentSection = useCallback((section: MedicalHistorySection) => {
        setFormState(prev => {
            if (prev.currentSection === section) return prev;
            return { ...prev, currentSection: section };
        });
    }, []);

    const setErrors = useCallback((errors: Record<string, string>) => {
        setFormState(prev => {
            // Verificar si los errores son diferentes
            const currentErrorKeys = Object.keys(prev.errors);
            const newErrorKeys = Object.keys(errors);
            
            if (currentErrorKeys.length !== newErrorKeys.length) {
                return { ...prev, errors };
            }
            
            const hasChanges = newErrorKeys.some(key => prev.errors[key] !== errors[key]);
            if (!hasChanges) return prev;
            
            return { ...prev, errors };
        });
    }, []);

    return {
        formData,
        formState,
        updateFormData,
        setFormState,
        resetFormData,
        setIsLoading,
        setIsSaving,
        setIsDirty,
        setCurrentSection,
        setErrors
    };
}