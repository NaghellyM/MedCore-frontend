/**
 * HEADER DE HISTORIA CLÍNICA
 * ==========================
 * Componente responsable de mostrar botón de navegación
 */

import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MedicalHistoryHeaderProps {
    backRoute?: string;
    backLabel?: string;
}

export function MedicalHistoryHeader({ 
    backRoute = "/medicalHistory/list",
    backLabel = "Volver a Historiales"
}: MedicalHistoryHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(backRoute)}
                    className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">{backLabel}</span>
                </button>
            </div>
        </div>
    );
}
