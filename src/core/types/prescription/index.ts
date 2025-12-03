// Tipos para el módulo de Prescripciones

// Estados de prescripción
export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// Tipos de duración
export type DurationType = 'días' | 'semanas' | 'meses' | 'days' | 'weeks' | 'months';

// Tipos de medicamento para validación
export type MedicationType = 
    | 'antibiotico' 
    | 'antiinflamatorio' 
    | 'analgesico' 
    | 'antihipertensivo' 
    | 'anticoagulante' 
    | 'vitamina' 
    | 'antidiabetico'
    | string;

// Medicamento en una prescripción
export interface PrescriptionMedication {
    id?: string;
    medicationName: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    duration: number;
    durationType: DurationType;
    instructions?: string;
    warnings?: string;
    medicationType?: MedicationType;
}

// DTO para crear medicamento
export interface CreateMedicationDto {
    medicationName: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    duration: number;
    durationType: DurationType;
    instructions?: string;
    warnings?: string;
    medicationType?: MedicationType;
}

// Prescripción completa
export interface Prescription {
    id: string;
    medicalHistoryId: string;
    diagnosticId?: string | null;
    doctorId: string;
    patientId: string;
    prescriptionDate: string;
    validUntil?: string;
    status: PrescriptionStatus;
    notes?: string;
    allergies: string[];
    medications: PrescriptionMedication[];
    createdAt?: string;
    updatedAt?: string;
}

// DTO para crear prescripción
export interface CreatePrescriptionDto {
    patientId: string;
    diagnosticId?: string;
    notes?: string;
    allergies?: string[];
    medications: CreateMedicationDto[];
}

// DTO para actualizar estado
export interface UpdatePrescriptionStatusDto {
    status: PrescriptionStatus;
}

// Advertencia de duración
export interface DurationWarning {
    medication: string;
    message: string;
    suggested: {
        duration: number;
        durationType: DurationType;
    };
}

// Advertencia de alergia
export interface AllergyWarning {
    medication: string;
    allergy: string;
    message: string;
}

// Info del PDF
export interface PrescriptionPdfInfo {
    available: boolean;
    size?: number;
    downloadUrl: string;
}

// Info del paciente en respuesta
export interface PatientInfo {
    id: string;
    name: string;
}

// Paginación
export interface PrescriptionPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// === RESPUESTAS DE API ===

// Respuesta al crear prescripción
export interface CreatePrescriptionResponse {
    message: string;
    prescription: Prescription;
    durationWarnings?: DurationWarning[];
    pdf?: PrescriptionPdfInfo;
}

// Respuesta de error por alergias
export interface AllergyConflictResponse {
    message: string;
    allergyWarnings: AllergyWarning[];
    patientAllergies: string[];
}

// Respuesta al obtener prescripción por ID
export interface GetPrescriptionByIdResponse {
    message: string;
    prescription: Prescription;
}

// Respuesta al obtener prescripciones de un paciente
export interface GetPrescriptionsByPatientResponse {
    message: string;
    data: Prescription[];
    pagination: PrescriptionPagination;
    patient: PatientInfo;
}

// Respuesta al obtener prescripciones activas
export interface GetActivePrescriptionsResponse {
    message: string;
    total: number;
    prescriptions: Prescription[];
    patient: PatientInfo;
}

// Respuesta al actualizar estado
export interface UpdatePrescriptionStatusResponse {
    message: string;
    prescription: Prescription;
}

// Parámetros de consulta
export interface GetPrescriptionsParams {
    page?: number;
    limit?: number;
    status?: PrescriptionStatus;
}
