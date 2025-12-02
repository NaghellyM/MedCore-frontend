/**
 * TIPOS PARA EL MÓDULO DE ÓRDENES MÉDICAS
 * ========================================
 * Definiciones de tipos para laboratory y radiology orders
 */

// Tipos de orden médica
export type MedicalOrderType = 'laboratory' | 'radiology';

// Estados de orden médica
export type MedicalOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Tipos de examen de laboratorio
export type LaboratoryExamType = 
    | 'hemograma'
    | 'glucosa'
    | 'perfil_lipidico'
    | 'funcion_hepatica'
    | 'funcion_renal'
    | 'electrolitos'
    | 'coagulacion'
    | 'urinalisis'
    | 'hemoglobina_glicosilada'
    | 'tiroides'
    | 'marcadores_cardiacos'
    | 'cultivo'
    | string;

// Tipos de examen de radiología
export type RadiologyExamType = 
    | 'radiografia'
    | 'tomografia'
    | 'resonancia_magnetica'
    | 'ecografia'
    | 'mamografia'
    | 'densitometria'
    | 'angiografia'
    | 'fluoroscopia'
    | string;

// Entidad de orden médica
export interface MedicalOrderEntity {
    id: string;
    patientId: string;
    doctorId: string;
    type: MedicalOrderType;
    examType: string;
    status: MedicalOrderStatus;
    notes?: string;
    results?: string;
    createdAt: string;
    updatedAt: string;
}

// DTO para crear orden de laboratorio
export interface CreateLaboratoryOrderDto {
    patientId: string;
    doctorId: string;
    examType: LaboratoryExamType;
    notes?: string;
    urgency?: 'routine' | 'urgent' | 'stat';
    instructions?: string;
}

// DTO para crear orden de radiología
export interface CreateRadiologyOrderDto {
    patientId: string;
    doctorId: string;
    examType: RadiologyExamType;
    notes?: string;
    urgency?: 'routine' | 'urgent' | 'stat';
    bodyPart?: string;
    contrast?: boolean;
    instructions?: string;
}

// Filtros para búsqueda de órdenes
export interface MedicalOrdersFilterParams {
    patientId?: string;
    doctorId?: string;
    type?: MedicalOrderType;
    status?: MedicalOrderStatus;
    dateFrom?: string;
    dateTo?: string;
}

// Respuesta de creación de orden
export interface CreateOrderResponse {
    message?: string;
    order: MedicalOrderEntity;
}

// Respuesta para obtener órdenes por paciente
export interface GetOrdersByPatientResponse {
    message?: string;
    orders: MedicalOrderEntity[];
    total?: number;
}

// Respuesta para obtener una orden por ID
export interface GetOrderByIdResponse {
    message?: string;
    order: MedicalOrderEntity;
}

// Respuesta para filtrar órdenes
export interface FilterOrdersResponse {
    message?: string;
    orders: MedicalOrderEntity[];
    total?: number;
    pagination?: {
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Respuesta de actualización de orden
export interface UpdateOrderResponse {
    message?: string;
    order: MedicalOrderEntity;
}

// DTO para actualizar orden
export interface UpdateMedicalOrderDto {
    status?: MedicalOrderStatus;
    results?: string;
    notes?: string;
}
