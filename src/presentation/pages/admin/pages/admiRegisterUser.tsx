import { motion } from "framer-motion"
import { UserForm } from "../components/adminUserForm"
import { useUserRegistrationForm, useUserRegistrationData } from "../../../../core/hooks/admin"
import { UserPlus, AlertCircle } from "lucide-react"
import { DashboardLayout } from "../../../layouts/dashboardLayout"
import { AdminSidebar } from "../components/adminSidebar"

export function AdminRegisterUser() {
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
      <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
        <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos del formulario...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  if (dataError) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
        <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive-light border border-destructive/30 p-6 rounded-2xl shadow-lg max-w-md text-center"
          >
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Error al cargar datos</h2>
            <p className="text-destructive/80 mb-4">{dataError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Reintentar
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
      <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border p-8 rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300"
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
              className="bg-primary/10 p-3 rounded-full mb-3"
            >
              <UserPlus className="text-primary w-8 h-8" />
            </motion.div>

            <h2 className="text-3xl font-semibold text-foreground text-center">
              Registrar Usuario
            </h2>
            <p className="text-muted-foreground text-sm mt-1 text-center">
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
    </DashboardLayout>
  )
}
