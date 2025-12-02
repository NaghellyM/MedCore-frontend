import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {ArrowLeft, CheckCircle, AlertCircle, ClipboardPlus, UserPlus } from "lucide-react";
import { useToast } from "../../../../core/hooks/notifications/useToast";
import { PatientSearchSection } from "../components/patientSearchSection";
import { MedicalHistoryForm } from "./medicalHistoryForm";
import type { PatientSearchResult } from "../../../../core/types/patient";
import type { MedicalHistoryFormData } from "../../../../core/types/medicalHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

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

        if (mode === "edit") {
            setInitialData(prev => ({ ...prev, historyId: savedHistoryId }));
        }

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

        setTimeout(() => {
            setSaveStatus({ type: null, message: "" });
        }, 8000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">                 
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ClipboardPlus className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {mode === "create" ? "Nueva Historia Clínica" : "Editar Historia Clínica"}
                                </h1>
                                <Badge variant={mode === "create" ? "default" : "secondary"}>
                                    {mode === "create" ? "Nuevo" : "Edición"}
                                </Badge>
                            </div>
                            <p className="text-slate-500">
                                {currentStep === "search" 
                                    ? "Seleccione un paciente para comenzar el registro"
                                    : `Completando historia clínica para ${selectedPatient?.fullname}`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="mt-8 flex items-center gap-4">
                        <StepIndicator 
                            step={1} 
                            title="Paciente" 
                            isActive={currentStep === "search"} 
                            isCompleted={currentStep === "form"} 
                        />
                        <div className={`h-0.5 flex-1 rounded-full transition-colors ${
                            currentStep === "form" ? "bg-blue-500" : "bg-slate-200"
                        }`} />
                        <StepIndicator 
                            step={2} 
                            title="Historia Clínica" 
                            isActive={currentStep === "form"} 
                            isCompleted={false} 
                        />
                    </div>
                </div>

                {/* Notificaciones de estado */}
                {saveStatus.type && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
                        saveStatus.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {saveStatus.type === "success" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">{saveStatus.message}</span>
                    </div>
                )}

                {/* Contenido principal */}
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
                        <div className="lg:col-span-1">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader className="pb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                                        <UserPlus className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">¿Cómo crear una historia?</CardTitle>
                                    <CardDescription>
                                        Siga estos pasos para registrar una nueva historia clínica
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <HelpStep 
                                        number={1} 
                                        title="Buscar paciente"
                                        description="Use el buscador para encontrar al paciente por nombre, documento o historia."
                                    />
                                    <HelpStep 
                                        number={2} 
                                        title="Completar información"
                                        description="Llene las secciones del formulario con los datos clínicos relevantes."
                                    />
                                    <HelpStep 
                                        number={3} 
                                        title="Guardar registro"
                                        description="Revise la información y guarde la historia clínica en el sistema."
                                    />

                                    <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-xs text-amber-800">
                                            <strong>Nota:</strong> Los campos marcados con (*) son obligatorios.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Botón para volver a búsqueda */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBackToSearch}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Cambiar paciente
                        </Button>

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
    );
}

// Componente de indicador de paso
function StepIndicator({ 
    step, 
    title, 
    isActive, 
    isCompleted 
}: { 
    step: number; 
    title: string; 
    isActive: boolean; 
    isCompleted: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${isCompleted 
                    ? "bg-blue-500 text-white" 
                    : isActive 
                        ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-2" 
                        : "bg-slate-100 text-slate-400"
                }
            `}>
                {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                ) : (
                    step
                )}
            </div>
            <span className={`text-sm font-medium transition-colors ${
                isActive || isCompleted ? "text-slate-900" : "text-slate-400"
            }`}>
                {title}
            </span>
        </div>
    );
}

// Componente de paso de ayuda
function HelpStep({ 
    number, 
    title, 
    description 
}: { 
    number: number; 
    title: string; 
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                {number}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
        </div>
    );
}