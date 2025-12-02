import { memo } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
    User, 
    Calendar, 
    Phone, 
    Mail, 
    AlertTriangle,
    Heart
} from 'lucide-react';
import type { ConsultationPatientInfo } from '../../../../core/types/consultation';

interface PatientInfoCardProps {
    patient: ConsultationPatientInfo | null;
    loading?: boolean;
    className?: string;
}

/**
 * Componente que muestra la información del paciente en la consulta
 */
export const PatientInfoCard = memo(function PatientInfoCard({
    patient,
    loading = false,
    className,
}: PatientInfoCardProps) {
    if (loading) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Información del Paciente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                </CardContent>
            </Card>
        );
    }

    if (!patient) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-sm text-slate-600">
                        No se ha cargado la información del paciente
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn(
            "border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Información del Paciente
                    </CardTitle>
                    {patient.allergies && patient.allergies.length > 0 && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Alergias
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Nombre y edad */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {patient.fullName}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {patient.documentType}: {patient.documentNumber}
                        </p>
                    </div>
                    {patient.age !== undefined && (
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {patient.age} años
                        </Badge>
                    )}
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {patient.birthDate && (
                        <div className="flex items-center gap-2 text-slate-700">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                                <span className="font-medium">Nacimiento:</span>{' '}
                                {new Date(patient.birthDate).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    )}

                    {patient.gender && (
                        <div className="flex items-center gap-2 text-slate-700">
                            <Heart className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                                <span className="font-medium">Sexo:</span>{' '}
                                {patient.gender === 'M' ? 'Masculino' : 
                                 patient.gender === 'F' ? 'Femenino' : patient.gender}
                            </span>
                        </div>
                    )}

                    {patient.phone && (
                        <div className="flex items-center gap-2 text-slate-700">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                                <span className="font-medium">Teléfono:</span>{' '}
                                {patient.phone}
                            </span>
                        </div>
                    )}

                    {patient.email && (
                        <div className="flex items-center gap-2 text-slate-700">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                                <span className="font-medium">Email:</span>{' '}
                                {patient.email}
                            </span>
                        </div>
                    )}
                </div>

                {/* Alergias */}
                {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-semibold text-red-800">
                                Alergias conocidas:
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {patient.allergies.map((allergy, index) => (
                                <Badge 
                                    key={index} 
                                    variant="outline"
                                    className="border-red-300 text-red-700 bg-white"
                                >
                                    {allergy}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});
