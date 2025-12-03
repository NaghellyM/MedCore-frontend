import { useState, useCallback, memo } from 'react';
import { X, Save, Loader2, TestTube, Radio, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useMedicalOrders } from '../../../../core/hooks/medicalOrders';
import { useToast } from '../../../../core/hooks/notifications';
import type { 
    MedicalOrderType, 
    CreateLaboratoryOrderDto, 
    CreateRadiologyOrderDto,
} from '../../../../core/types/medicalOrders';

// Opciones de exámenes de laboratorio (valores EXACTOS que acepta el backend)
const LABORATORY_EXAMS: { value: string; label: string; description: string }[] = [
    { value: 'Hemograma', label: 'Hemograma', description: 'Conteo completo de células sanguíneas' },
    { value: 'Quimica sanguinea', label: 'Química Sanguínea', description: 'Panel metabólico completo' },
    { value: 'Orina', label: 'Examen de Orina', description: 'Urianálisis completo' },
];

// Opciones de exámenes de radiología (valores EXACTOS que acepta el backend)
const RADIOLOGY_EXAMS: { value: string; label: string; description: string }[] = [
    { value: 'Rayos X', label: 'Rayos X', description: 'Radiografía convencional' },
    { value: 'TAC', label: 'TAC', description: 'Tomografía Axial Computarizada' },
    { value: 'Resonancia', label: 'Resonancia Magnética', description: 'IRM de alta resolución' },
    { value: 'Ecografia', label: 'Ecografía', description: 'Ultrasonido diagnóstico' },
];

interface MedicalOrdersFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: string;
    doctorId: string;
    initialOrderType?: MedicalOrderType;
}

/**
 * Formulario modal para crear órdenes médicas (laboratorio y radiología)
 * Actualizado según API del backend
 */
export const MedicalOrdersForm = memo(function MedicalOrdersForm({
    isOpen,
    onClose,
    onSuccess,
    patientId,
    doctorId,
    initialOrderType = 'LABORATORY'
}: MedicalOrdersFormProps) {
    const { success, error: showError } = useToast();
    const { createLaboratoryOrder, createRadiologyOrder, loading } = useMedicalOrders();

    // Estado del formulario
    const [orderType, setOrderType] = useState<MedicalOrderType>(initialOrderType);
    const [examType, setExamType] = useState<string>('');
    const [customExamType, setCustomExamType] = useState<string>('');

    // Errores de validación
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Resetear formulario
    const resetForm = useCallback(() => {
        setOrderType(initialOrderType);
        setExamType('');
        setCustomExamType('');
        setErrors({});
    }, [initialOrderType]);

    // Cambiar tipo de orden
    const handleOrderTypeChange = useCallback((type: MedicalOrderType) => {
        setOrderType(type);
        setExamType('');
        setCustomExamType('');
        setErrors({});
    }, []);

    // Validar formulario
    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        const finalExamType = examType === 'otro' ? customExamType : examType;
        if (!finalExamType.trim()) {
            newErrors.examType = 'Debe seleccionar un tipo de examen';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [examType, customExamType]);

    // Guardar orden (solo envía los 3 campos que acepta el backend)
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const finalExamType = examType === 'otro' ? customExamType : examType;

            if (orderType === 'LABORATORY') {
                const orderData: CreateLaboratoryOrderDto = {
                    patientId,
                    doctorId,
                    examType: finalExamType,
                };
                await createLaboratoryOrder(orderData);
                success('Orden creada', 'La orden de laboratorio se ha creado correctamente');
            } else {
                const orderData: CreateRadiologyOrderDto = {
                    patientId,
                    doctorId,
                    examType: finalExamType,
                };
                await createRadiologyOrder(orderData);
                success('Orden creada', 'La orden de radiología se ha creado correctamente');
            }

            resetForm();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'No se pudo crear la orden';
            showError('Error al crear orden', errorMessage);
        }
    };

    // Cerrar modal
    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    if (!isOpen) return null;

    const currentExams = orderType === 'LABORATORY' ? LABORATORY_EXAMS : RADIOLOGY_EXAMS;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden mx-4 shadow-2xl">
                <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            {orderType === 'LABORATORY' ? (
                                <>
                                    <TestTube className="h-6 w-6 text-cyan-600" />
                                    <span>Nueva Orden de Laboratorio</span>
                                </>
                            ) : (
                                <>
                                    <Radio className="h-6 w-6 text-indigo-600" />
                                    <span>Nueva Orden de Radiología</span>
                                </>
                            )}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Selector de tipo de orden */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            type="button"
                            variant={orderType === 'LABORATORY' ? 'default' : 'outline'}
                            className={orderType === 'LABORATORY' 
                                ? 'bg-cyan-600 hover:bg-cyan-700' 
                                : 'hover:bg-cyan-50'
                            }
                            onClick={() => handleOrderTypeChange('LABORATORY')}
                        >
                            <TestTube className="h-4 w-4 mr-2" />
                            Laboratorio
                        </Button>
                        <Button
                            type="button"
                            variant={orderType === 'RADIOLOGY' ? 'default' : 'outline'}
                            className={orderType === 'RADIOLOGY' 
                                ? 'bg-indigo-600 hover:bg-indigo-700' 
                                : 'hover:bg-indigo-50'
                            }
                            onClick={() => handleOrderTypeChange('RADIOLOGY')}
                        >
                            <Radio className="h-4 w-4 mr-2" />
                            Radiología
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                    <div className="space-y-6">
                        {/* Tipo de examen */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Tipo de Examen <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className={`w-full h-10 px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring ${
                                    errors.examType ? 'border-red-500' : 'border-input'
                                }`}
                            >
                                <option value="">Seleccionar examen...</option>
                                {currentExams.map((exam) => (
                                    <option key={exam.value} value={exam.value}>
                                        {exam.label}
                                    </option>
                                ))}
                                <option value="otro">Otro (especificar)</option>
                            </select>
                            
                            {/* Campo personalizado si selecciona "Otro" */}
                            {examType === 'otro' && (
                                <input
                                    type="text"
                                    value={customExamType}
                                    onChange={(e) => setCustomExamType(e.target.value)}
                                    placeholder="Especificar tipo de examen..."
                                    className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring border-input mt-2"
                                />
                            )}

                            {/* Descripción del examen seleccionado */}
                            {examType && examType !== 'otro' && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {currentExams.find(e => e.value === examType)?.description}
                                </p>
                            )}

                            {errors.examType && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.examType}
                                </p>
                            )}
                        </div>

                        {/* Resumen de la orden */}
                        {examType && examType !== 'otro' && (
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Resumen de la Orden</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={orderType === 'LABORATORY' 
                                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300' 
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                    }>
                                        {orderType === 'LABORATORY' ? 'Laboratorio' : 'Radiología'}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white">
                                        {currentExams.find(e => e.value === examType)?.label || examType}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {examType === 'otro' && customExamType && (
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Resumen de la Orden</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={orderType === 'LABORATORY' 
                                        ? 'bg-cyan-50 text-cyan-700 border-cyan-300' 
                                        : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                    }>
                                        {orderType === 'LABORATORY' ? 'Laboratorio' : 'Radiología'}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white">
                                        {customExamType}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer con botones */}
                <div className="border-t p-4 bg-slate-50 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || !examType}
                        className={orderType === 'LABORATORY' 
                            ? 'bg-cyan-600 hover:bg-cyan-700' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Crear Orden
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
});

export default MedicalOrdersForm;
