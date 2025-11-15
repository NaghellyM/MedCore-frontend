/**
 * ÍNDICE DEL DOMINIO PATIENT
 * =========================
 * Exportaciones centralizadas para todos los tipos relacionados con pacientes
 */

// Entidades principales
export type { 
    PatientState, 
    PatientRole, 
    PatientGender,
    Patient,
    PatientBasicInfo,
    PatientSearchResult,
    PatientFullInfo,
    CreatePatientDto,
    UpdatePatientDto,
    PatientStateUpdateDto,
    GetPatientResponse
} from './entities';

// Respuestas de API
export type {
    PatientSearchResponse,
    BaseApiResponse,
    CreatePatientResponse,
    UpdatePatientResponse,
    DeletePatientResponse,
    GetPatientByIdResponse
} from './api-responses';

// Parámetros de búsqueda
export type {
    PaginationParams,
    SimpleSearchParams,
    AdvancedSearchParams,
    QuickFilters
} from './search-params';

// Configuración del servicio
export type {
    PaginationConfig,
    PatientFilters,
    PatientSearchParams,
    PatientOperationResult,
    PatientDeletionResult,
    PatientStats,
    PatientServiceConfig,
    ServiceOptions
} from './service-config';