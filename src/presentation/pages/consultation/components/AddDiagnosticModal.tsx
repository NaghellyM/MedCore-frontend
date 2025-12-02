import { useState, useEffect } from 'react';
import { X, Plus, Search, Loader2, Tag, Activity, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { usePredefinedDiagnostics } from '../../../../core/hooks/diagnostic';
import { diagnosticService } from '../../../../core/services/diagnosticService';
import { useToast } from '../../../../core/hooks/notifications';
import type { PredefinedDiagnostic } from '../../../../core/types/diagnostic';

interface AddDiagnosticModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patientId: string;
}

/**
 * Modal para agregar diagnósticos a un paciente basados en diagnósticos predefinidos
 * Usa el endpoint POST /diagnostics/patient/:patientId
 */
export function AddDiagnosticModal({
    isOpen,
    onClose,
    onSuccess,
    patientId
}: AddDiagnosticModalProps) {
    const { success, error: showError } = useToast();
    const {
        predefinedDiagnostics,
        isLoading: loadingPredefined,
        fetchPredefinedDiagnostics,
        getCategories,
        getSeverities
    } = usePredefinedDiagnostics();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeverity, setSelectedSeverity] = useState('');
    const [selectedDiagnostics, setSelectedDiagnostics] = useState<PredefinedDiagnostic[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Cargar diagnósticos predefinidos al abrir
    useEffect(() => {
        if (isOpen) {
            fetchPredefinedDiagnostics();
            setSelectedDiagnostics([]);
            setSearchTerm('');
            setSelectedCategory('');
            setSelectedSeverity('');
        }
    }, [isOpen, fetchPredefinedDiagnostics]);

    // Filtrar diagnósticos
    const filteredDiagnostics = predefinedDiagnostics.filter(d => {
        const matchSearch = searchTerm === '' ||
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === '' || d.category === selectedCategory;
        const matchSeverity = selectedSeverity === '' || d.severity === selectedSeverity;
        return matchSearch && matchCategory && matchSeverity;
    });

    // Toggle selección de diagnóstico
    const toggleDiagnostic = (diagnostic: PredefinedDiagnostic) => {
        setSelectedDiagnostics(prev => {
            const isSelected = prev.some(d => d.id === diagnostic.id);
            if (isSelected) {
                return prev.filter(d => d.id !== diagnostic.id);
            } else {
                return [...prev, diagnostic];
            }
        });
    };

    // Verificar si un diagnóstico está seleccionado
    const isSelected = (id: string) => selectedDiagnostics.some(d => d.id === id);

    // Guardar diagnósticos seleccionados
    const handleSave = async () => {
        if (selectedDiagnostics.length === 0) {
            showError('Error', 'Seleccione al menos un diagnóstico');
            return;
        }

        setIsSaving(true);
        
        try {
            // Crear un diagnóstico por cada predefinido seleccionado
            const createPromises = selectedDiagnostics.map(predefined => 
                diagnosticService.createDiagnostic(patientId, {
                    title: predefined.name,
                    description: predefined.description,
                    symptoms: predefined.commonSymptoms,
                    diagnosis: `${predefined.code} - ${predefined.name}`,
                    treatment: predefined.recommendedTreatment,
                    observations: predefined.observations || '',
                    consultDate: new Date().toISOString()
                })
            );

            await Promise.all(createPromises);

            success(
                'Diagnósticos agregados', 
                `Se agregaron ${selectedDiagnostics.length} diagnóstico(s) al paciente`
            );
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error al agregar diagnósticos:', err);
            showError(
                'Error al guardar', 
                err?.response?.data?.message || err?.message || 'No se pudieron agregar los diagnósticos'
            );
        } finally {
            setIsSaving(false);
        }
    };

    // Color de severidad
    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'BAJA': case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
            case 'MODERADA': case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'ALTA': case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'CRITICA': case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
            <div className="relative w-full max-w-2xl max-h-[85vh] mx-4 overflow-hidden bg-white rounded-xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-purple-50">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Agregar Diagnósticos
                        </h2>
                        <p className="text-sm text-gray-500">
                            Seleccione uno o más diagnósticos para agregar
                        </p>
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

                {/* Búsqueda y filtros */}
                <div className="px-6 py-4 border-b bg-gray-50 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, código o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Todas las categorías</option>
                            {getCategories().map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Todas las severidades</option>
                            {getSeverities().map(sev => (
                                <option key={sev} value={sev}>{sev}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de diagnósticos */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loadingPredefined ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                            <span className="ml-3 text-gray-600">Cargando diagnósticos...</span>
                        </div>
                    ) : filteredDiagnostics.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No se encontraron diagnósticos
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {filteredDiagnostics.map(diagnostic => (
                                <Card
                                    key={diagnostic.id}
                                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                                        isSelected(diagnostic.id) 
                                            ? 'ring-2 ring-purple-500 bg-purple-50' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => toggleDiagnostic(diagnostic)}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox visual */}
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                            isSelected(diagnostic.id)
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {isSelected(diagnostic.id) && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-semibold text-gray-900">
                                                    {diagnostic.name}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {diagnostic.code}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                {diagnostic.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs">
                                                <span className="inline-flex items-center gap-1 text-gray-500">
                                                    <Tag className="w-3 h-3" />
                                                    {diagnostic.category}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getSeverityColor(diagnostic.severity)}`}>
                                                    <Activity className="w-3 h-3" />
                                                    {diagnostic.severity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con seleccionados y acciones */}
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            {selectedDiagnostics.length > 0 ? (
                                <span className="font-medium text-purple-600">
                                    {selectedDiagnostics.length} diagnóstico(s) seleccionado(s)
                                </span>
                            ) : (
                                <span>Seleccione diagnósticos de la lista</span>
                            )}
                        </div>
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
                                disabled={isSaving || selectedDiagnostics.length === 0}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar ({selectedDiagnostics.length})
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
