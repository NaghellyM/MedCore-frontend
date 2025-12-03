import { DiagnosticReadView } from "./DiagnosticReadView";
import type { Diagnostic } from "../../../../core/types/medicalHistory";
import { DeleteDiagnosticButton, DiagnosticStatusIndicator } from "../../../components/globals/diagnostic";

interface DiagnosticCardProps {
    diagnostic: Diagnostic;
    index: number;
    onDelete: (id: string) => void;
}

export function DiagnosticCard({
    diagnostic,
    index,
    onDelete
}: DiagnosticCardProps) {
    return (
        <div className="bg-muted/30 dark:bg-muted/20 border border-border rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-lg">
                        <span className="text-sm font-bold text-primary">N°{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                        {diagnostic.title || `Diagnóstico N${index + 1}`}
                    </h3>
                    <DiagnosticStatusIndicator state={diagnostic.state} size="sm" />
                </div>
                
                <DeleteDiagnosticButton
                    diagnosticId={diagnostic.id}
                    onDeleted={onDelete}
                    variant="icon"
                    size="sm"
                />
            </div>
            
            <DiagnosticReadView diagnostic={diagnostic} />
        </div>
    );
}
