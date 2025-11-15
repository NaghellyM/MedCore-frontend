/**
 * HOOKS - DIAGNÓSTICOS
 * =====================
 * Tipos para hooks personalizados de diagnósticos
 */

import type { 
    Diagnostic, 
    DiagnosticSummary, 
    DiagnosticFilters,
    DiagnosticSearchParams,
    CreateDiagnosticDto,
    UpdateDiagnosticDto,
    DiagnosticState
} from './entities';

import type { DiagnosticFormData, DiagnosticValidationErrors } from './forms';

// Estado de hook de diagnósticos
export interface UseDiagnosticsState {
    diagnostics: DiagnosticSummary[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Acciones de hook de diagnósticos
export interface UseDiagnosticsActions {
    fetchDiagnostics: (params?: DiagnosticSearchParams) => Promise<void>;
    createDiagnostic: (patientId: string, data: CreateDiagnosticDto) => Promise<Diagnostic>;
    updateDiagnostic: (id: string, data: UpdateDiagnosticDto) => Promise<void>;
    deleteDiagnostic: (id: string) => Promise<void>;
    updateDiagnosticState: (id: string, state: DiagnosticState) => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
}

// Hook completo de diagnósticos
export interface UseDiagnosticsReturn extends UseDiagnosticsState, UseDiagnosticsActions {}

// Estado de hook de diagnóstico individual
export interface UseDiagnosticState {
    diagnostic: Diagnostic | null;
    loading: boolean;
    error: string | null;
    notFound: boolean;
}

// Acciones de hook de diagnóstico individual
export interface UseDiagnosticActions {
    fetchDiagnostic: (id: string) => Promise<void>;
    updateDiagnostic: (data: UpdateDiagnosticDto) => Promise<Diagnostic>;
    deleteDiagnostic: () => Promise<void>;
    updateState: (state: DiagnosticState) => Promise<void>;
    refetch: () => Promise<void>;
    reset: () => void;
}

// Hook completo de diagnóstico individual
export interface UseDiagnosticReturn extends UseDiagnosticState, UseDiagnosticActions {}

// Estado de hook de formulario
export interface UseDiagnosticFormState {
    formData: DiagnosticFormData;
    errors: DiagnosticValidationErrors;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
    hasChanges: boolean;
}

// Acciones de hook de formulario
export interface UseDiagnosticFormActions {
    updateField: (field: keyof DiagnosticFormData, value: string) => void;
    updateFields: (fields: Partial<DiagnosticFormData>) => void;
    validateField: (field: keyof DiagnosticFormData) => void;
    validateForm: () => boolean;
    resetForm: (data?: Partial<DiagnosticFormData>) => void;
    resetErrors: () => void;
    setError: (field: keyof DiagnosticFormData, error: string) => void;
    clearError: (field: keyof DiagnosticFormData) => void;
    submit: () => Promise<void>;
}

// Hook completo de formulario
export interface UseDiagnosticFormReturn extends UseDiagnosticFormState, UseDiagnosticFormActions {}

// Configuración de hook de formulario
export interface UseDiagnosticFormConfig {
    initialData?: Partial<DiagnosticFormData>;
    validationRules?: Record<keyof DiagnosticFormData, (value: string) => string | null>;
    onSubmit: (data: DiagnosticFormData) => Promise<void>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    autoSave?: boolean;
    autoSaveInterval?: number;
}

// Estado de hook de filtros
export interface UseDiagnosticFiltersState {
    filters: DiagnosticFilters;
    appliedFilters: DiagnosticFilters;
    hasActiveFilters: boolean;
    isFiltering: boolean;
}

// Acciones de hook de filtros
export interface UseDiagnosticFiltersActions {
    updateFilter: <K extends keyof DiagnosticFilters>(key: K, value: DiagnosticFilters[K]) => void;
    updateFilters: (filters: Partial<DiagnosticFilters>) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    clearFilter: (key: keyof DiagnosticFilters) => void;
}

// Hook completo de filtros
export interface UseDiagnosticFiltersReturn extends UseDiagnosticFiltersState, UseDiagnosticFiltersActions {}

// Estado de operaciones asíncronas
export interface AsyncOperationState<T = unknown> {
    data: T | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

// Hook de operación async genérico para diagnósticos
export interface UseAsyncDiagnosticOperation<T = unknown> extends AsyncOperationState<T> {
    execute: (...args: unknown[]) => Promise<T>;
    reset: () => void;
}

// Configuraciones de hooks específicos
export interface UseDiagnosticsByPatientConfig {
    patientId: string;
    state?: DiagnosticState;
    autoFetch?: boolean;
    refreshInterval?: number;
}

export interface UseDiagnosticModalConfig {
    onSave?: (data: DiagnosticFormData) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    onClose?: () => void;
}