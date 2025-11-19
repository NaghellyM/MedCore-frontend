import { useState, useCallback } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { diagnosticService } from "../../services/diagnosticService";
import { DiagnosticMapper } from "../../mappers/diagnosticMapper";
import { DiagnosticDtoValidator } from "../../validators/diagnosticDtoValidator";
import { useToast } from "../notifications/useToast";
import type {
    OrchestrationResult,
    OrchestratorContext,
    OrchestratorOptions,
    OrchestratorState,
    StepResult,
    OrchestrationError,
} from "../../types/medicalHistory/orchestrator";
import type { MedicalHistoryFormData } from "../../types/medicalHistory/forms";

interface UseMedicalHistoryOrchestratorProps {
    onSuccess?: (result: OrchestrationResult) => void;
    onError?: (error: OrchestrationError) => void;
    options?: OrchestratorOptions;
}

interface UseMedicalHistoryOrchestratorReturn {
    state: OrchestratorState;
    currentStep: string;
    isProcessing: boolean;
    context: Partial<OrchestratorContext>;
    execute: (
        patientId: string,
        formData: Partial<MedicalHistoryFormData>,
        uploadDocumentsFn: (diagnosticId: string) => Promise<void>
    ) => Promise<OrchestrationResult>;
    reset: () => void;
}

/**
 * Hook para orquestar el proceso completo de creación de historia médica
 * Coordina: Historia → Diagnóstico → Documentos
 */
