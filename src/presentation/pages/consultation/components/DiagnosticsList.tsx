import { memo, useState } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
    Stethoscope, 
    Plus, 
    Eye, 
    Edit2,
    Calendar,
    FileText,
    AlertCircle
} from 'lucide-react';
import { AddDiagnosticModal } from './AddDiagnosticModal';
import type { Diagnostic } from '../../../../core/types/medicalHistory';

interface DiagnosticsListProps {
    diagnostics: Diagnostic[];
    medicalHistoryId: string | null;
    patientId: string | null;
    loading?: boolean;
    onAdd: () => void;
    onView: (diagnosticId: string) => void;
    onEdit: (diagnosticId: string) => void;
    onRefresh?: () => void;
    className?: string;
}

/**
 * Componente que muestra la lista de diagnósticos en la consulta
 */
export const DiagnosticsList = memo(function DiagnosticsList({
    diagnostics,
    medicalHistoryId,
    patientId,
    loading = false,
    onAdd: _onAdd, // Mantenido para compatibilidad, pero ahora usamos modal interno
    onView,
    onEdit,
    onRefresh,
    className,
}: DiagnosticsListProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStateColor = (state: string) => {
        switch (state) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStateLabel = (state: string) => {
        switch (state) {
            case 'ACTIVE':
                return 'Activo';
            case 'COMPLETED':
                return 'Completado';
            case 'CANCELLED':
                return 'Cancelado';
            default:
                return state;
        }
    };

    if (loading) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                        Diagnósticos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </CardContent>
            </Card>
        );
    }

    // Si no hay historia clínica
    if (!medicalHistoryId) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                        Diagnósticos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                        <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                            Primero debes seleccionar o crear una historia clínica
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn(
            "border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-purple-600" />
                        Diagnósticos
                    </CardTitle>
                    <Badge variant="secondary">
                        {diagnostics.length} registro{diagnostics.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Botón para agregar */}
                <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Diagnóstico
                </Button>

                {/* Lista de diagnósticos */}
                {diagnostics.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                        <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                            No hay diagnósticos registrados
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Agrega un nuevo diagnóstico para esta consulta
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {diagnostics.map((diagnostic) => (
                            <div
                                key={diagnostic.id}
                                className="p-4 bg-white rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-slate-900 truncate">
                                                {diagnostic.title}
                                            </h4>
                                            <Badge 
                                                variant="outline" 
                                                className={cn("text-xs", getStateColor(diagnostic.state))}
                                            >
                                                {getStateLabel(diagnostic.state)}
                                            </Badge>
                                        </div>
                                        
                                        {diagnostic.diagnosis && (
                                            <p className="text-sm text-slate-600 line-clamp-2">
                                                {diagnostic.diagnosis}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(diagnostic.consultDate).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-purple-600"
                                            onClick={() => onView(diagnostic.id)}
                                            title="Ver detalles"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-purple-600"
                                            onClick={() => onEdit(diagnostic.id)}
                                            title="Editar"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Modal para agregar diagnósticos */}
            {patientId && (
                <AddDiagnosticModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        onRefresh?.();
                    }}
                    patientId={patientId}
                />
            )}
        </Card>
    );
});
