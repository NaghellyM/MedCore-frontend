import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { verifyEmail } from '../../../core/services/verifyEmailService';
import { useRedirectByRole } from '../../../core/hooks/auth';
import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/globals/theme-switcher';

const VerificationPage: React.FC = () => {
    const [params] = useSearchParams();
    const location = useLocation() as { state?: { email?: string } };
    const navigate = useNavigate();
    const redirectByRole = useRedirectByRole();
    const email = useMemo(
        () => params.get('email') || location.state?.email || '',
        [params, location.state]
    );
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onVerify = async () => {
        try {
            if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Falta el correo electrónico para verificar.'
                });
                return;
            }
            if (!code.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ingresa el código de verificación.'
                });
                return;
            }

            setIsLoading(true);
            const res = await verifyEmail(email, code.trim());
            if (res?.accessToken && res?.refreshToken) {
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
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
            const errorMessage = err?.message || String(err) || 'Error al verificar el código';
            Swal.fire({
                icon: 'error',
                title: 'Error de verificación',
                text: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
            {/* Toggle de tema en la esquina */}
            <div className="fixed top-4 right-4 z-10">
                <ThemeToggle size="sm" />
            </div>

            <div className="w-full max-w-md space-y-8">
                <Card>
                    <CardHeader className="text-center space-y-4">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img 
                                src="/logoCuidarte.png" 
                                alt="Logo Cuidarte" 
                                className="w-20 h-20 object-contain"
                            />
                        </div>
                        
                        {/* Icono decorativo */}
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                        </div>

                        <div>
                            <CardTitle className="text-2xl">Verificación de correo</CardTitle>
                            <CardDescription className="mt-2">
                                Hemos enviado un código a{' '}
                                <span className="font-medium text-foreground">
                                    {email || '(correo no disponible)'}
                                </span>
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Campo de código */}
                        <Input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            label="Código de verificación"
                            placeholder="Ingresa el código enviado a tu correo"
                            leftIcon={<Mail className="h-4 w-4" />}
                            disabled={isLoading}
                        />

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            {/* Botón principal: Verificar */}
                            <Button
                                type="button"
                                onClick={onVerify}
                                fullWidth
                                loading={isLoading}
                                loadingText="Verificando..."
                                size="lg"
                            >
                                Verificar código
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

                        {/* Texto de ayuda */}
                        <p className="text-center text-sm text-muted-foreground">
                            ¿No recibiste el código?{' '}
                            <button 
                                type="button"
                                className="text-primary hover:underline font-medium"
                                onClick={() => {
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'Reenviar código',
                                        text: 'Funcionalidad próximamente disponible'
                                    });
                                }}
                            >
                                Reenviar
                            </button>
                        </p>
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

export default VerificationPage;