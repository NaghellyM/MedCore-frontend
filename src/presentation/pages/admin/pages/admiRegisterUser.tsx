import Swal from "sweetalert2"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { UserForm } from "../components/adminUserForm"
import { SidebarProvider } from "../../../components/ui/sidebar"
import { registerUser } from "../../../../core/services/patientService"
import type { RegisterUserDto } from "../../../../core/models/user"
import { validationSchema } from "../../../../core/validators/validationSchema"

export function AdminRegisterUser() {
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, reset, formState: { errors } } = useForm<RegisterUserDto>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: "",
            fullname: "",
            current_password: "",
            role: "PACIENTE", 
        },
    })

    const onSubmit = async (data: RegisterUserDto) => {
        setLoading(true)
        try {
            await registerUser(data)
            Swal.fire({
                icon: "success",
                title: "Usuario registrado con éxito",
                showConfirmButton: false,
                timer: 2000,
            })
            reset()
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudo registrar",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <SidebarProvider>
            <div className="flex">
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

                    <div className="p-6 border rounded-lg bg-white shadow w-full sm:max-w-lg mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Registrar Usuario</h2>
                        <UserForm control={control} onSubmit={handleSubmit(onSubmit)} errors={errors} loading={loading} />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
