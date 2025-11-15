/**
 * ÍNDICE DEL DOMINIO QUEUE
 * =======================
 * Exportaciones centralizadas para tipos de cola
 */

export type {
    QueuePatientStatus,
    QueuePositionDTO,
    QueuePositionResponse,
    QueueItemDTO,
    DoctorCurrentQueueResponse,
    CallNextPatientResponse,
    QueuePatient,
    CurrentPatientCardProps
} from './queue';

export type {
    QueueItemDisplay,
    QueueStatsDisplay,
    NextPatientDisplay,
    CurrentPatientDisplay,
    DoctorQueueDisplayProps
} from './queueDisplay';