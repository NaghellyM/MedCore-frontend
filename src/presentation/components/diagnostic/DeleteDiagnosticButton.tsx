/**
 * BOTÓN DE ELIMINACIÓN DE DIAGNÓSTICO
 * ===================================
 * Componente reutilizable para eliminar diagnósticos
 * Responsabilidad única: Manejar la UI y lógica de eliminación
 */

import { Trash2, Loader2 } from "lucide-react";
import { useDeleteDiagnostic } from "../../../core/hooks/diagnostic/useDeleteDiagnostic";

interface DeleteDiagnosticButtonProps {
    diagnosticId: string;
    onDeleted?: (diagnosticId: string) => void;
    onError?: (error: string) => void;
    variant?: "icon" | "button";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
    showConfirmation?: boolean;
}

export function DeleteDiagnosticButton({
    diagnosticId,
    onDeleted,
    onError,
    variant = "icon",
    size = "md",
    className = "",
    disabled = false,
    showConfirmation = true
}: DeleteDiagnosticButtonProps) {
    const { isDeleting, deleteDiagnostic, canDelete } = useDeleteDiagnostic({
        onSuccess: onDeleted,
        onError,
        showConfirmation
    });

    const handleDelete = async () => {
        await deleteDiagnostic(diagnosticId);
    };

    // No mostrar el botón si el usuario no tiene permisos
    if (!canDelete) {
        return null;
    }

    const isDisabled = disabled || isDeleting;

    // Estilos base según el tamaño
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm", 
        lg: "w-12 h-12 text-base"
    };

    const iconSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    if (variant === "icon") {
        return (
            <button
                onClick={handleDelete}
                disabled={isDisabled}
                className={`
                    ${sizeClasses[size]}
                    flex items-center justify-center
                    bg-red-50 hover:bg-red-100 
                    text-red-600 hover:text-red-700
                    border border-red-200 hover:border-red-300
                    rounded-lg
                    transition-all duration-200
                    disabled:opacity-50 
                    disabled:cursor-not-allowed
                    disabled:hover:bg-red-50
                    ${className}
                `}
                title="Eliminar diagnóstico"
            >
                {isDeleting ? (
                    <Loader2 className={`${iconSizes[size]} animate-spin`} />
                ) : (
                    <Trash2 className={iconSizes[size]} />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDisabled}
            className={`
                inline-flex items-center gap-2
                px-3 py-2
                bg-red-50 hover:bg-red-100 
                text-red-600 hover:text-red-700
                border border-red-200 hover:border-red-300
                rounded-lg
                font-medium
                transition-all duration-200
                disabled:opacity-50 
                disabled:cursor-not-allowed
                disabled:hover:bg-red-50
                ${sizeClasses[size]}
                ${className}
            `}
        >
            {isDeleting ? (
                <Loader2 className={`${iconSizes[size]} animate-spin`} />
            ) : (
                <Trash2 className={iconSizes[size]} />
            )}
            {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
    );
}