import React from 'react';
import Swal from 'sweetalert2';
import FormButton from '../../../components/globals/button';
import { verifyEmail } from '../../../../core/services/verifyEmailService';
import { useRedirectByRole } from '../../../../core/hooks/auth';

interface VerificationFormProps {
    email: string;
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ email, code, setCode }) => {
    const redirectByRole = useRedirectByRole();
    
    const onVerify = async () => {
        try {
            const res = await verifyEmail(email, code);
            if (res && res.accessToken && res.refreshToken) {
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
                await Swal.fire({
                    icon: 'success',
                    title: '¡Verificación exitosa!',
                    text: 'Tu cuenta ha sido verificada correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
                redirectByRole(res.accessToken);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de verificación',
                    text: 'Respuesta inválida del servidor'
                });
            }
        } catch (err: any) {
            const errorMessage = err?.message || err?.toString() || "Error al verificar el código";
            Swal.fire({
                icon: 'error',
                title: 'Error de verificación',
                text: errorMessage
            });
        }
    };

    return (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Código de verificación</label>
            <input
                type="text"
                value={code || ""}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Ingresa el código enviado a tu correo"
            />
            <FormButton label="Verificar código" onClick={onVerify} type='button'/>
        </div>
    );
};

export default VerificationForm;
