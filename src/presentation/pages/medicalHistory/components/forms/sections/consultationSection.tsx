import { Calendar, FileText, Clock } from "lucide-react";
import type { SectionProps } from "../../../../../../core/types/medicalHistory";

export function ConsultationSection({ data, onUpdate, isReadOnly = false, errors }: SectionProps) {
    const consultation = data.consultation || {
        chiefComplaint: "",
        currentIllnessHistory: "",
        consultDate: new Date().toISOString().split('T')[0]
    };

    const handleInputChange = (field: keyof typeof consultation, value: string) => {
        if (isReadOnly) return;
        
        onUpdate({
            ...data,
            consultation: {
                ...consultation,
                [field]: value
            }
        });
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Motivo de Consulta
                </h3>
            </div>

            <div className="space-y-6">
                {/* Fecha de consulta */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        Fecha de Consulta *
                    </label>
                    <input
                        type="date"
                        value={consultation.consultDate}
                        onChange={(e) => handleInputChange("consultDate", e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  ${errors?.["consultation.consultDate"] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.["consultation.consultDate"] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors["consultation.consultDate"]}
                        </p>
                    )}
                </div>

                {/* Motivo principal de consulta */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        Motivo Principal de Consulta *
                    </label>
                    <textarea
                        value={consultation.chiefComplaint}
                        onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Describa brevemente el motivo principal por el cual el paciente solicita la consulta..."
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  ${errors?.["consultation.chiefComplaint"] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.["consultation.chiefComplaint"] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors["consultation.chiefComplaint"]}
                        </p>
                    )}
                </div>

                {/* Historia de la enfermedad actual */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Historia de la Enfermedad Actual
                    </label>
                    <textarea
                        value={consultation.currentIllnessHistory}
                        onChange={(e) => handleInputChange("currentIllnessHistory", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Describa detalladamente la evolución de los síntomas, tiempo de inicio, características, factores que lo mejoran o empeoran..."
                        rows={6}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                  ${errors?.["consultation.currentIllnessHistory"] ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors?.["consultation.currentIllnessHistory"] && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors["consultation.currentIllnessHistory"]}
                        </p>
                    )}
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