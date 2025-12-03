/**
 * ÍNDICE DE TIPOS - DIAGNÓSTICOS
 * ===============================
 * Exportaciones centralizadas para todos los tipos de diagnósticos
 */

// Entidades principales
export type {
    DiagnosticState,
    Diagnostic,
    CreateDiagnosticDto,
    UpdateDiagnosticDto,
    UpdateDiagnosticStateDto,
    DiagnosticDetails,
    DiagnosticSummary,
    DiagnosticFilters,
    DiagnosticSearchParams
} from './entities';

// Diagnósticos predefinidos
export type {
    PredefinedDiagnostic,
    PredefinedDiagnosticFilters,
    GetPredefinedDiagnosticsResponse,
    GetPredefinedDiagnosticByIdResponse,
    UsePredefinedDiagnosticsState,
    UsePredefinedDiagnosticsActions,
    UsePredefinedDiagnosticsReturn,
    DiagnosticSeverity
} from './predefined';

export { DIAGNOSTIC_SEVERITIES } from './predefined';

// Respuestas del API
export type {
    ApiResponse as DiagnosticApiResponse,
    PaginatedResponse as DiagnosticPaginatedResponse,
    GetDiagnosticByIdResponse,
    GetDiagnosticsByPatientResponse,
    GetDiagnosticsResponse,
    CreateDiagnosticResponse,
    UpdateDiagnosticResponse,
    UpdateDiagnosticStateResponse,
    DeleteDiagnosticResponse,
    DiagnosticApiError
} from './api-responses';

// Formularios
export type {
    DiagnosticFormData,
    DiagnosticFormRequiredFields,
    DiagnosticFormState,
    DiagnosticFormConfig,
    DiagnosticFormInitialData,
    DiagnosticValidationErrors,
    DiagnosticFormProps,
    DiagnosticFormSectionProps,
    DiagnosticFieldConfig,
    DiagnosticFieldsConfig,
    DiagnosticFilterFormData,
    DiagnosticFilterFormProps
} from './forms';

// UI/Componentes
export type {
    DiagnosticTableColumn,
    DiagnosticTableProps,
    DiagnosticCardProps,
    DiagnosticDetailProps,
    DiagnosticModalProps,
    DiagnosticFiltersProps,
    DiagnosticAction,
    DiagnosticActionsProps,
    DiagnosticLoadingStates,
    DiagnosticPaginationConfig,
    DiagnosticPaginationProps,
    DiagnosticSearchConfig,
    DiagnosticSearchProps,
    DiagnosticListConfig,
    DiagnosticViewProps
} from './ui';

// Hooks
export type {
    UseDiagnosticsState,
    UseDiagnosticsActions,
    UseDiagnosticsReturn,
    UseDiagnosticState,
    UseDiagnosticActions,
    UseDiagnosticReturn,
    UseDiagnosticFormState,
    UseDiagnosticFormActions,
    UseDiagnosticFormReturn,
    UseDiagnosticFormConfig,
    UseDiagnosticFiltersState,
    UseDiagnosticFiltersActions,
    UseDiagnosticFiltersReturn,
    AsyncOperationState,
    UseAsyncDiagnosticOperation,
    UseDiagnosticsByPatientConfig,
    UseDiagnosticModalConfig
} from './hooks';