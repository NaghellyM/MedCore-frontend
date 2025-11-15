import React, { useMemo, useState } from 'react';
import FormButton from '../../../components/globals/button';
import { verifyEmail, requestVerificationCode } from '../../../../core/services/verifyEmailService';
import { useAuth } from '../../../../core/context/authContext';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

type Props = {
    initialEmail?: string;
    initialVerified?: boolean;
};

const VerifyEmailCard: React.FC<Props> = ({ initialEmail, initialVerified }) => {
    const { user, refreshUser } = useAuth();
    const email = useMemo(() => initialEmail ?? user?.email ?? '', [initialEmail, user?.email]);
    const [verified, setVerified] = useState<boolean>(!!initialVerified || !!user?.emailVerified);
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState(false);
    const [cooldown, setCooldown] = useState<number>(0);

    const onRequestCode = async () => {
        try {
            if (!email) return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró un correo para verificar.'
            });
            setBusy(true);
            await requestVerificationCode(email);
            // Use toast for informational feedback (non-blocking)
            toast.success('¡Código enviado!', {
                description: 'Te enviamos un código a tu correo',
                duration: 4000
            });
            setCooldown(60);
            const t = setInterval(() => setCooldown((s) => {
                if (s <= 1) { clearInterval(t); return 0; }
                return s - 1;
            }), 1000);
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e?.message || 'No pudimos enviar el código.'
            });
        } finally {
            setBusy(false);
        }
    };

    const onVerify = async () => {
        try {
            if (!email) return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró un correo para verificar.'
            });
            if (!code.trim()) return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ingresa el código de verificación.'
            });
            setBusy(true);

            const res = await verifyEmail(email, code.trim());
            if (res?.accessToken && res?.refreshToken) {
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                setVerified(true);

                try { await refreshUser?.(); } catch { /* noop */ }

                Swal.fire({
                    icon: 'success',
                    title: '¡Correo verificado!',
                    text: 'Tu correo ha sido verificado exitosamente.'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Respuesta inválida del servidor'
                });
            }
        } catch (e: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e?.message || 'Error al verificar el código.'
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Verificación de correo</h2>

            <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">Correo: </span>{email || '—'}
            </div>

            <div className="mt-2">
                {verified ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                        Verificado
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                        No verificado
                    </span>
                )}
            </div>

            {!verified && (
                <div className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código de verificación
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border rounded-md p-2"
                            placeholder="Ingresa el código enviado a tu correo"
                            disabled={busy}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormButton
                            type="button"
                            label="Verificar código"
                            onClick={onVerify}
                        />
                        <button
                            type="button"
                            onClick={onRequestCode}
                            disabled={busy || cooldown > 0}
                            className="w-full bg-gray-100 text-gray-800 py-2 font-semibold rounded-md"
                        >
                            {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Enviar/Reenviar código'}
                        </button>
                    </div>
                </div>
            )}

            {verified && (
                <p className="text-sm text-gray-500 mt-4">
                    Tu correo ya está verificado. Si cambias tu correo en el futuro, podrás verificarlo nuevamente aquí.
                </p>
            )}
        </div>
    );
};

export default VerifyEmailCard;
