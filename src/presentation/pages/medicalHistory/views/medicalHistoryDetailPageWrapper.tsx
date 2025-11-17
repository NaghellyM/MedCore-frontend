import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from '../../doctor/components/doctorSideBar';
import { usePatientMedicalHistory } from "../../../../core/hooks/medicalHistory/useMedicalHistory";

import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import { PatientNameDisplay } from "../../../components/globals/PatientNameDisplay";
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MedicalHistoryView } from './medicalHistoryView';

export const MedicalHistoryDetailPageWrapper: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();

    const {
        history,
        pagination,
        isLoading,
        isError,
        errorMessage,
    } = usePatientMedicalHistory(patientId ?? null);

    const { displayState, displayText } = usePatientDisplay(patientId ?? null);

    if (!patientId) {
        return (
            <DashboardLayout sidebar={<DoctorSidebar />}>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            ID de paciente requerido
                        </h2>
                        <p className="text-slate-600">
                            No se pudo identificar el paciente para mostrar la historia clínica.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebar={<DoctorSidebar />}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
                {/* Header */}
                <header className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver
                        </button>
                        <div className="h-6 border-l border-slate-300" />
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">
                                Historia Clínica de{" "}
                                <PatientNameDisplay
                                    displayState={displayState}
                                    displayText={displayText}
                                />
                            </h1>
                            {history && (
                                <p className="text-sm text-slate-600 mt-1">
                                    Médico tratante: Dr. {history.doctor.fullname}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.location.reload()}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                        {history && (
                            <button
                                onClick={() => navigate(`/medicalHistory/${history.id}/edit`)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                        )}
                        <button
                            onClick={() => navigate(`/patient/${patientId}/summary`)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ver Resumen Completo
                        </button>
                    </div>
                </header>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">Cargando historia clínica...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p className="font-medium">Error al cargar la historia clínica</p>
                        <p className="mt-1">{errorMessage}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                {/* Medical History Content */}
                {!isLoading && !isError && history && (
                    <>
                        <MedicalHistoryView 
                            history={history} 
                            showStatistics={true}
                            showFilters={true}
                        />
                        
                        {/* Pagination Info */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-500">
                                    Página {pagination.page} de {pagination.totalPages}
                                    <span className="mx-1">•</span>
                                    {pagination.total} diagnóstico{pagination.total !== 1 ? 's' : ''} en total
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* No Data State */}
                {!isLoading && !isError && !history && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PatientNameDisplay
                                displayState={displayState}
                                displayText="📋"
                            />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            No se encontró historia clínica
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Este paciente aún no tiene historia clínica registrada.
                        </p>
                        <button
                            onClick={() => navigate(`/medicalHistory/create?patientId=${patientId}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Crear Historia Clínica
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};