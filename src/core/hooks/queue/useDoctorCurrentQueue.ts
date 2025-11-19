import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { queueService } from "../../../core/services/queueService";
import type { QueueItemDTO, QueuePatientStatus } from "../../../core/types/queue";

type UseDoctorCurrentQueueOptions = {
    pollMs?: number;
};

export function useDoctorCurrentQueue(doctorId: string, options?: UseDoctorCurrentQueueOptions) {
    const { pollMs = 15000 } = options || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<QueueItemDTO[]>([]);
    const [lastUpdatedISO, setLastUpdatedISO] = useState<string | undefined>(undefined);
    const [callingNext, setCallingNext] = useState(false);
    const [completing, setCompleting] = useState(false);
    const pollRef = useRef<number | undefined>(undefined);

    const fetchQueue = useCallback(async () => {
        try {
            setError(null);
            const res = await queueService.getCurrentQueueByDoctorId(doctorId);
            const sorted = [...res.queue].sort((a, b) => a.queueNumber - b.queueNumber);
            setItems(sorted);
            setLastUpdatedISO(new Date().toISOString());
            setLoading(false);
        } catch (e: any) {
            setError(e?.message ?? "Error al obtener la cola del doctor.");
            setLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        let mounted = true;
        fetchQueue();
        pollRef.current = window.setInterval(() => mounted && fetchQueue(), pollMs);
        return () => {
            mounted = false;
            if (pollRef.current) window.clearInterval(pollRef.current);
        };
    }, [fetchQueue, pollMs]);

    const totalsByStatus = useMemo(() => {
        const acc: Record<QueuePatientStatus, number> = {
            WAITING: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0, CALLED: 0,
        };
        for (const it of items) acc[it.status] = (acc[it.status] ?? 0) + 1;
        return acc;
    }, [items]);

    const total = items.length;
    const waitingList = useMemo(() => items.filter(i => i.status === "WAITING"), [items]);
    const nextUp = waitingList[0] ?? null;

    const currentPatient = useMemo(() => {
        return items.find(i => i.status === "CALLED" || i.status === "IN_PROGRESS") ?? null;
    }, [items]);

    const callNext = useCallback(async () => {
        try {
            setCallingNext(true);
            const res = await queueService.callNextPatient(doctorId);
            const called = res.queue; 

            
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
            fetchQueue();
            return called;
        } catch (e: any) {
            throw new Error(e?.message ?? "No se pudo llamar al siguiente paciente.");
        } finally {
            setCallingNext(false);
        }
    }, [doctorId, fetchQueue]);

    
    const completeAttention = useCallback(async (queueItemId: string) => {
        try {
            setCompleting(true);           
            const res = await queueService.markCurrentPatientAsAttended(queueItemId);

            setItems(prev => {
                return prev.map(item =>
                    item.id === queueItemId
                        ? { ...item, status: "COMPLETED" as QueuePatientStatus }
                        : item
                );
            });

            setLastUpdatedISO(new Date().toISOString());
            setTimeout(() => {
                fetchQueue();
            }, 500);

            return res;
        } catch (e: any) {
            console.error('Error al completar la atención:', {
                error: e,
                queueItemId,
                message: e?.message,
                status: e?.response?.status,
            });
            throw new Error(e?.response?.data?.message || e?.message || "No se pudo completar la atención del paciente.");
        } finally {
            setCompleting(false);
        }
    }, [fetchQueue]);

    return {
        loading,
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