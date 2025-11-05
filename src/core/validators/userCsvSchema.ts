import * as Yup from "yup"

export const userCsvSchema = Yup.object().shape({
  nombre: Yup
    .string()
    .required("El nombre es obligatorio"),
  correo: Yup
    .string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  rol: Yup
    .string()
    .oneOf(["PACIENTE", "MEDICO", "ENFERMERA"], "Rol no válido")
    .required("El rol es obligatorio"),
})
