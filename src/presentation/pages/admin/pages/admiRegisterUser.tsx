import { motion } from "framer-motion"
import { UserForm } from "../components/adminUserForm"
import { useUserRegistrationForm, useUserRegistrationData } from "../../../../core/hooks/admin"
import { UserPlus, ArrowLeft, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function AdminRegisterUser() {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    watch,
    errors,
    loading,
    onSubmit,
  } = useUserRegistrationForm()

  const {
    specialties,
    departments,
    loading: dataLoading,
    error: dataError,
  } = useUserRegistrationData()

  const selectedRole = watch("role")

  if (dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del formulario...</p>
        </motion.div>
      </div>
    )
  }

  if (dataError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-lg max-w-md text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar datos</h2>
          <p className="text-red-600 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    )
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
