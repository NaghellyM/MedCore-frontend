/**
 * ÍNDICE DEL DOMINIO MEDICAL HISTORY
 * =================================
 * Exportaciones centralizadas para todos los tipos relacionados con historial médico
 */

// === ENTIDADES PRINCIPALES ===
export type { 
    // Estados y tipos base
    DiagnosticState,
    DiagnosisType,
    OrderType,
    OrderStatus,
    
    // Personas y roles
    DoctorSummary,
    PatientBasicMedical,
    
    // Datos médicos
    VitalSigns,
    Medication,
    Prescription,
    Allergy,
    Diagnosis,
    MedicalOrder,
    
    // Documentos y diagnósticos
    DiagnosticDocument,
    Diagnostic,
    DiagnosticDetails,
    DiagnosticSummary,
    DiagnosticFilters,
    DiagnosticSearchParams,
    
    // Historial médico
    MedicalHistory,
    Pagination,
    
    // DTOs para operaciones CRUD
    CreateDiagnosticDto,
    UpdateDiagnosticDto,
    UpdateDiagnosticStateDto
} from './entities';

// === RESPUESTAS DE API ===
export type {
    // Respuestas base
    ApiResponse,
    PaginatedResponse,
    
    // Historial médico
    MedicalHistoryByIdResponse,
    PatientMedicalHistoryResponse,
    AllMedicalHistoriesResponse,
    CreateMedicalHistoryResponse,
    UpdateMedicalHistoryResponse,
    
    // Diagnósticos
    GetDiagnosticByIdResponse,
    GetDiagnosticsByPatientResponse,
    GetDiagnosticsResponse,
    CreateDiagnosticResponse,
    UpdateDiagnosticResponse,
    UpdateDiagnosticStateResponse,
    DeleteDiagnosticResponse,
    DiagnosticApiError
} from './api-responses';

// === FORMULARIOS Y UI ===
export type {
    // Secciones y estado del formulario
    MedicalHistorySection,
    MedicalHistoryFormData,
    PatientSearchState,
    MedicalHistoryFormState,
    SectionProps,
    SectionConfig,
    
    // Validación
    ValidationError,
    FormValidationResult,
    
    // Formularios de diagnóstico
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
    
    // Filtros
    DiagnosticFilterFormData,
    DiagnosticFilterFormProps,
    
    // Contexto
    MedicalHistoryContextValue
} from './forms';

// === ENCUENTROS MÉDICOS ===
export type {
    EncounterPayload
} from './encounters';