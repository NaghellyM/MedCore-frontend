import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email('Email no válido').required('El correo es obligatorio'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});
