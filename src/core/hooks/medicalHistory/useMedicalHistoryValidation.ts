/**
 * HOOK DE VALIDACIÓN DE HISTORIA MÉDICA
 * Gestiona únicamente la validación del formulario de historia médica
 * Integra con React Hook Form y el validador centralizado
 */

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type { 
    MedicalHistoryFormData, 
    MedicalHistorySection,
    ValidationError,
    FormValidationResult
} from "../../types/medicalHistory";
import { MedicalHistoryFormValidator } from "../../validators/medicalHistoryFormValidator";

interface UseMedicalHistoryValidationOptions {
    initialData?: Partial<MedicalHistoryFormData>;
    mode?: "onChange" | "onBlur" | "onSubmit";
}

interface UseMedicalHistoryValidationReturn {
    // React Hook Form
    register: any;
    handleSubmit: any;
    setValue: any;
    watch: any;
    formErrors: any;
    reset: any;
    
    // Estado de validación
    isDirty: boolean;
    
    // Funciones de validación
    validateSection: (section: MedicalHistorySection) => ValidationError[];
    validateForm: () => FormValidationResult;
    validateForSave: () => FormValidationResult;
    isSectionComplete: (section: MedicalHistorySection) => boolean;
    isReadyToSave: () => boolean;
}

export function useMedicalHistoryValidation(
    formData: Partial<MedicalHistoryFormData>,
    options: UseMedicalHistoryValidationOptions = {}
): UseMedicalHistoryValidationReturn {
    const { initialData, mode = "onChange" } = options;

    const defaultData = MedicalHistoryFormValidator.getDefaultFormData();
    const defaultValues = { ...defaultData, ...initialData };

    // React Hook Form setup (sin resolver para evitar validación automática conflictiva)
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors: formErrors, isDirty }
    } = useForm<MedicalHistoryFormData>({
        defaultValues: defaultValues as MedicalHistoryFormData,
        mode
    });

    // Validar una sección específica
    const validateSection = useCallback((section: MedicalHistorySection): ValidationError[] => {
        return MedicalHistoryFormValidator.validateSection(section, formData);
    }, [formData]);

    // Validar todo el formulario
    const validateForm = useCallback((): FormValidationResult => {
        return MedicalHistoryFormValidator.validateForm(formData);
    }, [formData]);

    // Validar antes de guardar (más estricto)
    const validateForSave = useCallback((): FormValidationResult => {
        return MedicalHistoryFormValidator.validateForm(formData);
    }, [formData]);

    // Verificar si una sección está completa
    const isSectionComplete = useCallback((section: MedicalHistorySection): boolean => {
        return MedicalHistoryFormValidator.isSectionComplete(section, formData);
    }, [formData]);

    // Verificar si está listo para guardar
    const isReadyToSave = useCallback((): boolean => {
        return MedicalHistoryFormValidator.isReadyToSave(formData);
    }, [formData]);

    return {
        register,
        handleSubmit,
        setValue,
        watch,
        formErrors,
        reset,
        isDirty,
        validateSection,
        validateForm,
        validateForSave,
        isSectionComplete,
        isReadyToSave
    };
}