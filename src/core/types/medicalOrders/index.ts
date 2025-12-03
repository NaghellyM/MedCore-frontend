/**
 * TIPOS PARA EL MÓDULO DE ÓRDENES MÉDICAS
 * ========================================
 * Definiciones de tipos para laboratory y radiology orders
 */

// Tipos de orden médica (backend usa mayúsculas)
export type MedicalOrderType = 'LABORATORY' | 'RADIOLOGY';

// Estados de orden médica (backend usa mayúsculas)
export type MedicalOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

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

// Información del doctor en la orden
export interface OrderDoctorInfo {
    name: string;
    specialization: string;
}

// Entidad de orden médica (según respuesta del backend)
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
    doctor?: OrderDoctorInfo;
}

// DTO para crear orden de laboratorio (según API)
export interface CreateLaboratoryOrderDto {
    patientId: string;
    doctorId: string;
    examType: string;
}

// DTO para crear orden de radiología (según API)
export interface CreateRadiologyOrderDto {
    patientId: string;
    doctorId: string;
    examType: string;
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

// Respuesta de creación de orden (backend devuelve la orden directamente)
export type CreateOrderResponse = MedicalOrderEntity;

// Respuesta para obtener órdenes por paciente (backend devuelve array directo)
export type GetOrdersByPatientResponse = MedicalOrderEntity[];

// Respuesta para obtener una orden por ID
export type GetOrderByIdResponse = MedicalOrderEntity;

// Respuesta para filtrar órdenes (backend devuelve array directo)
export type FilterOrdersResponse = MedicalOrderEntity[];

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
