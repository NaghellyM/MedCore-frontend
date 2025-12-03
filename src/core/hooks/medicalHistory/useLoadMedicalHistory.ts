/**
 * HOOK UNIFICADO PARA CARGAR HISTORIA CLÍNICA
 * ===========================================
 * Centraliza toda la lógica de carga de historia médica + paciente
 * Elimina duplicación de código entre componentes
 */

import { useState, useEffect, useRef } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { patientService } from "../../services/patientService";
import type { MedicalHistory, Diagnostic } from "../../types/medicalHistory";
import type { Patient } from "../../types/patient";

interface LoadMedicalHistoryState {
    medicalHistory: MedicalHistory | null;
    diagnostics: Diagnostic[];
    patient: Patient | null;
    patientName: string;
    isLoading: boolean;
    error: string | null;
}

interface UseLoadMedicalHistoryOptions {
    historyId: string | null;
    enabled?: boolean;
    onSuccess?: (data: LoadMedicalHistoryState) => void;
    onError?: (error: string) => void;
}

/**
 * Hook para cargar una historia médica con toda su información relacionada
 * @param options - Configuración del hook
 * @returns Estado de la carga con toda la información
 */
export function useLoadMedicalHistory(options: UseLoadMedicalHistoryOptions) {
    const { historyId, enabled = true, onSuccess, onError } = options;

    const [state, setState] = useState<LoadMedicalHistoryState>({
        medicalHistory: null,
        diagnostics: [],
        patient: null,
        patientName: "",
        isLoading: true,
        error: null,
    });

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Evitar múltiples ejecuciones
        if (hasLoadedRef.current || !enabled || !historyId) {
            if (!historyId && enabled) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: "ID de historia clínica no válido"
                }));
            }
            return;
        }

        hasLoadedRef.current = true;

        const loadData = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true, error: null }));

                // Cargar historia médica
                const historyResponse = await medicalHistoryService.getMedicalHistoryById(historyId);
                const history = historyResponse.data;
                const diagnostics = history.diagnostics || [];

                let patient: Patient | null = null;
                let patientName = "Paciente";

                // Cargar información del paciente
                try {
                    const patientResponse = await patientService.getPatientById(history.patientId);
                    patient = patientResponse;
                    patientName = patient.fullname || "Paciente";
                } catch (patientError) {
                    console.warn("No se pudo cargar información del paciente:", patientError);
                    // Continuar sin datos del paciente
                }

                const newState = {
                    medicalHistory: history,
                    diagnostics,
                    patient,
                    patientName,
                    isLoading: false,
                    error: null,
                };

                setState(newState);
                onSuccess?.(newState);

            } catch (error) {
                const errorMessage = error instanceof Error 
                    ? error.message 
                    : "Error al cargar la historia clínica";
                
                setState({
                    medicalHistory: null,
                    diagnostics: [],
                    patient: null,
                    patientName: "",
                    isLoading: false,
                    error: errorMessage,
                });

                onError?.(errorMessage);
            }
        };

        loadData();
    }, [historyId, enabled, onSuccess, onError]);

    const refetch = async () => {
        hasLoadedRef.current = false;
        if (historyId) {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            // Trigger useEffect
            hasLoadedRef.current = false;
        }
    };

    return {
        ...state,
        refetch,
    };
}
