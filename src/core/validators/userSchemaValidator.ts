import * as yup from "yup";

export const validationSchema = yup.object().shape({
  fullname: yup
    .string()
    .required("Nombre obligatorio"),
  email: yup
    .string()
    .email("Email inválido")
    .required("Email obligatorio"),
  current_password: yup
    .string()
    .required("Contraseña obligatoria"),
  identificacion: yup
    .string()
    .required("Identificación obligatoria"),
  date_of_birth: yup
    .string()
    .required("Fecha de nacimiento obligatoria")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: AAAA-MM-DD"),

});
