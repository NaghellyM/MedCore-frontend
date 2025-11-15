import { Stethoscope, Search, FileText, CheckCircle } from "lucide-react";
import type { SectionProps } from "../../../../../../core/types/medicalHistory";

export function DiagnosticsSection({ data, onUpdate, isReadOnly = false, errors }: SectionProps) {
    const diagnostics = data.diagnostics || {
        symptoms: "",
        clinicalFindings: "",
        primaryDiagnosis: "",
        secondaryDiagnosis: "",
        diagnosticImpression: ""
    };

    const handleInputChange = (field: keyof typeof diagnostics, value: string) => {
        if (isReadOnly) return;
        
        onUpdate({
            ...data,
            diagnostics: {
                ...diagnostics,
                [field]: value
            }
        });
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Diagnósticos y Hallazgos Clínicos
                </h3>
            </div>

            <div className="space-y-6">
                {/* Síntomas */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Search className="w-4 h-4" />
                        Síntomas Reportados
                    </label>
                    <textarea
                        value={diagnostics.symptoms}
                        onChange={(e) => handleInputChange("symptoms", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Liste los síntomas reportados por el paciente..."
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  border-gray-300`}
                    />
                </div>

                {/* Hallazgos Clínicos */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Hallazgos Clínicos
                    </label>
                    <textarea
                        value={diagnostics.clinicalFindings}
                        onChange={(e) => handleInputChange("clinicalFindings", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Describa los hallazgos encontrados durante el examen físico y evaluación clínica..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  border-gray-300`}
                    />
                </div>

                {/* Diagnóstico Principal */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Diagnóstico Principal *
                    </label>
                    <input
                        type="text"
                        value={diagnostics.primaryDiagnosis}
                        onChange={(e) => handleInputChange("primaryDiagnosis", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Ej: Hipertensión arterial esencial (I10)"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  ${errors?.["diagnostics.primaryDiagnosis"] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.["diagnostics.primaryDiagnosis"] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors["diagnostics.primaryDiagnosis"]}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Incluya el código CIE-10 si está disponible
                    </p>
                </div>

                {/* Diagnóstico Secundario */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Diagnóstico Secundario
                    </label>
                    <input
                        type="text"
                        value={diagnostics.secondaryDiagnosis || ""}
                        onChange={(e) => handleInputChange("secondaryDiagnosis", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Diagnóstico secundario o comorbilidades (opcional)"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  border-gray-300`}
                    />
                </div>

                {/* Impresión Diagnóstica */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Stethoscope className="w-4 h-4" />
                        Impresión Diagnóstica y Razonamiento Clínico
                    </label>
                    <textarea
                        value={diagnostics.diagnosticImpression}
                        onChange={(e) => handleInputChange("diagnosticImpression", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Explique el razonamiento clínico que llevó al diagnóstico, diagnósticos diferenciales considerados, etc..."
                        rows={5}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  border-gray-300`}
                    />
                </div>
            </div>

            {/* Indicador de campos obligatorios */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    * Campos obligatorios
                </p>
            </div>
        </div>
    );
}