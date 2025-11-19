export type QueuePatientStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "CALLED";

export interface QueuePositionDTO {
    ticketId: string;
    doctorId: string;
    status: QueuePatientStatus;
    queueNumber: number;
    position: number;
    estimatedWaitTimeMinutes: number;
    doctor: {
        name: string;
        specialty: string;
        departament: string;
    };
    appointment: {
        id: string;
        scheduledAt: string;
        status: string;
    };
    
}

export interface QueuePositionResponse {
    message: string;
    position: QueuePositionDTO;
}

export interface QueueItemDTO {
    id: string;
    appointmentId: string;
    patientId: string;
    doctorId: string;
    queueNumber: number;
    status: QueuePatientStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorCurrentQueueResponse {
    message: string;
    queue: QueueItemDTO[];
}

export interface CallNextPatientResponse {
    message: string;
    queue: QueueItemDTO; 
}

export type QueuePatient = {
    id: string;
    queueNumber: number;
    patientId: string;
    appointmentId: string;
    status: QueuePatientStatus;
    createdAt: string;
    updatedAt: string;
};

export type CurrentPatientCardProps = {
    patient: QueuePatient | null;
    onComplete?: (queueItemId: string) => Promise<void> | void;
    completing?: boolean;
    className?: string;
    debug?: boolean;
};