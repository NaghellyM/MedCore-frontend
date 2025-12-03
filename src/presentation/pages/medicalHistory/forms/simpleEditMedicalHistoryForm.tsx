/**
 * FORMULARIO SIMPLE DE EDICIÓN DE HISTORIA CLÍNICA
 * ================================================
 * Versión minimalista para evitar bucles de estado
 */

import { useState, useEffect, useRef } from "react";
import { AlertCircle, Loader2, ArrowLeft, Save, Edit3, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHomeRouteByRole } from "../../../../core/utils/navigation";

// Componentes de diagnóstico
import { DeleteDiagnosticButton, DiagnosticStatusIndicator } from "../../../components/globals/diagnostic";

// Hooks de diagnóstico
import { useDiagnosticFilter } from "../../../../core/hooks/diagnostic";

// Servicios
import { medicalHistoryService } from "../../../../core/services/medicalHistoryService";
import { diagnosticService } from "../../../../core/services/diagnosticService";
import { useToast } from "../../../../core/hooks/notifications/useToast";

// Tipos
import type {
    MedicalHistory,
    Diagnostic,
    UpdateDiagnosticDto
} from "../../../../core/types/medicalHistory";

interface SimpleEditMedicalHistoryFormProps {
    historyId: string;
    onSaveSuccess?: (historyId: string, patientId?: string) => void;
    onSaveError?: (error: string) => void;
}

