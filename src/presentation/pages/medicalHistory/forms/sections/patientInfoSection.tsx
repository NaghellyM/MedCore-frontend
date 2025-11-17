import { User, Phone, Mail, Hash } from "lucide-react";
import type { SectionProps } from "../../../../../core/types/medicalHistory";

export function PatientInfoSection({ data}: SectionProps) {
    const patientInfo = data.patientInfo;

    if (!patientInfo) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-500 text-center">
                    Seleccione un paciente para continuar
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Paciente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre Completo
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                                {patientInfo.fullname}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Hash className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Documento de Identidad
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                                {patientInfo.identificacion.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {patientInfo.email && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <p className="text-base text-gray-900">
                                    {patientInfo.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {patientInfo.phone && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Phone className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <p className="text-base text-gray-900">
                                    {patientInfo.phone}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Información adicional si está disponible */}
            {(patientInfo.age || patientInfo.gender) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {patientInfo.age && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Edad
                                </label>
                                <p className="text-base text-gray-900">
                                    {patientInfo.age} años
                                </p>
                            </div>
                        )}
                        {patientInfo.gender && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Género
                                </label>
                                <p className="text-base text-gray-900">
                                    {patientInfo.gender}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}