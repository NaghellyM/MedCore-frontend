import * as yup from "yup"

export const validationSchema = yup.object().shape({
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
