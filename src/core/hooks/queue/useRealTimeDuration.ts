import { useState, useEffect } from "react";
import { getTimeDuration } from "../../utils/format";

/**
 * Hook personalizado para actualizar la duración en tiempo real
 * @param startTime - Tiempo de inicio en formato ISO string
 * @returns La duración formateada que se actualiza cada minuto
 */
export function useRealTimeDuration(startTime: string | null): string {
    const [duration, setDuration] = useState<string>("");

    useEffect(() => {
        if (!startTime) {
            setDuration("");
            return;
        }

        const updateDuration = () => {
            setDuration(getTimeDuration(startTime));
        };

        updateDuration();
        const interval = setInterval(updateDuration, 60000);

        return () => clearInterval(interval);
    }, [startTime]);

    return duration;
}