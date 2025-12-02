import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginSchema } from '../../../core/validators/userLoginValidator';
import { useAuth } from '../../../core/context/authContext';
import type { IFormInput } from "../../../core/types/auth";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ThemeToggle } from '../../components/globals/theme-switcher';
import { Alert } from '../../components/globals/alert';

type Role = 'admin' | 'doctor' | 'nurse' | 'patient';

const LoginDashboard: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggleVisibility = () => setIsVisible(v => !v);

  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const goToRoleHome = (role: Role | undefined) => {
    const dest =
      role === 'admin' ? '/adminPage' :
        role === 'doctor' ? '/doctorPage' :
          role === 'nurse' ? '/nursePage' :
            '/patientPage';
    navigate(dest, { replace: true });
  };

  const mapRoleToEnglish = (role: string): Role => {
    const roleMap: Record<string, Role> = {
      'ADMINISTRADOR': 'admin',
      'ADMIN': 'admin',
      'MEDICO': 'doctor',
      'DOCTOR': 'doctor',
      'ENFERMERO': 'nurse',
      'NURSE': 'nurse',
      'PACIENTE': 'patient',
      'PATIENT': 'patient',
    };
    return roleMap[role.toUpperCase()] || 'patient';
  };

  const onSubmit = async (data: IFormInput) => {
    setError(null);

    try {
      const res: any = await loginUser({ email: data.email, password: data.password });

      if (res?.message && String(res.message).toLowerCase().includes("email")) {
        navigate(`/verify?email=${encodeURIComponent(data.email)}`, {
          replace: true,
          state: { email: data.email },
        });
        return;
      }

      const redirect = params.get('redirect');
      if (redirect && redirect !== '/login') {
        navigate(redirect, { replace: true });
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role: Role = mapRoleToEnglish(user?.role || '');
      goToRoleHome(role);

    } catch (err: any) {
      let errorMessage = err?.response?.data?.message || err?.message || String(err) || "Error al iniciar sesión";

      if (errorMessage.toLowerCase().includes('credenciales inválidas') ||
        errorMessage.toLowerCase().includes('credenciales invalidas') ||
        errorMessage.toLowerCase().includes('invalid credentials') ||
        errorMessage.toLowerCase().includes('credenciales incorrectas')) {
        errorMessage = "Usuario o contraseña incorrecta";
      }

      setError(errorMessage);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo iniciar sesión',
        text: errorMessage
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Theme toggle en la esquina */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle size="sm" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Logo y título */}
        <div className="text-center space-y-4">
          <img
            src="/logoCuidarte.png"
            alt="Logo Cuidarte"
            className="mx-auto h-16 w-16 object-contain"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bienvenidos a Cuidarte
            </h1>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>
        </div>

        {/* Card del formulario */}
        <Card className="shadow-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu correo electrónico y contraseña
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Alert de error */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-6"
                closable
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Campo Email */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Correo Electrónico"
                    placeholder="name@cuidarte.com"
                    leftIcon={<Mail size={18} />}
                    error={!!errors.email}
                    errorMessage={errors.email?.message}
                    autoComplete="email"
                    required
                  />
                )}
              />

              {/* Campo Contraseña */}
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={isVisible ? "text" : "password"}
                    label="Contraseña"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    rightElement={
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {isVisible ? (
                          <EyeOff size={18} aria-hidden="true" />
                        ) : (
                          <Eye size={18} aria-hidden="true" />
                        )}
                      </button>
                    }
                    error={!!errors.password}
                    errorMessage={errors.password?.message}
                    autoComplete="current-password"
                    required
                  />
                )}
              />

              {/* Botones de acción */}
              <div className="space-y-3 pt-2">
                {/* Botón principal: Iniciar Sesión */}
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={isSubmitting}
                  loadingText="Iniciando sesión..."
                >
                  Iniciar Sesión
                </Button>

                {/* Botón secundario: Regresar */}
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => navigate(-1)}
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Regresar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cuidarte. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginDashboard;
