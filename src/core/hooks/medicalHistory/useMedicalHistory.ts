import { useEffect, useState } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { getCurrentUser } from "../../services/authService";
import type {
    PatientMedicalHistoryResponse,
    MedicalHistory,
} from "../../types/medicalHistory/index";

interface UsePatientMedicalHistoryOptions {
    enabled?: boolean;
}

interface UsePatientMedicalHistoryResult {
    history: MedicalHistory | null;
    pagination: PatientMedicalHistoryResponse["pagination"] | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
    refetch: () => Promise<void>;
    currentPatientId: string | null;
}

export function usePatientMedicalHistory(
    patientId: string | null,
    options: UsePatientMedicalHistoryOptions = {}
): UsePatientMedicalHistoryResult {
    const { enabled = true } = options;

    const [history, setHistory] = useState<MedicalHistory | null>(null);
    const [pagination, setPagination] =
        useState<PatientMedicalHistoryResponse["pagination"] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(Boolean(enabled));
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getCurrentPatientId = (): string | null => {
        if (patientId) {
            return patientId;
        }
        
        const currentUser = getCurrentUser();
        if (currentUser && (currentUser.role === 'PACIENTE' || currentUser.role === 'patient')) {
            const possibleIds = [currentUser.id, currentUser.sub, currentUser.userId, currentUser.patientId];
            const validId = possibleIds.find(id => id && typeof id === 'string');
            return validId || null;
        }
        
        return null;
    };

    const currentPatientId = getCurrentPatientId();
    const fetchHistory = async () => {        
        try {
            setIsLoading(true);
            setIsError(false);
            setErrorMessage(null);
            let response;
            if (patientId) {
                response = await medicalHistoryService.getMedicalHistoryByPatientId(patientId);
            } else if (currentPatientId) {
                response = await medicalHistoryService.getMyMedicalHistory();
            } else {
                return;
            }

            const { pagination: paginationData, ...historyData } = response;
            setHistory(historyData);
            setPagination(paginationData);
        } catch (error: any) {
            setIsError(true);
            setErrorMessage(
                error?.response?.data?.message ??
                "Ocurrió un error al cargar la historia clínica del paciente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (enabled && (patientId || currentPatientId)) {
            void fetchHistory();
        }
    }, [enabled, patientId, currentPatientId]);

    return {
        history,
        pagination,
        isLoading,
        isError,
        errorMessage,
        refetch: fetchHistory,
        currentPatientId,
    };
}

/**
 * Hook específico para que un paciente acceda a su propia historia médica
 * Obtiene automáticamente el ID del paciente desde los datos de sesión
 */
export function useMyMedicalHistory(
    options: UsePatientMedicalHistoryOptions = {}
): UsePatientMedicalHistoryResult {
    return usePatientMedicalHistory(null, options);
}
