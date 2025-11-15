import type { PatientSearchResult } from "../patient";

// Tipos base para la historia clínica
export interface MedicalHistoryFormData {
    // Información del paciente (solo lectura)
    patientInfo: {
        id: string;
        fullname: string;
        identificacion: string; // Alineado con el backend
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
        vitalSigns: {
            bloodPressure?: string;
            heartRate?: number;
            temperature?: number;
            respiratoryRate?: number;
            oxygenSaturation?: number;
            weight?: number;
            height?: number;
        };
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

export interface Prescription {
    id?: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
}

export interface MedicalOrder {
    id?: string;
    type: "laboratory" | "imaging" | "procedure" | "consultation";
    description: string;
    urgency: "routine" | "urgent" | "stat";
    instructions?: string;
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

export type MedicalHistorySection = 
    | "patient-search"
    | "consultation" 
    | "physical-exam"
    | "medical-history"
    | "diagnostics"
    | "treatment"
    | "follow-up";

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

// Respuestas de API
export interface CreateMedicalHistoryResponse {
    success: boolean;
    message: string;
    data: {
        historyId: string;
        patientId: string;
    };
}

export interface UpdateMedicalHistoryResponse {
    success: boolean;
    message: string;
    data: {
        historyId: string;
        updatedAt: string;
    };
}

// Validación
export interface ValidationError {
    field: string;
    message: string;
    section: MedicalHistorySection;
}

export interface FormValidationResult {
    isValid: boolean;
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