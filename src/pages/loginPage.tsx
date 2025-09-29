import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IFormInput } from '../types/formTypes';
import { login } from '../services/authService';
import { verifyEmail } from '../services/verifyEmail';
import { decodeToken } from '../lib/utils'; // 👈 importa tu decodeToken
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email('Email no válido').required('El correo es obligatorio'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

const Form: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  const redirectByRole = (token: string) => {
    const payload = decodeToken(token);

    switch (payload.role) {
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "user":
        navigate("/dashboard/user");
        break;
      case "manager":
        navigate("/dashboard/manager");
        break;
      default:
        navigate("/dashboard");
        break;
    }
  };

  const onSubmit = async (data: IFormInput) => {
    try {
      const res = await login(data.email, data.password);
      console.log("Respuesta login:", res);

      if (res.message?.includes("email")) {
        setEmail(data.email);
        setPassword(data.password);
        setNeedsVerification(true);
        alert("Te hemos enviado un correo con el código de verificación.");
      } else {
        // Guardamos tokens
        localStorage.setItem("accessToken", res.accessToken!);
        localStorage.setItem("refreshToken", res.refreshToken!);

        // Redirigir según rol 👇
        redirectByRole(res.accessToken!);
      }
    } catch (err: any) {
      alert(err.message || "Error al iniciar sesión");
    }
  };

  const onVerify = async () => {
    try {
      const res = await verifyEmail(email, code);
      console.log("Respuesta verificación:", res);

      localStorage.setItem("accessToken", res.accessToken!);
      localStorage.setItem("refreshToken", res.refreshToken!);

      // Redirigir según rol 👇
      redirectByRole(res.accessToken!);
    } catch (err: any) {
      alert(err.message || "Error al verificar el código");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Correo Electrónico</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input {...field} id="email" type="email" className="mt-1 p-2 w-full border rounded-md" />
            )}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input {...field} id="password" type="password" className="mt-1 p-2 w-full border rounded-md" />
            )}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">Iniciar sesión</button>
      </form>

      {needsVerification && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Código de verificación</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Ingresa el código enviado a tu correo"
          />
          <button
            onClick={onVerify}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-md"
          >
            Verificar código
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
