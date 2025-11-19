import React, { useCallback } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Diagnostic } from "../../../../core/types/diagnostic";
import { useDeleteDiagnostic } from "../../../../core/hooks/diagnostic/useDeleteDiagnostic";
import { useAuth } from "../../../../core/context/authContext";


interface DiagnosticCardProps {
    diagnostic: Diagnostic;
    onDiagnosticDeleted?: (diagnosticId: string) => void;
    showActions?: boolean;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ 
    diagnostic, 
    onDiagnosticDeleted,
    showActions = true 
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Determinar si el usuario actual es un paciente
    const isPatient = user?.role === 'PACIENTE' || user?.role === 'patient';

    const { deleteDiagnostic, isDeleting, canDelete } = useDeleteDiagnostic({
        onSuccess: onDiagnosticDeleted,
        showConfirmation: true
    });

    const handleDelete = useCallback(async () => {
        await deleteDiagnostic(diagnostic.id);
    }, [deleteDiagnostic, diagnostic.id]);

    const handleEdit = useCallback(() => {
        // Navegar a la página de edición del diagnóstico
        navigate(`/medicalHistory/${diagnostic.medicalHistoryId}/diagnosis/${diagnostic.id}/edit`);
    }, [navigate, diagnostic.medicalHistoryId, diagnostic.id]);

    const handleView = useCallback(() => {
        // Navegar a la página de lista de diagnósticos de esta historia médica
        navigate(`/medicalHistory/${diagnostic.medicalHistoryId}/diagnosis`);
    }, [navigate, diagnostic.medicalHistoryId]);
    const consultDate = new Date(diagnostic.consultDate).toLocaleDateString();
    const nextAppointment = diagnostic.nextAppointment
        ? new Date(diagnostic.nextAppointment).toLocaleDateString()
        : "Sin definir";

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <header className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">
                        {diagnostic.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                        Consulta del {consultDate}
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            diagnostic.state === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : diagnostic.state === "INACTIVE"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-red-50 text-red-700"
                            }`}
                    >
                        {diagnostic.state === "ACTIVE" 
                            ? "Activa" 
                            : diagnostic.state === "INACTIVE" 
                            ? "Inactiva" 
                            : "Eliminada"}
                    </span>

                    {/* Botones de acción - Solo para personal médico */}
                    {showActions && !isPatient && diagnostic.state !== "DELETED" && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleView}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Ver detalles"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={handleEdit}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Editar diagnóstico"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Eliminar diagnóstico"
                                >
                                    <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {diagnostic.diagnosis && (
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Diagnóstico
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                        {diagnostic.diagnosis}
                    </p>
                </section>
            )}

            {diagnostic.symptoms && (
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Síntomas
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                        {diagnostic.symptoms}
                    </p>
                </section>
            )}

            {diagnostic.treatment && (
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Tratamiento
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                        {diagnostic.treatment}
                    </p>
                </section>
            )}

            {diagnostic.prescriptions && (
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Prescripciones
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                        {diagnostic.prescriptions}
                    </p>
                </section>
            )}

            {diagnostic.documents && diagnostic.documents.length > 0 && (
                <section>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                        Documentos ({diagnostic.documents.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                        {diagnostic.documents.map((doc: any) => (
                            <span 
                                key={doc.id}
                                className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                            >
                                📄 {doc.filename}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            <footer className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Próxima cita: {nextAppointment}</span>
            </footer>
        </article>
    );
};
