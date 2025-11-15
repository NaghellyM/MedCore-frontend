import { useCallback } from 'react';
import { useToast } from '../notifications';

export interface AsyncOperationOptions {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    showSuccess?: boolean;
    showError?: boolean;
}

export interface AsyncOperationResult<T> {
    execute: (operation: () => Promise<T>, options?: AsyncOperationOptions) => Promise<T>;
    isLoading: boolean;
}

/**
 * Hook para manejar operaciones asíncronas con toast notifications
 * Encapsula el patrón común de loading/success/error con toast
 */
export function useAsyncOperation<T = any>(
    defaultOptions?: AsyncOperationOptions
): AsyncOperationResult<T> {
    const { success, error: showErrorToast, loading: showLoading, dismiss } = useToast();

    const execute = useCallback(async (
        operation: () => Promise<T>,
        options?: AsyncOperationOptions
    ): Promise<T> => {
        const config = { ...defaultOptions, ...options };
        const {
            loadingMessage = 'Procesando...',
            successMessage,
            errorMessage = 'Ha ocurrido un error inesperado',
            showSuccess = true,
            showError = true
        } = config;

        const toastId = config.loadingMessage ? showLoading(loadingMessage) : undefined;

        try {
            const result = await operation();

            if (toastId) dismiss(toastId);

            if (showSuccess && successMessage) {
                success(successMessage);
            }

            return result;
        } catch (e: any) {
            if (toastId) dismiss(toastId);

            if (showError) {
                const errorDesc = e.response?.data?.message || e.message || errorMessage;
                showErrorToast(errorDesc);
            }

            throw e;
        }
    }, [success, showErrorToast, showLoading, dismiss, defaultOptions]);

    return {
        execute,
        isLoading: false
    };
}