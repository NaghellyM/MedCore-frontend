export type QueueStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface QueuePositionDTO {
    ticketId: string;
    doctorId: string;
    status: QueueStatus;
    queueNumber: number;
    position: number;
    estimatedWaitTimeMinutes: number;
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
    status: QueueStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorCurrentQueueResponse {
    message: string;
    queue: QueueItemDTO[];
}
