
/**
 * TIPOS LEGACY - BACKEND
 * ======================
 * Este archivo contiene tipos legacy del backend que pueden ser necesarios
 * para compatibilidad con código existente. NO usar para nuevos desarrollos.
 * 
 * @deprecated Usar tipos desde ./entities.ts y ./api-responses.ts
 */

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface DoctorSummary {
    id: string;
    fullname: string;
    email: string;
}

export interface DiagnosticDocument {
    id: string;
    url: string;
    name: string;
    type: string;
    uploadedAt: string;
}

export type DiagnosticState = "ACTIVE" | "ARCHIVED" | "DELETED";

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

export interface MedicalHistory {
    id: string;
    patientId: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    diagnostics: Diagnostic[];
    doctor: DoctorSummary;
}

export interface MedicalHistoryByIdResponse {
    message: string;
    data: MedicalHistory;
}

export interface PatientMedicalHistoryResponse extends MedicalHistory {
    pagination: Pagination;
}

export interface MedicalHistoryByIdResponse {
    message: string;
    data: MedicalHistory;
}