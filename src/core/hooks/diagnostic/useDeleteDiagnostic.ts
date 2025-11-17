/**
 * HOOK PARA ELIMINAR DIAGNÓSTICO
 * Hook especializado para manejar la eliminación (soft delete) de diagnósticos
 * Considera permisos por rol: médicos no ven eliminados, administradores sí
 */

import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { diagnosticService } from "../../services/diagnosticService";
import { useToast } from "../notifications/useToast";
import { useAuth } from "../../context/authContext";
import type { DeleteDiagnosticResponse } from "../../types/diagnostic";

interface UseDeleteDiagnosticOptions {
    onSuccess?: (diagnosticId: string) => void;
    onError?: (error: string) => void;
    showConfirmation?: boolean;
}

interface DeleteDiagnosticResult {
    success: boolean;
    diagnosticId?: string;
    error?: string;
}

interface UseDeleteDiagnosticReturn {
    isDeleting: boolean;
    deleteDiagnostic: (diagnosticId: string) => Promise<DeleteDiagnosticResult>;
    canDelete: boolean;
}

export function useDeleteDiagnostic(options: UseDeleteDiagnosticOptions = {}): UseDeleteDiagnosticReturn {
    const { onSuccess, onError, showConfirmation = true } = options;
    const [isDeleting, setIsDeleting] = useState(false);
    const { success: showSuccess, error: showError } = useToast();
    const { user } = useAuth();

    // Verificar permisos para eliminar
    const canDelete = user?.role === 'ADMINISTRADOR' || user?.role === 'DOCTOR' || user?.role === 'MEDICO';

    const deleteDiagnostic = useCallback(async (diagnosticId: string): Promise<DeleteDiagnosticResult> => {
        if (!canDelete) {
            const errorMessage = "No tienes permisos para eliminar diagnósticos";
            showError(errorMessage);
            onError?.(errorMessage);
            return { success: false, error: errorMessage };
        }

        // Mostrar confirmación si está habilitada
        if (showConfirmation) {
            const result = await Swal.fire({
                title: '¿Eliminar diagnóstico?',
                html: `
                    <div class="text-left">
                        <p class="mb-3">Esta acción <strong>no se puede deshacer</strong>.</p>
                        <p class="mb-2">El diagnóstico será marcado como eliminado y:</p>
                        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Los médicos no podrán verlo</li>
                            <li>Solo los administradores tendrán acceso</li>
                            <li>Se mantendrá el historial para auditoría</li>
                        </ul>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                focusCancel: true,
                customClass: {
                    popup: 'swal2-popup-custom',
                    confirmButton: 'swal2-confirm-custom',
                    cancelButton: 'swal2-cancel-custom'
                }
            });
            
            if (!result.isConfirmed) {
                return { success: false, error: "Operación cancelada por el usuario" };
            }
        }

        setIsDeleting(true);

        try {
            const response: DeleteDiagnosticResponse = await diagnosticService.deleteDiagnostic(diagnosticId);

            // Verificar que la eliminación fue exitosa
            // Manejar diferentes formatos de respuesta del backend
            const isSuccessful = response.success === true || 
                                response.success === undefined ||
                                (response.message && response.message.toLowerCase().includes('eliminado')) ||
                                (response.data && (response.data as any).diagnosticId) ||
                                (response as any).diagnosticId; // Caso donde response.data es la respuesta directa

            if (isSuccessful) {
                // Solo mostrar confirmación con SweetAlert2 (sin toast duplicado)
                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El diagnóstico ha sido eliminado exitosamente.',
                    icon: 'success',
                    timer: 2500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                    customClass: {
                        popup: 'swal2-toast-custom'
                    }
                });
                
                onSuccess?.(diagnosticId);
                
                return {
                    success: true,
                    diagnosticId
                };
            } else {
                throw new Error(response.message || "Error al eliminar el diagnóstico");
            }

        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Error desconocido al eliminar el diagnóstico";

            // Verificar si es un error HTTP específico
            // Solo mostrar error detallado con SweetAlert2 (sin toast duplicado)
            Swal.fire({
                title: 'Error al eliminar',
                html: `
                    <div class="text-left">
                        <p class="mb-2">No se pudo eliminar el diagnóstico:</p>
                        <p class="text-sm text-red-600 bg-red-50 p-2 rounded">${errorMessage}</p>
                        <p class="text-xs text-gray-500 mt-2">
                            Por favor, intente nuevamente o contacte al administrador del sistema.
                        </p>
                    </div>
                `,
                icon: 'error',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#dc2626'
            });

            onError?.(errorMessage);

            return {
                success: false,
                error: errorMessage
            };

        } finally {
            setIsDeleting(false);
        }
    }, [canDelete, showConfirmation, showSuccess, showError, onSuccess, onError]);

    return {
        isDeleting,
        deleteDiagnostic,
        canDelete
    };
}