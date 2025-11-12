import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { queueService } from "../../../core/services/queueService";
import type { QueueItemDTO, QueueStatus } from "../../../core/types/queue";

type UseDoctorCurrentQueueOptions = {
    pollMs?: number; 
};

export function useDoctorCurrentQueue(doctorId: string, options?: UseDoctorCurrentQueueOptions) {
    const { pollMs = 15000 } = options || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<QueueItemDTO[]>([]);
    const [lastUpdatedISO, setLastUpdatedISO] = useState<string | undefined>(undefined);
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
        const acc: Record<QueueStatus, number> = {
            WAITING: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0,
        };
        for (const it of items) acc[it.status] = (acc[it.status] ?? 0) + 1;
        return acc;
    }, [items]);

    const total = items.length;
    const waitingList = useMemo(() => items.filter(i => i.status === "WAITING"), [items]);
    const nextUp = waitingList[0] ?? null; 

    return {
        loading,
        error,
        items,            
        totalsByStatus,
        total,
        nextUp,
        lastUpdatedISO,
        refetch: fetchQueue,
    };
}
