/**
 * HOOK PARA EDITAR HISTORIA MÉDICA
 * ================================
 * Hook especializado para manejar la edición de historias médicas existentes
 * Coordina la actualización de la historia médica y sus diagnósticos asociados
 */

import { useState, useCallback } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { diagnosticService } from "../../services/diagnosticService";
import { DiagnosticMapper } from "../../mappers/diagnosticMapper";
import { DiagnosticDtoValidator } from "../../validators/diagnosticDtoValidator";
import { useToast } from "../notifications/useToast";
import type {
    MedicalHistoryFormData,
    Diagnostic
} from "../../types/medicalHistory";
import type { UpdateDiagnosticDto } from "../../types/medicalHistory/entities";

interface UseEditMedicalHistoryOptions {
    onSuccess?: (historyId: string) => void;
    onError?: (error: string) => void;
    enableDebugMode?: boolean;
}

interface EditMedicalHistoryResult {
    success: boolean;
    historyId?: string;
    diagnosticId?: string;
    error?: string;
}

interface UseEditMedicalHistoryReturn {
    isUpdating: boolean;
    updateMedicalHistory: (
        historyId: string,
        formData: Partial<MedicalHistoryFormData>,
        existingDiagnostics?: Diagnostic[]
    ) => Promise<EditMedicalHistoryResult>;
}

export function useEditMedicalHistory(
    options: UseEditMedicalHistoryOptions = {}
): UseEditMedicalHistoryReturn {
    const { onSuccess, onError, enableDebugMode = false } = options;
    const [isUpdating, setIsUpdating] = useState(false);
    const { success: showSuccess, error: showError } = useToast();

    const logDebug = useCallback((_message: string, _data?: any) => {
        if (enableDebugMode) {
            // Debug logging removed for production
        }
    }, [enableDebugMode]);

    const updateMedicalHistory = useCallback(async (
        historyId: string,
        formData: Partial<MedicalHistoryFormData>,
        existingDiagnostics: Diagnostic[] = []
    ): Promise<EditMedicalHistoryResult> => {
        setIsUpdating(true);
        logDebug("Starting medical history update", { historyId, formData });

        try {
            // PASO 1: Validar datos del formulario
            if (!formData.patientInfo?.id) {
                throw new Error("Información del paciente es requerida");
            }

            // Validar diagnóstico usando el validador especializado
            const validationError = DiagnosticDtoValidator.validateMedicalHistoryForDiagnostic(formData);
            if (validationError) {
                throw new Error(validationError);
            }

            logDebug("Form data validation passed");

            // PASO 2: Actualizar la historia médica (metadatos básicos)
            // Nota: En el flujo actual, la historia médica principalmente sirve como contenedor
            // Los datos reales están en los diagnósticos
            const historyUpdateData = {
                // Los metadatos que queramos actualizar en la historia médica
                updatedAt: new Date().toISOString()
            };

            const historyUpdateResult = await medicalHistoryService.updateMedicalHistory(
                historyId,
                historyUpdateData
            );

            logDebug("Medical history updated", historyUpdateResult);

            // PASO 3: Manejar diagnósticos
            let diagnosticResult: any = null;

            // Transformar datos del formulario a DTO de diagnóstico
            const diagnosticDto = DiagnosticMapper.fromMedicalHistoryForm(formData);
            logDebug("Diagnostic DTO created", diagnosticDto);

            if (existingDiagnostics && existingDiagnostics.length > 0) {
                // Si hay diagnósticos existentes, actualizar el más reciente (o el primero)
                const diagnosticToUpdate = existingDiagnostics[0];
                logDebug("Updating existing diagnostic", { diagnosticId: diagnosticToUpdate.id });

                // Preparar datos de actualización (solo campos que han cambiado)
                const updateData: UpdateDiagnosticDto = {
                    title: diagnosticDto.title,
                    description: diagnosticDto.description,
                    symptoms: diagnosticDto.symptoms,
                    diagnosis: diagnosticDto.diagnosis,
                    treatment: diagnosticDto.treatment,
                    observations: diagnosticDto.observations,
                    prescriptions: diagnosticDto.prescriptions,
                    physicalExam: diagnosticDto.physicalExam,
                    vitalSigns: diagnosticDto.vitalSigns,
                    consultDate: diagnosticDto.consultDate,
                    nextAppointment: diagnosticDto.nextAppointment,
                    customFields: diagnosticDto.customFields
                };

                diagnosticResult = await diagnosticService.updateDiagnostic(
                    diagnosticToUpdate.id,
                    updateData
                );

                logDebug("Diagnostic updated successfully", diagnosticResult);

            } else {
                // Si no hay diagnósticos existentes, crear uno nuevo
                logDebug("Creating new diagnostic for existing history");

                diagnosticResult = await diagnosticService.createDiagnostic(
                    formData.patientInfo.id,
                    diagnosticDto
                );

                logDebug("New diagnostic created", diagnosticResult);
            }

            // PASO 4: Procesar resultado exitoso
            const result: EditMedicalHistoryResult = {
                success: true,
                historyId,
                diagnosticId: diagnosticResult?.data?.diagnosticId || 
                              diagnosticResult?.data?.id ||
                              existingDiagnostics[0]?.id
            };

            logDebug("Medical history edit completed successfully", result);

            // Notificar éxito
            showSuccess("Historia clínica actualizada exitosamente");
            onSuccess?.(historyId);

            return result;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al actualizar la historia clínica";
            
            logDebug("Medical history edit failed", { error: errorMessage });

            // Notificar error
            showError(errorMessage);
            onError?.(errorMessage);

            return {
                success: false,
                error: errorMessage
            };

        } finally {
            setIsUpdating(false);
        }
    }, [logDebug, showSuccess, showError, onSuccess, onError]);

    return {
        isUpdating,
        updateMedicalHistory
    };
}