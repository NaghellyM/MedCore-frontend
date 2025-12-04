/**
 * HOOK - DIAGNÓSTICOS POR PACIENTE
 * Hook específico para obtener diagnósticos de un paciente
 */

import { useState, useCallback, useEffect } from 'react';
import { diagnosticService } from '../../services/diagnosticService';
import type {
    Diagnostic,
    UseDiagnosticsByPatientConfig
} from '../../types/diagnostic';

export const useDiagnosticsByPatient = (config: UseDiagnosticsByPatientConfig) => {
    const { patientId, state, autoFetch = true } = config;
    
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDiagnostics = useCallback(async () => {
        if (!patientId) return;

        try {
            setLoading(true);
            setError(null);
            
            const response = await diagnosticService.getDiagnosticsByPatientId(patientId, state);

            console.log("respuesta lista diagnonisto", response);
            

            setDiagnostics(response.data || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener diagnósticos del paciente';
            setError(errorMessage);
            console.error('Error fetching patient diagnostics:', err);
        } finally {
            setLoading(false);
        }
    }, [patientId, state]);

    const refetch = useCallback(async () => {
        await fetchDiagnostics();
    }, [fetchDiagnostics]);

    const reset = useCallback(() => {
        setDiagnostics([]);
        setLoading(false);
        setError(null);
    }, []);

    // Auto-fetch en mount si está habilitado
    useEffect(() => {
        if (autoFetch && patientId) {
            fetchDiagnostics();
        }
    }, [autoFetch, patientId, fetchDiagnostics]);

    return {
        diagnostics,
        loading,
        error,
        fetchDiagnostics,
        refetch,
        reset
    };
};