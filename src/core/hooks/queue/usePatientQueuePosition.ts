import { useState, useEffect, useCallback, useRef } from "react";
import { queueService } from "../../services/queueService";
import { useCurrentUser } from "../auth";
import type { QueuePositionDTO, QueuePatientStatus } from "../../types/queue";

export interface UsePatientQueueOptions {
    pollMs?: number;
}

export interface UsePatientQueueReturn {
    loading: boolean;
    error: string | null;
    position: QueuePositionDTO | null;
    ticketNumber: number | null;
    queuePosition: number | null;
    estimatedWaitTime: number | null;
    status: QueuePatientStatus | null;
    doctor: {
        name: string;
        specialty: string;
        departament: string;
    } | null;
    appointment: {
        id: string;
        scheduledAt: string;
        status: string;
    } | null;
    lastUpdatedISO: string | undefined;
    refetch: () => Promise<void>;
    joinQueue: (appointmentId: string) => Promise<void>;
    joiningQueue: boolean;
}

/**
 * Hook para obtener la posición en cola del paciente autenticado
 * Gestiona el estado y obtiene la posición del paciente en la cola
 */
export function useMyPatientQueue(
    options: UsePatientQueueOptions = {}
): UsePatientQueueReturn {
    const { pollMs = 10000 } = options; 
    const [position, setPosition] = useState<QueuePositionDTO | null>(null);
    const [queueLoading, setQueueLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdatedISO, setLastUpdatedISO] = useState<string | undefined>(undefined);
    const [joiningQueue, setJoiningQueue] = useState(false);
    const [errorCount, setErrorCount] = useState(0);
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser();
    const pollRef = useRef<number | undefined>(undefined);

    const fetchQueuePosition = useCallback(async () => {
        // Si aún está cargando el usuario, no hacer nada
        if (userLoading) {
            return;
        }

        // Verificar que el usuario esté autenticado y sea paciente
        if (!isAuthenticated || !user?.id || (user?.role !== "PACIENTE" && user?.role !== "PATIENT")) {
            setError("Usuario no autenticado o no es un paciente");
            return;
        }

        // Validar que el ID del usuario sea válido
        const userId = user.id.toString().trim();
        if (!userId || userId.length < 3) {
            setError("ID de usuario inválido");
            return;
        }
        setQueueLoading(true);
        setError(null);

        try {
            const res = await queueService.getQueuePosition(userId);
            
            // Manejar diferentes estructuras de respuesta
            const positionData = res.position || res.data || res;
            if (!positionData) {
                setPosition(null);
                setError(null);
            } else {
                setPosition(positionData);
                setError(null);
                setErrorCount(0); 
            }
            
            setLastUpdatedISO(new Date().toISOString());
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setPosition(null);
                setError(null); 
                setErrorCount(0); 
            } else if (err?.response?.status === 500) {
                setErrorCount(prev => prev + 1);
                setError("Error inesperado. Por favor, intenta más tarde.");
                setPosition(null);
            } else {
                setErrorCount(prev => prev + 1);
                setError(err?.response?.data?.message || err?.message || "Actualmente no tienes citas próximas.");
                setPosition(null);
            }
        } finally {
            setQueueLoading(false);
        }
    }, [user?.id, isAuthenticated, userLoading, user?.role]);

    // Efecto para cargar la posición cuando cambian las dependencias
    useEffect(() => {
        let mounted = true;

        if (!userLoading && isAuthenticated && user?.id && (user?.role === "PACIENTE" || user?.role === "PATIENT")) {
            fetchQueuePosition();
            // Configurar polling solo si el componente sigue montado y no hay demasiados errores
            pollRef.current = window.setInterval(() => {
                if (mounted && errorCount < 5) { // Stop polling after 5 consecutive errors
                    fetchQueuePosition();
                }
            }, pollMs);
        }

        return () => {
            mounted = false;
            if (pollRef.current) {
                window.clearInterval(pollRef.current);
            }
        };
    }, [fetchQueuePosition, pollMs, userLoading, isAuthenticated, user?.id, user?.role, errorCount]);

    // Función para resetear errores y reiniciar polling
    const resetErrors = useCallback(async () => {
        setErrorCount(0);
        setError(null);
        await fetchQueuePosition();
    }, [fetchQueuePosition]);

    // Acción para unirse a la cola
    const joinQueue = useCallback(async (appointmentId: string) => {
        if (!appointmentId) {
            throw new Error("appointmentId es requerido para unirse a la cola");
        }

        try {
            setJoiningQueue(true);
            setError(null);

            await queueService.addPatientToQueue(appointmentId);

            // Refrescar la posición después de unirse
            setTimeout(() => {
                fetchQueuePosition();
            }, 1000);

        } catch (err: any) {
            console.error("Error joining queue:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "No se pudo unir a la cola.";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setJoiningQueue(false);
        }
    }, [fetchQueuePosition]);

    // Valores derivados
    const ticketNumber = position?.queueNumber ?? null;
    const queuePosition = position?.position ?? null;
    const estimatedWaitTime = position?.estimatedWaitTimeMinutes ?? null;
    const status = position?.status ?? null;
    const doctor = position?.doctor ?? null;
    const appointment = position?.appointment ?? null;

    return {
        loading: userLoading || queueLoading,
        error,
        position,
        ticketNumber,
        queuePosition,
        estimatedWaitTime,
        status,
        doctor,
        appointment,
        lastUpdatedISO,
        refetch: resetErrors,
        joinQueue,
        joiningQueue,
    };
}