export function SimpleEditMedicalHistoryForm({
    historyId,
    onSaveSuccess,
    onSaveError
}: SimpleEditMedicalHistoryFormProps) {
    // Estados básicos
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
    
    // Estados de edición
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingDiagnostic, setEditingDiagnostic] = useState<Diagnostic | null>(null);
    const [editForm, setEditForm] = useState<UpdateDiagnosticDto>({});

    // Estados para mostrar diagnósticos eliminados (solo admin)
    const [showDeletedDiagnostics, setShowDeletedDiagnostics] = useState(false);

    // Hook para filtrar diagnósticos según el rol del usuario
    const { filterDiagnostics, canViewDeleted } = useDiagnosticFilter({
        showDeleted: showDeletedDiagnostics
    });

    // Hooks
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const hasLoadedRef = useRef(false);

    // Cargar datos una sola vez
    useEffect(() => {
        // Evitar múltiples ejecuciones
        if (hasLoadedRef.current) {
            return;
        }

        if (!historyId) {
            setError("ID de historia clínica no válido");
            setIsLoading(false);
            return;
        }

        hasLoadedRef.current = true;

        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await medicalHistoryService.getMedicalHistoryById(historyId);

                const history = response.data;

                setMedicalHistory(history);
                setDiagnostics(history.diagnostics || []);

            } catch (error) {
                
                const errorMessage = error instanceof Error ? 
                    error.message : "Error al cargar la historia clínica";
                setError(errorMessage);
                showError(errorMessage);
                onSaveError?.(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []); // Sin dependencias para ejecutar solo una vez

    // Funciones de edición
    const startEditingDiagnostic = (diagnostic: Diagnostic) => {
        setEditingDiagnostic(diagnostic);
        setEditForm({
            title: diagnostic.title,
            description: diagnostic.description || "",
            symptoms: diagnostic.symptoms || "",
            diagnosis: diagnostic.diagnosis || "",
            treatment: diagnostic.treatment || "",
            observations: diagnostic.observations || "",
            prescriptions: diagnostic.prescriptions || "",
            physicalExam: diagnostic.physicalExam || "",
            vitalSigns: diagnostic.vitalSigns || "",
            consultDate: diagnostic.consultDate.split('T')[0],
            nextAppointment: diagnostic.nextAppointment?.split('T')[0] || ""
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingDiagnostic(null);
        setEditForm({});
    };

    const saveDiagnostic = async () => {
        if (!editingDiagnostic) return;

        setIsSaving(true);
        try {
            await diagnosticService.updateDiagnostic(editingDiagnostic.id, editForm);
            
            // Actualizar el diagnóstico en el estado local
            setDiagnostics(prev => prev.map(d => 
                d.id === editingDiagnostic.id 
                    ? { ...d, ...editForm, consultDate: editForm.consultDate + 'T00:00:00.000Z' }
                    : d
            ));

            success("Diagnóstico actualizado exitosamente");
            if (onSaveSuccess) onSaveSuccess(historyId, medicalHistory?.patientId);
            cancelEditing();

        } catch (error) {
            const errorMessage = error instanceof Error ? 
                error.message : "Error al guardar el diagnóstico";
            showError(errorMessage);
            onSaveError?.(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFormChange = (field: keyof UpdateDiagnosticDto, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDiagnosticDeleted = (deletedId: string) => {
        if (canViewDeleted) {
            // Si es admin, marcar como eliminado en lugar de remover
            setDiagnostics(prev => prev.map(d => 
                d.id === deletedId 
                    ? { ...d, state: 'DELETED' as const }
                    : d
            ));
        } else {
            // Si es médico, remover de la lista
            setDiagnostics(prev => prev.filter(d => d.id !== deletedId));
        }
        
        // Si estaba editando el diagnóstico eliminado, cancelar la edición
        if (editingDiagnostic?.id === deletedId) {
            cancelEditing();
        }
    };

    // Estados de carga
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-gray-600">Cargando historia clínica...</span>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500">
                        ID: {historyId}
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                            Cancelar y recargar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="flex items-center space-x-3 text-red-600">
                        <AlertCircle className="h-6 w-6" />
                        <div>
                            <h3 className="font-semibold">Error al cargar la historia clínica</h3>
                            <p className="text-sm text-red-500 mt-1">{error}</p>
                        </div>
                    </div>
                    <div className="mt-4 space-x-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={() => navigate("/medicalHistory/list")}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Volver a la lista
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!medicalHistory) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border p-8">
                    <div className="text-center text-gray-500">
                        No se encontró la historia clínica
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar información básica de la historia clínica
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(getHomeRouteByRole())}
                            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Volver</span>
                        </button>
                        <div className="h-6 w-px bg-border"></div>
                        <h1 className="text-xl font-semibold text-foreground">
                            Editar Historia Clínica
                        </h1>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        ID: <code className="bg-muted px-2 py-1 rounded text-foreground">{historyId}</code>
                    </div>
                </div>
            </div>

            {/* Información de la historia */}
            <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
                <h2 className="text-lg font-semibold text-foreground mb-4">Información de la Historia</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            ID del Paciente
                        </label>
                        <div className="text-sm text-foreground">{medicalHistory.patientId}</div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Médico Tratante
                        </label>
                        <div className="text-sm text-foreground">Dr. {medicalHistory.doctor.fullname}</div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Fecha de Creación
                        </label>
                        <div className="text-sm text-foreground">
                            {new Date(medicalHistory.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Última Actualización
                        </label>
                        <div className="text-sm text-foreground">
                            {new Date(medicalHistory.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Diagnósticos */}
            <div className="bg-card rounded-lg border border-border p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Diagnósticos Asociados ({diagnostics.length})
                        </h2>
                        
                        {/* Toggle para mostrar eliminados (solo admin) */}
                        {canViewDeleted && (
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={showDeletedDiagnostics}
                                    onChange={(e) => setShowDeletedDiagnostics(e.target.checked)}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>Mostrar eliminados</span>
                            </label>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={saveDiagnostic}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                            </button>
                            <button
                                onClick={cancelEditing}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-3 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 disabled:opacity-50 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span>Cancelar</span>
                            </button>
                        </div>
                    )}
                </div>
                
                {diagnostics.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No hay diagnósticos registrados
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filterDiagnostics(diagnostics).map((diagnostic, index) => (
                            <div key={diagnostic.id} className="border border-border rounded-lg p-4 transition-colors duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-medium text-lg text-foreground">Diagnóstico #{index + 1}</h3>
                                        <DiagnosticStatusIndicator 
                                            state={diagnostic.state} 
                                            size="sm"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {!isEditing && (
                                            <>
                                                <button
                                                    onClick={() => startEditingDiagnostic(diagnostic)}
                                                    className="flex items-center space-x-1 px-2 py-1 text-primary hover:bg-primary/10 rounded text-sm transition-colors"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                    <span>Editar</span>
                                                </button>
                                                <DeleteDiagnosticButton
                                                    diagnosticId={diagnostic.id}
                                                    onDeleted={handleDiagnosticDeleted}
                                                    variant="icon"
                                                    size="sm"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                
                                {editingDiagnostic?.id === diagnostic.id ? (
                                    // Formulario de edición
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    Título *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.title || ''}
                                                    onChange={(e) => handleFormChange('title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    Fecha de Consulta *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={editForm.consultDate || ''}
                                                    onChange={(e) => handleFormChange('consultDate', e.target.value)}
                                                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Descripción *
                                            </label>
                                            <textarea
                                                value={editForm.description || ''}
                                                onChange={(e) => handleFormChange('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Síntomas *
                                            </label>
                                            <textarea
                                                value={editForm.symptoms || ''}
                                                onChange={(e) => handleFormChange('symptoms', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Diagnóstico *
                                            </label>
                                            <textarea
                                                value={editForm.diagnosis || ''}
                                                onChange={(e) => handleFormChange('diagnosis', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Tratamiento *
                                            </label>
                                            <textarea
                                                value={editForm.treatment || ''}
                                                onChange={(e) => handleFormChange('treatment', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Observaciones
                                            </label>
                                            <textarea
                                                value={editForm.observations || ''}
                                                onChange={(e) => handleFormChange('observations', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                Próxima Cita
                                            </label>
                                            <input
                                                type="date"
                                                value={editForm.nextAppointment || ''}
                                                onChange={(e) => handleFormChange('nextAppointment', e.target.value)}
                                                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // Vista de solo lectura
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-muted-foreground">Título:</span>
                                                <p className="mt-1 text-foreground">{diagnostic.title}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Fecha:</span>
                                                <p className="mt-1 text-foreground">{new Date(diagnostic.consultDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {diagnostic.description && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Descripción:</span>
                                                <p className="mt-1 text-sm text-foreground">{diagnostic.description}</p>
                                            </div>
                                        )}

                                        {diagnostic.symptoms && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Síntomas:</span>
                                                <p className="mt-1 text-sm text-foreground">{diagnostic.symptoms}</p>
                                            </div>
                                        )}

                                        {diagnostic.diagnosis && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Diagnóstico:</span>
                                                <p className="mt-1 text-sm text-foreground">{diagnostic.diagnosis}</p>
                                            </div>
                                        )}

                                        {diagnostic.treatment && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Tratamiento:</span>
                                                <p className="mt-1 text-sm text-foreground">{diagnostic.treatment}</p>
                                            </div>
                                        )}

                                        {diagnostic.observations && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Observaciones:</span>
                                                <p className="mt-1 text-sm text-muted-foreground">{diagnostic.observations}</p>
                                            </div>
                                        )}

                                        {diagnostic.nextAppointment && (
                                            <div>
                                                <span className="font-medium text-muted-foreground">Próxima Cita:</span>
                                                <p className="mt-1 text-sm text-foreground">{new Date(diagnostic.nextAppointment).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instrucciones de uso */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 transition-colors duration-300">
                <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-medium text-foreground">Cómo editar</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Haz clic en "Editar" junto a cualquier diagnóstico para modificar su información. 
                            Los campos marcados con (*) son obligatorios.
                        </p>
                        <div className="mt-3">
                            <button
                                onClick={() => {
                                    const testUrl = `http://localhost:3003/api/v1/medical-history/${historyId}`;
                                    window.open(testUrl, '_blank');
                                }}
                                className="px-3 py-1 bg-primary/20 text-primary rounded text-xs hover:bg-primary/30 transition-colors"
                            >
                                Ver datos del backend
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Indicador de guardado */}
            {isSaving && (
                <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Guardando cambios...</span>
                    </div>
                </div>
            )}
        </div>
    );
}