// Tipos para las respuestas del API de diagnósticos

import type { Diagnostic, DiagnosticSummary } from './entities';

// Respuesta base del API 
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Respuesta paginada del API
export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Respuesta al obtener un diagnóstico por ID
export interface GetDiagnosticByIdResponse extends ApiResponse<Diagnostic> {}

// Respuesta al obtener diagnósticos por paciente
export interface GetDiagnosticsByPatientResponse extends ApiResponse<Diagnostic[]> {}

// Respuesta paginada de diagnósticos
export interface GetDiagnosticsResponse extends PaginatedResponse<DiagnosticSummary> {}

// Respuesta al crear un diagnóstico
export interface CreateDiagnosticResponse extends ApiResponse<{
    diagnosticId: string;
    medicalHistoryId: string;
    patientId: string;
}> {}

// Respuesta al actualizar un diagnóstico
export interface UpdateDiagnosticResponse extends ApiResponse<{
    diagnosticId: string;
    updatedAt: string;
}> {}

// Respuesta al actualizar estado
export interface UpdateDiagnosticStateResponse extends ApiResponse<{
    diagnosticId: string;
    previousState: string;
    currentState: string;
    updatedAt: string;
}> {}

// Respuesta al eliminar un diagnóstico
export interface DeleteDiagnosticResponse extends ApiResponse<{
    diagnosticId: string;
    deletedAt: string;
}> {}

// Respuesta de error del API
export interface DiagnosticApiError {
    success: false;
    message: string;
    error?: {
        code: string;
        details?: any;
    };
}