import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FormButton from '../../components/globals/button';
import { verifyEmail } from '../../../core/services/verifyEmailService';
import { useRedirectByRole } from '../../../core/hooks/auth';
import { House } from 'lucide-react';

type Role = 'admin' | 'doctor' | 'nurse' | 'patient';
const VerificationPage: React.FC = () => {
    const [params] = useSearchParams();
    const location = useLocation() as { state?: { email?: string } };
    const navigate = useNavigate();
    const redirectByRole = useRedirectByRole();
    const email = useMemo(
        () => params.get('email') || location.state?.email || '',
        [params, location.state]
    );
    const mapRoleToEnglish = (role: string): Role => {
        const roleMap: Record<string, Role> = {
            'ADMINISTRADOR': 'admin',
            'ADMIN': 'admin',
            'MEDICO': 'doctor',
            'DOCTOR': 'doctor',
            'DOCTORA': 'doctor',
            'ENFERMERO': 'nurse',
            'ENFERMERA': 'nurse',
            'NURSE': 'nurse',
            'PACIENTE': 'patient',
            'PATIENT': 'patient',
        };
        return roleMap[role?.toUpperCase?.()] || 'patient';
    };

    const [code, setCode] = useState('');

    const onVerify = async () => {
        try {
            if (!email) {
                alert('Falta el correo electrónico para verificar.');
                return;
            }
            if (!code.trim()) {
                alert('Ingresa el código de verificación.');
                return;
            }

            const res = await verifyEmail(email, code.trim());
            if (res?.accessToken && res?.refreshToken) {
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                redirectByRole(res.accessToken);
            } else {
                alert('Respuesta inválida del servidor');
            }
        } catch (err: any) {
            const errorMessage = err?.message || String(err) || 'Error al verificar el código';
            alert(errorMessage);
        }
    };
    const goToRoleHome = (role: Role | undefined) => {
        const dest =
            role === 'admin' ? '/adminPage' :
                role === 'doctor' ? '/doctorPage' :
                    role === 'nurse' ? '/nursePage' :
                        '/patientPage';
        navigate(dest, { replace: true });
    };

    const onSkipVerify = () => {
        try {
            // 1) intenta con user en localStorage (guardado por authService)
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const role: Role = mapRoleToEnglish(user?.role || '');

            // 2) si hay rol, ve al home; si no, vuelve a login
            if (role) {
                goToRoleHome(role);
            } else {
                navigate('/login', { replace: true });
            }
        } catch {
            navigate('/login', { replace: true });
        }
    };

    const goBack = () => navigate('/', { replace: true });

    return (
        <div className="min-h-screen grid place-items-center px-4">
            <button
                type="button"
                onClick={goBack}
                className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                <House />
            </button>
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
                <img src="/logoCuidarte.png" alt="logo-cuidarte" className="mx-auto mb-4 w-24 h-24" />
                <h1 className="text-center font-bold text-2xl">Verificación de correo</h1>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Hemos enviado un código a <span className="font-medium">{email || '(correo no disponible)'}</span>.
                </p>

                <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
                    Código de verificación
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full border rounded-md p-2"
                    placeholder="Ingresa el código enviado a tu correo"
                />

                <div className="mt-6 space-y-3">
                    <FormButton type="button" label="Verificar código" onClick={onVerify} />
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
