/**
 * HOOK - DIAGNÓSTICO INDIVIDUAL
 * ==============================
 * Hook para manejar un diagnóstico específico
 */

import { useState, useCallback } from 'react';
import { diagnosticService } from '../../services/diagnosticService';
import type {
    Diagnostic,
    UpdateDiagnosticDto,
    DiagnosticState,
    UseDiagnosticReturn
} from '../../types/diagnostic';

export const useDiagnostic = (initialId?: string): UseDiagnosticReturn => {
    const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const fetchDiagnostic = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            setNotFound(false);
            
            const response = await diagnosticService.getDiagnosticById(id);
            setDiagnostic(response.data);
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener diagnóstico';
            setError(errorMessage);
            
            // Verificar si es un error 404
            if (err?.response?.status === 404) {
                setNotFound(true);
            }
            
            console.error('Error fetching diagnostic:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDiagnostic = useCallback(async (data: UpdateDiagnosticDto): Promise<Diagnostic> => {
        if (!diagnostic?.id) {
            throw new Error('No hay diagnóstico cargado para actualizar');
        }

        try {
            setError(null);
            await diagnosticService.updateDiagnostic(diagnostic.id, data);
            
            // Actualizar el diagnóstico local con los nuevos datos
            const updatedDiagnostic: Diagnostic = { ...diagnostic, ...data };
            setDiagnostic(updatedDiagnostic);
            return updatedDiagnostic;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [diagnostic]);

    const deleteDiagnostic = useCallback(async (): Promise<void> => {
        if (!diagnostic?.id) {
            throw new Error('No hay diagnóstico cargado para eliminar');
        }

        try {
            setError(null);
            await diagnosticService.deleteDiagnostic(diagnostic.id);
            setDiagnostic(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar diagnóstico';
            setError(errorMessage);
            throw err;
        }
    }, [diagnostic?.id]);

    const updateState = useCallback(async (state: DiagnosticState): Promise<void> => {
        if (!diagnostic?.id) {
            throw new Error('No hay diagnóstico cargado para actualizar estado');
        }

        try {
            setError(null);
            await diagnosticService.updateDiagnosticState(diagnostic.id, state);
            
            // Actualizar el estado local
            setDiagnostic(prev => prev ? { ...prev, state } : null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado';
            setError(errorMessage);
            throw err;
        }
    }, [diagnostic?.id]);

    const refetch = useCallback(async () => {
        if (diagnostic?.id) {
            await fetchDiagnostic(diagnostic.id);
        } else if (initialId) {
            await fetchDiagnostic(initialId);
        }
    }, [diagnostic?.id, initialId, fetchDiagnostic]);

    const reset = useCallback(() => {
        setDiagnostic(null);
        setLoading(false);
        setError(null);
        setNotFound(false);
    }, []);

    return {
        // Estado
        diagnostic,
        loading,
        error,
        notFound,
        
        // Acciones
        fetchDiagnostic,
        updateDiagnostic,
        deleteDiagnostic,
        updateState,
        refetch,
        reset
    };
};