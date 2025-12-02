import { memo } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
    FileText, 
    Plus, 
    Calendar,
    User,
    FolderOpen,
    AlertCircle
} from 'lucide-react';
import type { MedicalHistory } from '../../../../core/types/medicalHistory';

interface MedicalHistorySelectorProps {
    patientId: string;
    medicalHistory: MedicalHistory | null;
    loading?: boolean;
    onCreateNew: () => void;
    onViewHistory?: () => void;
    className?: string;
}

/**
 * Componente para seleccionar o crear historia clínica
 */
export const MedicalHistorySelector = memo(function MedicalHistorySelector({
    medicalHistory,
    loading = false,
    onCreateNew,
    onViewHistory,
    className,
}: MedicalHistorySelectorProps) {
    if (loading) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        Historia Clínica
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Si existe historia clínica
    if (medicalHistory) {
        const diagnosticsCount = medicalHistory.diagnostics?.length || 0;

        return (
            <Card className={cn(
                "border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30",
                className
            )}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Historia Clínica
                        </CardTitle>
                        <Badge variant="default" className="bg-green-600">
                            Activa
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Información de la historia */}
                    <div className="p-4 bg-white rounded-lg border border-green-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-slate-700">
                                <FolderOpen className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">
                                    <span className="font-medium">ID:</span>{' '}
                                    {medicalHistory.id.slice(-8)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-700">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">
                                    <span className="font-medium">Creada:</span>{' '}
                                    {new Date(medicalHistory.createdAt).toLocaleDateString('es-ES')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-700">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">
                                    <span className="font-medium">Creador:</span>{' '}
                                    {medicalHistory.doctor?.fullname || 'No disponible'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-700">
                                <FileText className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">
                                    <span className="font-medium">Diagnósticos:</span>{' '}
                                    {diagnosticsCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Botón para ver detalles */}
                    {onViewHistory && (
                        <Button
                            variant="outline"
                            className="w-full border-green-300 text-green-700 hover:bg-green-50"
                            onClick={onViewHistory}
                        >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Ver Historia Clínica Completa
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Si no existe historia clínica
    return (
        <Card className={cn(
            "border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/30",
            className
        )}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    Historia Clínica
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Mensaje informativo */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">
                                No existe historia clínica
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                                Este paciente no tiene una historia clínica registrada. 
                                Puedes crear una nueva para continuar con la consulta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botón para crear */}
                <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={onCreateNew}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Historia Clínica
                </Button>
            </CardContent>
        </Card>
    );
});
