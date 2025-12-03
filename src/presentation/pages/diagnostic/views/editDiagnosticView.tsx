import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiagnosticForm } from "../forms/diagnosticForm";
import { useDiagnostic } from "../../../../core/hooks/diagnostic/useDiagnostic";
import { medicalHistoryService } from "../../../../core/services/medicalHistoryService";
import { getHomeRouteByRole } from "../../../../core/utils/navigation";

export function EditDiagnosticView() {
    const { medicalHistoryId, diagnosticId } = useParams<{
        medicalHistoryId: string;
        diagnosticId: string;
    }>();
    const navigate = useNavigate();

    const { diagnostic, loading, error, notFound, fetchDiagnostic } = useDiagnostic(diagnosticId);
    const [patientId, setPatientId] = React.useState<string | undefined>();
    const [medicalHistoryLoading, setMedicalHistoryLoading] = React.useState(false);

    // Cargar el diagnóstico al montar el componente
    React.useEffect(() => {
        if (diagnosticId && !diagnostic) {
            fetchDiagnostic(diagnosticId);
        }
    }, [diagnosticId, diagnostic, fetchDiagnostic]);

    // Obtener patientId desde la historia médica
    React.useEffect(() => {
        const loadPatientId = async () => {
            if (medicalHistoryId && !patientId) {
                try {
                    setMedicalHistoryLoading(true);
                    const medicalHistoryResponse = await medicalHistoryService.getMedicalHistoryById(medicalHistoryId);
                    setPatientId(medicalHistoryResponse.data.patientId);
                } catch (error) {
                    console.error('Error loading medical history:', error);
                } finally {
                    setMedicalHistoryLoading(false);
                }
            }
        };

        loadPatientId();
    }, [medicalHistoryId, patientId]);

    const handleSaveSuccess = () => {
        // Navegar de vuelta a la lista de diagnósticos o historia médica
        if (medicalHistoryId && patientId) {
            navigate(`/medicalHistory/patient/${patientId}`, { 
                replace: true,
                state: { message: "Diagnóstico actualizado exitosamente" }
            });
        } else {
            navigate(getHomeRouteByRole());
        }
    };

    const handleCancel = () => {
        navigate(getHomeRouteByRole());
    };

    if (loading || medicalHistoryLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-lg border border-border p-8 transition-colors duration-300">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-muted-foreground">
                            {loading ? "Cargando diagnóstico..." : "Cargando información del paciente..."}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || notFound || !diagnostic || !patientId) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-lg border border-border p-8 transition-colors duration-300">
                    <div className="text-center">
                        <div className="text-destructive mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {!diagnostic ? "Diagnóstico No Encontrado" : "Error de Carga"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {!diagnostic 
                                ? "No se pudo cargar el diagnóstico especificado."
                                : "No se pudo cargar la información del paciente."
                            }
                        </p>
                        <button
                            onClick={() => navigate(getHomeRouteByRole())}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <DiagnosticForm
                mode="edit"
                patientId={patientId}
                medicalHistoryId={medicalHistoryId}
                diagnosticId={diagnosticId}
                initialData={diagnostic}
                onSaveSuccess={handleSaveSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}