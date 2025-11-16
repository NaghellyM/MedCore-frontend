import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, User, FileText } from "lucide-react";
import { useDiagnosticForm } from "../hooks/useDiagnosticForm";
import type { Diagnostic } from "../../../../core/types/diagnostic";

interface DiagnosticFormProps {
    mode?: "create" | "edit";
    patientId?: string;
    medicalHistoryId?: string;
    diagnosticId?: string;
    initialData?: Diagnostic;
    onSaveSuccess?: (diagnostic: any) => void;
    onCancel?: () => void;
}

export function DiagnosticForm({
    mode = "create",
    patientId,
    medicalHistoryId,
    diagnosticId,
    initialData,
    onSaveSuccess,
    onCancel
}: DiagnosticFormProps) {
    const navigate = useNavigate();
    const params = useParams();
    
    
    const finalPatientId = patientId || params.patientId;
    const finalMedicalHistoryId = medicalHistoryId || params.medicalHisANtoryId;
    const finalDiagnosticId = diagnosticId || params.diagnosticId;

    const {
        formState,
        register,
        handleSubmit,
        formErrors,
        saveDiagnostic,
        isValid
    } = useDiagnosticForm({
        mode,
        patientId: finalPatientId,
        medicalHistoryId: finalMedicalHistoryId,
        diagnosticId: finalDiagnosticId,
        initialData: initialData ? {
            title: initialData.title,
            description: initialData.description || undefined,
            symptoms: initialData.symptoms || undefined,
            diagnosis: initialData.diagnosis || undefined,
            treatment: initialData.treatment || undefined,
            observations: initialData.observations || undefined,
            consultDate: initialData.createdAt || new Date().toISOString(),
            prescriptions: undefined,
            physicalExam: undefined,
            vitalSigns: undefined,
            nextAppointment: undefined
        } : undefined,
        onSaveSuccess: (diagnostic) => {
            onSaveSuccess?.(diagnostic);
            if (!onSaveSuccess) {
                navigate(`/medical-history/${finalMedicalHistoryId}`);
            }
        },
        onSaveError: (error) => {
            console.error('Error saving diagnostic:', error);
        }
    });

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    const onSubmit = async () => {
        await saveDiagnostic();
    };

    if (formState.isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Cargando diagnóstico...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCancel}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {mode === "create" ? "Nuevo Diagnóstico" : "Editar Diagnóstico"}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {mode === "create" 
                                    ? "Complete la información del diagnóstico"
                                    : "Modifique la información del diagnóstico"
                                }
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isValid 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                        }`}>
                            {isValid ? "Válido" : "Revisar campos"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Básica */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Información Básica
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título del Diagnóstico *
                            </label>
                            <input
                                {...register("title")}
                                type="text"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.title ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="Ej: Consulta por dolor abdominal"
                            />
                            {formErrors.title && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Consulta *
                            </label>
                            <input
                                {...register("consultDate")}
                                type="date"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.consultDate ? "border-red-300" : "border-gray-300"
                                }`}
                            />
                            {formErrors.consultDate && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.consultDate.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Próxima Cita
                            </label>
                            <input
                                {...register("nextAppointment")}
                                type="date"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.nextAppointment ? "border-red-300" : "border-gray-300"
                                }`}
                            />
                            {formErrors.nextAppointment && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.nextAppointment.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Información Clínica */}
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Información Clínica
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Síntomas
                            </label>
                            <textarea
                                {...register("symptoms")}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.symptoms ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="Describa los síntomas presentados por el paciente..."
                            />
                            {formErrors.symptoms && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.symptoms.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Examen Físico
                            </label>
                            <textarea
                                {...register("physicalExam")}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.physicalExam ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="Resultados del examen físico..."
                            />
                            {formErrors.physicalExam && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.physicalExam.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Signos Vitales
                            </label>
                            <textarea
                                {...register("vitalSigns")}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.vitalSigns ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="PA: 120/80, FC: 80, FR: 18, T: 36.5°C..."
                            />
                            {formErrors.vitalSigns && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.vitalSigns.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Diagnóstico
                            </label>
                            <textarea
                                {...register("diagnosis")}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    formErrors.diagnosis ? "border-red-300" : "border-gray-300"
                                }`}
                                placeholder="Diagnóstico principal y secundarios..."
                            />
                            {formErrors.diagnosis && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {formErrors.diagnosis.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            * Campos obligatorios
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={formState.isSaving || !isValid}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                                    formState.isSaving || !isValid
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                {formState.isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {mode === "create" ? "Crear Diagnóstico" : "Guardar Cambios"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}