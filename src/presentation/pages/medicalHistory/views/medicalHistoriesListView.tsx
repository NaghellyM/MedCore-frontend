import React, { useState } from "react";
import { 
    Search, 
    Filter, 
    FileText, 
    User, 
    Calendar, 
    ChevronRight,
    RefreshCw,
    X,
    Stethoscope,
    Clock
} from "lucide-react";
import { useMedicalHistoryList } from "../../../../core/hooks/medicalHistory/useMedicalHistoryList";
import { useNavigate } from "react-router-dom";

interface MedicalHistoriesListViewProps {
    showFilters?: boolean;
    enableNavigation?: boolean;
    onHistorySelect?: (historyId: string, patientId: string) => void;
}

export const MedicalHistoriesListView: React.FC<MedicalHistoriesListViewProps> = ({
    showFilters = true,
    enableNavigation = true,
    onHistorySelect
}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        doctorId: "",
        dateFrom: "",
        dateTo: "",
        patientName: "",
        patientDocument: ""
    });

    const {
        medicalHistories,
        pagination,
        isLoading,
        isError,
        errorMessage,
        filters,
        setFilters,
        clearFilters,
        loadPage,
        refresh,
        searchByPatient
    } = useMedicalHistoryList({
        enabled: true,
        pageSize: 20
    });

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchByPatient(searchTerm);
    };

    const handleApplyFilters = () => {
        setFilters({
            ...filters,
            ...tempFilters,
            searchTerm: searchTerm
        });
        setShowAdvancedFilters(false);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setTempFilters({
            doctorId: "",
            dateFrom: "",
            dateTo: "",
            patientName: "",
            patientDocument: ""
        });
        clearFilters();
        setShowAdvancedFilters(false);
    };

    const handleHistoryClick = (historyId: string, patientId: string) => {
        if (onHistorySelect) {
            onHistorySelect(historyId, patientId);
        } else if (enableNavigation) {
            navigate(`/medicalHistory/patient/${patientId}`);
        }
    };

    const hasActiveFilters = Object.values(filters).some(value => value && value.toString().trim() !== "");

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Historias Clínicas
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Listado completo de historias clínicas registradas
                    </p>
                </div>
                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {/* Search and Filters */}
            {showFilters && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
                    {/* Main Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre del paciente o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                    </form>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="border-t border-slate-200 pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nombre del Paciente
                                    </label>
                                    <input
                                        type="text"
                                        value={tempFilters.patientName}
                                        onChange={(e) => setTempFilters({...tempFilters, patientName: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nombre completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Documento del Paciente
                                    </label>
                                    <input
                                        type="text"
                                        value={tempFilters.patientDocument}
                                        onChange={(e) => setTempFilters({...tempFilters, patientDocument: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Número de documento"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fecha Desde
                                    </label>
                                    <input
                                        type="date"
                                        value={tempFilters.dateFrom}
                                        onChange={(e) => setTempFilters({...tempFilters, dateFrom: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Fecha Hasta
                                    </label>
                                    <input
                                        type="date"
                                        value={tempFilters.dateTo}
                                        onChange={(e) => setTempFilters({...tempFilters, dateTo: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleApplyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Aplicar Filtros
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Active Filters Indicator */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 text-sm text-blue-700">
                            <Filter className="w-4 h-4" />
                            <span>Filtros activos aplicados</span>
                            <button
                                onClick={handleClearFilters}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Limpiar todos
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Cargando historias clínicas...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <X className="w-5 h-5" />
                        <p className="font-medium">Error al cargar las historias clínicas</p>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                    <button
                        onClick={refresh}
                        className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            )}

            {/* Results */}
            {!isLoading && !isError && (
                <>
                    {/* Results Count */}
                    {pagination && (
                        <div className="flex items-center justify-between text-sm text-slate-600">
                            <p>
                                Mostrando {medicalHistories.length} de {pagination.total} historias clínicas
                            </p>
                            {pagination.totalPages > 1 && (
                                <p>
                                    Página {pagination.page} de {pagination.totalPages}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Medical Histories List */}
                    {medicalHistories.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                No se encontraron historias clínicas
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {hasActiveFilters 
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Aún no hay historias clínicas registradas"
                                }
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {medicalHistories.map((history) => (
                                <div
                                    key={history.id}
                                    onClick={() => handleHistoryClick(history.id, history.patient.id)}
                                    className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            {/* Patient Info */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {history.patient.fullname}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                                        <span>CC: {history.patient.identificacion}</span>
                                                        {history.patient.historyNumber && (
                                                            <span>HC: {history.patient.historyNumber}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Medical Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Stethoscope className="w-4 h-4" />
                                                    <span>Dr. {history.doctor.fullname}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <FileText className="w-4 h-4" />
                                                    <span>{history.totalDiagnostics} diagnóstico{history.totalDiagnostics !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        {history.lastDiagnosticDate 
                                                            ? `Última consulta: ${new Date(history.lastDiagnosticDate).toLocaleDateString()}`
                                                            : "Sin consultas"
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Creada: {new Date(history.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>Actualizada: {new Date(history.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/medicalHistory/${history.id}/edit`);
                                                }}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar historia clínica"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6">
                            <button
                                onClick={() => loadPage(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => loadPage(page)}
                                            className={`w-8 h-8 text-sm rounded-lg ${
                                                page === pagination.page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-slate-300 hover:bg-slate-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <button
                                onClick={() => loadPage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};