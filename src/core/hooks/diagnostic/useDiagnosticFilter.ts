/**
 * HOOK PARA FILTRAR DIAGNÓSTICOS POR ROL
 * ======================================
 * Hook que maneja el filtrado de diagnósticos según el rol del usuario
 * Médicos: Solo ven diagnósticos activos (no eliminados)
 * Administradores: Ven todos los diagnósticos incluidos los eliminados
 */

import { useMemo } from "react";
import { useAuth } from "../../context/authContext";
import type { Diagnostic } from "../../types/medicalHistory";

interface UseDiagnosticFilterOptions {
    showDeleted?: boolean; // Forzar mostrar eliminados (solo para admin)
    hideDeleted?: boolean; // Forzar ocultar eliminados
}

interface UseDiagnosticFilterReturn {
    filterDiagnostics: (diagnostics: Diagnostic[]) => Diagnostic[];
    canViewDeleted: boolean;
    shouldShowDeleted: boolean;
}

export function useDiagnosticFilter(options: UseDiagnosticFilterOptions = {}): UseDiagnosticFilterReturn {
    const { showDeleted = false, hideDeleted = false } = options;
    const { user } = useAuth();

    const canViewDeleted = useMemo(() => {
        return user?.role === 'ADMIN';
    }, [user?.role]);

    const shouldShowDeleted = useMemo(() => {
        if (hideDeleted) return false;
        if (showDeleted && canViewDeleted) return true;
        return canViewDeleted; // Por defecto, admin puede ver eliminados
    }, [showDeleted, hideDeleted, canViewDeleted]);

    const filterDiagnostics = useMemo(() => {
        return (diagnostics: Diagnostic[]): Diagnostic[] => {
            if (!diagnostics || diagnostics.length === 0) {
                return [];
            }

            // Si es admin y debe mostrar eliminados, devolver todos
            if (shouldShowDeleted) {
                return diagnostics;
            }

            // Filtrar solo diagnósticos activos (no eliminados)
            return diagnostics.filter(diagnostic => {
                // Los diagnósticos eliminados tienen estado 'DELETED'
                // Los diagnósticos inactivos pueden ser 'INACTIVE'
                const isDeleted = diagnostic.state === 'DELETED';
                const isInactive = diagnostic.state === 'INACTIVE';
                
                // Para médicos: solo mostrar diagnósticos activos
                // Para admins: mostrar activos e inactivos, pero no eliminados (a menos que se especifique)
                return !isDeleted && (shouldShowDeleted || !isInactive);
            });
        };
    }, [shouldShowDeleted]);

    return {
        filterDiagnostics,
        canViewDeleted,
        shouldShowDeleted
    };
}