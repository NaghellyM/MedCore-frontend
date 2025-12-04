import React, { useState, useEffect, useMemo, useCallback } from "react";
import { documentsService } from "../../../../core/services/documentsService";
import { prescriptionService } from "../../../../core/services/prescriptionService";
import { FileText as FileTextIcon,FileIcon } from "lucide-react";
import { Image, File, Download, FileArchive, FileVideo, FileAudio } from "lucide-react";
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
import { DiagnosticCard } from "../../diagnostic/components/DiagnosticCard";
import { useDiagnosticFilter } from "../../../../core/hooks/diagnostic/useDiagnosticFilter";
import { useAuth } from "../../../../core/context/authContext";

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
    const { user } = useAuth();
    const patientId = history.patientId || history.patient?.id;
    
    // Determinar si el usuario actual es un paciente
    const isPatient = user?.role === 'PACIENTE' || user?.role === 'patient';
    const [selectedState, setSelectedState] = useState<DiagnosticState | "all">("all");
    const [sortBy, setSortBy] = useState<"date" | "title">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showStatisticsDetails, setShowStatisticsDetails] = useState(false);
    const [localDiagnostics, setLocalDiagnostics] = useState(history.diagnostics);
    const [showDeleted, setShowDeleted] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loadingDocuments, setLoadingDocuments] = useState(true);
    const [prescriptions, setPrescriptions] = useState([]);
const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<string | null>(null);



    useEffect(() => {
    loadDocuments();
}, [patientId]);




const handleDownload = async (documentId: string, filename: string) => {
    try {
        const response = await documentsService.downloadDocument(documentId);
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error descargando:", err);
    }
};


    const loadDocuments = async () => {
    if (!patientId) return;
    try {
        const res = await documentsService.getDocumentsByPatientId(patientId);
        setDocuments(res.data);
    } catch (error) {
        console.error("Error cargando documentos:", error);
    } finally {
        setLoadingDocuments(false);
    }
};


    // Hook para filtrado por rol
    const { canViewDeleted } = useDiagnosticFilter({ showDeleted });

    // Sincronizar localDiagnostics con history.diagnostics cuando cambie
    useEffect(() => {
        setLocalDiagnostics(history.diagnostics);
    }, [history.diagnostics]);

    useEffect(() => {
    loadPrescriptions();
}, [patientId]);

const loadPrescriptions = async () => {
    if (!patientId) return;
    try {
        const res = await prescriptionService.getPrescriptionsByPatientId(patientId);
        console.log("res:", res);
        
        setPrescriptions(res.data || []);
    } catch (error) {
        console.error("Error cargando prescripciones:", error);
    } finally {
        setLoadingPrescriptions(false);
    }
};


const downloadPrescriptionPdf = async (id: string) => {
    try {
        const blob = await prescriptionService.downloadPrescriptionPdf(id);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription-${id}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error descargando PDF:", error);
    }
};


