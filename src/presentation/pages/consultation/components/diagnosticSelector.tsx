import { memo, useState, useEffect, useCallback } from 'react';
import { cn } from '../../../../core/utils/cn';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import {
    Search,
    Check,
    AlertCircle,
    X,
    Plus,
    Trash2,
    Calendar,
    Stethoscope
} from 'lucide-react';
import { usePredefinedDiagnostics } from '../../../../core/hooks/diagnostic';
import type { PredefinedDiagnostic, SelectedDiagnostic } from '../../../../core/types/diagnostic';

interface DiagnosticSelectorProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (diagnostics: SelectedDiagnostic[]) => void;
    patientId: string;
    className?: string;
}

/**
 * Modal para seleccionar y configurar diagnósticos predefinidos
 * Permite seleccionar múltiples diagnósticos del catálogo
 */
export const DiagnosticSelector = memo(function DiagnosticSelector({
    open,
    onClose,
    onConfirm,
    patientId: _patientId,
    className,
}: DiagnosticSelectorProps) {
    const {
        predefinedDiagnostics,
        isLoading,
        error,
        fetchPredefinedDiagnostics,
    } = usePredefinedDiagnostics();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDiagnostics, setSelectedDiagnostics] = useState<SelectedDiagnostic[]>([]);
    const [consultDate, setConsultDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    // Cargar diagnósticos predefinidos al abrir el modal
    useEffect(() => {
        if (open) {
            fetchPredefinedDiagnostics();
        }
    }, [open, fetchPredefinedDiagnostics]);

    // Filtrar diagnósticos por término de búsqueda
    const filteredDiagnostics = predefinedDiagnostics.filter((diag) =>
        diag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diag.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diag.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Verificar si un diagnóstico está seleccionado
    const isSelected = useCallback((diagnosticId: string) => {
        return selectedDiagnostics.some(d => d.predefinedId === diagnosticId);
    }, [selectedDiagnostics]);

    // Agregar diagnóstico a la selección
    const handleAddDiagnostic = (diagnostic: PredefinedDiagnostic) => {
        if (!isSelected(diagnostic.id)) {
            const selected: SelectedDiagnostic = {
                predefinedId: diagnostic.id,
                code: diagnostic.code,
                name: diagnostic.name,
                description: diagnostic.description,
                commonSymptoms: diagnostic.commonSymptoms,
                recommendedTreatment: diagnostic.recommendedTreatment,
                category: diagnostic.category,
                severity: diagnostic.severity,
                consultDate: consultDate,
                observations: '',
            };
            setSelectedDiagnostics([...selectedDiagnostics, selected]);
        }
    };

    // Remover diagnóstico de la selección
    const handleRemoveDiagnostic = (diagnosticId: string) => {
        setSelectedDiagnostics(
            selectedDiagnostics.filter(d => d.predefinedId !== diagnosticId)
        );
    };

    // Actualizar observaciones de un diagnóstico seleccionado
    const handleUpdateObservations = (diagnosticId: string, observations: string) => {
        setSelectedDiagnostics(
            selectedDiagnostics.map(d =>
                d.predefinedId === diagnosticId ? { ...d, observations } : d
            )
        );
    };

    // Confirmar selección
    const handleConfirm = () => {
        if (selectedDiagnostics.length > 0) {
            onConfirm(selectedDiagnostics);
            handleClose();
        }
    };

    // Cerrar y limpiar
    const handleClose = () => {
        setSelectedDiagnostics([]);
        setSearchTerm('');
        setConsultDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    // Obtener color de severidad
    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'GRAVE':
            case 'ALTA':
            case 'CRÍTICA':
                return 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
            case 'MODERADA':
            case 'MODERADO':
                return 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
            default:
                return 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className={cn("max-w-5xl max-h-[90vh] flex flex-col", className)}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Seleccionar Diagnósticos
                    </DialogTitle>
                    <DialogDescription>
                        Seleccione uno o más diagnósticos del catálogo para asignar al paciente
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    {/* Fecha de consulta */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <Label htmlFor="consultDate" className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de Consulta
                        </Label>
                        <Input
                            id="consultDate"
                            type="date"
                            value={consultDate}
                            onChange={(e) => setConsultDate(e.target.value)}
                            className="max-w-xs bg-white dark:bg-gray-800"
                        />
                    </div>

                    {/* Diagnósticos seleccionados */}
                    {selectedDiagnostics.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                Diagnósticos Seleccionados ({selectedDiagnostics.length})
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {selectedDiagnostics.map((diag) => (
                                    <div
                                        key={diag.predefinedId}
                                        className="flex items-start gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-700"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm text-gray-900 dark:text-white">
                                                    {diag.code}
                                                </span>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    {diag.name}
                                                </span>
                                                <Badge variant="outline" className={cn("text-xs", getSeverityColor(diag.severity))}>
                                                    {diag.severity}
                                                </Badge>
                                            </div>
                                            <Input
                                                placeholder="Observaciones adicionales (opcional)"
                                                value={diag.observations || ''}
                                                onChange={(e) => handleUpdateObservations(diag.predefinedId, e.target.value)}
                                                className="mt-2 text-sm"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveDiagnostic(diag.predefinedId)}
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buscador */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por código, nombre o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Lista de diagnósticos disponibles */}
                    <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                        {isLoading ? (
                            <div className="p-4 space-y-3">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : error ? (
                            <div className="p-6 text-center">
                                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        ) : filteredDiagnostics.length === 0 ? (
                            <div className="p-6 text-center">
                                <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No se encontraron diagnósticos
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredDiagnostics.map((diagnostic) => {
                                    const selected = isSelected(diagnostic.id);
                                    return (
                                        <div
                                            key={diagnostic.id}
                                            className={cn(
                                                "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                                                selected && "bg-blue-50 dark:bg-blue-900/20"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {diagnostic.code}
                                                        </Badge>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                                            {diagnostic.name}
                                                        </h4>
                                                        <Badge variant="outline" className={cn("text-xs", getSeverityColor(diagnostic.severity))}>
                                                            {diagnostic.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                        {diagnostic.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {diagnostic.category}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant={selected ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => selected ? handleRemoveDiagnostic(diagnostic.id) : handleAddDiagnostic(diagnostic)}
                                                    className={cn(
                                                        "min-w-[100px]",
                                                        selected && "bg-green-600 hover:bg-green-700"
                                                    )}
                                                >
                                                    {selected ? (
                                                        <>
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Seleccionado
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Seleccionar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={selectedDiagnostics.length === 0}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Asignar {selectedDiagnostics.length > 0 && `(${selectedDiagnostics.length})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});
