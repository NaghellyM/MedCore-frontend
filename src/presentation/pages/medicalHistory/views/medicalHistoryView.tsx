import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
    FileText, 
    Calendar, 
    Stethoscope, 
    Activity,
    TrendingUp,
    Filter,
    ChevronDown,
    ChevronUp,
    Clock,
    Mail
} from "lucide-react";
import type { MedicalHistory, DiagnosticState } from "../../../../core/types/medicalHistory/index";
import { DiagnosticCard } from "../../diagnostic/components/diagnosticCard";
import { useDiagnosticFilter } from "../../../../core/hooks/diagnostic/useDiagnosticFilter";

interface MedicalHistoryViewProps {
    history: MedicalHistory;
    showStatistics?: boolean;
    showFilters?: boolean;
}

export const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({
    history,
    showStatistics = true,
    showFilters = true
}) => {
    const [selectedState, setSelectedState] = useState<DiagnosticState | "all">("all");
    const [sortBy, setSortBy] = useState<"date" | "title">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showStatisticsDetails, setShowStatisticsDetails] = useState(false);
    const [localDiagnostics, setLocalDiagnostics] = useState(history.diagnostics);
    const [showDeleted, setShowDeleted] = useState(false);

    // Hook para filtrado por rol
    const { canViewDeleted } = useDiagnosticFilter({ showDeleted });

    // Sincronizar localDiagnostics con history.diagnostics cuando cambie
    useEffect(() => {
        setLocalDiagnostics(history.diagnostics);
    }, [history.diagnostics]);

    const handleDiagnosticDeleted = useCallback((deletedId: string) => {
        if (canViewDeleted) {
            // Si es admin, marcar como eliminado
            setLocalDiagnostics(prev => prev.map(d => 
                d.id === deletedId 
                    ? { ...d, state: 'DELETED' as const }
                    : d
            ));
        } else {
            // Si es médico, remover de la lista
            setLocalDiagnostics(prev => prev.filter(d => d.id !== deletedId));
        }
    }, [canViewDeleted]);

    // Filtrar y ordenar diagnósticos (memoizado para evitar recálculos)
    const filteredDiagnostics = useMemo(() => {
        const diagnosticsToShow = canViewDeleted && showDeleted 
            ? localDiagnostics 
            : localDiagnostics.filter((d: any) => d.state !== "DELETED");

        return diagnosticsToShow
            .filter((diagnostic: any) => selectedState === "all" || diagnostic.state === selectedState)
            .sort((a: any, b: any) => {
                if (sortBy === "date") {
                    const dateA = new Date(a.consultDate).getTime();
                    const dateB = new Date(b.consultDate).getTime();
                    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
                } else {
                    return sortOrder === "desc" 
                        ? b.title.localeCompare(a.title)
                        : a.title.localeCompare(b.title);
                }
            });
    }, [localDiagnostics, canViewDeleted, showDeleted, selectedState, sortBy, sortOrder]);

    // Estadísticas (memoizadas para evitar recálculos)
    const stats = useMemo(() => ({
        total: localDiagnostics.length,
        active: localDiagnostics.filter((d: any) => d.state === "ACTIVE").length,
        inactive: localDiagnostics.filter((d: any) => d.state === "INACTIVE").length,
        deleted: localDiagnostics.filter((d: any) => d.state === "DELETED").length,
        withDocuments: localDiagnostics.filter((d: any) => d.documents && d.documents.length > 0).length,
        withNextAppointment: localDiagnostics.filter((d: any) => d.nextAppointment).length
    }), [localDiagnostics]);

    const getStateColor = (state: DiagnosticState) => {
        switch (state) {
            case "ACTIVE": return "text-emerald-600 bg-emerald-50";
            case "INACTIVE": return "text-slate-600 bg-slate-50";
            case "DELETED": return "text-red-600 bg-red-50";
            default: return "text-slate-600 bg-slate-50";
        }
    };

    const getStateLabel = (state: DiagnosticState) => {
        switch (state) {
            case "ACTIVE": return "Activos";
            case "INACTIVE": return "Inactivos";
            case "DELETED": return "Eliminados";
            default: return "Todos";
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Encabezado de la Historia Clínica */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Historia Clínica
                            </h1>
                            <p className="text-sm text-slate-500">
                                ID: {history.id}
                            </p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                        <p>Creada: {new Date(history.createdAt).toLocaleDateString()}</p>
                        <p>Actualizada: {new Date(history.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Información del Médico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                Médico Tratante
                            </p>
                            <p className="text-sm text-slate-700">
                                Dr. {history.doctor.fullname}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                Contacto
                            </p>
                            <p className="text-sm text-slate-700">
                                {history.doctor.email}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Estadísticas */}
            {showStatistics && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Resumen Estadístico
                        </h2>
                        <button
                            onClick={() => setShowStatisticsDetails(!showStatisticsDetails)}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            {showStatisticsDetails ? "Ocultar" : "Ver más"}
                            {showStatisticsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                            <p className="text-sm text-blue-700">Total Diagnósticos</p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                            <p className="text-2xl font-bold text-amber-600">{stats.withDocuments}</p>
                            <p className="text-sm text-amber-700">Con Documentos</p>
                        </div>
                    </div>

                    {showStatisticsDetails && (
                        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">
                                    Citas programadas: <span className="font-medium">{stats.withNextAppointment}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">
                                    Tasa de actividad: <span className="font-medium">
                                        {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Filtros y Ordenamiento */}
            {showFilters && localDiagnostics.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-700">Filtrar por estado:</span>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedState("all")}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                    selectedState === "all"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                Todos ({stats.total})
                            </button>
                            {(["ACTIVE", "INACTIVE"] as DiagnosticState[]).map(state => (
                                <button
                                    key={state}
                                    onClick={() => setSelectedState(state)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        selectedState === state
                                            ? `${getStateColor(state)} border-current`
                                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {getStateLabel(state)} ({stats[state.toLowerCase() as keyof typeof stats]})
                                </button>
                            ))}
                            
                            {/* Solo mostrar el filtro de eliminados si el usuario puede verlos */}
                            {canViewDeleted && (
                                <button
                                    onClick={() => setSelectedState("DELETED")}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        selectedState === "DELETED"
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    Eliminados ({stats.deleted})
                                </button>
                            )}
                        </div>

                        {/* Toggle para mostrar/ocultar eliminados (solo admin) */}
                        {canViewDeleted && stats.deleted > 0 && (
                            <div className="flex items-center gap-2 ml-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={showDeleted}
                                        onChange={(e) => setShowDeleted(e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Incluir eliminados en vista general</span>
                                </label>
                            </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm text-slate-600">Ordenar por:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy as "date" | "title");
                                    setSortOrder(newSortOrder as "asc" | "desc");
                                }}
                                className="text-sm border border-slate-300 rounded px-2 py-1"
                            >
                                <option value="date-desc">Fecha (más reciente)</option>
                                <option value="date-asc">Fecha (más antigua)</option>
                                <option value="title-asc">Título (A-Z)</option>
                                <option value="title-desc">Título (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </section>
            )}

            {/* Lista de Diagnósticos */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Diagnósticos
                        {selectedState !== "all" && (
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                ({filteredDiagnostics.length} de {localDiagnostics.length})
                            </span>
                        )}
                    </h2>
                    
                    {filteredDiagnostics.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="w-4 h-4" />
                            <span>
                                Última consulta: {
                                    new Date(
                                        Math.max(...localDiagnostics.map((d: any) => new Date(d.consultDate).getTime()))
                                    ).toLocaleDateString()
                                }
                            </span>
                        </div>
                    )}
                </div>

                {filteredDiagnostics.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border border-slate-200">
                        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            {selectedState === "all" 
                                ? "No hay diagnósticos registrados"
                                : `No hay diagnósticos ${getStateLabel(selectedState as DiagnosticState).toLowerCase()}`
                            }
                        </h3>
                        <p className="text-sm text-slate-500">
                            {selectedState === "all"
                                ? "Esta historia clínica aún no tiene diagnósticos asociados."
                                : "Intenta cambiar el filtro para ver otros diagnósticos."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {filteredDiagnostics.map((diagnostic: any) => (
                            <DiagnosticCard 
                                key={diagnostic.id} 
                                diagnostic={diagnostic} 
                                onDiagnosticDeleted={handleDiagnosticDeleted}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
