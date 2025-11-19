import { useDoctorCurrentQueue } from "../../../../core/hooks/queue/useDoctorCurrentQueue";
import { DoctorQueue } from "../components/queueDoctor";
import { useAsyncOperation } from "../../../../core/hooks/queue/useAsyncOperation";
import { StateWrapper } from "../../../components/globals/StateComponents";
import { 
    transformNextPatient
} from "../../../../core/utils/queueTransformers";
import { useToast } from "../../../../core/hooks/notifications";

export type QueueDoctorContainerProps = {
    doctorId: string;
    onBack?: () => void;
    pollMs?: number;
    className?: string;
};

export function DoctorQueueContainer({
    doctorId,
    onBack,
    pollMs = 15000,
    className,
}: QueueDoctorContainerProps) {
    const { warning } = useToast();
    const asyncOperation = useAsyncOperation();
    
    const {
        loading,
        error,
        items,
        totalsByStatus,
        lastUpdatedISO,
        refetch,
        callNext,
        callingNext,
        nextUp,
        currentPatient,
        completeAttention,
        completing,
    } = useDoctorCurrentQueue(doctorId, { pollMs });

    const canCallNext = (totalsByStatus["WAITING"] ?? 0) > 0 && !callingNext && !currentPatient;

    const handleCallNext = async () => {
        if (!canCallNext) {
            warning('No se puede llamar al siguiente paciente',
                'No hay pacientes esperando o ya está llamando a alguien');
            return;
        }

        try {
            await asyncOperation.execute(() => callNext(), {
                loadingMessage: 'Llamando al siguiente paciente...',
                successMessage: `Turno ha sido llamado exitosamente`,
                errorMessage: 'Ha ocurrido un error inesperado'
            });
        } catch (error) {
            console.error('Error al llamar al siguiente paciente:', error);
        }
    };

    const handleCompleteAttention = async (appointmentId: string) => {
        try {
            await asyncOperation.execute(() => completeAttention(appointmentId), {
                loadingMessage: 'Completando atención...',
                successMessage: 'El paciente ha sido marcado como atendido exitosamente',
                errorMessage: 'No se pudo marcar como atendido'
            });
        } catch (error) {
            console.error('Error al completar la atención:', error);
        }
    };

    return (
        <StateWrapper
            loading={loading}
            error={error}
            onRetry={refetch}
            onBack={onBack}
            loadingProps={{
                title: "Cargando cola…",
                description: "Obteniendo información del doctor.",
                className: className
            }}
            errorProps={{
                title: "No pudimos cargar la cola",
                className: className
            }}
        >
            <DoctorQueue
                className={className}
                items={items}
                totalsByStatus={totalsByStatus}
                lastUpdatedISO={lastUpdatedISO}
                onRefresh={refetch}
                title="Cola actual del doctor"
                onCallNext={handleCallNext}
                callingNext={callingNext}
                canCallNext={canCallNext}
                nextUp={transformNextPatient(nextUp)}
                currentPatient={currentPatient}
                onCompleteAttention={handleCompleteAttention}
                completing={completing}
                onBack={onBack}
            />
        </StateWrapper>
    );
}