const downloadAllPrescriptionsPdf = async () => {
    try {
        const blob = await prescriptionService.downloadAllPrescriptionsPdf(patientId);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `prescripciones-${patientId}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error descargando PDF:", error);
    }
};



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
    archived: localDiagnostics.filter((d: any) => d.state === "ARCHIVED").length,
    deleted: localDiagnostics.filter((d: any) => d.state === "DELETED").length,
    totalDocuments: documents.length,
    withNextAppointment: localDiagnostics.filter((d: any) => d.nextAppointment).length
}), [localDiagnostics, documents]);


    const getStateColor = (state: DiagnosticState) => {
        switch (state) {
            case "ACTIVE": return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30";
            case "ARCHIVED": return "text-slate-600 bg-slate-50 dark:text-gray-400 dark:bg-gray-800";
            case "DELETED": return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30";
            default: return "text-slate-600 bg-slate-50 dark:text-gray-400 dark:bg-gray-800";
        }
    };

    const getStateLabel = (state: DiagnosticState) => {
        switch (state) {
            case "ACTIVE": return "Activos";
            case "ARCHIVED": return "Archivados";
            case "DELETED": return "Eliminados";
            default: return "Todos";
        }
    };

    const handlePreview = async (documentId: string, fileType: string) => {
    try {
        const response = await documentsService.downloadDocument(documentId);

        const blobUrl = window.URL.createObjectURL(response.data);
        setPreviewUrl(blobUrl);
        setPreviewType(fileType.toLowerCase());
    } catch (err) {
        console.error("Error mostrando previsualización:", err);
    }
};


// Función para mostrar un ícono según el tipo de archivo
const getDocumentIcon = (type: string) => {
    const fileType = type.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileType)) {
        return <Image className="w-6 h-6 text-blue-600" />;
    }

    if (["pdf"].includes(fileType)) {
        return <FileText className="w-6 h-6 text-red-600" />;
    }

    if (["zip", "rar", "7z"].includes(fileType)) {
        return <FileArchive className="w-6 h-6 text-amber-600" />;
    }

    if (["mp4", "mov", "avi", "mkv"].includes(fileType)) {
        return <FileVideo className="w-6 h-6 text-purple-600" />;
    }

    if (["mp3", "wav", "aac"].includes(fileType)) {
        return <FileAudio className="w-6 h-6 text-green-600" />;
    }

    return <File className="w-6 h-6 text-slate-600" />;
};


    return (
        
        <div className="flex flex-col gap-6">
            {previewUrl && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-auto relative">

            {/* Botón cerrar */}
            <button
                onClick={() => setPreviewUrl(null)}
                className="absolute top-3 right-3 text-xl"
            >
                ✕
            </button>

            {/* Vista segun tipo */}
            {["jpg", "jpeg", "png", "gif", "webp"].includes(previewType!) ? (
                <img src={previewUrl} className="w-full rounded-lg" />
            ) : previewType === "pdf" ? (
                <iframe
                    src={previewUrl}
                    className="w-full h-[80vh] rounded-lg"
                ></iframe>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-600">
                        No se puede previsualizar este tipo de archivo.
                    </p>
                    <a
                        href={previewUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                    >
                        Abrir directamente
                    </a>
                </div>
            )}
        </div>
    </div>
)}

            {/* Encabezado de la Historia Clínica */}
            <section className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-300">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
                                Historia Clínica
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-gray-400">
                                ID: {history.id}
                            </p>
                        </div>
                    </div>
                    <div className="text-right text-sm text-slate-500 dark:text-gray-400">
                        <p>Creada: {new Date(history.createdAt).toLocaleDateString()}</p>
                        <p>Actualizada: {new Date(history.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Información del Médico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                                Médico Tratante
                            </p>
                            <p className="text-sm text-slate-700 dark:text-gray-300">
                                Dr. {history.doctor.fullname}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                                Contacto
                            </p>
                            <p className="text-sm text-slate-700 dark:text-gray-300">
                                {history.doctor.email}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Estadísticas */}
            {showStatistics && (
                <section className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            {isPatient ? "Resumen" : "Resumen Estadístico"}
                        </h2>
                        {!isPatient && (
                            <button
                                onClick={() => setShowStatisticsDetails(!showStatisticsDetails)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                                {showStatisticsDetails ? "Ocultar" : "Ver más"}
                                {showStatisticsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors duration-300">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Total Diagnósticos</p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg transition-colors duration-300">
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.totalDocuments}</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">Con Documentos</p>
                        </div>
                    </div>

                    {!isPatient && showStatisticsDetails && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-600 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                <span className="text-slate-600 dark:text-gray-400">
                                    Citas programadas: <span className="font-medium">{stats.withNextAppointment}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                <span className="text-slate-600 dark:text-gray-400">
                                    Tasa de actividad: <span className="font-medium">
                                        {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                                    </span>
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Filtros y Ordenamiento - Solo para personal médico */}
            {showFilters && !isPatient && localDiagnostics.length > 0 && (
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
                            {(["ACTIVE", "ARCHIVED"] as DiagnosticState[]).map(state => (
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
                                            ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                                            : "bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 border-slate-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    Eliminados ({stats.deleted})
                                </button>
                            )}
                        </div>

                        {/* Toggle para mostrar/ocultar eliminados (solo admin) */}
                        {canViewDeleted && stats.deleted > 0 && (
                            <div className="flex items-center gap-2 ml-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                                    <input
                                        type="checkbox"
                                        checked={showDeleted}
                                        onChange={(e) => setShowDeleted(e.target.checked)}
                                        className="rounded border-slate-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                    />
                                    <span>Incluir eliminados en vista general</span>
                                </label>
                            </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm text-slate-600 dark:text-gray-400">Ordenar por:</span>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy as "date" | "title");
                                    setSortOrder(newSortOrder as "asc" | "desc");
                                }}
                                className="text-sm border border-slate-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded px-2 py-1 transition-colors duration-300"
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
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                        Diagnósticos
                        {selectedState !== "all" && (
                            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-gray-400">
                                ({filteredDiagnostics.length} de {localDiagnostics.length})
                            </span>
                        )}
                    </h2>
                    
                    {filteredDiagnostics.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
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
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 transition-colors duration-300">
                        <FileText className="w-12 h-12 text-slate-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-gray-100 mb-2">
                            {selectedState === "all" 
                                ? "No hay diagnósticos registrados"
                                : `No hay diagnósticos ${getStateLabel(selectedState as DiagnosticState).toLowerCase()}`
                            }
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">
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
                                showActions={!isPatient} // Los pacientes no ven botones de acción
                            />
                        ))}
                    </div>
                )}
            </section>
            {/* ====================================================
   DOCUMENTOS DEL PACIENTE 📄
==================================================== */}
{/* ====================================================
    DOCUMENTOS DEL PACIENTE 📄
==================================================== */}
<section className="flex flex-col gap-4 mt-4">
    <h2 className="text-lg font-semibold flex items-center gap-2">
        <FileTextIcon className="w-5 h-5 text-blue-600" />
        Documentos del Paciente
    </h2>

    {loadingDocuments ? (
        <p className="text-slate-500 italic">Cargando documentos...</p>
    ) : documents.length === 0 ? (
        <div className="p-6 text-center border bg-slate-50 rounded-xl">
            <FileIcon className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="mt-2 text-slate-500">No hay documentos registrados.</p>
        </div>
    ) : (
        <div className="grid md:grid-cols-2 gap-4">
            {documents.map(doc => (
                <div
                    key={doc.id}
                    className="p-4 border rounded-xl bg-white shadow-sm flex gap-4 items-center cursor-pointer hover:bg-slate-50"
                    onClick={() => handlePreview(doc.id, doc.fileType)}
                >

                    
                    {/* ICONO */}
                    <div className="p-3 rounded-lg bg-slate-100">
                        {getDocumentIcon(doc.fileType)}
                    </div>

                    {/* INFO */}
                    <div className="flex-1">
                        <p className="font-medium">{doc.filename}</p>
                        <p className="text-xs text-slate-500">
                            {doc.diagnostic?.title}
                        </p>
                        <p className="text-xs text-slate-400">
                            {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* BOTÓN DESCARGAR */}
                    <button
    className="p-2 rounded-md bg-blue-100 hover:bg-blue-200"
    onClick={(e) => {
    e.stopPropagation();
    handleDownload(doc.id, doc.filename);
}}

>
    <FileTextIcon className="w-4 h-4 text-blue-600" />
</button>

                </div>
            ))}
        </div>
    )}
</section>
{/* ====================================================
    PRESCRIPCIONES DEL PACIENTE 💊
==================================================== */}
<section className="flex flex-col gap-4 mt-6">
    <h2 className="text-lg font-semibold flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-green-600" />
        Prescripciones del Paciente
    </h2>

<button
    onClick={downloadAllPrescriptionsPdf}
    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md flex justify-center items-center gap-2 transition"
>
    <FileText className="w-5 h-5" />
    Descargar todas las prescripciones en PDF
</button>


    {loadingPrescriptions ? (
        <p className="text-slate-500 italic">Cargando prescripciones...</p>
    ) : prescriptions.length === 0 ? (
        <div className="p-6 text-center border bg-slate-50 rounded-xl dark:bg-gray-800 dark:border-gray-700">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="mt-2 text-slate-500 dark:text-gray-400">No hay prescripciones registradas.</p>
        </div>
    ) : (
        <div className="flex flex-col gap-4">
            {prescriptions.map((pres) => (
                <div
    key={pres.id}
    className="p-5 border rounded-xl bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700"
>
    {/* Encabezado */}
    <div className="flex items-center justify-between mb-3">
        <div>
            <h3 className="text-md font-semibold text-slate-800 dark:text-gray-100">
                Prescripción Médica
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
                Emitida el: {new Date(pres.prescriptionDate).toLocaleDateString()}
            </p>
        </div>

        <div className="flex items-center gap-2">
            <button
                onClick={() => downloadPrescriptionPdf(pres.id)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md flex items-center gap-1 text-sm"
            >
                <FileText className="w-4 h-4" />
                PDF
            </button>

            <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    pres.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}
            >
                {pres.status === "ACTIVE" ? "Activa" : "Inactiva"}
            </span>
        </div>
    </div>

    {/* Alergias */}
    {pres.allergies?.length > 0 && (
        <div className="mb-3">
            <p className="text-sm font-medium text-slate-600 dark:text-gray-300">Alergias:</p>
            <div className="flex gap-2 flex-wrap mt-1">
                {pres.allergies.map((al) => (
                    <span
                        key={al}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded dark:bg-red-900/30 dark:text-red-300"
                    >
                        {al}
                    </span>
                ))}
            </div>
        </div>
    )}

    {/* Notas */}
    {pres.notes && (
        <p className="text-sm italic text-slate-700 dark:text-gray-300 mb-3">
            “{pres.notes}”
        </p>
    )}

    {/* Medicamentos */}
    <div className="mt-3 border-t pt-3 dark:border-gray-600">
        <p className="font-medium text-sm text-slate-700 dark:text-gray-200 mb-2">
            Medicamentos Recetados:
        </p>

        <div className="flex flex-col gap-3">
            {pres.medications.map((med) => (
                <div
                    key={med.id}
                    className="p-3 rounded-lg bg-slate-50 border dark:bg-gray-700 dark:border-gray-600"
                >
                    <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                        {med.medicationName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-300">
                        {med.activeIngredient}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                        <div>
                            <span className="font-medium">Dosis:</span> {med.dosage}
                        </div>
                        <div>
                            <span className="font-medium">Frecuencia:</span> {med.frequency}
                        </div>
                        <div>
                            <span className="font-medium">Duración:</span>{" "}
                            {med.duration} {med.durationType}
                        </div>
                        <div>
                            <span className="font-medium">Advertencias:</span>{" "}
                            {med.warnings || "Ninguna"}
                        </div>
                    </div>

                    {med.instructions && (
                        <p className="text-xs mt-2 italic text-slate-600 dark:text-gray-300">
                            Instrucciones: {med.instructions}
                        </p>
                    )}
                </div>
            ))}
        </div>
    </div>
</div>

            ))}
        </div>
    )}
</section>

 
        </div>
    );
};
