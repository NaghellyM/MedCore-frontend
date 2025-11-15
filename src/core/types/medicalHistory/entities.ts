/**
 * ENTIDADES MÉDICAS UNIFICADAS
 * ============================
 * Este archivo contiene todas las entidades base del dominio médico
 * consolidando duplicaciones entre archivos
 */

// Enums y tipos base
export type DiagnosticState = "ACTIVE" | "INACTIVE";
export type DiagnosisType = "principal" | "secundario";
export type OrderType = "lab" | "imagen" | "interconsulta" | "laboratory" | "imaging" | "procedure" | "consultation";
export type OrderStatus = "pendiente" | "en_proceso" | "listo" | "routine" | "urgent" | "stat";

// Información básica del doctor
export interface DoctorSummary {
    id: string;
    fullname: string;
    email: string;
}

// Información básica del paciente (para contexto médico)
export interface PatientBasicMedical {
    document_type: string;
    document_number: string;
    first_name: string;
    last_name: string;
    birth_date?: string;
    sex_at_birth?: string;
    contact?: { phone?: string | null; email?: string | null };
}

// Signos vitales unificados
export interface VitalSigns {
    // Nomenclatura backend
    bp?: string | null; // blood pressure
    hr?: string | null; // heart rate  
    rr?: string | null; // respiratory rate
    temp?: string | null; // temperature
    spo2?: string | null; // oxygen saturation
    weight?: string | null;
    height?: string | null;
    bmi?: number | null;
    
    // Nomenclatura frontend (para formularios)
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
}

// Medicamentos/Prescripciones unificadas
export interface Medication {
    id?: string;
    drug: string; // nombre del medicamento
    dose: string; // dosis
    route: string; // vía de administración
    frequency: string; // frecuencia
    start_date?: string;
    
    // Campos adicionales del frontend
    medicationName?: string; // alias para drug
    dosage?: string; // alias para dose
    duration?: string;
    instructions?: string;
}

// Alias para compatibilidad con formularios
export interface Prescription extends Medication {
    medicationName: string;
    dosage: string;
    duration: string;
    instructions: string;
}

// Alergias
export interface Allergy {
    substance: string;
    reaction: string;
    severity: string;
}

// Diagnósticos unificados
export interface Diagnosis {
    code?: string;
    description: string;
    type: DiagnosisType;
    date?: string;
}

// Órdenes médicas unificadas
export interface MedicalOrder {
    id?: string;
    type: OrderType;
    description: string;
    status?: OrderStatus;
    urgency?: "routine" | "urgent" | "stat";
    instructions?: string;
}

// Documentos diagnósticos
export interface DiagnosticDocument {
    id: string;
    url: string;
    name: string;
    type: string;
    uploadedAt: string;
}

// Diagnóstico completo (entidad del backend)
export interface Diagnostic {
    id: string;
    medicalHistoryId: string;
    doctorId: string;
    title: string;
    description: string | null;
    symptoms: string | null;
    diagnosis: string | null;
    treatment: string | null;
    observations: string | null;
    prescriptions: string | null;
    physicalExam: string | null;
    vitalSigns: string | null;
    consultDate: string;
    nextAppointment: string | null;
    state: DiagnosticState;
    customFields: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    documents: DiagnosticDocument[];
}

// Historia médica principal
export interface MedicalHistory {
    id: string;
    patientId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    diagnostics: Diagnostic[];
    doctor: DoctorSummary;
}