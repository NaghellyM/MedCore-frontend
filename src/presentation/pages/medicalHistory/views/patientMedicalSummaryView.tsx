import React, { useState } from "react";
import { 
    User, 
    Calendar, 
    Activity, 
    FileText, 
    Stethoscope,
    Clock,
    TrendingUp,
    Heart,
    AlertCircle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Search
} from "lucide-react";
import { usePatientMedicalHistory } from "../../../../core/hooks/medicalHistory/useMedicalHistory";
import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import { DiagnosticCard } from "../../diagnostic/components/diagnosticCard";

interface PatientMedicalSummaryViewProps {
    patientId: string;
    showTimeline?: boolean;
    showStatistics?: boolean;
    showPatientInfo?: boolean;
}

interface TimelineItem {
    id: string;
    type: "diagnostic" | "appointment" | "milestone";
    date: string;
    title: string;
    description?: string;
    status?: "active" | "inactive" | "deleted";
    diagnostic?: any;
}

export const PatientMedicalSummaryView: React.FC<PatientMedicalSummaryViewProps> = ({
    patientId,
    showTimeline = true,
    showStatistics = true,
    showPatientInfo = true
}) => {
    const [timelineFilter, setTimelineFilter] = useState<"all" | "diagnostics" | "appointments">("all");
    const [expandedStats, setExpandedStats] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        history,
        pagination,
        isLoading,
        isError,
        errorMessage,
    } = usePatientMedicalHistory(patientId);

    const { displayText } = usePatientDisplay(patientId);

    // Generar timeline de eventos médicos
    const generateTimeline = (): TimelineItem[] => {
        if (!history) return [];

        const items: TimelineItem[] = [];

        // Agregar diagnósticos
        history.diagnostics.forEach((diagnostic: any) => {
            items.push({
                id: `diagnostic-${diagnostic.id}`,
                type: "diagnostic",
                date: diagnostic.consultDate,
                title: diagnostic.title,
                description: diagnostic.diagnosis || diagnostic.symptoms,
                status: diagnostic.state.toLowerCase(),
                diagnostic
            });

            // Agregar citas programadas
            if (diagnostic.nextAppointment) {
                items.push({
                    id: `appointment-${diagnostic.id}`,
                    type: "appointment",
                    date: diagnostic.nextAppointment,
                    title: "Cita Programada",
                    description: `Seguimiento para: ${diagnostic.title}`
                });
            }
        });

        // Ordenar por fecha (más reciente primero)
        return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const timeline = generateTimeline();

    // Filtrar timeline
    const filteredTimeline = timeline.filter(item => {
        const matchesFilter = timelineFilter === "all" || 
                            (timelineFilter === "diagnostics" && item.type === "diagnostic") ||
                            (timelineFilter === "appointments" && item.type === "appointment");
        
        const matchesSearch = !searchTerm || 
                            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesFilter && matchesSearch;
    });

    // Estadísticas del paciente
    const patientStats = history ? {
        totalDiagnostics: history.diagnostics.length,
        activeDiagnostics: history.diagnostics.filter((d: any) => d.state === "ACTIVE").length,
        inactiveDiagnostics: history.diagnostics.filter((d: any) => d.state === "INACTIVE").length,
        totalDocuments: history.diagnostics.reduce((sum: number, d: any) => sum + (d.documents?.length || 0), 0),
        upcomingAppointments: history.diagnostics.filter((d: any) => 
            d.nextAppointment && new Date(d.nextAppointment) > new Date()
        ).length,
        lastConsultation: history.diagnostics.length > 0 
            ? new Date(Math.max(...history.diagnostics.map((d: any) => new Date(d.consultDate).getTime())))
            : null,
        daysSinceLastConsultation: history.diagnostics.length > 0 
            ? Math.floor((new Date().getTime() - Math.max(...history.diagnostics.map((d: any) => new Date(d.consultDate).getTime()))) / (1000 * 60 * 60 * 24))
            : null
    } : null;

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "active": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case "inactive": return <Clock className="w-4 h-4 text-slate-500" />;
            case "deleted": return <XCircle className="w-4 h-4 text-red-500" />;
            default: return <AlertCircle className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "diagnostic": return <Stethoscope className="w-4 h-4" />;
            case "appointment": return <Calendar className="w-4 h-4" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Activity className="w-8 h-8 animate-pulse text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Cargando resumen médico del paciente...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                    <XCircle className="w-5 h-5" />
                    <h3 className="font-medium">Error al cargar el resumen médico</h3>
                </div>
                <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
        );
    }

    if (!history) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No se encontró historial médico
                </h3>
                <p className="text-sm text-slate-500">
                    Este paciente aún no tiene historia clínica registrada.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header del Paciente */}
            {showPatientInfo && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                                Resumen Médico del Paciente
                            </h1>
                            <p className="text-lg text-slate-700">
                                {displayText}
                            </p>
                        </div>
                        {patientStats?.lastConsultation && (
                            <div className="text-right text-sm text-slate-500">
                                <p>Última consulta</p>
                                <p className="font-medium text-slate-900">
                                    {patientStats.lastConsultation.toLocaleDateString()}
                                </p>
                                <p className="text-xs">
                                    Hace {patientStats.daysSinceLastConsultation} días
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Médico Tratante */}
                    <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">
                                    Médico Tratante Principal
                                </p>
                                <p className="text-sm text-slate-700">
                                    Dr. {history.doctor.fullname}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {history.doctor.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estadísticas del Paciente */}
            {showStatistics && patientStats && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Estadísticas Médicas
                        </h2>
                        <button
                            onClick={() => setExpandedStats(!expandedStats)}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            {expandedStats ? "Ocultar" : "Ver más"}
                            {expandedStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{patientStats.totalDiagnostics}</p>
                            <p className="text-sm text-blue-700">Total Diagnósticos</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                            <p className="text-3xl font-bold text-emerald-600">{patientStats.activeDiagnostics}</p>
                            <p className="text-sm text-emerald-700">Activos</p>
                        </div>
                        <div className="text-center p-4 bg-amber-50 rounded-lg">
                            <p className="text-3xl font-bold text-amber-600">{patientStats.totalDocuments}</p>
                            <p className="text-sm text-amber-700">Documentos</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-3xl font-bold text-purple-600">{patientStats.upcomingAppointments}</p>
                            <p className="text-sm text-purple-700">Citas Pendientes</p>
                        </div>
                    </div>

                    {expandedStats && (
                        <div className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-red-400" />
                                <span className="text-slate-600">
                                    Estado general: <span className="font-medium text-emerald-600">Estable</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <span className="text-slate-600">
                                    Diagnósticos inactivos: <span className="font-medium">{patientStats.inactiveDiagnostics}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">
                                    Primera consulta: <span className="font-medium">
                                        {new Date(history.createdAt).toLocaleDateString()}
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Timeline */}
            {showTimeline && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Línea de Tiempo Médica
                        </h2>
                        <div className="flex items-center gap-4">
                            {/* Búsqueda */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar eventos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            
                            {/* Filtros */}
                            <select
                                value={timelineFilter}
                                onChange={(e) => setTimelineFilter(e.target.value as any)}
                                className="text-sm border border-slate-300 rounded-lg px-3 py-2"
                            >
                                <option value="all">Todos los eventos</option>
                                <option value="diagnostics">Solo diagnósticos</option>
                                <option value="appointments">Solo citas</option>
                            </select>
                        </div>
                    </div>

                    {filteredTimeline.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">
                                No se encontraron eventos
                            </h3>
                            <p className="text-sm text-slate-500">
                                {searchTerm || timelineFilter !== "all" 
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Aún no hay eventos médicos registrados para este paciente"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTimeline.map((item, index) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Timeline line */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                                            {getTypeIcon(item.type)}
                                        </div>
                                        {index < filteredTimeline.length - 1 && (
                                            <div className="w-0.5 h-16 bg-slate-200 mt-2"></div>
                                        )}
                                    </div>

                                    {/* Event content */}
                                    <div className="flex-1 pb-8">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-medium text-slate-900 flex items-center gap-2">
                                                        {item.title}
                                                        {item.status && getStatusIcon(item.status)}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(item.date).toLocaleDateString('es', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    item.type === "diagnostic" 
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}>
                                                    {item.type === "diagnostic" ? "Diagnóstico" : "Cita"}
                                                </span>
                                            </div>
                                            
                                            {item.description && (
                                                <p className="text-sm text-slate-600 mb-3">
                                                    {item.description}
                                                </p>
                                            )}

                                            {/* Mostrar tarjeta de diagnóstico completa si es un diagnóstico */}
                                            {item.type === "diagnostic" && item.diagnostic && (
                                                <div className="mt-3">
                                                    <DiagnosticCard diagnostic={item.diagnostic} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Información de Paginación */}
            {pagination && pagination.totalPages > 1 && (
                <div className="text-center text-sm text-slate-500">
                    <p>
                        Mostrando página {pagination.page} de {pagination.totalPages}
                        <span className="mx-1">•</span>
                        {pagination.total} diagnóstico{pagination.total !== 1 ? 's' : ''} en total
                    </p>
                </div>
            )}
        </div>
    );
};