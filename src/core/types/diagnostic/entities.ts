/**
 * ENTIDADES DE DIAGNÓSTICO
 * Tipos específicos para el manejo de diagnósticos médicos
 */

// Estados del diagnóstico (actualizado según respuesta real del backend)
// ACTIVE: Diagnóstico activo y visible
// ARCHIVED: Diagnóstico archivado (oculto pero recuperable)
// DELETED: Diagnóstico eliminado lógicamente (soft delete)
export type DiagnosticState = "ACTIVE" | "ARCHIVED" | "DELETED";

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

// Entidad principal del diagnóstico basada en la respuesta real del API
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
    consultDate: string; // ISO date string
    nextAppointment: string | null; // ISO date string
    state: DiagnosticState;
    customFields: Record<string, unknown> | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    documents: DiagnosticDocument[]; // Array de documentos asociados
}

// DTO para crear un diagnóstico
export interface CreateDiagnosticDto {
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

// DTO para actualizar un diagnóstico
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

// Diagnóstico con información expandida (para vistas detalladas)
export interface DiagnosticDetails extends Diagnostic {
    doctor?: {
        id: string;
        fullname: string;
        email: string;
        specialization?: string;
    };
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
    medicalHistoryId: string;
    title: string;
    description?: string | null;
    diagnosis: string | null;
    consultDate: string;
    state: DiagnosticState;
    doctorName?: string;
    createdAt: string;
    updatedAt: string;
}

// Filtros para búsqueda de diagnósticos
export interface DiagnosticFilters {
    medicalHistoryId?: string;
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
    predefined?: boolean; // Permite obtener diagnósticos predefinidos
}