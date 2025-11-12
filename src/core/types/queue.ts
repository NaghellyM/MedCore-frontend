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
