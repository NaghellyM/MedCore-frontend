/**
 * RESPUESTAS DE API DEL HISTORIAL MÉDICO
 * ======================================
 * Este archivo contiene todas las interfaces para respuestas de API
 */

import type { MedicalHistory } from "./entities";
import type { Pagination } from "../shared";

// Re-exportar Pagination para compatibilidad
export type { Pagination } from "../shared";

// Respuestas de API para historial médico
export interface MedicalHistoryByIdResponse {
    message: string;
    data: MedicalHistory;
}

export interface PatientMedicalHistoryResponse extends MedicalHistory {
    pagination: Pagination;
}

// Respuestas para operaciones CRUD del formulario
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