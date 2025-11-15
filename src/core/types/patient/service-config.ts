/**
 * TIPOS ESPECÍFICOS DEL SERVICIO DE PACIENTES
 * ==========================================
 * Este archivo contiene interfaces específicas para las operaciones del servicio
 */

import type { Patient, PatientState } from './entities';

// Configuración de paginación para listados
export interface PaginationConfig {
    page: number;
    limit: number;
    sortBy?: 'fullname' | 'identificacion' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

// Filtros adicionales para la búsqueda
export interface PatientFilters {
    status?: PatientState;
    role?: string;
    dateFrom?: string; // ISO date
    dateTo?: string;   // ISO date
    hasHistory?: boolean;
}

// Parámetros completos de búsqueda
export interface PatientSearchParams {
    query?: string;
    identificacion?: string;
    fullname?: string;
    email?: string;
    phone?: string;
    exactMatch?: boolean;
    filters?: PatientFilters;
    pagination?: PaginationConfig;
}

// Respuesta de operaciones de modificación
export interface PatientOperationResult {
    success: boolean;
    patient?: Patient;
    message?: string;
    errors?: string[];
}

// Respuesta de eliminación/desactivación
export interface PatientDeletionResult {
    success: boolean;
    message?: string;
    affectedPatientId?: string;
}

// Estadísticas de pacientes (para dashboards)
export interface PatientStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    recentlyAdded: number; // Último mes
    withMedicalHistory: number;
}

// Configuración del servicio
export interface PatientServiceConfig {
    enableCache?: boolean;
    cacheTimeout?: number; // en milisegundos
    maxSearchResults?: number;
    defaultPageSize?: number;
}

// Opciones para operaciones del servicio
export interface ServiceOptions {
    skipCache?: boolean;
    timeout?: number;
    retries?: number;
    onProgress?: (progress: number) => void;
    onError?: (error: Error) => void;
}