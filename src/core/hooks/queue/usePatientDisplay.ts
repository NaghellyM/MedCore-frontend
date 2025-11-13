import { usePatient } from "./usePatient";
import type { Patient } from "../../models/patient";

export interface UsePatientDisplayReturn {
    patientData: Patient | null;
    loading: boolean;
    error: string | null;
    displayState: 'loading' | 'error' | 'success' | 'fallback';
    displayText: string;
}

/**
 * Hook personalizado para manejar la información del paciente para visualización
 * @param patientId - ID del paciente
 * @returns Datos del paciente y estado de visualización
 */
export function usePatientDisplay(patientId: string | null): UsePatientDisplayReturn {
    const {
        patient: patientData,
        loading: patientLoading,
        error: patientError
    } = usePatient(patientId);

    const getDisplayState = (): UsePatientDisplayReturn['displayState'] => {
        if (patientLoading) return 'loading';
        if (patientError) return 'error';
        if (patientData?.fullname) return 'success';
        return 'fallback';
    };

    const getDisplayText = (): string => {
        const state = getDisplayState();
        switch (state) {
            case 'loading':
                return 'Cargando nombre...';
            case 'error':
                return `Error al cargar nombre (ID: ${patientId?.slice(-8)})`;
            case 'success':
                return patientData?.fullname || '';
            case 'fallback':
                return `ID: ${patientId?.slice(-8)}`;
            default:
                return '';
        }
    };

    return {
        patientData,
        loading: patientLoading,
        error: patientError,
        displayState: getDisplayState(),
        displayText: getDisplayText()
    };
}