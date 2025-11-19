/**
 * FORMULARIOS - DIAGNÓSTICOS
 * Tipos para formularios y validación de diagnósticos
 */

import type { DiagnosticState } from './entities';

// Datos del formulario de diagnóstico
export interface DiagnosticFormData {
    title: string;
    description: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    observations: string;
    prescriptions: string;
    physicalExam: string;
    vitalSigns: string;
    consultDate: string;
    nextAppointment: string;
    customFields: Record<string, string>;
}

// Campos requeridos del formulario
export interface DiagnosticFormRequiredFields {
    title: boolean;
    consultDate: boolean;
}

// Estado del formulario
export interface DiagnosticFormState {
    data: DiagnosticFormData;
    errors: Partial<Record<keyof DiagnosticFormData, string>>;
    isValid: boolean;
    isSubmitting: boolean;
    isDirty: boolean;
}

// Configuración del formulario
export interface DiagnosticFormConfig {
    requiredFields: (keyof DiagnosticFormData)[];
    validateOnChange: boolean;
    validateOnBlur: boolean;
    autoSave: boolean;
    autoSaveInterval: number; // milliseconds
}

// Datos iniciales del formulario
export type DiagnosticFormInitialData = Partial<DiagnosticFormData>;

// Errores de validación
export interface DiagnosticValidationErrors {
    title?: string;
    description?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    prescriptions?: string;
    physicalExam?: string;
    vitalSigns?: string;
    consultDate?: string;
    nextAppointment?: string;
    customFields?: Record<string, string>;
    _form?: string; // Error general del formulario
}

// Props para componentes de formulario
export interface DiagnosticFormProps {
    initialData?: DiagnosticFormInitialData;
    patientId: string;
    medicalHistoryId?: string;
    onSubmit: (data: DiagnosticFormData) => void | Promise<void>;
    onCancel?: () => void;
    isEditing?: boolean;
    diagnosticId?: string;
    config?: Partial<DiagnosticFormConfig>;
    className?: string;
}

// Props para secciones del formulario
export interface DiagnosticFormSectionProps {
    formData: DiagnosticFormData;
    errors: DiagnosticValidationErrors;
    onChange: (field: keyof DiagnosticFormData, value: string) => void;
    onBlur?: (field: keyof DiagnosticFormData) => void;
    disabled?: boolean;
    required?: boolean;
}

// Configuración de campos del formulario
export interface DiagnosticFieldConfig {
    label: string;
    placeholder?: string;
    type: 'text' | 'textarea' | 'date' | 'datetime-local' | 'select';
    required: boolean;
    maxLength?: number;
    rows?: number; // para textarea
    options?: { value: string; label: string }[]; // para select
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: string) => string | null;
    };
}

// Mapa de configuración de todos los campos
export type DiagnosticFieldsConfig = Record<keyof DiagnosticFormData, DiagnosticFieldConfig>;

// Estados para filtros de diagnósticos
export interface DiagnosticFilterFormData {
    state: DiagnosticState | '';
    doctorId: string;
    dateFrom: string;
    dateTo: string;
    searchTerm: string;
}

export interface DiagnosticFilterFormProps {
    initialFilters?: Partial<DiagnosticFilterFormData>;
    onFiltersChange: (filters: DiagnosticFilterFormData) => void;
    onReset: () => void;
    doctors?: Array<{ id: string; fullname: string }>;
}