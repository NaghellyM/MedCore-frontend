import { SidebarProvider } from "../../components/ui/sidebar"
import { useState } from "react"
import { AdminSidebar } from "../admin/adminSidebar"
import { registerUser} from "../../services/patientService"
import type { RegisterUserDto } from "../../services/patientService"


import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Swal from "sweetalert2"

const schema = yup.object().shape({
  email: yup.string().email("Email no válido").required("El correo es obligatorio"),
  fullname: yup.string().required("El nombre completo es obligatorio"),
  current_password: yup
    .string()
    .required("La contraseña es obligatoria")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "La contraseña debe tener al menos una letra y un número, y mínimo 6 caracteres"
    ),
  role: yup.string().required("El rol es obligatorio"),
})

export function AdminPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserDto>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      fullname: "",
      current_password: "",
      role: "MEDICO",
      status: "PENDING",
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
      <div className="flex min-h-screen bg-gray-50">
        {/* Botón hamburguesa en móviles */}
        <div className="md:hidden fixed top-2 left-2 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 border rounded-md bg-white shadow-md"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`w-64 bg-white shadow-md md:block ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <AdminSidebar />
        </div>

        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

          {/* Formulario de registro */}
          <div className="max-w-lg p-6 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-semibold mb-4">Registrar Usuario</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Correo *</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className="w-full border rounded px-3 py-2"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-sm font-medium">
                  Nombre Completo *
                </label>
                <Controller
                  name="fullname"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full border rounded px-3 py-2"
                    />
                  )}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs">{errors.fullname.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium">Contraseña *</label>
                <Controller
                  name="current_password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      className="w-full border rounded px-3 py-2"
                    />
                  )}
                />
                {errors.current_password && (
                  <p className="text-red-500 text-xs">{errors.current_password.message}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium">Rol</label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full border rounded px-3 py-2">
                      <option value="ADMINISTRADOR">Administrador</option>
                      <option value="PACIENTE">Paciente</option>
                      <option value="MEDICO">Médico</option>
                      <option value="ENFERMERA">Enfermera</option>
                    </select>
                  )}
                />
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrar"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
