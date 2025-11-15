/**
 * HOOK - FORMULARIO DE DIAGNÓSTICOS
 * ==================================
 * Hook para manejar formularios de diagnósticos con validación
 */

import { useState, useCallback, useMemo } from 'react';
import type {
    DiagnosticFormData,
    DiagnosticValidationErrors,
    UseDiagnosticFormReturn,
    UseDiagnosticFormConfig
} from '../../types/diagnostic';

// Validaciones por defecto
const defaultValidationRules = {
    title: (value: string) => {
        if (!value?.trim()) return 'El título es requerido';
        if (value.length < 3) return 'El título debe tener al menos 3 caracteres';
        if (value.length > 200) return 'El título no puede exceder 200 caracteres';
        return null;
    },
    consultDate: (value: string) => {
        if (!value) return 'La fecha de consulta es requerida';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Fecha de consulta inválida';
        if (date > new Date()) return 'La fecha de consulta no puede ser futura';
        return null;
    },
    description: (value: string) => {
        if (value && value.length > 1000) return 'La descripción no puede exceder 1000 caracteres';
        return null;
    },
    symptoms: (value: string) => {
        if (value && value.length > 1000) return 'Los síntomas no pueden exceder 1000 caracteres';
        return null;
    },
    diagnosis: (value: string) => {
        if (value && value.length > 1000) return 'El diagnóstico no puede exceder 1000 caracteres';
        return null;
    },
    treatment: (value: string) => {
        if (value && value.length > 1000) return 'El tratamiento no puede exceder 1000 caracteres';
        return null;
    },
    observations: (value: string) => {
        if (value && value.length > 1000) return 'Las observaciones no pueden exceder 1000 caracteres';
        return null;
    },
    prescriptions: (value: string) => {
        if (value && value.length > 1000) return 'Las prescripciones no pueden exceder 1000 caracteres';
        return null;
    },
    physicalExam: (value: string) => {
        if (value && value.length > 1000) return 'El examen físico no puede exceder 1000 caracteres';
        return null;
    },
    vitalSigns: (value: string) => {
        if (value && value.length > 500) return 'Los signos vitales no pueden exceder 500 caracteres';
        return null;
    },
    nextAppointment: (value: string) => {
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) return 'Fecha de próxima cita inválida';
            if (date <= new Date()) return 'La próxima cita debe ser en el futuro';
        }
        return null;
    },
    customFields: (_value: Record<string, string>) => {
        // Validación básica para campos personalizados
        return null;
    }
};

// Datos iniciales del formulario
const initialFormData: DiagnosticFormData = {
    title: '',
    description: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    observations: '',
    prescriptions: '',
    physicalExam: '',
    vitalSigns: '',
    consultDate: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    nextAppointment: '',
    customFields: {}
};

export const useDiagnosticForm = (config: UseDiagnosticFormConfig): UseDiagnosticFormReturn => {
    const {
        initialData,
        validationRules = defaultValidationRules,
        onSubmit,
        validateOnChange = true
    } = config;

    // Estado del formulario
    const [formData, setFormData] = useState<DiagnosticFormData>({
        ...initialFormData,
        ...initialData
    });
    
    const [errors, setErrors] = useState<DiagnosticValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Validar un campo específico
    const validateField = useCallback((field: keyof DiagnosticFormData) => {
        const value = formData[field];
        const rule = validationRules[field];
        
        if (rule) {
            const error = rule(value as any);
            setErrors(prev => ({
                ...prev,
                [field]: error
            }));
            return !error;
        }
        
        return true;
    }, [formData, validationRules]);

    // Validar todo el formulario
    const validateForm = useCallback(() => {
        const newErrors: DiagnosticValidationErrors = {};
        let isValid = true;

        (Object.keys(validationRules) as Array<keyof DiagnosticFormData>).forEach(field => {
            const value = formData[field];
            const rule = validationRules[field];
            
            if (rule) {
                const error = rule(value as any);
                if (error) {
                    (newErrors as any)[field] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [formData, validationRules]);

    // Comprobar si el formulario es válido
    const isValid = useMemo(() => {
        return Object.values(errors).every(error => !error);
    }, [errors]);

    // Comprobar si hay cambios
    const hasChanges = useMemo(() => {
        if (!initialData) return isDirty;
        
        return Object.keys(formData).some(key => {
            const fieldKey = key as keyof DiagnosticFormData;
            return formData[fieldKey] !== initialData[fieldKey];
        });
    }, [formData, initialData, isDirty]);

    // Actualizar un campo
    const updateField = useCallback((field: keyof DiagnosticFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        setIsDirty(true);

        if (validateOnChange) {
            // Validar después de un pequeño delay para evitar validaciones excesivas
            setTimeout(() => validateField(field), 300);
        }
    }, [validateOnChange, validateField]);

    // Actualizar múltiples campos
    const updateFields = useCallback((fields: Partial<DiagnosticFormData>) => {
        setFormData(prev => ({
            ...prev,
            ...fields
        }));
        
        setIsDirty(true);

        if (validateOnChange) {
            setTimeout(() => {
                Object.keys(fields).forEach(key => {
                    validateField(key as keyof DiagnosticFormData);
                });
            }, 300);
        }
    }, [validateOnChange, validateField]);

    // Resetear formulario
    const resetForm = useCallback((data?: Partial<DiagnosticFormData>) => {
        const newData = {
            ...initialFormData,
            ...initialData,
            ...data
        };
        
        setFormData(newData);
        setErrors({});
        setIsDirty(false);
        setIsSubmitting(false);
    }, [initialData]);

    // Resetear errores
    const resetErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Establecer error específico
    const setError = useCallback((field: keyof DiagnosticFormData, error: string) => {
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));
    }, []);

    // Limpiar error específico
    const clearError = useCallback((field: keyof DiagnosticFormData) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    // Enviar formulario
    const submit = useCallback(async () => {
        if (isSubmitting) return;
        
        const isFormValid = validateForm();
        if (!isFormValid) return;

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            setIsDirty(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Establecer error general en el estado de errores
            setErrors(prev => ({
                ...prev,
                _form: error instanceof Error ? error.message : 'Error al enviar el formulario'
            }));
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, validateForm, onSubmit, formData, setError]);

    return {
        // Estado
        formData,
        errors,
        isValid,
        isDirty,
        isSubmitting,
        hasChanges,
        
        // Acciones
        updateField,
        updateFields,
        validateField,
        validateForm,
        resetForm,
        resetErrors,
        setError,
        clearError,
        submit
    };
};