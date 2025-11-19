/**
 * PÁGINA DE EDICIÓN DE HISTORIA CLÍNICA
 * =====================================
 * Página wrapper para editar historias clínicas existentes
 * Maneja el enrutamiento y la navegación después de la edición
 */

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Componente de formulario de edición
import { SimpleEditMedicalHistoryForm } from "./forms/simpleEditMedicalHistoryForm";

// Hooks
import { useToast } from "../../../core/hooks/notifications/useToast";

export function EditMedicalHistoryPage() {
    const { historyId } = useParams<{ historyId: string }>();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    // Validar que tenemos el ID de la historia
    useEffect(() => {
        if (!historyId) {
            showError("ID de historia clínica no encontrado");
            navigate("/medical-history", { replace: true });
        }
    }, [historyId, navigate, showError]);

    if (!historyId) {
        return null;
    }

    const handleSaveSuccess = (_updatedHistoryId: string, patientId?: string) => {
        success("Historia clínica actualizada exitosamente");
        
        // Redirigir a la vista de historias médicas del paciente
        if (patientId) {
            navigate(`/medicalHistory/patient/${patientId}`, { replace: true });
        } else {
            // Fallback: ir a la lista general
            navigate("/medicalHistory/list", { replace: true });
        }
    };

    const handleSaveError = (error: string) => {
        showError("Error al actualizar la historia clínica", error);
    };



    const handleGoBack = () => {
        // Opción 1: Volver a la vista de detalle si existe
        navigate(`/medical-history/${historyId}`, { replace: true });
        
        // Opción 2: Volver a la lista
        // navigate("/medical-history", { replace: true });
        
        // Opción 3: Usar history.back() para ir a la página anterior
        // window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header de la página */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleGoBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Volver</span>
                            </button>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Editar Historia Clínica
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>ID:</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {historyId}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SimpleEditMedicalHistoryForm
                    historyId={historyId}
                    onSaveSuccess={handleSaveSuccess}
                    onSaveError={handleSaveError}
                />
            </div>
        </div>
    );
}