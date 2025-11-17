import { useCallback, useEffect } from "react";
import type { 
    DiagnosticFormData,
    DiagnosticFormState,
    Diagnostic
} from "../medicalHistory";
import { useDiagnosticFormState } from "../../hooks/diagnostic/useDiagnosticFormState";
import { useDiagnosticValidation } from "../../hooks/diagnostic/useDiagnosticValidation";
import { useDiagnosticOperations } from "../../hooks/diagnostic/useDiagnosticOperations";

interface UseDiagnosticFormOptions {
    initialData?: Partial<DiagnosticFormData>;
    mode?: "create" | "edit";
    patientId?: string;
    medicalHistoryId?: string;
    diagnosticId?: string;
    onSaveSuccess?: (diagnostic: Diagnostic) => void;
    onSaveError?: (error: string) => void;
}

interface UseDiagnosticFormReturn {
    // Form data y estado
    formData: DiagnosticFormData;
    formState: DiagnosticFormState;
    
    // React Hook Form
    register: any;
    handleSubmit: any;
    setValue: any;
    watch: any;
    formErrors: any;
    reset: any;
    
    // Acciones
    updateFormData: (data: Partial<DiagnosticFormData>) => void;
    saveDiagnostic: () => Promise<void>;
    loadDiagnostic: (diagnosticId: string) => Promise<void>;
    resetForm: () => void;
    
    // Validación
    isValid: boolean;
    validate: () => Promise<boolean>;
}

export function useDiagnosticForm(
    options: UseDiagnosticFormOptions = {}
): UseDiagnosticFormReturn {
    const {
        mode = "create",
        patientId,
        medicalHistoryId,
        diagnosticId,
        onSaveSuccess,
        onSaveError
    } = options;

    // Usar hooks especializados
    const {
        formData,
        formState,
        updateFormData: updateFormDataState,
        setFormState,
        resetFormData,
        setIsLoading,
        setIsSaving,
        setIsDirty
    } = useDiagnosticFormState({
        initialData: options.initialData,
        mode,
        patientId,
        medicalHistoryId,
        diagnosticId
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        isValid,
        isDirty,
        validateForSave
    } = useDiagnosticValidation({
        initialData: formData,
        mode: "onChange"
    });

    const {
        createDiagnostic,
        updateDiagnostic,
        loadDiagnostic: loadDiagnosticData
    } = useDiagnosticOperations({
        onSaveSuccess,
        onSaveError
    });

    // Sincronizar isDirty entre hooks
    useEffect(() => {
        setIsDirty(isDirty);
    }, [isDirty, setIsDirty]);

    // Función para actualizar los datos del formulario (combina ambos hooks)
    const updateFormData = useCallback((newData: Partial<DiagnosticFormData>) => {
        // Actualizar estado local
        updateFormDataState(newData);
        
        // Actualizar React Hook Form también
        Object.entries(newData).forEach(([key, value]) => {
            setValue(key as keyof DiagnosticFormData, value as any);
        });
    }, [updateFormDataState, setValue]);

    // Guardar diagnóstico
    const saveDiagnostic = useCallback(async () => {
        const isFormValid = await validateForSave();
        
        if (!isFormValid) {
            onSaveError?.("Por favor, corrija los errores en el formulario");
            return;
        }

        if (!patientId || !medicalHistoryId) {
            onSaveError?.("Faltan datos requeridos: paciente o historia médica");
            return;
        }

        setIsSaving(true);

        try {
            let result: Diagnostic;

            if (formState.mode === "create") {
                result = await createDiagnostic(patientId, formData);
                
                // Actualizar estado para reflejar que ahora tenemos un ID
                setFormState(prev => ({ 
                    ...prev, 
                    isSaving: false, 
                    isDirty: false,
                    diagnosticId: result.id,
                    mode: "edit"
                }));
            } else if (diagnosticId) {
                result = await updateDiagnostic(diagnosticId, formData);
                
                setFormState(prev => ({ 
                    ...prev, 
                    isSaving: false, 
                    isDirty: false
                }));
            } else {
                throw new Error("ID de diagnóstico requerido para actualización");
            }

            onSaveSuccess?.(result);
        } catch (error) {
            setIsSaving(false);
            const errorMessage = error instanceof Error ? error.message : "Error al guardar el diagnóstico";
            onSaveError?.(errorMessage);
        }
    }, [
        validateForSave, 
        patientId, 
        medicalHistoryId, 
        formState.mode, 
        formData, 
        diagnosticId,
        createDiagnostic,
        updateDiagnostic,
        setIsSaving,
        setFormState,
        onSaveSuccess,
        onSaveError
    ]);

    // Cargar diagnóstico existente
    const loadDiagnostic = useCallback(async (id: string) => {
        setIsLoading(true);

        try {
            const formattedData = await loadDiagnosticData(id);
            
            // Actualizar ambos estados
            updateFormDataState(formattedData);
            reset(formattedData);
            
            setFormState(prev => ({ 
                ...prev, 
                isLoading: false, 
                mode: "edit",
                diagnosticId: id,
                isDirty: false
            }));
        } catch (error) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : "Error al cargar el diagnóstico";
            onSaveError?.(errorMessage);
        }
    }, [loadDiagnosticData, updateFormDataState, reset, setIsLoading, setFormState, onSaveError]);

    // Resetear formulario
    const resetForm = useCallback(() => {
        resetFormData();
        reset();
    }, [resetFormData, reset]);

    // Función de validación manual
    const validate = useCallback(async (): Promise<boolean> => {
        return await validateForSave();
    }, [validateForSave]);

    return {
        formData,
        formState,
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        updateFormData,
        saveDiagnostic,
        loadDiagnostic,
        resetForm,
        isValid,
        validate
    };
}