import type { PatientState } from "./entities";
import type { PaginationParams } from "../shared";

/**
 * PARÁMETROS DE BÚSQUEDA DE PACIENTES
 * ===================================
 * Este archivo contiene todas las interfaces para búsquedas y filtros
 */

// Re-exportar PaginationParams para compatibilidad
export type { PaginationParams } from "../shared";

// Parámetros para búsqueda simple
export interface SimpleSearchParams extends PaginationParams {
    query: string; // Puede ser nombre, email, identificación, etc.
}

// Parámetros para búsqueda avanzada de pacientes
export interface AdvancedSearchParams extends PaginationParams {
    // Búsqueda por datos básicos
    fullname?: string;
    email?: string;
    identificacion?: string;
    phone?: string;
    
    // Búsqueda por estado y rol
    status?: PatientState;
    role?: string;
    
    // Búsqueda por fechas
    dateOfBirthFrom?: string;
    dateOfBirthTo?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
    
    // Búsqueda por edad (calculada)
    ageMin?: number;
    ageMax?: number;
    
    // Búsqueda médica específica
    diagnostic?: string;
    allergies?: string;
    medicalHistory?: string;
    
    // Ordenamiento
    sortBy?: 'fullname' | 'createdAt' | 'updatedAt' | 'date_of_birth';
    sortOrder?: 'asc' | 'desc';
}

// Filtros rápidos predefinidos
export interface QuickFilters extends PaginationParams {
    activeOnly?: boolean;
    recentlyCreated?: boolean; // Últimos 30 días
    recentlyUpdated?: boolean; // Últimos 7 días
    hasEmail?: boolean;
    hasPhone?: boolean;
}