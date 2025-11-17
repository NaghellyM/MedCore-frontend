/**
 * ENTIDADES MÉDICAS UNIFICADAS
 * ============================
 * Este archivo contiene todas las entidades base del dominio médico
 * consolidando duplicaciones entre archivos
 */

// Enums y tipos base
export type DiagnosticState = "ACTIVE" | "INACTIVE" | "DELETED";
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

// Documentos diagnósticos (según respuesta real del backend)
export interface DiagnosticDocument {
    id: string;
    diagnosticId: string;
    filename: string;
    storedFilename: string;
    filePath: string;
    fileType: string;
    mimeType: string;
    fileSize: number;
    description: string | null;
    uploadedBy: string;
    currentVersion: number;
    createdAt: string;
    updatedAt: string;
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

// Paginación (según respuesta del backend)
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Historia médica principal (según respuesta del backend)
export interface MedicalHistory {
    id: string;
    patientId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    diagnostics: Diagnostic[]; // Array de diagnósticos (relación 1:N)
    doctor: DoctorSummary;
    pagination?: Pagination; // Solo presente en respuestas paginadas
}

// DTOs para operaciones CRUD

// DTO para crear diagnóstico
// ✅ CORREGIDO: Campos obligatorios según backend (diagnosticController.js líneas 56-59)
export interface CreateDiagnosticDto {
    // 🔴 CAMPOS OBLIGATORIOS (backend los valida)
    title: string;        // OBLIGATORIO - Mínimo 3 caracteres
    description: string;  // OBLIGATORIO
    symptoms: string;     // OBLIGATORIO
    diagnosis: string;    // OBLIGATORIO
    treatment: string;    // OBLIGATORIO - ⚠️ CRÍTICO: Nunca debe ser undefined

    // 🟡 CAMPOS OPCIONALES
    observations?: string;
    prescriptions?: string;
    physicalExam?: string;     // JSON stringificado si es objeto
    vitalSigns?: string;       // JSON stringificado si es objeto
    consultDate: string;       // ISO date string - OBLIGATORIO (corregido para coincidir con servicio)
    nextAppointment?: string;  // ISO date string
    customFields?: Record<string, unknown>;
}

// DTO para actualizar diagnóstico
export interface UpdateDiagnosticDto {
    title?: string;
    description?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    prescriptions?: string;
    physicalExam?: string;
    vitalSigns?: string;
    consultDate?: string; // ISO date string
    nextAppointment?: string; // ISO date string
    customFields?: Record<string, unknown>;
}

// DTO para actualizar estado
export interface UpdateDiagnosticStateDto {
    state: DiagnosticState;
}

// Tipos extendidos para vistas detalladas
export interface DiagnosticDetails extends Diagnostic {
    doctor?: DoctorSummary;
    patient?: {
        id: string;
        fullName: string;
        documentNumber: string;
        documentType: string;
    };
    medicalHistory?: {
        id: string;
        patientId: string;
        createdAt: string;
    };
}

// Resumen de diagnóstico para listas
export interface DiagnosticSummary {
    id: string;
    title: string;
    diagnosis: string | null;
    consultDate: string;
    state: DiagnosticState;
    doctorName?: string;
}

// Filtros para búsqueda de diagnósticos
export interface DiagnosticFilters {
    state?: DiagnosticState;
    doctorId?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
}

// Parámetros de búsqueda paginada
export interface DiagnosticSearchParams extends DiagnosticFilters {
    page?: number;
    limit?: number;
    sortBy?: 'consultDate' | 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}