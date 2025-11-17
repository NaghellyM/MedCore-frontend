import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Plus, Eye, Edit2, Trash2, Calendar, FileText } from "lucide-react";
import { useToast } from "../../../../core/hooks/notifications/useToast";
import Swal from "sweetalert2";
import { useDiagnostics } from "../../../../core/hooks/diagnostic/useDiagnostics";
import type { DiagnosticSummary } from "../../../../core/types/diagnostic";


export function DiagnosticListView() {
    const { medicalHistoryId } = useParams<{
        patientId: string;
        medicalHistoryId: string;
    }>();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    const { diagnostics, loading, error, fetchDiagnostics, deleteDiagnostic } = useDiagnostics();

    // Cargar diagnósticos al montar el componente
    React.useEffect(() => {
        if (medicalHistoryId) {
            fetchDiagnostics({ medicalHistoryId });
        }
    }, [medicalHistoryId, fetchDiagnostics]);

    const handleDelete = async (diagnostic: DiagnosticSummary) => {
        const result = await Swal.fire({
            title: '¿Eliminar diagnóstico?',
            text: `Se eliminará permanentemente el diagnóstico "${diagnostic.title}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteDiagnostic(diagnostic.id);
                success("Diagnóstico eliminado exitosamente");
                // Recargar la lista
                if (medicalHistoryId) {
                    fetchDiagnostics({ medicalHistoryId });
                }
            } catch (error) {
                showError("Error al eliminar el diagnóstico", "No se pudo completar la operación");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case "ACTIVE":
                return "bg-green-100 text-green-800 border-green-200";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            case "DELETED":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStateLabel = (state: string) => {
        switch (state) {
            case "ACTIVE":
                return "Activo";
            case "COMPLETED":
                return "Completado";
            case "CANCELLED":
                return "Cancelado";
            case "DELETED":
                return "Eliminado";
            default:
                return state;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Cargando diagnósticos...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg border p-8">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <FileText className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Error al Cargar Diagnósticos
                        </h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={() => medicalHistoryId && fetchDiagnostics({ medicalHistoryId })}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Diagnósticos</h1>
                    <p className="text-gray-500 mt-1">
                        Gestión de diagnósticos de la historia médica
                    </p>
                </div>
                <Link
                    to={`/medical-history/${medicalHistoryId}/diagnosis/new`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Diagnóstico
                </Link>
            </div>

            {/* Lista de Diagnósticos */}
            {diagnostics.length === 0 ? (
                <div className="bg-white rounded-lg border p-8">
                    <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No hay diagnósticos registrados
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Comience creando el primer diagnóstico para esta historia médica.
                        </p>
                        <Link
                            to={`/medical-history/${medicalHistoryId}/diagnosis/new`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Crear Primer Diagnóstico
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {diagnostics.map((diagnostic) => (
                        <div
                            key={diagnostic.id}
                            className="bg-white rounded-lg border hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {diagnostic.title}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStateColor(
                                                    diagnostic.state
                                                )}`}
                                            >
                                                {getStateLabel(diagnostic.state)}
                                            </span>
                                        </div>

                                        {diagnostic.description && (
                                            <p className="text-gray-600 mb-3 line-clamp-2">
                                                {diagnostic.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(diagnostic.consultDate)}
                                            </div>
                                            {diagnostic.updatedAt && diagnostic.updatedAt !== diagnostic.createdAt && (
                                                <div className="flex items-center gap-1">
                                                    <Edit2 className="w-4 h-4" />
                                                    Actualizado {diagnostic.updatedAt && formatDate(diagnostic.updatedAt)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() =>
                                                navigate(`/medical-history/${medicalHistoryId}/diagnosis/${diagnostic.id}`)
                                            }
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(`/medical-history/${medicalHistoryId}/diagnosis/${diagnostic.id}/edit`)
                                            }
                                            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(diagnostic)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}