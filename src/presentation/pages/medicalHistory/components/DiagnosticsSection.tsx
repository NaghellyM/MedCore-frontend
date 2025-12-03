/**
 * SECCIÓN DE DIAGNÓSTICOS - SOLO LECTURA
 * =======================================
 * Componente responsable de listar diagnósticos
 * Sin capacidad de edición, solo visualización y eliminación
 */

import { FileText } from "lucide-react";
import { DiagnosticCard } from "./DiagnosticCard";
import type { Diagnostic } from "../../../../core/types/medicalHistory";

interface DiagnosticsSectionProps {
    diagnostics: Diagnostic[];
    canViewDeleted: boolean;
    showDeleted: boolean;
    onToggleDeleted: (show: boolean) => void;
    onDelete: (id: string) => void;
}

export function DiagnosticsSection({
    diagnostics,
    canViewDeleted,
    showDeleted,
    onToggleDeleted,
    onDelete
}: DiagnosticsSectionProps) {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-foreground">
                            Diagnósticos Asociados
                        </h2>
                        <span className="px-3 py-1 bg-primary/20 dark:bg-primary/30 text-primary rounded-full text-sm font-semibold">
                            {diagnostics.length}
                        </span>
                        
                        {canViewDeleted && (
                            <label className="flex items-center gap-2 text-sm text-muted-foreground ml-4">
                                <input
                                    type="checkbox"
                                    checked={showDeleted}
                                    onChange={(e) => onToggleDeleted(e.target.checked)}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>Mostrar eliminados</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                {diagnostics.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No hay diagnósticos registrados</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {diagnostics.map((diagnostic, index) => (
                            <DiagnosticCard
                                key={diagnostic.id}
                                diagnostic={diagnostic}
                                index={index}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
