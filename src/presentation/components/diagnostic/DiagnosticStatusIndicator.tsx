/**
 * INDICADOR DE ESTADO DE DIAGNÓSTICO
 * ==================================
 * Componente para mostrar visualmente el estado de un diagnóstico
 * Responsabilidad única: Renderizar el estado del diagnóstico
 */

import { CheckCircle, XCircle, Trash2, AlertCircle } from "lucide-react";
import type { DiagnosticState } from "../../../core/types/medicalHistory";

interface DiagnosticStatusIndicatorProps {
    state: DiagnosticState;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}

export function DiagnosticStatusIndicator({
    state,
    size = "md",
    showLabel = true,
    className = ""
}: DiagnosticStatusIndicatorProps) {
    const sizeClasses = {
        sm: "w-3 h-3 text-xs",
        md: "w-4 h-4 text-sm",
        lg: "w-5 h-5 text-base"
    };

    const getStateConfig = (state: DiagnosticState) => {
        switch (state) {
            case "ACTIVE":
                return {
                    icon: CheckCircle,
                    label: "Activo",
                    bgColor: "bg-green-50",
                    textColor: "text-green-700",
                    borderColor: "border-green-200",
                    iconColor: "text-green-600"
                };
            case "ARCHIVED":
                return {
                    icon: AlertCircle,
                    label: "Archivado",
                    bgColor: "bg-yellow-50",
                    textColor: "text-yellow-700",
                    borderColor: "border-yellow-200",
                    iconColor: "text-yellow-600"
                };
            case "DELETED":
                return {
                    icon: Trash2,
                    label: "Eliminado",
                    bgColor: "bg-red-50",
                    textColor: "text-red-700",
                    borderColor: "border-red-200",
                    iconColor: "text-red-600"
                };
            default:
                return {
                    icon: XCircle,
                    label: "Desconocido",
                    bgColor: "bg-gray-50",
                    textColor: "text-gray-700",
                    borderColor: "border-gray-200",
                    iconColor: "text-gray-600"
                };
        }
    };

    const config = getStateConfig(state);
    const Icon = config.icon;

    if (!showLabel) {
        return (
            <div
                className={`
                    inline-flex items-center justify-center
                    rounded-full
                    ${sizeClasses[size]}
                    ${config.bgColor}
                    ${config.borderColor}
                    border
                    ${className}
                `}
                title={config.label}
            >
                <Icon className={`${sizeClasses[size]} ${config.iconColor}`} />
            </div>
        );
    }

    return (
        <div
            className={`
                inline-flex items-center gap-1.5
                px-2 py-1
                rounded-full
                border
                ${config.bgColor}
                ${config.textColor}
                ${config.borderColor}
                ${sizeClasses[size]}
                ${className}
            `}
        >
            <Icon className={`${sizeClasses[size]} ${config.iconColor}`} />
            {showLabel && (
                <span className="font-medium whitespace-nowrap">
                    {config.label}
                </span>
            )}
        </div>
    );
}