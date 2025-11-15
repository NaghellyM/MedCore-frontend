import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerUser } from '../../../core/services/patientService'
import { validationSchema } from '../../../core/validators/userSchemaValidator'
import { useToast } from '../notifications'
import type { RegisterUserDto } from '../../../core/models/user'

interface UseUserRegistrationFormReturn {
    control: any
    handleSubmit: any
    watch: any
    reset: any
    errors: any
    loading: boolean
    onSubmit: (data: RegisterUserDto) => Promise<void>
}

export function useUserRegistrationForm(): UseUserRegistrationFormReturn {
    const { success, error: showError } = useToast()
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm<RegisterUserDto>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            current_password: "",
            identificacion: "",
            date_of_birth: "",
            role: "PACIENTE",
            fullname: "",
        },
    })

    const onSubmit = async (data: RegisterUserDto) => {
        setLoading(true)

        try {
            await registerUser(data)
            success("¡Usuario registrado!", "El usuario ha sido creado exitosamente")
            reset()
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const backendErrors = error.response.data.errors
                for (const [field, message] of Object.entries(backendErrors)) {
                    setError(field as keyof RegisterUserDto, {
                        type: "server",
                        message: message as string,
                    })
                }
            } else if (error.response?.data?.message) {
                showError("Error al registrar usuario", error.response.data.message)
            } else {
                showError("Error inesperado", "Ocurrió un error inesperado. Intenta nuevamente.")
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        control,
        handleSubmit,
        watch,
        reset,
        errors,
        loading,
        onSubmit,
    }
}