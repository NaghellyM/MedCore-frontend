// Formateo genérico de valores
export const fmt = (v?: string | number | null): string => {
    if (v == null) return "—";                 
    if (typeof v === "string") return v || "—"; 
    return String(v);                           
}
// Formateo de fecha y hora
export const fmtDateTime = (s?: string | null): string =>
    s ? new Date(s).toLocaleString() : "—"

// Formateo de tiempo relativo
export const humanizeAgo = (iso?: string): string | null => {
    if (!iso) return null;
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.max(0, Math.round(diff / 60000));
    if (mins < 1) return "actualizado justo ahora";
    if (mins === 1) return "actualizado hace 1 minuto";
    if (mins < 60) return `actualizado hace ${mins} minutos`;
    const h = Math.floor(mins / 60);
    return h === 1 ? "actualizado hace 1 hora" : `actualizado hace ${h} horas`;
}

// Mapeo de estados de cola
export const queueStatusToLabel = (status: string): string => {
    switch (status) {
        case "WAITING": return "En espera";
        case "IN_PROGRESS": return "En curso";
        case "COMPLETED": return "Completado";
        case "CANCELLED": return "Cancelado";
        case "CALLED": return "Llamado";
        default: return status;
    }
}
// Mapeo de estados de cola a variantes de UI
export const queueStatusToVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "WAITING": return "secondary";
        case "IN_PROGRESS": return "default";
        case "COMPLETED": return "outline";
        case "CANCELLED": return "destructive";
        case "CALLED": return "default";
        default: return "secondary";
    }
}

/**
 * Formatea una fecha ISO a formato local español
 * @param isoString - Fecha en formato ISO
 * @returns Fecha formateada en español (DD/MM/YYYY HH:MM)
 */
export const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Calcula la duración transcurrida desde un tiempo de inicio
 * @param startTime - Tiempo de inicio en formato ISO
 * @returns Duración formateada (ej: "5 minutos", "2h 30m")
 */
export const getTimeDuration = (startTime: string): string => {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Menos de 1 minuto";
    if (diffMins === 1) return "1 minuto";
    if (diffMins < 60) return `${diffMins} minutos`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
}

/**
 * Obtiene la etiqueta de estado en español para un estado de cola
 * @param status - Estado de la cola
 * @returns Etiqueta en español
 */
export const getQueueStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
        'CALLED': 'Llamado',
        'IN_PROGRESS': 'En Atención',
        'WAITING': 'En Espera',
        'COMPLETED': 'Completado',
        'CANCELLED': 'Cancelado'
    };
    
    return statusLabels[status] || 'Estado Desconocido';
}
