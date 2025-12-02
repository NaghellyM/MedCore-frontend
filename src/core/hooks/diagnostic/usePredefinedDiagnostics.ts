import { useState, useCallback, useMemo } from 'react';
import { diagnosticService } from '../../services/diagnosticService';
import type { 
    PredefinedDiagnostic, 
    PredefinedDiagnosticFilters,
    UsePredefinedDiagnosticsReturn 
} from '../../types/diagnostic';

/**
 * Hook para manejar diagnósticos predefinidos del sistema
 * Permite obtener, filtrar y buscar diagnósticos predefinidos
 */
export function usePredefinedDiagnostics(): UsePredefinedDiagnosticsReturn {
    const [predefinedDiagnostics, setPredefinedDiagnostics] = useState<PredefinedDiagnostic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<PredefinedDiagnosticFilters>({});

    /**
     * Obtener diagnósticos predefinidos del sistema
     */
    const fetchPredefinedDiagnostics = useCallback(async (
        filterParams?: PredefinedDiagnosticFilters
    ): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await diagnosticService.getPredefinedDiagnostics(filterParams || filters);
            setPredefinedDiagnostics(response.data || []);
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Error al obtener diagnósticos predefinidos';
            setError(errorMessage);
            console.error('Error fetching predefined diagnostics:', err);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    /**
     * Establecer filtros y opcionalmente recargar
     */
    const setFilters = useCallback((newFilters: PredefinedDiagnosticFilters) => {
        setFiltersState(newFilters);
    }, []);

    /**
     * Limpiar todos los filtros
     */
    const clearFilters = useCallback(() => {
        setFiltersState({});
    }, []);

    /**
     * Obtener un diagnóstico predefinido por ID
     */
    const getPredefinedById = useCallback((id: string): PredefinedDiagnostic | undefined => {
        return predefinedDiagnostics.find(d => d.id === id);
    }, [predefinedDiagnostics]);

    /**
     * Obtener lista única de categorías disponibles
     */
    const getCategories = useCallback((): string[] => {
        const categories = new Set(predefinedDiagnostics.map(d => d.category).filter(Boolean));
        return Array.from(categories).sort();
    }, [predefinedDiagnostics]);

    /**
     * Obtener lista única de severidades disponibles
     */
    const getSeverities = useCallback((): string[] => {
        const severities = new Set(predefinedDiagnostics.map(d => d.severity).filter(Boolean));
        return Array.from(severities).sort();
    }, [predefinedDiagnostics]);

    return useMemo(() => ({
        // Estado
        predefinedDiagnostics,
        isLoading,
        error,
        filters,
        // Acciones
        fetchPredefinedDiagnostics,
        setFilters,
        clearFilters,
        getPredefinedById,
        getCategories,
        getSeverities
    }), [
        predefinedDiagnostics,
        isLoading,
        error,
        filters,
        fetchPredefinedDiagnostics,
        setFilters,
        clearFilters,
        getPredefinedById,
        getCategories,
        getSeverities
    ]);
}