export function useMedicalHistoryOrchestrator({
    onSuccess,
    onError,
    options = {},
}: UseMedicalHistoryOrchestratorProps): UseMedicalHistoryOrchestratorReturn {

    const [state, setState] = useState<OrchestratorState>("idle");
    const [currentStep, setCurrentStep] = useState<string>("");
    const [context, setContext] = useState<Partial<OrchestratorContext>>({});
    useToast();

    const isProcessing = state !== "idle" && state !== "success" && state !== "error";

    /**
     * Actualiza el estado y contexto del orquestador
     */
    const updateState = useCallback((
        newState: OrchestratorState,
        step: string,
        updates: Partial<OrchestratorContext> = {}
    ) => {
        setState(newState);
        setCurrentStep(step);
        setContext(prev => ({ ...prev, state: newState, currentStep: step, ...updates }));

        // Callback de progreso
        options.onProgress?.(newState, {
            ...context,
            state: newState,
            currentStep: step,
            ...updates
        } as OrchestratorContext);
    }, [context, options]);

    /**
     * Registra el resultado de un paso
     */
    const logStepResult = useCallback((step: string, result: StepResult) => {
        if (!result.success && result.error) {
            console.error(`Error "${step}" :`, result.error);
        }
        options.onStepComplete?.(step, result);
    }, [options]);

    /**
     * PASO 1: Validar datos del formulario
     */
    const validateFormData = useCallback(async (
        formData: Partial<MedicalHistoryFormData>
    ): Promise<StepResult<void>> => {
        const step = "Validating form data";
        updateState("validating", step);

        try {
            // Validar paciente
            if (!formData.patientInfo?.id) {
                throw new Error("Información del paciente es requerida");
            }

            // Validar diagnóstico usando el validador especializado
            const validationError = DiagnosticDtoValidator.validateMedicalHistoryForDiagnostic(formData);
            if (validationError) {
                throw new Error(validationError);
            }

            // Validar consulta
            if (!formData.consultation?.chiefComplaint?.trim()) {
                throw new Error("El motivo de consulta es obligatorio");
            }

            const result: StepResult<void> = { success: true };
            logStepResult(step, result);
            return result;

        } catch (error) {
            const result: StepResult<void> = {
                success: false,
                error: error instanceof Error ? error.message : "Error en la validación de datos"
            };
            logStepResult(step, result);
            return result;
        }
    }, [updateState, logStepResult]);

    /**
     * PASO 2: Crear Medical History
     */
    const createMedicalHistory = useCallback(async (
        patientId: string
    ): Promise<StepResult<{ historyId: string }>> => {
        const step = "Creating medical history";
        updateState("creating-history", step);

        try {
            const response = await medicalHistoryService.createMedicalHistory(
                patientId,
                {} 
            );

            const historyId = response.data?.id;

            if (!historyId) {
                throw new Error("Error del servidor: No se pudo obtener el ID de la historia médica");
            }

            const result: StepResult<{ historyId: string }> = {
                success: true,
                data: { historyId }
            };
            logStepResult(step, result);
            return result;

        } catch (error) {
            const result: StepResult<{ historyId: string }> = {
                success: false,
                error: error instanceof Error ? error.message : "Error al crear la historia médica"
            };
            logStepResult(step, result);
            return result;
        }
    }, [updateState, logStepResult]);

    /**
     * PASO 3: Crear Diagnostic
     */
    const createDiagnostic = useCallback(async (
        patientId: string,
        formData: Partial<MedicalHistoryFormData>
    ): Promise<StepResult<{ diagnosticId: string }>> => {
        const step = "Creating diagnostic";
        updateState("creating-diagnostic", step);

        try {
            // Transformar datos usando el mapper
            const diagnosticDto = DiagnosticMapper.fromMedicalHistoryForm(formData);

            // Crear diagnóstico
            const response = await diagnosticService.createDiagnostic(
                patientId,
                diagnosticDto
            );

            const responseAny = response as any;
            const diagnosticId = responseAny.data?.diagnosticId;
            
            if (!diagnosticId) {
                console.error("Backend response missing diagnosticId. Available fields:", Object.keys(responseAny.data || {}));
                throw new Error("Error del servidor: No se pudo obtener el ID del diagnóstico");
            }
            
            // Verificar que es un UUID válido
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(diagnosticId)) {
                console.warn("diagnosticId no parece ser un UUID válido:", diagnosticId);
            }

            const result: StepResult<{ diagnosticId: string }> = {
                success: true,
                data: { diagnosticId }
            };
            logStepResult(step, result);
            return result;

        } catch (error) {
            const result: StepResult<{ diagnosticId: string }> = {
                success: false,
                error: error instanceof Error ? error.message : "Error al crear el diagnóstico"
            };
            logStepResult(step, result);
            return result;
        }
    }, [updateState, logStepResult]);

    /**
     * PASO 4: Subir Documentos
     */
    const uploadDocuments = useCallback(async (
        diagnosticId: string,
        uploadFn: (diagnosticId: string) => Promise<void>
    ): Promise<StepResult<{ documentIds: string[] }>> => {
        const step = "Uploading documents";
        updateState("uploading-documents", step);

        try {
            await uploadFn(diagnosticId);

            const result: StepResult<{ documentIds: string[] }> = {
                success: true,
                data: { documentIds: [] } 
            };
            logStepResult(step, result);
            return result;

        } catch (error) {
            const result: StepResult<{ documentIds: string[] }> = {
                success: false,
                error: error instanceof Error ? error.message : "Error al subir documentos"
            };
            logStepResult(step, result);
            return result;
        }
    }, [updateState, logStepResult]);

    /**
     * Ejecuta el flujo completo de orquestación
     */
    const execute = useCallback(async (
        patientId: string,
        formData: Partial<MedicalHistoryFormData>,
        uploadDocumentsFn: (diagnosticId: string) => Promise<void>
    ): Promise<OrchestrationResult> => {
        // Inicializar contexto
        setContext({
            patientId,
            formData,
            state: "validating",
            currentStep: "",
            uploadedDocumentIds: [],
        });

        try {
            // PASO 1: Validar
            const validationResult = await validateFormData(formData);
            if (!validationResult.success) {
                throw new Error(validationResult.error || "Error en la validación");
            }

            // PASO 2: Crear Historia
            const historyResult = await createMedicalHistory(patientId);
            if (!historyResult.success || !historyResult.data) {
                throw new Error(historyResult.error || "Error al crear la historia médica");
            }

            const historyId = historyResult.data.historyId;
            setContext(prev => ({ ...prev, historyId }));

            // PASO 3: Crear Diagnóstico
            const diagnosticResult = await createDiagnostic(patientId, formData);
            if (!diagnosticResult.success || !diagnosticResult.data) {
                throw new Error(diagnosticResult.error || "Error al crear el diagnóstico");
            }

            const diagnosticId = diagnosticResult.data.diagnosticId;
            setContext(prev => ({ ...prev, diagnosticId }));

            // PASO 4: Subir Documentos (opcional)
            let documentIds: string[] = [];
            try {
                const documentsResult = await uploadDocuments(diagnosticId, uploadDocumentsFn);
                if (documentsResult.success) {
                    documentIds = documentsResult.data?.documentIds || [];
                } else {
                    console.warn("Documents upload failed, but continuing:", documentsResult.error);
                }
            } catch (docError) {
                console.warn("Documents upload failed (non-critical):", docError);
            }

            // Éxito
            updateState("success", "Process completed");

            const result: OrchestrationResult = {
                success: true,
                historyId,
                diagnosticId,
                documentIds,
            };

            onSuccess?.(result);
            return result;

        } catch (error) {
            console.error("Orchestration failed:", error);

            updateState("error", "Process failed");

            const orchestrationError: OrchestrationError = new (Error as any)(
                error instanceof Error ? error.message : "Error en el proceso de creación",
                currentStep,
                context,
                error instanceof Error ? error : undefined
            );

            const result: OrchestrationResult = {
                success: false,
                error: orchestrationError.message,
                partialData: {
                    historyId: context.historyId,
                    diagnosticId: context.diagnosticId,
                },
            };

            onError?.(orchestrationError);
            return result;
        }
    }, [
        validateFormData,
        createMedicalHistory,
        createDiagnostic,
        uploadDocuments,
        updateState,
        currentStep,
        context,
        onSuccess,
        onError,
    ]);

    /**
     * Reinicia el estado del orquestador
     */
    const reset = useCallback(() => {
        setState("idle");
        setCurrentStep("");
        setContext({});
    }, []);

    return {
        state,
        currentStep,
        isProcessing,
        context,
        execute,
        reset,
    };
}