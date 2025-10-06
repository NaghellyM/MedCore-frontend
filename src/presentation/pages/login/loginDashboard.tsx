import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../../core/validators/validationLogin';
import { useRedirectByRole } from '../../../presentation/hooks/useRedirectByRole';
import { useAuth } from '../../../core/context/authContext'
import type { IFormInput } from '../../../core/types/types';
import FormInput from '../../components/globals/input';
import FormButton from '../../components/globals/button';
import LoginVerification from './components/loginVerification';

const Form: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);
  const { loginUser } = useAuth();
  const redirectByRole = useRedirectByRole();

  const onSubmit = async (data: IFormInput) => {
    try {
      const res = await loginUser({ email: data.email, password: data.password });
      if (res && res.message && res.message.includes("email")) {
        setEmail(data.email);
        setNeedsVerification(true);
      } else {
        redirectByRole(res.accessToken);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || "Error al iniciar sesión";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-xl font-bold mb-4">Bienvenidos a Cuidarte</h1>
      <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput name="email" label="Correo Electrónico" control={control} error={errors.email} />
          <FormInput name="password" label="Contraseña" control={control} type="password" error={errors.password} />
          <FormButton type="submit" label="Iniciar sesión" />
        </form>

        {needsVerification && (
          <LoginVerification email={email} code={code} setCode={setCode} />
        )}
      </div>
    </div>
  );
};

export default Form;
