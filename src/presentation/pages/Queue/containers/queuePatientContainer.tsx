import { QueuePatient } from "../components/queuePatient";
import { useMyPatientQueue } from "../../../../core/hooks/queue/usePatientQueuePosition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useMemo, useRef, useState, useEffect } from "react";

export type QueuePatientContainerSmartProps = {
    onBack?: () => void;
    pollMs?: number;
    enableLocalCountdown?: boolean;
    showJoinQueueOption?: boolean;
    defaultAppointmentId?: string;
};

// Usa el hook useMyPatientQueue que obtiene automáticamente el ID del paciente autenticado
export function QueuePatientContainer({
    onBack,
    pollMs = 10000,
    enableLocalCountdown = true,
    showJoinQueueOption = false,
    defaultAppointmentId,
}: QueuePatientContainerSmartProps) {
    const {
        loading,
        error,
        position,
        ticketNumber,
        queuePosition,
        estimatedWaitTime,
        status,
        doctor,
        appointment,
        lastUpdatedISO,
        refetch,
        joinQueue,
        joiningQueue,
    } = useMyPatientQueue({ pollMs });

    // Estado para countdown local
    const [etaLocal, setEtaLocal] = useState<number>(0);
    const lastTickRef = useRef<number>(Date.now());

    // Actualizar el tiempo base cuando cambia estimatedWaitTime
    useEffect(() => {
        if (estimatedWaitTime !== null) {
            setEtaLocal(estimatedWaitTime);
            lastTickRef.current = Date.now();
        }
    }, [estimatedWaitTime]);

    // Countdown local
    useEffect(() => {
        if (!enableLocalCountdown || estimatedWaitTime === null) return;
        
        const id = window.setInterval(() => {
            const elapsedMs = Date.now() - lastTickRef.current;
            const elapsedMins = Math.floor(elapsedMs / 60000);
            setEtaLocal(Math.max(0, (estimatedWaitTime || 0) - elapsedMins));
        }, 1000);
        
        return () => window.clearInterval(id);
    }, [estimatedWaitTime, enableLocalCountdown]);

    // Calcular valores derivados
    const derived = useMemo(() => {
        if (!position) return null;

        const aheadCount = Math.max(0, (queuePosition || 1) - 1);
        const etaMinutes = enableLocalCountdown ? etaLocal : (estimatedWaitTime || 0);

        return {
            ticketNumber: ticketNumber || 0,
            aheadCount,
            etaMinutes,
            status: status || 'WAITING',
            doctor,
            appointment,
        };
    }, [position, queuePosition, enableLocalCountdown, etaLocal, estimatedWaitTime, ticketNumber, status, doctor, appointment]);

    // Manejador para unirse a la cola
    const handleJoinQueue = async () => {
        if (!defaultAppointmentId) {
            console.error('No appointment ID provided for joining queue');
            return;
        }
        
        try {
            await joinQueue(defaultAppointmentId);
        } catch (error) {
            console.error('Failed to join queue:', error);
        }
    };

    // Estado de carga
    if (loading) {
        return (
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">Obteniendo tu turno…</CardTitle>
                    <CardDescription className="text-slate-600">Por favor, espera un momento.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="h-24 w-full rounded-2xl bg-slate-100 animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Estado cuando no está en cola y no hay error de autenticación
    if (!position && !error && showJoinQueueOption) {
        return (
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">No estás en ninguna cola</CardTitle>
                    <CardDescription className="text-slate-600">
                        ¿Deseas unirte a una cola para tu cita?
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center gap-2">
                    <Button 
                        onClick={handleJoinQueue} 
                        disabled={joiningQueue || !defaultAppointmentId}
                    >
                        {joiningQueue ? "Uniéndose..." : "Unirse a la cola"}
                    </Button>
                    {onBack && (
                        <Button variant="ghost" onClick={onBack}>
                            Volver
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Estado de error o sin datos
    if (error || !derived) {
        return (
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">No pudimos cargar tu turno</CardTitle>
                    <CardDescription className="text-slate-600">
                        {error ?? "Intenta nuevamente o vuelve más tarde."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center gap-2">
                    <Button onClick={refetch}>Reintentar</Button>
                    {onBack && (
                        <Button variant="ghost" onClick={onBack}>
                            Volver
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Configurar mensajes según el estado
    const titleByStatus: Record<string, string> = {
        WAITING: "Falta poco para que seas atendido",
        IN_PROGRESS: "Estás por ingresar",
        CALLED: "¡Te están llamando!",
        COMPLETED: "Turno finalizado",
        CANCELLED: "Turno cancelado",
    };

    const title = titleByStatus[derived.status] ?? "Pronto serás atendido";
    const subtitle = derived.aheadCount === 0
        ? "Estás a punto de ser llamado, por favor permanece cerca."
        : "Por favor, espera en la sala de espera.";

    return (
        <QueuePatient
            ticketNumber={derived.ticketNumber}
            aheadCount={derived.aheadCount}
            etaMinutes={derived.etaMinutes}
            lastUpdatedISO={lastUpdatedISO}
            title={title}
            subtitle={subtitle}
            doctor={derived.doctor || undefined}
            appointment={derived.appointment || undefined}
            onBack={onBack}
        />
    );
}