import { useState, useCallback } from 'react';
import { diagnosticService } from '../../services/diagnosticService';
import { useToast } from '../notifications/useToast';
import type { 
    UseAssignDiagnosticsReturn,
    SelectedDiagnostic,
    AssignDiagnosticDto
} from '../../types/diagnostic';

/**
 * Hook para asignar diagnósticos predefinidos a un paciente
 * Permite seleccionar múltiples diagnósticos del catálogo y asignarlos
 */
export function useAssignDiagnostics(): UseAssignDiagnosticsReturn {
    const [isAssigning, setIsAssigning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { loading: showLoading, dismiss } = useToast();

    /**
     * Asignar diagnósticos seleccionados a un paciente
     */
    const assignDiagnostics = useCallback(async (
        patientId: string,
        selectedDiagnostics: SelectedDiagnostic[]
    ): Promise<boolean> => {
        if (!patientId || selectedDiagnostics.length === 0) {
            setError('Debe seleccionar al menos un diagnóstico');
            return false;
        }

        setIsAssigning(true);
        setError(null);
        setSuccess(false);

        try {
            // Mostrar indicador de carga
            const loadingToastId = showLoading(
                'Asignando diagnósticos',
                `Procesando ${selectedDiagnostics.length} diagnóstico${selectedDiagnostics.length > 1 ? 's' : ''}...`
            );
            
            // Asignar cada diagnóstico individualmente
            const results = [];
            
            for (const diag of selectedDiagnostics) {
                const diagnosticDto: AssignDiagnosticDto = {
                    title: diag.name,
                    description: diag.description,
                    symptoms: diag.customSymptoms || diag.commonSymptoms,
                    diagnosis: `${diag.code} - ${diag.name}`,
                    treatment: diag.customTreatment || diag.recommendedTreatment,
                    consultDate: diag.consultDate,
                    nextAppointment: diag.nextAppointment,
                    observations: diag.observations,
                    vitalSigns: diag.vitalSigns
                };
                
                const response = await diagnosticService.assignDiagnosticToPatient(patientId, diagnosticDto);
                results.push(response);
            }
            
            // Cerrar el toast de loading
            dismiss(loadingToastId);
            
            setSuccess(true);
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message 
                || err.message 
                || 'Error al asignar diagnósticos';
            setError(errorMessage);
            return false;
        } finally {
            setIsAssigning(false);
        }
    }, []);

    /**
     * Resetear el estado del hook
     */
    const reset = useCallback(() => {
        setIsAssigning(false);
        setError(null);
        setSuccess(false);
    }, []);

    return {
        isAssigning,
        error,
        success,
        assignDiagnostics,
        reset
    };
}
