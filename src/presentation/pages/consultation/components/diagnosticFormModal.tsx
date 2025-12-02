import { useState, useEffect, useCallback } from 'react';
import { X, Save, Loader2, Sparkles, FileText, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { usePredefinedDiagnostics } from '../../../../core/hooks/diagnostic';
import { diagnosticService } from '../../../../core/services/diagnosticService';
import { useToast } from '../../../../core/hooks/notifications';
import type { PredefinedDiagnostic } from '../../../../core/types/diagnostic';
import type { CreateDiagnosticDto } from '../../../../core/types/medicalHistory';

interface DiagnosticFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: string;
    medicalHistoryId: string;
}

/**
 * Modal de formulario para crear diagnóstico con selector de predefinidos
 */
export function DiagnosticFormModal({
    isOpen,
    onClose,
    onSuccess,
    patientId: _patientId, // Mantenido para compatibilidad pero se usa medicalHistoryId
    medicalHistoryId
}: DiagnosticFormModalProps) {
    const { success, error: showError } = useToast();
    const {
        predefinedDiagnostics,
        isLoading: loadingPredefined,
        fetchPredefinedDiagnostics,
        getCategories,
        getSeverities
    } = usePredefinedDiagnostics();

    // Estado del formulario
    const [formData, setFormData] = useState<CreateDiagnosticDto>({
        title: '',
        description: '',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        observations: '',
        prescriptions: '',
        physicalExam: '',
        vitalSigns: '',
        consultDate: new Date().toISOString().split('T')[0],
        nextAppointment: ''
    });

    const [selectedPredefinedId, setSelectedPredefinedId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPredefinedList, setShowPredefinedList] = useState(false);

    // Cargar diagnósticos predefinidos al abrir
    useEffect(() => {
        if (isOpen) {
            fetchPredefinedDiagnostics();
        }
    }, [isOpen, fetchPredefinedDiagnostics]);

    // Filtrar diagnósticos predefinidos
    const filteredPredefined = predefinedDiagnostics.filter(d => {
        const matchSearch = searchTerm === '' ||
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === '' || d.category === selectedCategory;
        const matchSeverity = selectedSeverity === '' || d.severity === selectedSeverity;
        return matchSearch && matchCategory && matchSeverity;
    });

    // Seleccionar un diagnóstico predefinido
    const handleSelectPredefined = useCallback((predefined: PredefinedDiagnostic) => {
        setSelectedPredefinedId(predefined.id);
        setFormData(prev => ({
            ...prev,
            title: predefined.name,
            description: predefined.description,
            symptoms: predefined.commonSymptoms,
            diagnosis: `${predefined.code} - ${predefined.name}`,
            treatment: predefined.recommendedTreatment,
            observations: predefined.observations || ''
        }));
        setShowPredefinedList(false);
        success('Diagnóstico predefinido cargado');
    }, [success]);

    // Actualizar campo del formulario
    const updateField = (field: keyof CreateDiagnosticDto, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Guardar diagnóstico
    const handleSave = async () => {
        if (!formData.title.trim()) {
            showError('Error', 'El título es requerido');
            return;
        }

        setIsSaving(true);
        try {
            // Crear diagnóstico con los campos requeridos
            const diagnosticData: CreateDiagnosticDto = {
                title: formData.title,
                description: formData.description || '',
                symptoms: formData.symptoms || '',
                diagnosis: formData.diagnosis || '',
                treatment: formData.treatment || '',
                observations: formData.observations,
                prescriptions: formData.prescriptions,
                physicalExam: formData.physicalExam,
                vitalSigns: formData.vitalSigns,
                consultDate: formData.consultDate,
                nextAppointment: formData.nextAppointment || undefined
            };
            
            // Usar medicalHistoryId en lugar de patientId
            await diagnosticService.createDiagnostic(medicalHistoryId, diagnosticData);
            success('Diagnóstico creado', 'El diagnóstico se ha guardado correctamente');
            onSuccess();
            onClose();
            // Limpiar formulario
            setFormData({
                title: '',
                description: '',
                symptoms: '',
                diagnosis: '',
                treatment: '',
                observations: '',
                prescriptions: '',
                physicalExam: '',
                vitalSigns: '',
                consultDate: new Date().toISOString().split('T')[0],
                nextAppointment: ''
            });
            setSelectedPredefinedId('');
        } catch (err: any) {
            showError('Error al guardar', err?.message || 'No se pudo crear el diagnóstico');
        } finally {
            setIsSaving(false);
        }
    };

    // Obtener color de severidad
    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'BAJA': case 'LOW': return 'bg-green-100 text-green-800';
            case 'MODERADA': case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
            case 'ALTA': case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'CRITICA': case 'CRITICAL': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] mx-4 overflow-hidden bg-white rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Nuevo Diagnóstico
                            </h2>
                            <p className="text-sm text-gray-500">
                                Complete la información del diagnóstico
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
                    {/* Selector de Diagnóstico Predefinido */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                Diagnóstico Predefinido
                                <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    Opcional
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-3">
                                Seleccione un diagnóstico de la lista para auto-completar el formulario.
                            </p>
                            
                            {/* Botón para mostrar lista */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-between border-2"
                                onClick={() => setShowPredefinedList(!showPredefinedList)}
                            >
                                <span className="text-left truncate">
                                    {selectedPredefinedId 
                                        ? predefinedDiagnostics.find(d => d.id === selectedPredefinedId)?.name 
                                        : 'Seleccionar diagnóstico predefinido...'}
                                </span>
                                <span className="text-gray-400">▼</span>
                            </Button>

                            {/* Lista desplegable de predefinidos */}
                            {showPredefinedList && (
                                <div className="mt-3 border rounded-lg bg-white shadow-lg">
                                    {/* Búsqueda y filtros */}
                                    <div className="p-3 border-b space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o código..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border rounded-lg"
                                            >
                                                <option value="">Todas las categorías</option>
                                                {getCategories().map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={selectedSeverity}
                                                onChange={(e) => setSelectedSeverity(e.target.value)}
                                                className="flex-1 px-2 py-1.5 text-sm border rounded-lg"
                                            >
                                                <option value="">Todas las severidades</option>
                                                {getSeverities().map(sev => (
                                                    <option key={sev} value={sev}>{sev}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Lista */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {loadingPredefined ? (
                                            <div className="p-4 text-center text-gray-500">
                                                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                                Cargando...
                                            </div>
                                        ) : filteredPredefined.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">
                                                No se encontraron diagnósticos
                                            </div>
                                        ) : (
                                            filteredPredefined.map(diagnostic => (
                                                <button
                                                    key={diagnostic.id}
                                                    type="button"
                                                    onClick={() => handleSelectPredefined(diagnostic)}
                                                    className={`w-full p-3 text-left hover:bg-blue-50 border-b last:border-b-0 transition-colors ${
                                                        selectedPredefinedId === diagnostic.id ? 'bg-blue-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-gray-900">
                                                            {diagnostic.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            {diagnostic.code}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${getSeverityColor(diagnostic.severity)}`}>
                                                            {diagnostic.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        {diagnostic.description}
                                                    </p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información Básica */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Información Básica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título del Diagnóstico *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        placeholder="Ej: Consulta por dolor abdominal"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Consulta *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.consultDate}
                                        onChange={(e) => updateField('consultDate', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Próxima Cita
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.nextAppointment || ''}
                                        onChange={(e) => updateField('nextAppointment', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información Clínica */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Información Clínica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Síntomas
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.symptoms || ''}
                                        onChange={(e) => updateField('symptoms', e.target.value)}
                                        placeholder="Describa los síntomas presentados..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Examen Físico
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.physicalExam || ''}
                                        onChange={(e) => updateField('physicalExam', e.target.value)}
                                        placeholder="Resultados del examen físico..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Signos Vitales
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.vitalSigns || ''}
                                        onChange={(e) => updateField('vitalSigns', e.target.value)}
                                        placeholder="PA: 120/80, FC: 80, FR: 18, T: 36.5°C..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Diagnóstico
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.diagnosis || ''}
                                        onChange={(e) => updateField('diagnosis', e.target.value)}
                                        placeholder="Diagnóstico principal y secundarios..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tratamiento
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.treatment || ''}
                                        onChange={(e) => updateField('treatment', e.target.value)}
                                        placeholder="Plan de tratamiento recomendado..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Observaciones
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.observations || ''}
                                        onChange={(e) => updateField('observations', e.target.value)}
                                        placeholder="Notas adicionales..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                    <span className="text-sm text-gray-500">
                        * Campos obligatorios
                    </span>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !formData.title.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Diagnóstico
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
