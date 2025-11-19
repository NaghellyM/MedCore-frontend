/**
 * ÍNDICE PRINCIPAL DE TIPOS
 * ========================
 * Exportaciones centralizadas para todos los dominios de tipos
 */

// Tipos compartidos (tienen prioridad)
export * from './shared';

// Dominio de autenticación
export * from './auth';

// Dominio de pacientes (evitar duplicación con shared)
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
    GetPatientResponse,
    PatientSearchResponse,
    CreatePatientResponse,
    UpdatePatientResponse,
    DeletePatientResponse,
    GetPatientByIdResponse,
    SimpleSearchParams,
    AdvancedSearchParams,
    QuickFilters,
    PaginationConfig,
    PatientFilters,
    PatientSearchParams,
    PatientOperationResult,
    PatientDeletionResult,
    PatientStats,
    PatientServiceConfig,
    ServiceOptions
} from './patient';

// Dominio de historial médico (evitar duplicación con shared)
export type {
    DiagnosticState,
    DiagnosisType,
    OrderType,
    OrderStatus,
    DoctorSummary,
    PatientBasicMedical,
    VitalSigns,
    Medication,
    Prescription,
    Allergy,
    Diagnosis,
    MedicalOrder,
    DiagnosticDocument,
    Diagnostic,
    MedicalHistory,
    MedicalHistorySection,
    MedicalHistoryFormData,
    PatientSearchState,
    MedicalHistoryFormState,
    SectionProps,
    SectionConfig,
    MedicalHistoryContextValue,
    MedicalHistoryByIdResponse,
    PatientMedicalHistoryResponse,
    CreateMedicalHistoryResponse,
    UpdateMedicalHistoryResponse,
    EncounterPayload
} from './medicalHistory';

// Dominio de cola de atención
export * from './queue';

// Dominio de usuarios
export * from './user';

// Dominio de diagnósticos
export * from './diagnostic';