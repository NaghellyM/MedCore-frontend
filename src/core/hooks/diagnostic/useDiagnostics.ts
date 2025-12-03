// Hook para manejar operaciones de lectura y eliminación de diagnósticos
// NOTA: Los diagnósticos NO se pueden crear ni editar

import { useState, useCallback } from 'react';
import { diagnosticService } from "../../services/diagnosticService";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import type {
    DiagnosticSummary,
    DiagnosticSearchParams,
    DiagnosticState,
    UseDiagnosticsReturn
} from "../../types/diagnostic";

export const useDiagnostics = (): UseDiagnosticsReturn => {
    const [diagnostics, setDiagnostics] = useState<DiagnosticSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchDiagnostics = useCallback(async (params?: DiagnosticSearchParams & { predefined?: boolean }) => {
        try {
            setLoading(true);
            setError(null);

            let response;

            if (params?.predefined) {
                // Obtener diagnósticos predefinidos
                response = await diagnosticService.getPredefinedDiagnostics(params);
            } else if (params?.medicalHistoryId) {
                // Si se proporciona medicalHistoryId, obtener primero la información del historial médico
                // para conseguir el patientId y luego obtener los diagnósticos por paciente
                const medicalHistoryResponse = await medicalHistoryService.getMedicalHistoryById(params.medicalHistoryId);
                const patientId = medicalHistoryResponse.data.patientId;
                // Obtener diagnósticos por patientId y filtrar por medicalHistoryId en el frontend
                response = await diagnosticService.getDiagnosticsByPatientId(patientId, params.state);
                // Filtrar los diagnósticos que pertenecen a esta historia médica específica
                if (response.data && Array.isArray(response.data)) {
                    response.data = response.data.filter((diagnostic: any) => 
                        diagnostic.medicalHistoryId === params.medicalHistoryId
                    );
                }
            } else {
                response = await diagnosticService.getDiagnostics(params);
            }

            if (response.data && Array.isArray(response.data)) {
                setDiagnostics(response.data);
                setTotal(response.pagination?.total || response.data.length);
                setPage(response.pagination?.page || 1);
                setTotalPages(response.pagination?.totalPages || 1);
            } else {
                setDiagnostics([]);
                setTotal(0);
                setPage(1);
                setTotalPages(0);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener diagnósticos';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // NOTA: createDiagnostic y updateDiagnostic fueron eliminados
    // Los diagnósticos NO se pueden crear ni editar desde el frontend

    const deleteDiagnostic = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);
            await diagnosticService.deleteDiagnostic(id);
            await fetchDiagnostics();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [fetchDiagnostics]);

    // NOTA: updateDiagnosticState fue eliminado
    // Los diagnósticos solo se pueden eliminar (soft delete)

    const refetch = useCallback(async () => {
        await fetchDiagnostics();
    }, [fetchDiagnostics]);

    const reset = useCallback(() => {
        setDiagnostics([]);
        setLoading(false);
        setError(null);
        setTotal(0);
        setPage(1);
        setTotalPages(0);
    }, []);

    return {
        // Estado
        diagnostics,
        loading,
        error,
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,

        // Acciones
        fetchDiagnostics,
        deleteDiagnostic,
        refetch,
        reset
    };
};