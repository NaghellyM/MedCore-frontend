/**
 * HOOK DE VALIDACIÓN DEL FORMULARIO DE DIAGNÓSTICO
 * Gestiona únicamente la validación del formulario usando DiagnosticFormValidator
 * Separado del hook principal para mejor reutilización
 */

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { DiagnosticFormData } from "../../types/medicalHistory";
import { DiagnosticFormValidator } from "../../validators/diagnosticFormValidator";

interface UseDiagnosticValidationOptions {
    initialData?: DiagnosticFormData;
    mode?: "onChange" | "onBlur" | "onSubmit";
}

interface UseDiagnosticValidationReturn {
    // React Hook Form
    register: any;
    handleSubmit: any;
    setValue: any;
    watch: any;
    formErrors: any;
    reset: any;
    trigger: any;
    
    // Estado de validación
    isValid: boolean;
    isDirty: boolean;
    
    // Funciones de validación
    validateField: (fieldName: keyof DiagnosticFormData, value: any) => Promise<{ isValid: boolean; error?: string }>;
    validateFormData: (data: DiagnosticFormData) => Promise<{ isValid: boolean; errors: Record<string, string> }>;
    validateForSave: () => Promise<boolean>;
}

export function useDiagnosticValidation(
    options: UseDiagnosticValidationOptions = {}
): UseDiagnosticValidationReturn {
    const { initialData, mode = "onChange" } = options;

    const defaultData = DiagnosticFormValidator.getDefaultFormData(initialData);

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        trigger,
        formState: { errors: formErrors, isDirty, isValid }
    } = useForm<DiagnosticFormData>({
        defaultValues: defaultData,
        resolver: yupResolver(DiagnosticFormValidator.validationSchema),
        mode,
        shouldFocusError: false,
        criteriaMode: "firstError"
    });

    // Validar un campo específico
    const validateField = useCallback(async (
        fieldName: keyof DiagnosticFormData, 
        value: any
    ) => {
        return DiagnosticFormValidator.validateField(fieldName, value);
    }, []);

    // Validar datos completos del formulario
    const validateFormData = useCallback(async (data: DiagnosticFormData) => {
        const result = await DiagnosticFormValidator.validateFormData(data);
        return {
            isValid: result.isValid,
            errors: result.errors
        };
    }, []);

    // Validar antes de guardar (más estricto)
    const validateForSave = useCallback(async (): Promise<boolean> => {
        return await trigger();
    }, [trigger]);

    return {
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        trigger,
        isValid,
        isDirty,
        validateField,
        validateFormData,
        validateForSave
    };
}