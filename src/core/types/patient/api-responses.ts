import type { Patient, PatientSearchResult } from "./entities";
import type { BaseApiResponse } from "../shared";

/**
 * RESPUESTAS DE API PARA PACIENTES
 * ================================
 * Este archivo contiene todas las interfaces para las respuestas de la API
 */

// Re-exportar BaseApiResponse para compatibilidad
export type { BaseApiResponse } from "../shared";

// Respuesta paginada para búsquedas de pacientes
export interface PatientSearchResponse {
    patients: PatientSearchResult[];
    total: number;
    page: number;
    totalPages: number;
    currentPage?: number;
}

// Respuesta para creación de paciente
export interface CreatePatientResponse extends BaseApiResponse {
    data: Patient;
}

// Respuesta para actualización de paciente
export interface UpdatePatientResponse extends BaseApiResponse {
    data: Patient;
}

// Respuesta para eliminación de paciente
export interface DeletePatientResponse extends BaseApiResponse {
    deletedId: string;
}

// Respuesta para obtener un paciente por ID
export interface GetPatientByIdResponse {
    data: Patient;
    message?: string;
}