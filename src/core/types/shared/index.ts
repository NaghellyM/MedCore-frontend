/**
 * ÍNDICE DE TIPOS COMPARTIDOS
 * ===========================
 * Exportaciones centralizadas para tipos compartidos entre dominios
 */

// Tipos de API
export type {
    BaseApiResponse,
    Pagination,
    PaginatedResponse,
    PaginationParams,
    SortParams,
    EntityState,
    Timestamps,
    DataResponse,
    OperationResult
} from './api';

// Tipos de UI
export type {
    BaseComponentProps,
    LoadingState,
    FormState,
    TableColumn,
    ModalProps,
    ButtonProps,
    ValidationError,
    ValidationResult
} from './ui';