import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, AlertCircle, Tag, Activity, FileText, X } from 'lucide-react';
import { usePredefinedDiagnostics } from '../../../../core/hooks/diagnostic';
import type { PredefinedDiagnostic } from '../../../../core/types/diagnostic';

interface PredefinedDiagnosticSelectorProps {
    onSelect: (diagnostic: PredefinedDiagnostic) => void;
    selectedId?: string;
    disabled?: boolean;
}

export function PredefinedDiagnosticSelector({
    onSelect,
    selectedId,
    disabled = false
}: PredefinedDiagnosticSelectorProps) {
    const {
        predefinedDiagnostics,
        isLoading,
        error,
        fetchPredefinedDiagnostics,
        getCategories,
        getSeverities
    } = usePredefinedDiagnostics();

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSeverity, setSelectedSeverity] = useState<string>('');

    // Cargar diagnósticos predefinidos al montar
    useEffect(() => {
        fetchPredefinedDiagnostics();
    }, [fetchPredefinedDiagnostics]);

    // Filtrar diagnósticos por búsqueda y filtros
    const filteredDiagnostics = predefinedDiagnostics.filter(diagnostic => {
        const matchesSearch = searchTerm === '' || 
            diagnostic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnostic.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnostic.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === '' || diagnostic.category === selectedCategory;
        const matchesSeverity = selectedSeverity === '' || diagnostic.severity === selectedSeverity;
        
        return matchesSearch && matchesCategory && matchesSeverity;
    });

    const handleSelect = useCallback((diagnostic: PredefinedDiagnostic) => {
        onSelect(diagnostic);
        setIsOpen(false);
        setSearchTerm('');
    }, [onSelect]);

    const selectedDiagnostic = predefinedDiagnostics.find(d => d.id === selectedId);

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedSeverity('');
        setSearchTerm('');
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'BAJA':
            case 'LOW':
                return 'bg-green-100 text-green-800';
            case 'MODERADA':
            case 'MODERATE':
                return 'bg-yellow-100 text-yellow-800';
            case 'ALTA':
            case 'HIGH':
                return 'bg-orange-100 text-orange-800';
            case 'CRITICA':
            case 'CRITICAL':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-left transition-colors ${
                    disabled 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white hover:bg-gray-50 cursor-pointer'
                } ${isOpen ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {selectedDiagnostic ? (
                        <div className="truncate">
                            <span className="font-medium text-gray-900">{selectedDiagnostic.name}</span>
                            <span className="text-gray-500 ml-2">({selectedDiagnostic.code})</span>
                        </div>
                    ) : (
                        <span className="text-gray-500">Seleccionar diagnóstico predefinido...</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-hidden">
                    {/* Search and Filters */}
                    <div className="p-3 border-b border-gray-200 space-y-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre, código o descripción..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                autoFocus
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Todas las categorías</option>
                                {getCategories().map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value)}
                                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Todas las severidades</option>
                                {getSeverities().map(severity => (
                                    <option key={severity} value={severity}>{severity}</option>
                                ))}
                            </select>

                            {(selectedCategory || selectedSeverity || searchTerm) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-2 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-[280px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                Cargando diagnósticos...
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-red-500 flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        ) : filteredDiagnostics.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No se encontraron diagnósticos
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredDiagnostics.map((diagnostic) => (
                                    <button
                                        key={diagnostic.id}
                                        type="button"
                                        onClick={() => handleSelect(diagnostic)}
                                        className={`w-full p-3 text-left hover:bg-blue-50 transition-colors ${
                                            selectedId === diagnostic.id ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900 truncate">
                                                        {diagnostic.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                        {diagnostic.code}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {diagnostic.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                        <Tag className="w-3 h-3" />
                                                        {diagnostic.category}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getSeverityColor(diagnostic.severity)}`}>
                                                        <Activity className="w-3 h-3" />
                                                        {diagnostic.severity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
                        {filteredDiagnostics.length} diagnóstico(s) encontrado(s)
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
