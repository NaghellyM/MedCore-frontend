import { useParams, useNavigate } from "react-router-dom";
import { DiagnosticForm } from "../forms/diagnosticForm";
import { usePatientMedicalHistory } from "../../../../core/hooks/medicalHistory/useMedicalHistory";
import { getHomeRouteByRole } from "../../../../core/utils/navigation";

export function CreateDiagnosticView() {
    const { patientId, medicalHistoryId } = useParams<{
        patientId: string;
        medicalHistoryId: string;
    }>();
    const navigate = useNavigate();

    const { history, isLoading, isError } = usePatientMedicalHistory(patientId || null);

    const handleSaveSuccess = () => {
        // Navegar de vuelta al detalle de la historia médica
        navigate(`/medical-history/${medicalHistoryId}`);
    };

    const handleCancel = () => {
        navigate(getHomeRouteByRole());
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-lg border border-border p-8 transition-colors duration-300">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-muted-foreground">Verificando historia médica...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !history) {
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
                            Historia Médica No Encontrada
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            No se pudo cargar la historia médica especificada.
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
                mode="create"
                patientId={patientId}
                medicalHistoryId={medicalHistoryId}
                onSaveSuccess={handleSaveSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
}