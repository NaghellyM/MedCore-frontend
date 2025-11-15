/**
 * TIPOS DE FORMULARIOS DE HISTORIA MÉDICA
 * =======================================
 * Este archivo contiene los tipos específicos para los formularios de UI
 */

import type { PatientSearchResult } from "../patient";
import type { ValidationError as BaseValidationError, ValidationResult } from "../shared";
import type { VitalSigns, Prescription, MedicalOrder } from "./entities";

// Secciones del formulario
export type MedicalHistorySection = 
    | "patient-search"
    | "consultation" 
    | "physical-exam"
    | "medical-history"
    | "diagnostics"
    | "treatment"
    | "follow-up";

// Datos del formulario de historia clínica
export interface MedicalHistoryFormData {
    // Información del paciente (solo lectura)
    patientInfo: {
        id: string;
        fullname: string;
        identificacion: string;
        email?: string;
        phone?: string;
        age?: number;
        gender?: string;
    };

    // Motivo de consulta
    consultation: {
        chiefComplaint: string;
        currentIllnessHistory: string;
        consultDate: string;
    };

    // Examen físico y signos vitales
    physicalExam: {
        vitalSigns: VitalSigns;
        generalAppearance: string;
        systemicExam: string;
    };

    // Antecedentes
    medicalHistory: {
        personalHistory: string;
        familyHistory: string;
        allergies: string;
        currentMedications: string;
    };

    // Diagnósticos
    diagnostics: {
        symptoms: string;
        clinicalFindings: string;
        primaryDiagnosis: string;
        secondaryDiagnosis?: string;
        diagnosticImpression: string;
    };

    // Tratamiento y órdenes
    treatment: {
        treatmentPlan: string;
        prescriptions: Prescription[];
        medicalOrders: MedicalOrder[];
        recommendations: string;
    };

    // Seguimiento
    followUp: {
        nextAppointmentDate?: string;
        observations: string;
        warningFlags: string;
    };

    // Campos adicionales personalizables
    customFields?: Record<string, any>;
}

// Estados del componente de búsqueda de pacientes
export interface PatientSearchState {
    query: string;
    results: PatientSearchResult[];
    selectedPatient: PatientSearchResult | null;
    isSearching: boolean;
    showResults: boolean;
    recentPatients: PatientSearchResult[];
    error: string | null;
}

// Estados del formulario de historia clínica
export interface MedicalHistoryFormState {
    mode: "create" | "edit";
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    errors: Record<string, string>;
    currentSection: MedicalHistorySection;
    historyId?: string;
}

// Props para componentes de secciones
export interface SectionProps {
    data: Partial<MedicalHistoryFormData>;
    onUpdate: (sectionData: Partial<MedicalHistoryFormData>) => void;
    isReadOnly?: boolean;
    errors?: Record<string, string>;
}

// Configuración de secciones
export interface SectionConfig {
    id: MedicalHistorySection;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isRequired: boolean;
    order: number;
}



// Validación específica del historial médico
export interface ValidationError extends BaseValidationError {
    section: MedicalHistorySection;
}

export interface FormValidationResult extends ValidationResult {
    errors: ValidationError[];
}

// === FORMULARIOS DE DIAGNÓSTICO ===

// Datos del formulario de diagnóstico (alineado con CreateDiagnosticDto)
export interface DiagnosticFormData {
    title: string;
    description?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    prescriptions?: string;
    physicalExam?: string;
    vitalSigns?: string;
    consultDate: string; // ISO date string
    nextAppointment?: string; // ISO date string
    customFields?: Record<string, unknown>;
}

// Campos requeridos del formulario de diagnóstico
export interface DiagnosticFormRequiredFields {
    title: string;
    consultDate: string;
}

// Estado del formulario de diagnóstico
export interface DiagnosticFormState {
    mode: "create" | "edit";
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    errors: Record<string, string>;
    diagnosticId?: string;
    medicalHistoryId?: string;
    patientId?: string;
}

// Configuración del formulario de diagnóstico
export interface DiagnosticFormConfig {
    showOptionalFields: boolean;
    enableAutoSave: boolean;
    validationMode: "onChange" | "onBlur" | "onSubmit";
}

// Datos iniciales del formulario de diagnóstico
export interface DiagnosticFormInitialData extends Partial<DiagnosticFormData> {
    patientId: string;
    medicalHistoryId?: string;
}

// Errores de validación del diagnóstico
export interface DiagnosticValidationErrors {
    [key: string]: string;
}

// Props para el formulario de diagnóstico
export interface DiagnosticFormProps {
    initialData?: DiagnosticFormInitialData;
    config?: Partial<DiagnosticFormConfig>;
    onSubmit: (data: DiagnosticFormData) => Promise<void>;
    onCancel?: () => void;
    isReadOnly?: boolean;
}

// Props para secciones del formulario de diagnóstico
export interface DiagnosticFormSectionProps {
    data: Partial<DiagnosticFormData>;
    onUpdate: (sectionData: Partial<DiagnosticFormData>) => void;
    errors?: DiagnosticValidationErrors;
    isReadOnly?: boolean;
}

// Configuración de campos del formulario
export interface DiagnosticFieldConfig {
    required: boolean;
    multiline?: boolean;
    placeholder?: string;
    helperText?: string;
    validation?: (value: any) => string | null;
}

export interface DiagnosticFieldsConfig {
    [key: string]: DiagnosticFieldConfig;
}

// === FORMULARIOS DE FILTROS ===

// Datos del formulario de filtros de diagnóstico  
export interface DiagnosticFilterFormData {
    state?: "ACTIVE" | "INACTIVE" | "DELETED";
    doctorId?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
}

// Props para el formulario de filtros
export interface DiagnosticFilterFormProps {
    initialFilters?: DiagnosticFilterFormData;
    onFiltersChange: (filters: DiagnosticFilterFormData) => void;
    onReset?: () => void;
}

// Contexto del módulo de historia médica
export interface MedicalHistoryContextValue {
    // Estado del formulario
    formData: Partial<MedicalHistoryFormData>;
    formState: MedicalHistoryFormState;
    
    // Estado de búsqueda de pacientes
    patientSearch: PatientSearchState;
    
    // Acciones
    updateFormData: (data: Partial<MedicalHistoryFormData>) => void;
    selectPatient: (patient: PatientSearchResult) => void;
    searchPatients: (query: string) => void;
    clearPatientSearch: () => void;
    saveHistory: () => Promise<void>;
    loadHistory: (historyId: string) => Promise<void>;
    resetForm: () => void;
    
    // Navegación entre secciones
    goToSection: (section: MedicalHistorySection) => void;
    nextSection: () => void;
    previousSection: () => void;
}