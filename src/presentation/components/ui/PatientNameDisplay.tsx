import React from "react";
import { Loader2, AlertCircle } from "lucide-react";

export type PatientNameDisplayState = 'loading' | 'error' | 'success' | 'fallback';

interface PatientNameDisplayProps {
    displayState: PatientNameDisplayState;
    displayText: string;
    className?: string;
}

/**
 * Componente reutilizable para mostrar el nombre del paciente con diferentes estados visuales.
 * 
 * @param displayState - Estado actual de la carga del nombre del paciente
 * @param displayText - Texto a mostrar (nombre del paciente o mensaje de estado)
 * @param className - Clases CSS adicionales opcionales
 */
export const PatientNameDisplay: React.FC<PatientNameDisplayProps> = ({ 
    displayState, 
    displayText,
    className = ""
}) => {
    switch (displayState) {
        case 'loading':
            return (
                <span className={`flex items-center gap-2 text-slate-600 ${className}`}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {displayText}
                </span>
            );
        
        case 'error':
            return (
                <span className={`flex items-center gap-2 text-red-600 ${className}`}>
                    <AlertCircle className="h-4 w-4" />
                    {displayText}
                </span>
            );
        
        case 'success':
            return (
                <span className={`font-medium text-slate-900 ${className}`}>
                    {displayText}
                </span>
            );
        
        case 'fallback':
            return (
                <span className={`text-slate-600 italic ${className}`}>
                    {displayText}
                </span>
            );
        
        default:
            return (
                <span className={className}>
                    {displayText}
                </span>
            );
    }
};