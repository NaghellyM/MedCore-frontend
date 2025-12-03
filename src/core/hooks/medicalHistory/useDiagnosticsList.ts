/**
 * HOOK PARA GESTIÓN DE LISTA DE DIAGNÓSTICOS
 * ==========================================
 * Maneja el estado de la lista de diagnósticos incluyendo filtros
 */

import { useState, useEffect, useCallback } from "react";
import { useDiagnosticFilter } from "../diagnostic";
import type { Diagnostic } from "../../types/medicalHistory";

interface UseDiagnosticsListOptions {
    initialDiagnostics?: Diagnostic[];
}

export function useDiagnosticsList({ initialDiagnostics = [] }: UseDiagnosticsListOptions = {}) {
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>(initialDiagnostics);
    const [showDeleted, setShowDeleted] = useState(false);
    
    const { filterDiagnostics, canViewDeleted } = useDiagnosticFilter({ showDeleted });

    // Sincronizar con diagnósticos iniciales
    useEffect(() => {
        if (initialDiagnostics.length > 0) {
            setDiagnostics(initialDiagnostics);
        }
    }, [initialDiagnostics]);

    const handleDiagnosticDeleted = useCallback((deletedId: string) => {
        if (canViewDeleted) {
            // Admin: marcar como eliminado
            setDiagnostics(prev => prev.map(d => 
                d.id === deletedId 
                    ? { ...d, state: 'DELETED' as const }
                    : d
            ));
        } else {
            // Médico: remover de la lista
            setDiagnostics(prev => prev.filter(d => d.id !== deletedId));
        }
    }, [canViewDeleted]);

    const filteredDiagnostics = filterDiagnostics(diagnostics);

    return {
        diagnostics: filteredDiagnostics,
        allDiagnostics: diagnostics,
        showDeleted,
        canViewDeleted,
        setShowDeleted,
        handleDiagnosticDeleted
    };
}
