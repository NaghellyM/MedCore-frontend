import { useState, useEffect, useCallback } from 'react';
import { getPatientById } from '../../services/patientService';
import type { Patient } from '../../models/patient';

interface UsePatientState {
    patient: Patient | null;
    loading: boolean;
    error: string | null;
}

export const usePatient = (patientId: string | null) => {
    const [state, setState] = useState<UsePatientState>({
        patient: null,
        loading: false,
        error: null,
    });

    const fetchPatient = useCallback(async (id: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const patientData = await getPatientById(id);
            setState({
                patient: patientData,
                loading: false,
                error: null,
            });
        } catch (error) {
            setState({
                patient: null,
                loading: false,
                error: error instanceof Error ? error.message : 'Error al obtener datos del paciente',
            });
        }
    }, []);

    useEffect(() => {
        if (patientId) {
            fetchPatient(patientId);
        } else {
            setState({ patient: null, loading: false, error: null });
        }
    }, [patientId, fetchPatient]);

    const refetch = useCallback(() => {
        if (patientId) {
            fetchPatient(patientId);
        }
    }, [patientId, fetchPatient]);

    return {
        ...state,
        refetch,
    };
};