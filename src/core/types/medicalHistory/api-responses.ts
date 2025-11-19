/**
 * RESPUESTAS DE API DEL HISTORIAL MÉDICO
 * ======================================
 * Este archivo contiene todas las interfaces para respuestas de API
 */

import type { MedicalHistory, Pagination } from "./entities";

// Respuesta base genérica
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

// Respuesta paginada genérica
export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: Pagination;
}

// === RESPUESTAS DE HISTORIAL MÉDICO ===

// Respuesta al obtener historial médico por ID
export interface MedicalHistoryByIdResponse {
    message: string;
    data: MedicalHistory;
}

// Respuesta al obtener historial médico de un paciente (con paginación)
// Según la respuesta real del backend, extiende MedicalHistory y añade pagination
export interface PatientMedicalHistoryResponse extends MedicalHistory {
    pagination: Pagination;
}

// Respuesta para obtener todas las historias médicas
export interface AllMedicalHistoriesResponse {
    patients: {
        id: string;
        fullname: string;
        identificacion: string;
        email?: string;
        historyNumber?: string;
        medicalHistory?: {
            id: string;
            totalDiagnostics: number;
            lastDiagnosticDate?: string | null;
            createdAt: string;
            updatedAt: string;
        };
        doctor?: {
            id: string;
            fullname: string;
            email: string;
        };
    }[];
    pagination?: Pagination;
}

// Respuestas para operaciones CRUD del historial médico
// ✅ CORREGIDO: Alineado exactamente con respuesta del backend
export interface CreateMedicalHistoryResponse {
    message: string;
    data: {
        id: string;           // ✅ Backend devuelve 'id'
        patientId: string;    // ✅ Backend devuelve 'patientId'
        createdBy: string;    // ✅ Backend devuelve 'createdBy'
        createdAt: string;    // ✅ Backend devuelve 'createdAt'
        updatedAt: string;    // ✅ Backend devuelve 'updatedAt'
        // ❌ Backend NO devuelve: diagnostics[], success
    };
}

export interface UpdateMedicalHistoryResponse {
    success?: boolean;
    message: string;
    data: {
        id: string;           // Backend devuelve 'id', no 'historyId'
        updatedAt: string;
    };
}

// === RESPUESTAS DE DIAGNÓSTICOS ===

// Respuesta al obtener un diagnóstico por ID
export interface GetDiagnosticByIdResponse {
    success: boolean;
    message: string;
    data: any; // Usar any para evitar circular dependency
}

// Respuesta al obtener diagnósticos de un paciente
export interface GetDiagnosticsByPatientResponse {
    success: boolean;
    message: string;
    data: any[];
}

// Respuesta paginada de diagnósticos
export interface GetDiagnosticsResponse {
    success: boolean;
    message: string;
    data: any[];
    pagination: Pagination;
}

// Respuesta al crear un diagnóstico
// ✅ ACTUALIZADO: Alineado con la respuesta REAL del backend (ahora incluye diagnosticId)
export interface CreateDiagnosticResponse {
    message: string;
    data: {
        patient: {
            id: string;
            createdAt: string;
            updatedAt: string;
        };
        doctor: {
            id: string;
            email: string;
            role: string;
            fullname: string;
        };
        documents: any[]; // Array vacío inicialmente
        diagnosticId: string; // ✅ ¡AHORA SÍ INCLUIDO! UUID del diagnóstico creado
    };
}

// Respuesta al actualizar un diagnóstico
export interface UpdateDiagnosticResponse {
    success: boolean;
    message: string;
    data: {
        diagnosticId: string;
        updatedAt: string;
    };
}

// Respuesta al actualizar estado de un diagnóstico
export interface UpdateDiagnosticStateResponse {
    success: boolean;
    message: string;
    data: {
        diagnosticId: string;
        previousState: string;
        currentState: string;
        updatedAt: string;
    };
}

// Respuesta al eliminar un diagnóstico
export interface DeleteDiagnosticResponse {
    success: boolean;
    message: string;
    data: {
        diagnosticId: string;
        deletedAt: string;
    };
}

// Errores de API
export interface DiagnosticApiError {
    success: false;
    message: string;
    error?: {
        code: string;
        details?: any;
    };
}