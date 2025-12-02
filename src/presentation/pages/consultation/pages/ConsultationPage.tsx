import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../../../layouts/dashboardLayout';
import DoctorSidebar from '../../doctor/components/doctorSideBar';
import { ConsultationPanel } from '../components/consultationPanel';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Stethoscope, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../../core/hooks/notifications';
import { queueService } from '../../../../core/services/queueService';
import { useState } from 'react';
import type { QueuePatient } from '../../../../core/types/queue';

/**
 * Página de Consulta Médica
 * Maneja el flujo completo de atención al paciente
 */
export default function ConsultationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { success, error: showError } = useToast();
    const [completing, setCompleting] = useState(false);

    // Obtener el paciente del state de navegación
    const patient = location.state?.patient as QueuePatient | undefined;

    const handleCompleteConsultation = async (appointmentId: string) => {
        setCompleting(true);
        try {
            await queueService.markCurrentPatientAsAttended(appointmentId);
            success(
                'Consulta finalizada',
                'El paciente ha sido marcado como atendido exitosamente'
            );
            navigate('/queueDoctor');
        } catch (err: any) {
            showError(
                'Error al finalizar',
                err?.message || 'No se pudo marcar al paciente como atendido'
            );
        } finally {
            setCompleting(false);
        }
    };

    const handleCancel = () => {
        navigate('/queueDoctor');
    };

    // Si no hay paciente en el state, mostrar error
    if (!patient) {
        return (
            <DashboardLayout sidebar={<DoctorSidebar />} showSearch={false}>
                <div className="p-6">
                    <Card className="max-w-lg mx-auto border-2 border-amber-200">
                        <CardContent className="p-8 text-center">
                            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                No hay paciente seleccionado
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Para iniciar una consulta, primero debes llamar a un paciente
                                desde la cola de atención.
                            </p>
                            <Button
                                onClick={() => navigate('/queueDoctor')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Ir a la Cola de Pacientes
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebar={<DoctorSidebar />} showSearch={false}>
            <div className="p-6 space-y-6">
                {/* Título */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Consulta Médica
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona la atención del paciente
                        </p>
                    </div>
                </div>

                {/* Panel de consulta */}
                <div className="max-w-4xl mx-auto">
                    <ConsultationPanel
                        patient={patient}
                        onComplete={handleCompleteConsultation}
                        onCancel={handleCancel}
                        completing={completing}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
