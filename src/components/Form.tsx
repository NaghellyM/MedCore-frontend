import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IFormInput } from '../types/formTypes';

const schema = yup.object().shape({
    nombre: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Email no válido').required('El correo es obligatorio'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

const Form: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: IFormInput) => {
        console.log(data);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Nombre</label>
                    <Controller
                        name="nombre"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="nombre"
                                type="text"
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">Correo Electrónico</label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                id="email"
                                type="email"
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                            <input
                                {...field}
                                id="password"
                                type="password"
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">Enviar</button>
            </form>
        </div>
    );
};

export default Form;
