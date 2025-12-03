import React from "react";
import { FileText, Filter, Search } from "lucide-react";
import { useToast } from "../../../../core/hooks/notifications/useToast";
import { useDiagnostics } from "../../../../core/hooks/diagnostic/useDiagnostics";
import { useDeleteDiagnostic } from "../../../../core/hooks/diagnostic/useDeleteDiagnostic";
import type { DiagnosticSummary, DiagnosticState } from "../../../../core/types/diagnostic";
import { AutoDashboardLayout } from "../../../layouts/autoDashboardLayout";
import { Breadcrumbs } from "../../../components/navigation/Breadcrumbs";
import { DiagnosticListComponent } from "../components/DiagnosticListComponent";

/**
 * Página para listar TODOS los diagnósticos del sistema
 * Responsabilidad única: Orquestar la lógica de negocio y conectar con el componente de presentación
 */
export function AllDiagnosticsPage() {
    const { error: showError } = useToast();
    const [stateFilter, setStateFilter] = React.useState<DiagnosticState | "ALL">("ALL");
    const [searchTerm, setSearchTerm] = React.useState("");

    const { diagnostics, loading, error, fetchDiagnostics } = useDiagnostics();
    
    const { deleteDiagnostic } = useDeleteDiagnostic({
        onSuccess: () => {
            // Recargar la lista después de eliminar
            fetchDiagnostics(stateFilter !== "ALL" ? { state: stateFilter } : undefined);
        },
        onError: (error) => {
            if (!error.includes("cancelada")) {
                showError("Error al eliminar el diagnóstico", error);
            }
        },
        showConfirmation: true
    });

    // Cargar diagnósticos al montar el componente
    React.useEffect(() => {
        // Mostrar solo diagnósticos predefinidos
        fetchDiagnostics({ predefined: true });
    }, [fetchDiagnostics]);

    const handleDelete = async (diagnostic: DiagnosticSummary) => {
        await deleteDiagnostic(diagnostic.id);
    };

    const handleRetry = () => {
        fetchDiagnostics({ predefined: true });
    };

    const handleFilterChange = (newState: DiagnosticState | "ALL") => {
        setStateFilter(newState);
    };

    // Filtrar diagnósticos por término de búsqueda
    const filteredDiagnostics = React.useMemo(() => {
        if (!searchTerm) return diagnostics;
        
        const lowerSearch = searchTerm.toLowerCase();
        return diagnostics.filter(
            (d) =>
                d.title.toLowerCase().includes(lowerSearch) ||
                d.description?.toLowerCase().includes(lowerSearch)
        );
    }, [diagnostics, searchTerm]);

    const getViewUrl = (diagnostic: DiagnosticSummary) => {
        return `/medical-history/${diagnostic.medicalHistoryId}/diagnosis/${diagnostic.id}`;
    };

    return (
        <AutoDashboardLayout showSearch={false}>
            <div className="p-6">
                <Breadcrumbs />
                
                {/* Header */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6" />
                                Todos los Diagnósticos
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Visualización completa de todos los diagnósticos del sistema
                            </p>
                        </div>
                    </div>

                    {/* Filtros y Búsqueda */}
                    <div className="bg-white rounded-lg border p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Filtro por Estado */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={stateFilter}
                                    onChange={(e) => handleFilterChange(e.target.value as DiagnosticState | "ALL")}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="ALL">Todos los estados</option>
                                    <option value="ACTIVE">Activos</option>
                                    <option value="COMPLETED">Completados</option>
                                    <option value="CANCELLED">Cancelados</option>
                                    <option value="DELETED">Eliminados</option>
                                </select>
                            </div>
                        </div>

                        {/* Contador de resultados */}
                        {!loading && (
                            <div className="mt-3 text-sm text-gray-600">
                                Mostrando {filteredDiagnostics.length} de {diagnostics.length} diagnóstico{diagnostics.length !== 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lista de Diagnósticos */}
                <DiagnosticListComponent
                    diagnostics={filteredDiagnostics}
                    loading={loading}
                    error={error}
                    onDelete={handleDelete}
                    onRetry={handleRetry}
                    emptyMessage={searchTerm ? "No se encontraron diagnósticos" : "No hay diagnósticos registrados"}
                    emptyDescription={
                        searchTerm
                            ? "No existen diagnósticos que coincidan con tu búsqueda."
                            : "No existen diagnósticos en el sistema."
                    }
                    showViewButton={true}
                    getViewUrl={getViewUrl}
                />
            </div>
        </AutoDashboardLayout>
    );
}
