import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../../../../core/hooks/notifications/useToast";
import { PatientSearchSection } from "../components/patientSearchSection";
import { MedicalHistoryForm } from "./medicalHistoryForm";
import type { PatientSearchResult } from "../../../../core/types/patient";
import type { MedicalHistoryFormData } from "../../../../core/types/medicalHistory";

export function MedicalHistoryManagementForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    
    // Estados principales
    const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
    const [currentStep, setCurrentStep] = useState<"search" | "form">("search");
    const [initialData, setInitialData] = useState<Partial<MedicalHistoryFormData> | undefined>();
    const [saveStatus, setSaveStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    // Parámetros de URL para modo edición
    const mode = searchParams.get("mode") as "create" | "edit" || "create";
    const historyId = searchParams.get("historyId") || undefined;
    const patientId = searchParams.get("patientId") || undefined;

    // Función para cargar historia clínica existente
    const loadExistingHistory = useCallback(async (_id: string) => {
        try {
            // const historyData = await medicalHistoryService.getMedicalHistoryById(id);
            // setInitialData(historyData);
            // setSelectedPatient(historyData.patientInfo);
            // setCurrentStep("form");
            // TODO: Implementar carga de historia existente
        } catch (error) {
            setSaveStatus({
                type: "error",
                message: "Error al cargar la historia clínica"
            });
            showError("Error al cargar la historia clínica");
        }
    }, [showError]);

    // Función para cargar datos del paciente
    const loadPatientData = useCallback(async (_id: string) => {
        try {
            // Aquí cargarías los datos del paciente
            // const patientData = await patientService.getPatientById(id);
            // if (patientData) {
            //     setSelectedPatient(patientData);
            //     setCurrentStep("form");
            // }
            // TODO: Implementar carga de datos del paciente
        } catch (error) {
            setSaveStatus({
                type: "error", 
                message: "Error al cargar los datos del paciente"
            });
            showError("Error al cargar los datos del paciente");
        }
    }, [showError]);

    // Efecto para cargar datos iniciales en modo edición
    useEffect(() => {
        if (historyId && mode === "edit") {
            loadExistingHistory(historyId);
        } else if (patientId) {
            loadPatientData(patientId);
        }
    }, [mode, historyId, patientId, loadExistingHistory, loadPatientData]);

    // Manejar selección de paciente
    const handlePatientSelect = (patient: PatientSearchResult) => {
        setSelectedPatient(patient);
        setCurrentStep("form");
        setSaveStatus({ type: null, message: "" });
    };

    // Volver a búsqueda de pacientes
    const handleBackToSearch = () => {
        setCurrentStep("search");
        setSaveStatus({ type: null, message: "" });
    };

    // Manejar guardado exitoso
    const handleSaveSuccess = (savedHistoryId: string) => {
        const successMessage = mode === "create" 
            ? "Historia clínica creada exitosamente" 
            : "Historia clínica actualizada exitosamente";
            
        success(successMessage);
        setSaveStatus({
            type: "success",
            message: successMessage
        });

        // Actualizar datos iniciales si es necesario
        if (mode === "edit") {
            setInitialData(prev => ({ ...prev, historyId: savedHistoryId }));
        }

        // Redirigir después de un breve delay
        setTimeout(() => {
            navigate("/medicalHistory/list");
        }, 2000);
    };

    // Manejar error de guardado
    const handleSaveError = (error: string) => {
        showError("Error al guardar la historia médica", error);
        setSaveStatus({
            type: "error",
            message: error
        });

        // Limpiar mensaje después de 8 segundos para dar más tiempo de lectura
        setTimeout(() => {
            setSaveStatus({ type: null, message: "" });
        }, 8000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver
                        </button>
                        <div className="h-6 border-l border-gray-300" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {mode === "create" ? "Nueva Historia Clínica" : "Editar Historia Clínica"}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {currentStep === "search" 
                                        ? "Seleccione un paciente para comenzar"
                                        : `Historia clínica para ${selectedPatient?.fullname}`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Indicador de progreso */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${
                            currentStep === "search" ? "text-blue-600" : "text-green-600"
                        }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                currentStep === "search" 
                                    ? "bg-blue-100 text-blue-600" 
                                    : "bg-green-100 text-green-600"
                            }`}>
                                {currentStep === "search" ? "1" : "✓"}
                            </div>
                            <span className="text-sm font-medium">Seleccionar Paciente</span>
                        </div>
                        <div className={`h-px flex-1 ${
                            currentStep === "form" ? "bg-green-600" : "bg-gray-300"
                        }`} />
                        <div className={`flex items-center gap-2 ${
                            currentStep === "form" ? "text-blue-600" : "text-gray-400"
                        }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                currentStep === "form" 
                                    ? "bg-blue-100 text-blue-600" 
                                    : "bg-gray-100 text-gray-400"
                            }`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Completar Historia</span>
                        </div>
                    </div>
                </div>

                {/* Notificaciones de estado */}
                {saveStatus.type && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                        saveStatus.type === "success"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {saveStatus.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">{saveStatus.message}</span>
                    </div>
                )}

                {/* Contenido principal */}
                <div className="space-y-6">
                    {currentStep === "search" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Búsqueda de pacientes */}
                            <div className="lg:col-span-2">
                                <PatientSearchSection
                                    onPatientSelect={handlePatientSelect}
                                    selectedPatient={selectedPatient}
                                />
                            </div>

                            {/* Panel de ayuda */}
                            <div className="bg-white rounded-lg border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    ¿Cómo crear una historia clínica?
                                </h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex gap-3">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            1
                                        </span>
                                        <p>Busque y seleccione el paciente usando su nombre, documento o número de historia.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            2
                                        </span>
                                        <p>Complete las secciones del formulario con la información clínica relevante.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                            3
                                        </span>
                                        <p>Guarde la historia clínica para que quede registrada en el sistema.</p>
                                    </div>
                                </div>

                                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-xs text-yellow-800">
                                        <strong>Recordatorio:</strong> Los campos marcados con (*) son obligatorios y deben completarse antes de guardar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Botón para volver a búsqueda */}
                            <div className="mb-4">
                                <button
                                    onClick={handleBackToSearch}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Cambiar paciente
                                </button>
                            </div>

                            {/* Formulario de historia clínica */}
                            <MedicalHistoryForm
                                selectedPatient={selectedPatient}
                                initialData={initialData}
                                mode={mode}
                                historyId={historyId}
                                onSaveSuccess={handleSaveSuccess}
                                onSaveError={handleSaveError}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}