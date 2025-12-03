import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../core/utils/cn';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { 
    ChevronLeft, 
    ChevronRight, 
    CheckCircle, 
    X,
    Loader2,
    Clock,
    FileText,
    Stethoscope,
    Pill,
    ClipboardList
} from 'lucide-react';
import { useConsultation } from '../../../../core/hooks/consultation';
import { useAssignDiagnostics } from '../../../../core/hooks/diagnostic';
import { useToast } from '../../../../core/hooks/notifications';
import { ConsultationSteps } from './consultationSteps';
import { PatientInfoCard } from './patientInfoCard';
import { MedicalHistorySelector } from './medicalHistorySelector';
import { DiagnosticsList } from './diagnosticsList';
import { DiagnosticSelector } from './diagnosticSelector';
import { PrescriptionsList } from './prescriptionsList';
import { MedicalOrdersList } from './medicalOrdersList';
import type { QueuePatient } from '../../../../core/types/queue';
import type { SelectedDiagnostic } from '../../../../core/types/diagnostic';

interface ConsultationPanelProps {
    patient: QueuePatient;
    onComplete: (appointmentId: string) => Promise<void>;
    onCancel: () => void;
    completing?: boolean;
    className?: string;
}

/**
 * Panel principal de consulta médica
 * Gestiona todo el flujo de atención al paciente
 */
