import { toast } from "sonner"

interface UseToastReturn {
    toast: typeof toast
    success: (message: string, description?: string) => void
    error: (message: string, description?: string) => void
    info: (message: string, description?: string) => void
    warning: (message: string, description?: string) => void
    loading: (message: string, description?: string) => string | number
    dismiss: (toastId?: string | number) => void
}

export const useToast = (): UseToastReturn => {
    const success = (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 4000,
        })
    }

    const error = (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 6000, 
        })
    }

    const info = (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 4000,
        })
    }

    const warning = (message: string, description?: string) => {
        toast.warning(message, {
            description,
            duration: 5000,
        })
    }

    const loading = (message: string, description?: string) => {
        return toast.loading(message, {
            description,
        })
    }

    const dismiss = (toastId?: string | number) => {
        if (toastId) {
            toast.dismiss(toastId)
        } else {
            toast.dismiss()
        }
    }

    return {
        toast,
        success,
        error,
        info,
        warning,
        loading,
        dismiss,
    }
}