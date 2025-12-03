import React from "react";
import { useParams } from "react-router-dom";
import { usePatientMedicalHistory } from "../../../../core/hooks/medicalHistory/useMedicalHistory";
import { MedicalHistoryView } from "./medicalHistoryView";
import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import { PatientNameDisplay } from "../../../components/globals/PatientNameDisplay";

export const ViewPatientMedicalHistoryPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();

    const {
        history,
        pagination,
        isLoading,
        isError,
        errorMessage,
    } = usePatientMedicalHistory(patientId ?? null);

    const { displayState, displayText } = usePatientDisplay(patientId ?? null);

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">
                        Historias clínicas de  <PatientNameDisplay
                            displayState={displayState}
                            displayText={displayText}
                        />
                    </h1>

                </div>
            </header>
            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-slate-500 dark:text-gray-400">Cargando historia clínica…</p>
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30 p-4 text-sm text-rose-700 dark:text-rose-300 transition-colors duration-300">
                    <p className="font-medium">Error al cargar la historia clínica</p>
                    <p className="mt-1">{errorMessage}</p>
                </div>
            )}

            {!isLoading && !isError && history && (
                <>
                    <MedicalHistoryView history={history} />
                    {pagination && (
                        <div className="mt-4 text-center">
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                                Página {pagination.page} de {pagination.totalPages}
                                <span className="mx-1">•</span>
                                {pagination.total} diagnóstico{pagination.total !== 1 ? 's' : ''} en total
                            </p>
                        </div>
                    )}
                </>
            )}

            {!isLoading && !isError && !history && (
                <div className="text-center py-8">
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        No se encontró información de historia clínica para este paciente.
                    </p>
                </div>
            )}
        </main>

    );
};