export const ConsultationPanel = memo(function ConsultationPanel({
    patient,
    onComplete,
    onCancel,
    completing = false,
    className,
}: ConsultationPanelProps) {
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const [showDiagnosticSelector, setShowDiagnosticSelector] = useState(false);
    
    const {
        consultation,
        isActive,
        loading,
        error,
        currentStep,
        navigation,
        patientInfo,
        medicalHistory,
        diagnostics,
        prescriptions,
        orders,
        startConsultation,
        createMedicalHistory,
        refreshDiagnostics,
        refreshPrescriptions,
        refreshOrders,
        completeConsultation,
        cancelConsultation,
        loadingPatient,
        loadingHistory,
        loadingDiagnostics,
        loadingPrescriptions,
        loadingOrders,
    } = useConsultation({
        onComplete: async () => {
            // Usar patient.id (ID del ticket de cola) en lugar de appointmentId
            await onComplete(patient.id);
        },
        onError: (errorMsg) => {
            showError('Error en la consulta', errorMsg);
        },
    });

    const {
        isAssigning,
        assignDiagnostics,
        reset: resetAssignment
    } = useAssignDiagnostics();

    // Iniciar consulta cuando se monta el componente
    useEffect(() => {
        if (!isActive && patient) {
            startConsultation(patient);
        }
    }, [patient, isActive, startConsultation]);

    // Cargar datos cuando cambia el paso
    useEffect(() => {
        if (currentStep === 'diagnostics' && patientInfo) {
            refreshDiagnostics();
        } else if (currentStep === 'prescriptions' && patientInfo) {
            refreshPrescriptions();
        } else if (currentStep === 'orders' && patientInfo) {
            refreshOrders();
        }
    }, [currentStep, patientInfo, refreshDiagnostics, refreshPrescriptions, refreshOrders]);

    // Handlers para navegación a formularios
    // NOTA: Los diagnósticos NO se pueden crear ni editar, solo visualizar
    const handleViewDiagnostic = (diagnosticId: string) => {
        if (medicalHistory) {
            navigate(`/medicalHistory/${medicalHistory.id}/diagnosis/${diagnosticId}`);
        }
    };

    const handleAddPrescription = () => {
        if (patientInfo) {
            navigate(`/prescriptions/new?patientId=${patientInfo.id}`);
        }
    };

    const handleViewPrescription = (prescriptionId: string) => {
        navigate(`/prescriptions/${prescriptionId}`);
    };

    const handleAddLaboratoryOrder = () => {
        if (patientInfo) {
            navigate(`/orders/laboratory/new?patientId=${patientInfo.id}`);
        }
    };

    const handleAddRadiologyOrder = () => {
        if (patientInfo) {
            navigate(`/orders/radiology/new?patientId=${patientInfo.id}`);
        }
    };

    const handleViewOrder = (orderId: string) => {
        navigate(`/orders/${orderId}`);
    };

    const handleCreateMedicalHistory = async () => {
        const historyId = await createMedicalHistory();
        if (historyId) {
            success('Historia clínica creada', 'La historia clínica se ha creado correctamente');
        }
    };

    const handleCompleteConsultation = () => {
        completeConsultation();
    };

    const handleCancelConsultation = () => {
        cancelConsultation();
        onCancel();
    };

    // Handlers para diagnósticos
    const handleOpenDiagnosticSelector = () => {
        setShowDiagnosticSelector(true);
    };

    const handleCloseDiagnosticSelector = () => {
        setShowDiagnosticSelector(false);
        resetAssignment();
    };

    const handleAssignDiagnostics = async (selectedDiagnostics: SelectedDiagnostic[]) => {
        if (!patientInfo) {
            showError('Error', 'No se ha cargado la información del paciente');
            return;
        }

        const assigned = await assignDiagnostics(patientInfo.id, selectedDiagnostics);
        
        if (assigned) {
            success(
                'Diagnósticos asignados',
                `Se han asignado ${selectedDiagnostics.length} diagnóstico${selectedDiagnostics.length > 1 ? 's' : ''} correctamente`
            );
            setShowDiagnosticSelector(false);
            resetAssignment();
            // Recargar la lista de diagnósticos
            refreshDiagnostics();
        } else {
            showError('Error', 'No se pudieron asignar los diagnósticos');
        }
    };

    // Determinar qué pasos están completados
    const getCompletedSteps = () => {
        const completed: string[] = [];
        if (patientInfo) completed.push('patient-info');
        if (medicalHistory) completed.push('medical-history');
        if (diagnostics.length > 0) completed.push('diagnostics');
        if (prescriptions.length > 0) completed.push('prescriptions');
        if (orders.length > 0) completed.push('orders');
        return completed;
    };

    // Renderizar contenido según el paso actual
    const renderStepContent = () => {
        switch (currentStep) {
            case 'patient-info':
                return (
                    <PatientInfoCard
                        patient={patientInfo}
                        loading={loadingPatient}
                    />
                );

            case 'medical-history':
                return (
                    <MedicalHistorySelector
                        patientId={patientInfo?.id || ''}
                        medicalHistory={medicalHistory}
                        loading={loadingHistory}
                        onCreateNew={handleCreateMedicalHistory}
                    />
                );

            case 'diagnostics':
                return (
                    <>
                        <DiagnosticsList
                            diagnostics={diagnostics}
                            medicalHistoryId={medicalHistory?.id || null}
                            patientId={patientInfo?.id || null}
                            loading={loadingDiagnostics}
                            onView={handleViewDiagnostic}
                            onRefresh={refreshDiagnostics}
                            onAssign={handleOpenDiagnosticSelector}
                        />
                        {patientInfo && (
                            <DiagnosticSelector
                                open={showDiagnosticSelector}
                                onClose={handleCloseDiagnosticSelector}
                                onConfirm={handleAssignDiagnostics}
                                patientId={patientInfo.id}
                            />
                        )}
                    </>
                );

            case 'prescriptions':
                return (
                    <PrescriptionsList
                        prescriptions={prescriptions}
                        patientId={patientInfo?.id || null}
                        loading={loadingPrescriptions}
                        onAdd={handleAddPrescription}
                        onView={handleViewPrescription}
                    />
                );

            case 'orders':
                return (
                    <MedicalOrdersList
                        orders={orders}
                        patientId={patientInfo?.id || null}
                        loading={loadingOrders}
                        onView={handleViewOrder}
                        onRefresh={refreshOrders}
                    />
                );

            case 'summary':
                return (
                    <ConsultationSummary
                        consultation={consultation}
                        patientInfo={patientInfo}
                        medicalHistory={medicalHistory}
                        diagnostics={diagnostics}
                        prescriptions={prescriptions}
                        orders={orders}
                    />
                );

            default:
                return null;
        }
    };

    if (error) {
        return (
            <Card className={cn("border-2 border-red-200", className)}>
                <CardContent className="p-6 text-center">
                    <p className="text-red-600">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => startConsultation(patient)}
                    >
                        Reintentar
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header con info del turno */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold">
                                N°{patient.queueNumber}
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    Consulta Médica en Curso
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Iniciada: {consultation?.startedAt 
                                            ? new Date(consultation.startedAt).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleCancelConsultation}
                            title="Cancelar consulta"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Pasos de navegación */}
            <ConsultationSteps
                currentStep={currentStep}
                completedSteps={getCompletedSteps() as any}
                onStepClick={navigation.goToStep}
            />

            {/* Contenido del paso actual */}
            <div className="min-h-[300px]">
                {renderStepContent()}
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center justify-between pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={navigation.goBack}
                    disabled={navigation.isFirstStep || loading}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                </Button>

                <div className="flex items-center gap-3">
                    {navigation.isLastStep ? (
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleCompleteConsultation}
                            disabled={completing || loading}
                        >
                            {completing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Finalizando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Finalizar Consulta
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={navigation.goNext}
                            disabled={loading}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});

// Componente de resumen de consulta
interface ConsultationSummaryProps {
    consultation: any;
    patientInfo: any;
    medicalHistory: any;
    diagnostics: any[];
    prescriptions: any[];
    orders: any[];
}

const ConsultationSummary = memo(function ConsultationSummary({
    patientInfo,
    medicalHistory,
    diagnostics,
    prescriptions,
    orders,
}: ConsultationSummaryProps) {
    return (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Resumen de la Consulta
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Info del paciente */}
                <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-slate-900 mb-2">Paciente</h4>
                    <p className="text-slate-600">{patientInfo?.fullName || 'N/A'}</p>
                    <p className="text-sm text-slate-500">
                        {patientInfo?.documentType}: {patientInfo?.documentNumber}
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SummaryCard
                        icon={FileText}
                        label="Historia Clínica"
                        value={medicalHistory ? '✓' : '—'}
                        color="green"
                    />
                    <SummaryCard
                        icon={Stethoscope}
                        label="Diagnósticos"
                        value={diagnostics.length.toString()}
                        color="purple"
                    />
                    <SummaryCard
                        icon={Pill}
                        label="Prescripciones"
                        value={prescriptions.length.toString()}
                        color="orange"
                    />
                    <SummaryCard
                        icon={ClipboardList}
                        label="Órdenes"
                        value={orders.length.toString()}
                        color="cyan"
                    />
                </div>

                {/* Nota final */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 text-center">
                        Al finalizar la consulta, el paciente será marcado como atendido
                        y se liberará el turno.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});

// Mini componente para las tarjetas de resumen
interface SummaryCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    color: 'green' | 'purple' | 'orange' | 'cyan';
}

const SummaryCard = ({ icon: Icon, label, value, color }: SummaryCardProps) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-700 border-green-200',
        purple: 'bg-purple-100 text-purple-700 border-purple-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    };

    return (
        <div className={cn(
            "p-3 rounded-lg border text-center",
            colorClasses[color]
        )}>
            <Icon className="h-5 w-5 mx-auto mb-1" />
            <p className="text-lg font-bold">{value}</p>
            <p className="text-xs">{label}</p>
        </div>
    );
};
