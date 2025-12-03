/**
 * HOOK PARA EDITAR HISTORIA MÉDICA
 * ================================
 * Hook especializado para manejar la edición de historias médicas existentes
 * NOTA: Los diagnósticos NO se editan desde aquí, solo la metadata de la historia clínica
 */

import { useState, useCallback } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { useToast } from "../notifications/useToast";
import type {
    MedicalHistoryFormData
} from "../../types/medicalHistory";

interface UseEditMedicalHistoryOptions {
    onSuccess?: (historyId: string) => void;
    onError?: (error: string) => void;
    enableDebugMode?: boolean;
}

interface EditMedicalHistoryResult {
    success: boolean;
    historyId?: string;
    error?: string;
}

interface UseEditMedicalHistoryReturn {
    isUpdating: boolean;
    updateMedicalHistory: (
        historyId: string,
        formData: Partial<MedicalHistoryFormData>
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
        formData: Partial<MedicalHistoryFormData>
    ): Promise<EditMedicalHistoryResult> => {
        setIsUpdating(true);
        logDebug("Starting medical history update", { historyId, formData });

        try {
            // PASO 1: Validar datos del formulario
            if (!formData.patientInfo?.id) {
                throw new Error("Información del paciente es requerida");
            }

            logDebug("Form data validation passed");

            // PASO 2: Actualizar la historia médica (metadatos básicos)
            // NOTA: Los diagnósticos NO se crean ni editan aquí
            const historyUpdateData = {
                updatedAt: new Date().toISOString()
                // Agregar otros campos de metadata que se necesiten actualizar
            };

            const historyUpdateResult = await medicalHistoryService.updateMedicalHistory(
                historyId,
                historyUpdateData
            );

            logDebug("Medical history updated", historyUpdateResult);

            // PASO 3: Procesar resultado exitoso
            const result: EditMedicalHistoryResult = {
                success: true,
                historyId
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
