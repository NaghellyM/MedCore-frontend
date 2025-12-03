import React from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../core/hooks/notifications/useToast";
import { useDiagnostics } from "../../../../core/hooks/diagnostic/useDiagnostics";
import { useDeleteDiagnostic } from "../../../../core/hooks/diagnostic/useDeleteDiagnostic";
import type { DiagnosticSummary } from "../../../../core/types/diagnostic";
import { AutoDashboardLayout } from "../../../layouts/autoDashboardLayout";
import { Breadcrumbs } from "../../../components/navigation/Breadcrumbs";
import { DiagnosticListComponent } from "../components/DiagnosticListComponent";

/**
 * Vista de diagnósticos filtrada por historia médica específica
 * Responsabilidad única: Orquestar la lógica para diagnósticos de una historia médica
 */
export function DiagnosticListView() {
    const { medicalHistoryId } = useParams<{
        patientId: string;
        medicalHistoryId: string;
    }>();
    const { error: showError } = useToast();

    const { diagnostics, loading, error, fetchDiagnostics } = useDiagnostics();
    const { deleteDiagnostic } = useDeleteDiagnostic({
        onSuccess: () => {
            if (medicalHistoryId) {
                fetchDiagnostics({ 
                    medicalHistoryId,
                    state: "ACTIVE"
                });
            }
        },
        onError: (error) => {
            // Solo mostrar error si no es una cancelación del usuario
            if (!error.includes("cancelada")) {
                showError("Error al eliminar el diagnóstico", error);
            }
        },
        showConfirmation: true
    });

    // Cargar diagnósticos al montar el componente y cuando se vuelve de edición
    React.useEffect(() => {
        if (medicalHistoryId) {
            // Usar el endpoint de diagnósticos generales con filtro por medicalHistoryId
            fetchDiagnostics({ 
                medicalHistoryId,
                state: "ACTIVE" // Solo diagnósticos activos por defecto
            });
        }
    }, [medicalHistoryId, fetchDiagnostics]);

    // Refrescar cuando se vuelve a la página (por ejemplo, después de editar)
    React.useEffect(() => {
        const handleFocus = () => {
            if (medicalHistoryId) {
                fetchDiagnostics({ medicalHistoryId, state: "ACTIVE" });
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [medicalHistoryId, fetchDiagnostics]);

    const handleDelete = async (diagnostic: DiagnosticSummary) => {
        await deleteDiagnostic(diagnostic.id);
    };

    const handleRetry = () => {
        if (medicalHistoryId) {
            fetchDiagnostics({ medicalHistoryId, state: "ACTIVE" });
        }
    };

    const getViewUrl = (diagnostic: DiagnosticSummary) => {
        return `/medical-history/${medicalHistoryId}/diagnosis/${diagnostic.id}`;
    };

    return (
        <AutoDashboardLayout showSearch={false}>
            <div className="p-6">
                <Breadcrumbs />
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Diagnósticos</h1>
                        <p className="text-gray-500 mt-1">
                            Visualización y gestión de diagnósticos (solo lectura)
                        </p>
                    </div>
                </div>

                {/* Lista de Diagnósticos - Componente Reutilizable */}
                <DiagnosticListComponent
                    diagnostics={diagnostics}
                    loading={loading}
                    error={error}
                    onDelete={handleDelete}
                    onRetry={handleRetry}
                    emptyMessage="No hay diagnósticos registrados"
                    emptyDescription="No existen diagnósticos asociados a esta historia médica."
                    showViewButton={true}
                    getViewUrl={getViewUrl}
                />
            </div>
        </AutoDashboardLayout>
    );
}