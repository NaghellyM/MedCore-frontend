import React from "react";
import type { MedicalHistory } from "../../../../core/types/medicalHistory";
import { DiagnosticCard } from "./DiagnosticCard";

interface MedicalHistoryViewProps {
    history: MedicalHistory;
}

export const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({
    history,
}) => {

    return (
        <div className="flex flex-col gap-6">
            {/* Encabezado */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-start gap-2">
                    <div className="text-left text-sm text-slate-700">
                        <p>
                            Médico tratante:{" "}
                            <span className="font-medium">
                                {history.doctor.fullname}
                            </span>
                        </p>
                        <p >
                            Correo electrónico:{" "}
                            <span className="font-medium">
                                {history.doctor.email}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                    <span>Total diagnósticos: {history.diagnostics.length}</span>
                </div>
            </section>

            {/* Lista de diagnósticos */}
            <section className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-slate-800">
                    Diagnósticos
                </h2>

                {history.diagnostics.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        Aún no hay diagnósticos registrados para esta historia clínica.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {history.diagnostics.map((diagnostic) => (
                            <DiagnosticCard key={diagnostic.id} diagnostic={diagnostic} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
