import React from "react";
import type { Diagnostic } from "../../../../core/types/diagnostic";

interface DiagnosticCardProps {
    diagnostic: Diagnostic;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ diagnostic }) => {
    const consultDate = new Date(diagnostic.consultDate).toLocaleDateString();
    const nextAppointment = diagnostic.nextAppointment
        ? new Date(diagnostic.nextAppointment).toLocaleDateString()
        : "Sin definir";

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-2">
            <header className="flex items-start justify-between gap-2">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                        {diagnostic.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                        Consulta del {consultDate}
                    </p>
                </div>
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
