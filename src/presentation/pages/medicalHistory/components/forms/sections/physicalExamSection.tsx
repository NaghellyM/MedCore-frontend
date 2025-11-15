import { Activity, Heart } from "lucide-react";
import type { SectionProps } from "../../../../../../core/types/medicalHistory";

export function PhysicalExamSection({ data, onUpdate, isReadOnly = false }: SectionProps) {
    const physicalExam = data.physicalExam || {
        vitalSigns: {
            bloodPressure: "",
            heartRate: undefined,
            temperature: undefined,
            respiratoryRate: undefined,
            oxygenSaturation: undefined,
            weight: undefined,
            height: undefined
        },
        generalAppearance: "",
        systemicExam: ""
    };

    const handleVitalSignChange = (field: string, value: string | number) => {
        if (isReadOnly) return;

        onUpdate({
            ...data,
            physicalExam: {
                ...physicalExam,
                vitalSigns: {
                    ...physicalExam.vitalSigns,
                    [field]: value === "" ? undefined : value
                }
            }
        });
    };

    const handleInputChange = (field: keyof typeof physicalExam, value: string) => {
        if (isReadOnly || field === "vitalSigns") return;
        
        onUpdate({
            ...data,
            physicalExam: {
                ...physicalExam,
                [field]: value
            }
        });
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                    Examen Físico y Signos Vitales
                </h3>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">
                        Signos Vitales
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Heart className="w-4 h-4 text-red-500" />
                                Presión Arterial
                            </label>
                            <input
                                type="text"
                                value={physicalExam.vitalSigns.bloodPressure || ""}
                                onChange={(e) => handleVitalSignChange("bloodPressure", e.target.value)}
                                disabled={isReadOnly}
                                placeholder="120/80 mmHg"
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""} border-gray-300`}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Apariencia General
                    </label>
                    <textarea
                        value={physicalExam.generalAppearance}
                        onChange={(e) => handleInputChange("generalAppearance", e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Describa el estado general del paciente..."
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""} border-gray-300`}
                    />
                </div>
            </div>
        </div>
    );
}
