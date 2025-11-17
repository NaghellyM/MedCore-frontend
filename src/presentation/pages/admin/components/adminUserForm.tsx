import { motion } from "framer-motion"
import { FormField, PasswordField, DynamicSelectField } from "../../../components/globals"

interface Props {
  control: any
  onSubmit: any
  errors: any
  loading: boolean
  specialties: { id: string; name: string }[]
  departments: string[]
  selectedRole: string
}

export function UserForm({
  control,
  onSubmit,
  errors,
  loading,
  specialties,
  departments,
  selectedRole,
}: Props) {
  const roleOptions = [
    { name: "Paciente", value: "PACIENTE" },
    { name: "Médico", value: "MEDICO" },
    { name: "Enfermera", value: "ENFERMERA" },
  ]

  const specialtyOptions = specialties.map(sp => ({
    id: sp.id,
    name: sp.name,
    value: sp.name
  }))

  const departmentOptions = departments.map(dept => ({
    name: dept,
    value: dept
  }))

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 text-left">
      <FormField
        name="fullname"
        label="Nombre completo"
        placeholder="Ej: Dr. Juan Pérez"
        control={control}
        error={errors.fullname}
      />

      <FormField
        name="identificacion"
        label="Identificación"
        placeholder="Ej: 1002389234"
        control={control}
        error={errors.identificacion}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="usuario@correo.com"
        control={control}
        error={errors.email}
      />

      <PasswordField
        name="current_password"
        label="Contraseña"
        placeholder="********"
        control={control}
        error={errors.current_password}
      />

      <FormField
        name="date_of_birth"
        label="Fecha de nacimiento"
        type="date"
        control={control}
        error={errors.date_of_birth}
      />

      <FormField
        name="role"
        label="Rol"
        control={control}
        error={errors.role}
      >
        {(field) => (
          <select
            {...field}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.name}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <DynamicSelectField
        name="especializacion"
        label="Especialización"
        options={specialtyOptions}
        placeholder="Selecciona una especialización"
        control={control}
        error={errors.especializacion}
        isVisible={selectedRole === "MEDICO"}
      />

      <DynamicSelectField
        name="departamento"
        label="Departamento"
        options={departmentOptions}
        placeholder="Selecciona un departamento"
        control={control}
        error={errors.departamento}
        isVisible={selectedRole === "ENFERMERA"}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        type="submit"
        className={`w-full py-2 mt-4 text-white rounded-lg ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 transition-all"
        }`}
      >
        {loading ? "Registrando..." : "Registrar"}
      </motion.button>
    </form>
  )
}
