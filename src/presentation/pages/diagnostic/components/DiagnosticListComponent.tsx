import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, FileText } from "lucide-react";
import type { DiagnosticSummary } from "../../../../core/types/diagnostic";

interface DiagnosticListComponentProps {
    diagnostics: DiagnosticSummary[];
    loading: boolean;
    error: string | null;
    onDelete: (diagnostic: DiagnosticSummary) => void;
    onRetry: () => void;
    emptyMessage?: string;
    emptyDescription?: string;
    showViewButton?: boolean;
    getViewUrl?: (diagnostic: DiagnosticSummary) => string;
}

/**
 * Componente reutilizable para mostrar listas de diagnósticos
 * Responsabilidad única: Presentación de la lista de diagnósticos
 */
export const DiagnosticListComponent: React.FC<DiagnosticListComponentProps> = ({
    diagnostics,
    loading,
    error,
    onDelete,
    onRetry,
    emptyMessage = "No hay diagnósticos registrados",
    emptyDescription = "No existen diagnósticos disponibles.",
    showViewButton = true,
    getViewUrl
}) => {
    const navigate = useNavigate();

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
            <div className="bg-white rounded-lg border p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando diagnósticos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
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
                        onClick={onRetry}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (diagnostics.length === 0) {
        return (
            <div className="bg-white rounded-lg border p-8">
                <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {emptyMessage}
                    </h3>
                    <p className="text-gray-500">
                        {emptyDescription}
                    </p>
                </div>
            </div>
        );
    }

    return (
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

        
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                {showViewButton && getViewUrl && (
                                    <button
                                        onClick={() => navigate(getViewUrl(diagnostic))}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Ver detalles"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(diagnostic)}
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
    );
};
