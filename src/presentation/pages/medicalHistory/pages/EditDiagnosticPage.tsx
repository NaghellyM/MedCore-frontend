import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DiagnosticForm } from "../components/DiagnosticForm";
import { useDiagnostic } from "../../../../core/hooks/diagnostic/useDiagnostic";

export function EditDiagnosticPage() {
    const { patientId, medicalHistoryId, diagnosticId } = useParams<{
        patientId: string;
        medicalHistoryId: string;
        diagnosticId: string;
    }>();
    const navigate = useNavigate();

    const { diagnostic, loading, error, notFound, fetchDiagnostic } = useDiagnostic(diagnosticId);

    // Cargar el diagnóstico al montar el componente
    React.useEffect(() => {
        if (diagnosticId) {
            fetchDiagnostic(diagnosticId);
        }
    }, [diagnosticId, fetchDiagnostic]);

    const handleSaveSuccess = () => {
        // Navegar de vuelta al detalle de la historia médica
        navigate(`/medical-history/${medicalHistoryId}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Cargando diagnóstico...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || notFound || !diagnostic) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Diagnóstico No Encontrado
                        </h3>
                        <p className="text-gray-500 mb-4">
                            No se pudo cargar el diagnóstico especificado.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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