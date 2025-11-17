import type { MedicalHistoryFormData } from "./forms";

/**
 * Estado del proceso de orquestación
 */
export type OrchestratorState =
    | "idle"
    | "validating"
    | "creating-history"
    | "creating-diagnostic"
    | "uploading-documents"
    | "success"
    | "error"
    | "rolling-back";

/**
 * Resultado de cada paso del proceso
 */
export interface StepResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Resultado completo del proceso de orquestación
 */
export interface OrchestrationResult {
    success: boolean;
    historyId?: string;
    diagnosticId?: string;
    documentIds?: string[];
    error?: string;
    partialData?: {
        historyId?: string;
        diagnosticId?: string;
        documentsUploaded?: number;
    };
}

/**
 * Contexto del proceso de orquestación
 */
export interface OrchestratorContext {
    patientId: string;
    formData: Partial<MedicalHistoryFormData>;
    documents: File[];
    state: OrchestratorState;
    currentStep: string;
    historyId?: string;
    diagnosticId?: string;
    uploadedDocumentIds: string[];
}

/**
 * Opciones del orquestador
 */
export interface OrchestratorOptions {
    enableRollback?: boolean; // Por defecto false (no soportado aún)
    enableRetry?: boolean; // Por defecto false
    maxRetries?: number; // Por defecto 0
    onProgress?: (state: OrchestratorState, context: OrchestratorContext) => void;
    onStepComplete?: (step: string, result: StepResult) => void;
}

/**
 * Errores específicos del orquestador
 */
export class OrchestrationError extends Error {
    constructor(
        message: string,
        public step: string,
        public context: Partial<OrchestratorContext>,
        public originalError?: Error
    ) {
        super(message);
        this.name = "OrchestrationError";
    }
}