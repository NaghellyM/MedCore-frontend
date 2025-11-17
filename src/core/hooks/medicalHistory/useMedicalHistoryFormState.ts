/**
 * HOOK DE ESTADO DEL FORMULARIO DE HISTORIA MÉDICA
 * Gestiona únicamente el estado del formulario de historia médica
 * Separado del hook principal para mejor mantenibilidad
 */

import { useState } from "react";
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
    const updateFormData = (newData: Partial<MedicalHistoryFormData>) => {
        setFormData(prev => {
            const updatedData = { ...prev, ...newData };
            return updatedData;
        });
        
        // Marcar como modificado si no estaba ya
        if (!formState.isDirty) {
            setFormState(prev => ({ ...prev, isDirty: true }));
        }
    };

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
    const setIsLoading = (loading: boolean) => {
        setFormState(prev => ({ ...prev, isLoading: loading }));
    };

    const setIsSaving = (saving: boolean) => {
        setFormState(prev => ({ ...prev, isSaving: saving }));
    };

    const setIsDirty = (dirty: boolean) => {
        setFormState(prev => ({ ...prev, isDirty: dirty }));
    };

    const setCurrentSection = (section: MedicalHistorySection) => {
        setFormState(prev => ({ ...prev, currentSection: section }));
    };

    const setErrors = (errors: Record<string, string>) => {
        setFormState(prev => ({ ...prev, errors }));
    };

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