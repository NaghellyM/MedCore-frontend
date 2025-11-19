import type { QueueItemDTO, QueuePatientStatus } from '../types/queue';

// Interfaz para elementos de cola mostrados en la UI
export interface QueueItemDisplay {
    id: string;
    queueNumber: number;
    patientId: string;
    appointmentId: string;
    status: QueuePatientStatus;
    createdAt: string;
    updatedAt: string;
}


// Interfaz para información del siguiente paciente
export interface NextPatientDisplay {
    queueNumber: number;
    patientId: string;
}

// Convuerte un QueueItemDTO a QueueItemDisplay
export function transformQueueItem(item: QueueItemDTO): QueueItemDisplay {
    return {
        id: item.id,
        queueNumber: item.queueNumber,
        patientId: item.patientId,
        appointmentId: item.appointmentId,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

 //  un array de QueueItemDTO a QueueItemDisplay
export function transformQueueItems(items: QueueItemDTO[]): QueueItemDisplay[] {
    return items.map(transformQueueItem);
}

//Transforma un QueueItemDTO a NextPatientDisplay
export function transformNextPatient(item: QueueItemDTO | null): NextPatientDisplay | null {
    if (!item) return null;

    return {
        queueNumber: item.queueNumber,
        patientId: item.patientId,
    };
}

// Transforma un QueueItemDTO a CurrentPatientDisplay (que es igual a QueueItemDisplay)
export function transformCurrentPatient(item: QueueItemDTO | null): QueueItemDisplay | null {
    if (!item) return null;
    return transformQueueItem(item);
}

/**
 * Utilidad genérica para mapear propiedades específicas de un objeto
 */
export function mapObjectProperties<T, R>(
    source: T | null,
    mapper: (item: T) => R
): R | null {
    if (!source) return null;
    return mapper(source);
}

/**
 * Utilidad para mapear arrays con transformación
 */
export function mapArrayItems<T, R>(
    source: T[],
    mapper: (item: T) => R
): R[] {
    return source.map(mapper);
}