/**
 * DIAGNÓSTICOS PREDEFINIDOS
 * Tipos para el manejo de diagnósticos predefinidos del sistema
 */

// Entidad de diagnóstico predefinido
export interface PredefinedDiagnostic {
    id: string;
    code: string;
    name: string;
    description: string;
    commonSymptoms: string;
    recommendedTreatment: string;
    observations?: string;
    category: string;
    severity: string;
    createdAt?: string;
    updatedAt?: string;
}

// Filtros para búsqueda de diagnósticos predefinidos
export interface PredefinedDiagnosticFilters {
    category?: string;
    severity?: string;
}

// Respuesta del API para diagnósticos predefinidos
export interface GetPredefinedDiagnosticsResponse {
    message: string;
    data: PredefinedDiagnostic[];
}

// Respuesta del API para obtener un diagnóstico predefinido por ID
export interface GetPredefinedDiagnosticByIdResponse {
    message: string;
    data: PredefinedDiagnostic;
}

// Estado del hook usePredefinedDiagnostics
export interface UsePredefinedDiagnosticsState {
    predefinedDiagnostics: PredefinedDiagnostic[];
    isLoading: boolean;
    error: string | null;
    filters: PredefinedDiagnosticFilters;
}

// Acciones del hook usePredefinedDiagnostics
export interface UsePredefinedDiagnosticsActions {
    fetchPredefinedDiagnostics: (filters?: PredefinedDiagnosticFilters) => Promise<void>;
    setFilters: (filters: PredefinedDiagnosticFilters) => void;
    clearFilters: () => void;
    getPredefinedById: (id: string) => PredefinedDiagnostic | undefined;
    getCategories: () => string[];
    getSeverities: () => string[];
}

// Retorno del hook usePredefinedDiagnostics
export interface UsePredefinedDiagnosticsReturn extends UsePredefinedDiagnosticsState, UsePredefinedDiagnosticsActions {}

// Categorías de severidad comunes
export const DIAGNOSTIC_SEVERITIES = {
    LOW: 'BAJA',
    MODERATE: 'MODERADA', 
    HIGH: 'ALTA',
    CRITICAL: 'CRITICA'
} as const;

export type DiagnosticSeverity = typeof DIAGNOSTIC_SEVERITIES[keyof typeof DIAGNOSTIC_SEVERITIES];
