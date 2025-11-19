/**
 * FORMULARIO DE EDICIÓN DE HISTORIA CLÍNICA - VERSIÓN SIMPLIFICADA
 * ================================================================
 * Versión simplificada para evitar bucles de estado
 */

import { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

// Hooks especializados
import { medicalHistoryService } from "../../../../core/services/medicalHistoryService";
import { useToast } from "../../../../core/hooks/notifications/useToast";

// Componente base del formulario
import { MedicalHistoryForm } from "./medicalHistoryForm";

// Tipos
import type {
    MedicalHistoryFormData,
    MedicalHistory,
    Diagnostic
} from "../../../../core/types/medicalHistory";
import type { PatientSearchResult } from "../../../../core/types/patient";

interface EditMedicalHistoryFormProps {
    historyId: string;
    onSaveSuccess?: (historyId: string) => void;
    onSaveError?: (error: string) => void;
    onLoadError?: (error: string) => void;
}

interface LoadedData {
    medicalHistory: MedicalHistory;
    patientInfo: PatientSearchResult;
    formData: Partial<MedicalHistoryFormData>;
    diagnostics: Diagnostic[];
}

export function EditMedicalHistoryForm({
    historyId,
    onSaveSuccess,
    onSaveError,
    onLoadError
}: EditMedicalHistoryFormProps) {
    // Estados locales simplificados
    const [isLoading, setIsLoading] = useState(true);
    const [loadedData, setLoadedData] = useState<LoadedData | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Hooks
    const { error: showError } = useToast();

    // Cargar datos una sola vez al montar
    useEffect(() => {
        let isCancelled = false;

        const loadData = async () => {
            try {
                setIsLoading(true);
                setLoadError(null);

                const historyResponse = await medicalHistoryService.getMedicalHistoryById(historyId);
                
                if (isCancelled) return;

                const medicalHistory = historyResponse.data;
                const diagnostics = medicalHistory.diagnostics || [];

                const patientInfo: PatientSearchResult = {
                    id: medicalHistory.patientId,
                    fullname: "Paciente",
                    identificacion: "...",
                    email: ""
                };

                const formData: Partial<MedicalHistoryFormData> = {
                    patientInfo: patientInfo,
                    
                    ...(diagnostics.length > 0 && {
                        consultation: {
                            chiefComplaint: diagnostics[0].title || "",
                            currentIllnessHistory: diagnostics[0].description || "",
                            consultDate: diagnostics[0].consultDate?.split('T')[0] || new Date().toISOString().split('T')[0]
                        },
                        
                        physicalExam: {
                            vitalSigns: diagnostics[0].vitalSigns ? 
                                JSON.parse(diagnostics[0].vitalSigns) : {},
                            generalAppearance: diagnostics[0].physicalExam || "",
                            systemicExam: ""
                        },
                        
                        diagnostics: {
                            symptoms: diagnostics[0].symptoms || "",
                            clinicalFindings: diagnostics[0].observations || "",
                            primaryDiagnosis: diagnostics[0].diagnosis || "",
                            secondaryDiagnosis: "",
                            diagnosticImpression: diagnostics[0].treatment || ""
                        }
                    })
                };

                if (!isCancelled) {
                    setLoadedData({
                        medicalHistory,
                        patientInfo,
                        formData,
                        diagnostics
                    });
                }

            } catch (error) {
                if (!isCancelled) {
                    const errorMessage = error instanceof Error ? 
                        error.message : "Error al cargar la historia clínica";
                    
                    setLoadError(errorMessage);
                    onLoadError?.(errorMessage);
                    showError(errorMessage);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isCancelled = true;
        };
    }, [historyId]); // Solo depende de historyId


    // Renderizado condicional según el estado de carga
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-gray-600">Cargando historia clínica...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center space-x-3 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        <div>
                            <h3 className="font-semibold">Error al cargar la historia clínica</h3>
                            <p className="text-sm text-red-500 mt-1">{loadError}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!loadedData) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="text-center text-gray-500">
                        No se pudieron cargar los datos de la historia clínica
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar el formulario con los datos cargados
    return (
        <div className="space-y-4">
            {/* Indicador de modo edición */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                        Editando Historia Clínica - ID: {historyId}
                    </span>
                </div>
                {loadedData.diagnostics.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                        {loadedData.diagnostics.length} diagnóstico(s) asociado(s)
                    </p>
                )}
            </div>

            {/* Formulario base en modo edición */}
            <MedicalHistoryForm
                selectedPatient={loadedData.patientInfo}
                initialData={loadedData.formData}
                mode="edit"
                historyId={historyId}
                onSaveSuccess={(updatedHistoryId) => {
                    onSaveSuccess?.(updatedHistoryId);
                }}
                onSaveError={onSaveError}
            />


        </div>
    );
}