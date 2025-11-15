/**
 * ÍNDICE DEL DOMINIO MEDICAL HISTORY
 * =================================
 * Exportaciones centralizadas para todos los tipos relacionados con historial médico
 */

// Entidades principales
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
    MedicalHistory
} from './entities';

// Formularios y UI
export type {
    MedicalHistorySection,
    MedicalHistoryFormData,
    PatientSearchState,
    MedicalHistoryFormState,
    SectionProps,
    SectionConfig,
    ValidationError,
    FormValidationResult,
    MedicalHistoryContextValue
} from './forms';

// Respuestas de API
export type {
    Pagination,
    MedicalHistoryByIdResponse,
    PatientMedicalHistoryResponse,
    CreateMedicalHistoryResponse,
    UpdateMedicalHistoryResponse
} from './api-responses';

// Encuentros médicos
export type {
    EncounterPayload
} from './encounters';