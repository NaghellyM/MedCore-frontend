import { useEffect, useState, useMemo, useCallback } from "react";
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Memorizar el ID del paciente para evitar recálculos innecesarios
    const currentPatientId = useMemo((): string | null => {
        if (patientId) {
            return patientId;
        }
        
        const currentUser = getCurrentUser();
        
        // Verificar que el usuario sea paciente y tenga un ID válido
        if (currentUser && (currentUser.role === 'PACIENTE' || currentUser.role === 'patient')) {
            // Intentar obtener el ID desde diferentes campos posibles
            const id = currentUser.id || currentUser.sub || currentUser.patientId || null;
            return id;
        }
        
        return null;
    }, [patientId]);

    const fetchHistory = useCallback(async () => {        
        if (!currentPatientId && !patientId) {
            setIsError(true);
            setErrorMessage("No se pudo obtener el ID del paciente.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setIsError(false);
            setErrorMessage(null);

            let response: PatientMedicalHistoryResponse;
            
            if (patientId) {
                // Si se proporciona un patientId específico, usarlo
                response = await medicalHistoryService.getMedicalHistoryByPatientId(patientId);
            } else {
                // Si no, usar el endpoint para obtener la historia del paciente logueado
                response = await medicalHistoryService.getMyMedicalHistory();
            }

            // Validar que la respuesta tenga la estructura esperada
            if (!response) {
                throw new Error("La respuesta del servidor está vacía");
            }

            // Verificar si la respuesta tiene estructura de paginación o es directa
            if ('pagination' in response) {
                // Respuesta con paginación: { ...historyData, pagination }
                const { pagination: paginationData, ...historyData } = response;
                setHistory(historyData as MedicalHistory);
                setPagination(paginationData || null);
            } else {
                // Respuesta directa sin paginación
                setHistory(response as MedicalHistory);
                setPagination(null);
            }
        } catch (error: any) {
            setIsError(true);
            setHistory(null);
            setPagination(null);
            
            // Mejorar el manejo de errores
            let errorMsg = "Ocurrió un error al cargar la historia clínica del paciente.";
            
            if (error?.response?.status === 404) {
                errorMsg = "No se encontró historia clínica para este paciente.";
            } else if (error?.response?.status === 403) {
                errorMsg = "No tienes permisos para acceder a esta historia clínica.";
            } else if (error?.response?.status === 401) {
                errorMsg = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            } else if (error?.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error?.message) {
                errorMsg = error.message;
            }
            
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [patientId, currentPatientId]);

    useEffect(() => {
        if (enabled && (patientId || currentPatientId)) {
            void fetchHistory();
        } else if (enabled && !patientId && !currentPatientId) {
            // Si está habilitado pero no hay ID, mostrar error
            setIsError(true);
            setErrorMessage("No se pudo obtener la información del paciente desde la sesión.");
            setIsLoading(false);
        }
    }, [enabled, fetchHistory]);

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
