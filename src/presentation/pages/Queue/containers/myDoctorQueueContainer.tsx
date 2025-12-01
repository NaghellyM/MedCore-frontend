import { useMyDoctorQueue } from "../../../../core/hooks/queue/useDoctorQueue";
import { DoctorQueue } from "../components/queueDoctor";
import { useAsyncOperation } from "../../../../core/hooks/queue/useAsyncOperation";
import { StateWrapper } from "../../../components/globals/StateComponents";
import { 
    transformNextPatient
} from "../../../../core/utils/queueTransformers";
import { useToast } from "../../../../core/hooks/notifications";

export type MyDoctorQueueContainerProps = {
    onBack?: () => void;
    pollMs?: number;
    className?: string;
};

/**
 * Container para la cola del doctor autenticado
 * Usa el ID del doctor logueado automáticamente
 */
export function MyDoctorQueueContainer({
    onBack,
    pollMs = 15000,
    className,
}: MyDoctorQueueContainerProps) {
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
        pauseAttention,
        pausing,
        isPaused,
        nextUp,
        currentPatient,
        completeAttention,
        completing,
    } = useMyDoctorQueue({ pollMs });

    const canCallNext = (totalsByStatus["WAITING"] ?? 0) > 0 && !callingNext && !currentPatient;

    const canPauseAttention = !pausing && !callingNext && !completing;

    const handlePauseAttention = async () => {
        if (!canPauseAttention) {
            warning('No se puede pausar la atención',
                'No se puede pausar la atención mientras se está llamando a un paciente o completando una atención');
            return;
        }
        
        try {
            await asyncOperation.execute(() => pauseAttention(), {
                loadingMessage: 'Pausando atención...',
                successMessage: `Atención ha sido pausada exitosamente`,
                errorMessage: 'Ha ocurrido un error inesperado'
            });
        } catch (error) {
            console.error('Error al pausar la atención:', error);
        }
    };
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
                description: "Obteniendo información de tu cola de pacientes.",
                className: className
            }}
            errorProps={{
                title: "No hay pacientes actualmente en espera para ti.",
                description: "Tu cola está vacía en este momento.",
                className: className
            }}
            
        >
            <DoctorQueue
                className={className}
                items={items}
                totalsByStatus={totalsByStatus}
                lastUpdatedISO={lastUpdatedISO}
                onRefresh={refetch}
                title="Mi cola de pacientes"
                onCallNext={handleCallNext}
                callingNext={callingNext}
                canCallNext={canCallNext}
                canPauseAttention={canPauseAttention}
                onPauseAttention={handlePauseAttention}
                pausing={pausing}
                isPaused={isPaused}
                nextUp={transformNextPatient(nextUp)}
                currentPatient={currentPatient}
                onCompleteAttention={handleCompleteAttention}
                completing={completing}
                onBack={onBack}
            />
        </StateWrapper>
    );
}