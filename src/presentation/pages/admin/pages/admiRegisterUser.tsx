import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { motion } from "framer-motion"
import { UserForm } from "../components/adminUserForm"
import { registerUser } from "../../../../core/services/patientService"
import { doctorsService } from "../../../../core/services/doctorsService"
import type { RegisterUserDto } from "../../../../core/models/user"
import { validationSchema } from "../../../../core/validators/userSchemaValidator"
import { UserPlus, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../../../core/hooks/notifications"

export function AdminRegisterUser() {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([])
  const [departments, setDepartments] = useState<string[]>([])

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


  const selectedRole = watch("role")

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await doctorsService.getSpecialties()
        if (Array.isArray(response)) {
          const mapped = response.map((esp: any) => ({
            id: esp.id,
            name: esp.nombre,
          }))
          setSpecialties(mapped)
        }
      } catch (error) {
        console.error("❌ Error al cargar especialidades:", error)
      }
    }

    const loadDepartments = async () => {
      try {
        const list = ["Urgencias", "Pediatría", "UCI", "Oncología", "Farmacia"]
        setDepartments(list)
      } catch (error) {
        console.error("❌ Error al cargar departamentos:", error)
      }
    }

    loadSpecialties()
    loadDepartments()
  }, [])

  const onSubmit = async (data: RegisterUserDto) => {
    console.log("📤 Enviando datos al backend:", data)
    setLoading(true)
    try {
      const res = await registerUser(data)
      console.log("✅ Respuesta del backend:", res)
      success("¡Usuario registrado!", "El usuario ha sido creado exitosamente")
      reset()
    } catch (error: any) {
      console.error("❌ Error al registrar usuario:", error)
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/adminpage")}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition-all duration-300 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al panel de administración</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-blue-100 p-3 rounded-full mb-3"
          >
            <UserPlus className="text-blue-600 w-8 h-8" />
          </motion.div>

          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Registrar Usuario
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Completa los datos para agregar un nuevo usuario
          </p>
        </motion.div>

        <UserForm
          control={control}
          onSubmit={handleSubmit(onSubmit)}
          errors={errors}
          loading={loading}
          specialties={specialties}
          selectedRole={selectedRole}
          departments={departments}
        />
      </motion.div>
    </div>
  )
}
