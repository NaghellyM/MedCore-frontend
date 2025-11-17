import React from "react";
import { useMyMedicalHistory } from "../../../../core/hooks/medicalHistory/useMedicalHistory";
import { MedicalHistoryView } from "./medicalHistoryView";
import { useAuth } from "../../../../core/context/authContext";

export const ViewMyMedicalHistoryPage: React.FC = () => {
    const { user } = useAuth();
    
    const {
        history,
        pagination,
        isLoading,
        isError,
        errorMessage,
        currentPatientId,
    } = useMyMedicalHistory();



    return (
        <div className="w-full min-h-full flex flex-col gap-4 sm:gap-6">
            {/* Header centrado y responsive */}
            <header className="w-full text-center mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 mb-2">
                    Mi Historia Clínica
                </h1>
                {user && (
                    <p className="text-sm sm:text-base text-slate-600">
                        Paciente: {user.fullname}
                    </p>
                )}
            </header>

            {/* Contenido principal que ocupa todo el ancho disponible */}
            <div className="w-full flex-1">

            {isLoading && (
                <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-slate-500">Cargando historia clínica…</p>
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <p className="font-medium">Error al cargar la historia clínica</p>
                    <p className="mt-1">{errorMessage}</p>
                    {!currentPatientId && (
                        <p className="mt-1 text-xs">
                            No se pudo obtener el ID del paciente desde la sesión.
                        </p>
                    )}
                    {errorMessage?.includes("Acceso denegado") && (
                        <div className="mt-3 p-3 bg-rose-100 rounded">
                            <p className="font-medium text-rose-800">Posible solución:</p>
                            <p className="text-xs text-rose-700 mt-1">
                                El backend podría no tener implementado el acceso directo para pacientes a su historia médica. 
                                Esto requiere configuración adicional en el servidor.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {!isLoading && !isError && history && (
                <>
                    <MedicalHistoryView history={history} />
                    {pagination && (
                        <div className="mt-4 text-center">
                            <p className="text-xs text-slate-500">
                                Página {pagination.page} de {pagination.totalPages}
                                <span className="mx-1">•</span>
                                {pagination.total} diagnóstico{pagination.total !== 1 ? 's' : ''} en total
                            </p>
                        </div>
                    )}
                </>
            )}

            {!isLoading && !isError && !history && currentPatientId && (
                <div className="text-center py-8">
                    <p className="text-sm text-slate-500">
                        No se encontró información de historia clínica para tu perfil.
                    </p>
                </div>
            )}
            {!currentPatientId && !isLoading && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    <p className="font-medium">No se puede acceder a la historia clínica</p>
                    <p className="mt-1">
                        No se pudo obtener tu información de paciente desde la sesión. 
                        Por favor, inicia sesión nuevamente.
                    </p>
                </div>
            )}
            </div>
        </div>
    );
};