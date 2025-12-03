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
            <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
                <h1 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Detalle del Diagnóstico
                </h1>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                ) : diagnostic ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{diagnostic.name}</h2>
                                <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                    Código: {diagnostic.code}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{diagnostic.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-5">
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2 tracking-wide">Síntomas Comunes</h3>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{diagnostic.commonSymptoms}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2 tracking-wide">Tratamiento Recomendado</h3>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{diagnostic.recommendedTreatment}</p>
                                </div>
                                {diagnostic.observations && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2 tracking-wide">Observaciones</h3>
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{diagnostic.observations}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-5">
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2 tracking-wide">Categoría</h3>
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 font-medium border border-purple-200 dark:border-purple-700">
                                        {diagnostic.category}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2 tracking-wide">Severidad</h3>
                                    <span className={`inline-block px-4 py-1.5 rounded-full font-medium ${
                                        diagnostic.severity === 'Grave' 
                                            ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700' 
                                            : diagnostic.severity === 'Moderado' 
                                            ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700' 
                                            : 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
                                    }`}>
                                        {diagnostic.severity}
                                    </span>
                                </div>
                                {(diagnostic.createdAt || diagnostic.updatedAt) && (
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2">
                                        {diagnostic.createdAt && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong className="text-gray-900 dark:text-white">Creado:</strong> {new Date(diagnostic.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                        {diagnostic.updatedAt && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <strong className="text-gray-900 dark:text-white">Actualizado:</strong> {new Date(diagnostic.updatedAt).toLocaleDateString()}
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
