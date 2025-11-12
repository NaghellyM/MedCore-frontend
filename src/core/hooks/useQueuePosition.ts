// modules/queue/hooks/useQueuePosition.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { queueService } from "../../core/services/queueService";
import type { QueuePositionDTO } from "../types/queue";

type UseQueuePositionOptions = {
    pollMs?: number;       
    enableLocalCountdown?: boolean;
};

export function useQueuePosition(ticketId: string, options?: UseQueuePositionOptions) {
    const { pollMs = 15000, enableLocalCountdown = true } = options || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<QueuePositionDTO | null>(null);
    const [lastUpdatedISO, setLastUpdatedISO] = useState<string | undefined>(undefined);

    const [etaBase, setEtaBase] = useState<number>(0);
    const lastTickRef = useRef<number>(Date.now());

    useEffect(() => {
        let mounted = true;
        let pollId: number | undefined;

        const fetcher = async () => {
            try {
                setError(null);
                const res = await queueService.getQueuePosition(ticketId);
                if (!mounted) return;
                setData(res.position);
                setEtaBase(res.position.estimatedWaitTimeMinutes);
                setLastUpdatedISO(new Date().toISOString());
                setLoading(false);
                lastTickRef.current = Date.now();
            } catch (e: any) {
                if (!mounted) return;
                setError(e?.message ?? "Error al obtener la posición en la cola.");
                setLoading(false);
            }
        };

        fetcher();
        pollId = window.setInterval(fetcher, pollMs);

        return () => {
            mounted = false;
            if (pollId) window.clearInterval(pollId);
        };
    }, [ticketId, pollMs]);

    const [etaLocal, setEtaLocal] = useState<number>(0);
    useEffect(() => {
        if (!enableLocalCountdown) return;
        const id = window.setInterval(() => {
            const elapsedMs = Date.now() - lastTickRef.current;
            const elapsedMins = Math.floor(elapsedMs / 60000);
            setEtaLocal(Math.max(0, etaBase - elapsedMins));
        }, 1000);
        return () => window.clearInterval(id);
    }, [etaBase, enableLocalCountdown]);

    const derived = useMemo(() => {
        if (!data) return null;
        const aheadCount = Math.max(0, data.position - 1);
        const etaMinutes = enableLocalCountdown ? etaLocal : data.estimatedWaitTimeMinutes;

        return {
            ticketNumber: data.queueNumber ?? data.ticketId, 
            aheadCount,
            etaMinutes,
            status: data.status,
            lastUpdatedISO,
        };
    }, [data, etaLocal, enableLocalCountdown, lastUpdatedISO]);

    return {
        loading,
        error,
        derived, 
        raw: data, 
        lastUpdatedISO,
        refetch: async () => {
            const res = await queueService.getQueuePosition(ticketId);
            setData(res.position);
            setEtaBase(res.position.estimatedWaitTimeMinutes);
            setLastUpdatedISO(new Date().toISOString());
            lastTickRef.current = Date.now();
        },
    };
}
