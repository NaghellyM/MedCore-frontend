// Tipos específicos para la UI de la cola del doctor
export interface QueueItemDisplay {
    id: string;
    queueNumber: number;
    patientId: string;
    appointmentId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface QueueStatsDisplay {
    waiting: number;
    inProgress: number;
    completed: number;
    cancelled?: number;
    called?: number;
}

export interface NextPatientDisplay {
    queueNumber: number;
    patientId: string;
}

export interface CurrentPatientDisplay extends QueueItemDisplay {
    // Campos adicionales específicos para el paciente actual si los hay
}

export interface DoctorQueueDisplayProps {
    items: QueueItemDisplay[];
    stats: QueueStatsDisplay;
    lastUpdated?: string;
    title?: string;
    className?: string;
    
    // Estado del siguiente paciente
    nextUp?: NextPatientDisplay | null;
    canCallNext?: boolean;
    isCallingNext?: boolean;
    onCallNext?: () => void;
    
    // Estado del paciente actual
    currentPatient?: CurrentPatientDisplay | null;
    isCompletingAttention?: boolean;
    onCompleteAttention?: (appointmentId: string) => void;
    
    // Navegación
    onBack?: () => void;
    onRefresh?: () => void;
}