import { useCallback } from "react";

export interface UsePatientActionsProps {
    onComplete?: (queueItemId: string) => Promise<void> | void;
    patientId: string;
}

export interface UsePatientActionsReturn {
    handleComplete: () => Promise<void>;
    canComplete: boolean;
}

/**
 * Hook personalizado para manejar las acciones del paciente
 * @param props - Configuración del hook
 * @returns Funciones y estado para las acciones del paciente
 */
export function usePatientActions({ 
    onComplete, 
    patientId 
}: UsePatientActionsProps): UsePatientActionsReturn {
    
    const canComplete = Boolean(onComplete);

    const handleComplete = useCallback(async (): Promise<void> => {
        if (!onComplete) {
            console.warn('⚠️ onComplete function is not provided');
            return;
        }

        try {
            await onComplete(patientId);
        } catch (error) {
            console.error('Error al completar la atención:', error);
            throw error; 
        }
    }, [onComplete, patientId]);

    return {
        handleComplete,
        canComplete
    };
}