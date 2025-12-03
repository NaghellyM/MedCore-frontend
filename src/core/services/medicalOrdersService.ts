import httpClinical from "../../infrastructure/http/httpClinical";
import type {
    CreateLaboratoryOrderDto,
    CreateRadiologyOrderDto,
    MedicalOrderEntity,
    MedicalOrdersFilterParams,
} from "../types/medicalOrders";

// URL base para órdenes médicas
const medicalOrdersUrl = `/medical-orders`;

export const medicalOrdersService = {
    /**
     * Crea una nueva orden de laboratorio
     * @param data - Datos de la orden de laboratorio
     * @returns Promesa con la orden creada
     */
    async createLaboratoryOrder(
        data: CreateLaboratoryOrderDto
    ): Promise<MedicalOrderEntity> {
        const response = await httpClinical.post<MedicalOrderEntity>(
            `${medicalOrdersUrl}/laboratory`,
            data
        );
        return response.data;
    },

    /**
     * Crea una nueva orden de radiología
     * @param data - Datos de la orden de radiología
     * @returns Promesa con la orden creada
     */
    async createRadiologyOrder(
        data: CreateRadiologyOrderDto
    ): Promise<MedicalOrderEntity> {
        const response = await httpClinical.post<MedicalOrderEntity>(
            `${medicalOrdersUrl}/radiology`,
            data
        );
        return response.data;
    },

    /**
     * Obtiene todas las órdenes médicas de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes del paciente (array directo)
     */
    async getOrdersByPatientId(
        patientId: string
    ): Promise<MedicalOrderEntity[]> {
        if (!patientId || patientId.trim() === "") {
            throw new Error("patientId es requerido para obtener las órdenes");
        }
        
        const response = await httpClinical.get<MedicalOrderEntity[]>(
            `${medicalOrdersUrl}/patient/${patientId}`
        );
        return response.data;
    },

    /**
     * Obtiene una orden médica por su ID
     * @param orderId - ID de la orden
     * @returns Promesa con la orden encontrada
     */
    async getOrderById(orderId: string): Promise<MedicalOrderEntity> {
        if (!orderId || orderId.trim() === "") {
            throw new Error("orderId es requerido para obtener la orden");
        }
        
        const response = await httpClinical.get<MedicalOrderEntity>(
            `${medicalOrdersUrl}/${orderId}`
        );
        return response.data;
    },

    /**
     * Obtiene todas las órdenes médicas con filtros opcionales
     * @param params - Parámetros de filtrado opcionales
     * @returns Promesa con las órdenes filtradas (array directo)
     */
    async getOrders(
        params?: MedicalOrdersFilterParams
    ): Promise<MedicalOrderEntity[]> {
        const queryParams = new URLSearchParams();
        
        if (params) {
            if (params.patientId) queryParams.append("patientId", params.patientId);
            if (params.doctorId) queryParams.append("doctorId", params.doctorId);
            if (params.type) queryParams.append("type", params.type);
            if (params.status) queryParams.append("status", params.status);
        }
        
        const queryString = queryParams.toString();
        const url = queryString 
            ? `${medicalOrdersUrl}?${queryString}` 
            : medicalOrdersUrl;
        
        const response = await httpClinical.get<MedicalOrderEntity[]>(url);
        return response.data;
    },

    /**
     * Obtiene órdenes de laboratorio de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes de laboratorio
     */
    async getLaboratoryOrdersByPatient(
        patientId: string
    ): Promise<MedicalOrderEntity[]> {
        return this.getOrders({ patientId, type: 'LABORATORY' });
    },

    /**
     * Obtiene órdenes de radiología de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes de radiología
     */
    async getRadiologyOrdersByPatient(
        patientId: string
    ): Promise<MedicalOrderEntity[]> {
        return this.getOrders({ patientId, type: 'RADIOLOGY' });
    },

    /**
     * Obtiene órdenes de un doctor específico
     * @param doctorId - ID del doctor
     * @returns Promesa con las órdenes del doctor
     */
    async getOrdersByDoctorId(
        doctorId: string
    ): Promise<MedicalOrderEntity[]> {
        if (!doctorId || doctorId.trim() === "") {
            throw new Error("doctorId es requerido para obtener las órdenes");
        }
        
        return this.getOrders({ doctorId });
    },

    /**
     * Obtiene órdenes pendientes de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes pendientes
     */
    async getPendingOrdersByPatient(
        patientId: string
    ): Promise<MedicalOrderEntity[]> {
        return this.getOrders({ patientId, status: 'PENDING' });
    },

    /**
     * Obtiene órdenes completadas de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes completadas
     */
    async getCompletedOrdersByPatient(
        patientId: string
    ): Promise<MedicalOrderEntity[]> {
        return this.getOrders({ patientId, status: 'COMPLETED' });
    },
};
