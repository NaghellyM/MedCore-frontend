/**
 * HOOK DE ESTADO DEL FORMULARIO DE DIAGNÓSTICO
 * Gestiona únicamente el estado del formulario de diagnóstico
 * Separado del hook principal para mejor mantenibilidad
 */

import { useState, useCallback } from "react";
import type { DiagnosticFormData, DiagnosticFormState } from "../../types/medicalHistory";
import { DiagnosticFormValidator } from "../../validators/diagnosticFormValidator";

interface UseDiagnosticFormStateOptions {
    initialData?: Partial<DiagnosticFormData>;
    mode?: "create" | "edit";
    patientId?: string;
    medicalHistoryId?: string;
    diagnosticId?: string;
}

interface UseDiagnosticFormStateReturn {
    formData: DiagnosticFormData;
    formState: DiagnosticFormState;
    updateFormData: (data: Partial<DiagnosticFormData>) => void;
    setFormState: React.Dispatch<React.SetStateAction<DiagnosticFormState>>;
    resetFormData: () => void;
    setIsLoading: (loading: boolean) => void;
    setIsSaving: (saving: boolean) => void;
    setIsDirty: (dirty: boolean) => void;
}

export function useDiagnosticFormState(
    options: UseDiagnosticFormStateOptions = {}
): UseDiagnosticFormStateReturn {
    const {
        mode = "create",
        patientId,
        medicalHistoryId,
        diagnosticId
    } = options;

    // Obtener datos por defecto usando el validador
    const defaultData = DiagnosticFormValidator.getDefaultFormData(options.initialData);

    // Estado del formulario
    const [formData, setFormData] = useState<DiagnosticFormData>(defaultData);
    
    // Estado de la UI
    const [formState, setFormState] = useState<DiagnosticFormState>({
        mode,
        isLoading: false,
        isSaving: false,
        isDirty: false,
        errors: {},
        diagnosticId,
        medicalHistoryId,
        patientId
    });

    // Función para actualizar datos del formulario
    const updateFormData = useCallback((newData: Partial<DiagnosticFormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
        
        // Marcar como modificado si no estaba ya
        setFormState(prev => {
            if (!prev.isDirty) {
                return { ...prev, isDirty: true };
            }
            return prev;
        });
    }, []);

    // Función para resetear el formulario
    const resetFormData = useCallback(() => {
        const newDefaultData = DiagnosticFormValidator.getDefaultFormData(options.initialData);
        setFormData(newDefaultData);
        setFormState(prev => ({
            ...prev,
            isDirty: false,
            errors: {},
            mode: "create"
        }));
    }, [options.initialData]);

    // Funciones de conveniencia para actualizar estado
    const setIsLoading = useCallback((loading: boolean) => {
        setFormState(prev => ({ ...prev, isLoading: loading }));
    }, []);

    const setIsSaving = useCallback((saving: boolean) => {
        setFormState(prev => ({ ...prev, isSaving: saving }));
    }, []);

    const setIsDirty = useCallback((dirty: boolean) => {
        setFormState(prev => ({ ...prev, isDirty: dirty }));
    }, []);

    return {
        formData,
        formState,
        updateFormData,
        setFormState,
        resetFormData,
        setIsLoading,
        setIsSaving,
        setIsDirty
    };
}