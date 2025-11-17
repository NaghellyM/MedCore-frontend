import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { queueService } from "../../services/queueService";
import { useCurrentUser } from "../auth";
import type { QueueItemDTO, QueuePatientStatus } from "../../types/queue";

interface UseMyDoctorQueueOptions {
    pollMs?: number;
}

interface UseMyDoctorQueueReturn {
    loading: boolean;
    error: string | null;
    items: QueueItemDTO[];
    totalsByStatus: Record<QueuePatientStatus, number>;
    total: number;
    nextUp: QueueItemDTO | null;
    currentPatient: QueueItemDTO | null;
    lastUpdatedISO: string | undefined;
    refetch: () => Promise<void>;
    callNext: () => Promise<QueueItemDTO>;
    callingNext: boolean;
    completeAttention: (queueItemId: string) => Promise<any>;
    completing: boolean;
}

/**
 * Hook para obtener la cola de pacientes del doctor autenticado
 * Responsabilidad única: Gestionar el estado y obtención de la cola del doctor logueado
 */
export function useMyDoctorQueue(
    options: UseMyDoctorQueueOptions = {}
): UseMyDoctorQueueReturn {
    const { pollMs = 15000 } = options;
    const [items, setItems] = useState<QueueItemDTO[]>([]);
    const [queueLoading, setQueueLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdatedISO, setLastUpdatedISO] = useState<string | undefined>(undefined);
    const [callingNext, setCallingNext] = useState(false);
    const [completing, setCompleting] = useState(false);
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser();
    const pollRef = useRef<number | undefined>(undefined);

    const fetchQueue = useCallback(async () => {
        // Si aún está cargando el usuario, no hacer nada
        if (userLoading) {
            return;
        }

        // Verificar que el usuario esté autenticado y sea doctor
        if (!isAuthenticated || !user?.id || (user?.role !== "MEDICO" && user?.role !== "MÉDICO")) {
            setError("Usuario no autenticado o no es un doctor");
            return;
        }

        setQueueLoading(true);
        setError(null);

        try {
            const res = await queueService.getCurrentQueueByDoctorId(user.id);
            const sorted = [...res.queue].sort((a, b) => a.queueNumber - b.queueNumber);
            setItems(sorted);
            setLastUpdatedISO(new Date().toISOString());
        } catch (err: any) {
            console.error("Error fetching doctor queue:", err);
            setError(err?.message ?? "No se pudo obtener la cola del doctor.");
            setItems([]);
        } finally {
            setQueueLoading(false);
        }
    }, [user?.id, isAuthenticated, userLoading, user?.role]);

    // Efecto para cargar la cola cuando cambian las dependencias
    useEffect(() => {
        let mounted = true;
        
        if (!userLoading && isAuthenticated && user?.id && (user?.role === "MEDICO" || user?.role === "MÉDICO")) {
            fetchQueue();
            // Configurar polling
            pollRef.current = window.setInterval(() => {
                if (mounted) fetchQueue();
            }, pollMs);
        }

        return () => {
            mounted = false;
            if (pollRef.current) {
                window.clearInterval(pollRef.current);
            }
        };
    }, [fetchQueue, pollMs, userLoading, isAuthenticated, user?.id, user?.role]);

    // Cálculos derivados
    const totalsByStatus = useMemo(() => {
        const acc: Record<QueuePatientStatus, number> = {
            WAITING: 0, 
            IN_PROGRESS: 0, 
            COMPLETED: 0, 
            CANCELLED: 0, 
            CALLED: 0,
        };
        for (const item of items) {
            acc[item.status] = (acc[item.status] ?? 0) + 1;
        }
        return acc;
    }, [items]);

    const total = items.length;
    
    const waitingList = useMemo(() => 
        items.filter(i => i.status === "WAITING"), 
        [items]
    );
    
    const nextUp = waitingList[0] ?? null;

    const currentPatient = useMemo(() => {
        return items.find(i => i.status === "CALLED" || i.status === "IN_PROGRESS") ?? null;
    }, [items]);

    // Acción para llamar al siguiente paciente
    const callNext = useCallback(async () => {
        if (!user?.id) {
            throw new Error("Usuario no autenticado");
        }

        try {
            setCallingNext(true);
            const res = await queueService.callNextPatient(user.id);
            const called = res.queue;

            // Actualizar el estado local
            setItems(prev => {
                const idx = prev.findIndex(x => x.id === called.id);
                if (idx >= 0) {
                    const clone = [...prev];
                    clone[idx] = called;
                    return clone.sort((a, b) => a.queueNumber - b.queueNumber);
                }
                return [...prev, called].sort((a, b) => a.queueNumber - b.queueNumber);
            });

            setLastUpdatedISO(new Date().toISOString());
            
            // Refrescar la cola después de un breve delay
            setTimeout(() => {
                fetchQueue();
            }, 500);
            
            return called;
        } catch (err: any) {
            console.error("Error calling next patient:", err);
            throw new Error(err?.message ?? "No se pudo llamar al siguiente paciente.");
        } finally {
            setCallingNext(false);
        }
    }, [user?.id, fetchQueue]);

    // Acción para completar atención
    const completeAttention = useCallback(async (queueItemId: string) => {
        try {
            setCompleting(true);
            const res = await queueService.markCurrentPatientAsAttended(queueItemId);

            // Actualizar el estado local
            setItems(prev => {
                return prev.map(item =>
                    item.id === queueItemId
                        ? { ...item, status: "COMPLETED" as QueuePatientStatus }
                        : item
                );
            });

            setLastUpdatedISO(new Date().toISOString());
            
            // Refrescar la cola después de un breve delay
            setTimeout(() => {
                fetchQueue();
            }, 500);

            return res;
        } catch (err: any) {
            console.error('Error completing attention:', err);
            throw new Error(err?.response?.data?.message || err?.message || "No se pudo completar la atención del paciente.");
        } finally {
            setCompleting(false);
        }
    }, [fetchQueue]);

    return {
        loading: userLoading || queueLoading,
        error,
        items,
        totalsByStatus,
        total,
        nextUp,
        currentPatient,
        lastUpdatedISO,
        refetch: fetchQueue,
        callNext,
        callingNext,
        completeAttention,
        completing,
    };
}