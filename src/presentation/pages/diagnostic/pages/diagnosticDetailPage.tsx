import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { diagnosticService } from "../../../../core/services/diagnosticService";
import type { PredefinedDiagnostic } from "../../../../core/types/diagnostic";
import { FileText, Loader } from "lucide-react";

export const DiagnosticDetailPage: React.FC = () => {
    const { diagnosticId } = useParams<{ diagnosticId: string }>();
    const [diagnostic, setDiagnostic] = useState<PredefinedDiagnostic | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDiagnostic() {
            setLoading(true);
            setError(null);
            try {
                if (diagnosticId) {
                    const response = await diagnosticService.getDiagnosticById(diagnosticId);
                    setDiagnostic(response.data);
                } else {
                    setError("ID de diagnóstico no proporcionado");
                }
            } catch (err: any) {
                setError(err.message || "Error al obtener el diagnóstico");
            } finally {
                setLoading(false);
            }
        }
        fetchDiagnostic();
    }, [diagnosticId]);

    return (
        <DashboardLayout sidebar={<DoctorSidebar />}>
            <div className="p-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                    <FileText className="w-6 h-6" />
                    Detalle del Diagnóstico
                </h1>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div className="text-red-600 dark:text-red-400">{error}</div>
                ) : diagnostic ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/50 p-6">
                        <div className="mb-6">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{diagnostic.name}</h2>
                                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                    Código: {diagnostic.code}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{diagnostic.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Síntomas Comunes</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{diagnostic.commonSymptoms}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Tratamiento Recomendado</h3>
                                    <p className="text-gray-700 dark:text-gray-300">{diagnostic.recommendedTreatment}</p>
                                </div>
                                {diagnostic.observations && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Observaciones</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{diagnostic.observations}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Categoría</h3>
                                    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                                        {diagnostic.category}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Severidad</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full ${
                                        diagnostic.severity === 'Grave' 
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                                            : diagnostic.severity === 'Moderado' 
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' 
                                            : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    }`}>
                                        {diagnostic.severity}
                                    </span>
                                </div>
                                {(diagnostic.createdAt || diagnostic.updatedAt) && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        {diagnostic.createdAt && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <strong>Creado:</strong> {new Date(diagnostic.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                        {diagnostic.updatedAt && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <strong>Actualizado:</strong> {new Date(diagnostic.updatedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
};
