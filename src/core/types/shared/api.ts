/**
 * TIPOS COMPARTIDOS - API
 * =======================
 * Este archivo contiene interfaces comunes para respuestas de API
 */

// Respuesta base para operaciones de la API
export interface BaseApiResponse {
    success: boolean;
    message: string;
}

// Paginación estándar
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Respuesta paginada genérica
export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

// Parámetros de paginación
export interface PaginationParams {
    page?: number;
    limit?: number;
}

// Parámetros de ordenamiento
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Estados genéricos
export type EntityState = "ACTIVE" | "INACTIVE" | "PENDING";

// Timestamps estándar
export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

// Respuesta genérica con datos
export interface DataResponse<T> extends BaseApiResponse {
    data: T;
}

// Respuesta de operación (CRUD)
export interface OperationResult {
    success: boolean;
    message?: string;
    errors?: string[];
}