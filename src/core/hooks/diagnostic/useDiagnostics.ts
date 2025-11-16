/**
 * HOOK - DIAGNÓSTICOS
 * ====================
 * Hook personalizado para manejar operaciones CRUD de diagnósticos
 */

import { useState, useCallback } from 'react';
import { diagnosticService } from '../../services/diagnosticService';
import type {
    DiagnosticSummary,
    DiagnosticSearchParams,
    CreateDiagnosticDto,
    UpdateDiagnosticDto,
    DiagnosticState,
    UseDiagnosticsReturn
} from '../../types/diagnostic';

export const useDiagnostics = (): UseDiagnosticsReturn => {
    const [diagnostics, setDiagnostics] = useState<DiagnosticSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchDiagnostics = useCallback(async (params?: DiagnosticSearchParams) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await diagnosticService.getDiagnostics(params);
            
            // Asumiendo que el API devuelve datos paginados
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
            console.error('Error fetching diagnostics:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createDiagnostic = useCallback(async (
        patientId: string, 
        data: CreateDiagnosticDto
    ): Promise<void> => {
        try {
            setError(null);
            await diagnosticService.createDiagnostic(patientId, data);
            
            // Actualizar la lista después de crear
            await fetchDiagnostics();
            
            console.log("✅ Diagnóstico creado correctamente, esperando respuesta del servidor...");
            
            // No retornamos un diagnóstico temporal con datos hardcodeados
            // El hook fetchDiagnostics() actualizará la lista con los datos reales del servidor
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al crear diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [fetchDiagnostics]);

    const updateDiagnostic = useCallback(async (
        id: string, 
        data: UpdateDiagnosticDto
    ): Promise<void> => {
        try {
            setError(null);
            await diagnosticService.updateDiagnostic(id, data);
            
            // Actualizar la lista después de actualizar
            await fetchDiagnostics();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [fetchDiagnostics]);

    const deleteDiagnostic = useCallback(async (id: string): Promise<void> => {
        try {
            setError(null);
            await diagnosticService.deleteDiagnostic(id);
            
            // Actualizar la lista después de eliminar
            await fetchDiagnostics();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [fetchDiagnostics]);

    const updateDiagnosticState = useCallback(async (
        id: string, 
        state: DiagnosticState
    ): Promise<void> => {
        try {
            setError(null);
            await diagnosticService.updateDiagnosticState(id, state);
            
            // Actualizar la lista después de cambiar estado
            await fetchDiagnostics();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado';
            setError(errorMessage);
            throw err;
        }
    }, [fetchDiagnostics]);

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
        createDiagnostic,
        updateDiagnostic,
        deleteDiagnostic,
        updateDiagnosticState,
        refetch,
        reset
    };
};