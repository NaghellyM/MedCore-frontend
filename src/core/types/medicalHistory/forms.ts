/**
 * TIPOS DE FORMULARIOS DE HISTORIA MÉDICA
 * =======================================
 * Este archivo contiene los tipos específicos para los formularios de UI
 */

import type { PatientSearchResult } from "../patient";
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

import type { ValidationError as BaseValidationError, ValidationResult } from "../shared";

// Re-exportar ValidationError base para compatibilidad
export type { ValidationError as BaseValidationError } from "../shared";

// Validación específica del historial médico
export interface ValidationError extends BaseValidationError {
    section: MedicalHistorySection;
}

export interface FormValidationResult extends ValidationResult {
    errors: ValidationError[];
}

// Contexto del módulo
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