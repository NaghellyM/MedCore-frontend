import httpClinical from "../../infrastructure/http/httpClinical";
import type {
    CreateLaboratoryOrderDto,
    CreateRadiologyOrderDto,
    CreateOrderResponse,
    GetOrdersByPatientResponse,
    GetOrderByIdResponse,
    FilterOrdersResponse,
    MedicalOrdersFilterParams,
} from "../types/medicalOrders";

// URL base para órdenes médicas
const medicalOrdersUrl = `/medical-orders`;

export const medicalOrdersService = {
    /**
     * Crea una nueva orden de laboratorio
     * @param data - Datos de la orden de laboratorio
     * @returns Promesa con la respuesta de creación
     */
    async createLaboratoryOrder(
        data: CreateLaboratoryOrderDto
    ): Promise<CreateOrderResponse> {
        const response = await httpClinical.post<CreateOrderResponse>(
            `${medicalOrdersUrl}/laboratory`,
            data
        );
        return response.data;
    },

    /**
     * Crea una nueva orden de radiología
     * @param data - Datos de la orden de radiología
     * @returns Promesa con la respuesta de creación
     */
    async createRadiologyOrder(
        data: CreateRadiologyOrderDto
    ): Promise<CreateOrderResponse> {
        const response = await httpClinical.post<CreateOrderResponse>(
            `${medicalOrdersUrl}/radiology`,
            data
        );
        return response.data;
    },

    /**
     * Obtiene todas las órdenes médicas de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes del paciente
     */
    async getOrdersByPatientId(
        patientId: string
    ): Promise<GetOrdersByPatientResponse> {
        if (!patientId || patientId.trim() === "") {
            throw new Error("patientId es requerido para obtener las órdenes");
        }
        
        const response = await httpClinical.get<GetOrdersByPatientResponse>(
            `${medicalOrdersUrl}/patient/${patientId}`
        );
        return response.data;
    },

    /**
     * Obtiene una orden médica por su ID
     * @param orderId - ID de la orden
     * @returns Promesa con la orden encontrada
     */
    async getOrderById(orderId: string): Promise<GetOrderByIdResponse> {
        if (!orderId || orderId.trim() === "") {
            throw new Error("orderId es requerido para obtener la orden");
        }
        
        const response = await httpClinical.get<GetOrderByIdResponse>(
            `${medicalOrdersUrl}/${orderId}`
        );
        return response.data;
    },

    /**
     * Obtiene todas las órdenes médicas con filtros opcionales
     * @param params - Parámetros de filtrado opcionales
     * @returns Promesa con las órdenes filtradas
     */
    async getOrders(
        params?: MedicalOrdersFilterParams
    ): Promise<FilterOrdersResponse> {
        const queryParams = new URLSearchParams();
        
        if (params) {
            if (params.patientId) queryParams.append("patientId", params.patientId);
            if (params.doctorId) queryParams.append("doctorId", params.doctorId);
            if (params.type) queryParams.append("type", params.type);
            if (params.status) queryParams.append("status", params.status);
            if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
            if (params.dateTo) queryParams.append("dateTo", params.dateTo);
        }
        
        const queryString = queryParams.toString();
        const url = queryString 
            ? `${medicalOrdersUrl}?${queryString}` 
            : medicalOrdersUrl;
        
        const response = await httpClinical.get<FilterOrdersResponse>(url);
        return response.data;
    },

    /**
     * Obtiene órdenes de laboratorio de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes de laboratorio
     */
    async getLaboratoryOrdersByPatient(
        patientId: string
    ): Promise<FilterOrdersResponse> {
        return this.getOrders({ patientId, type: 'laboratory' });
    },

    /**
     * Obtiene órdenes de radiología de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes de radiología
     */
    async getRadiologyOrdersByPatient(
        patientId: string
    ): Promise<FilterOrdersResponse> {
        return this.getOrders({ patientId, type: 'radiology' });
    },

    /**
     * Obtiene órdenes de un doctor específico
     * @param doctorId - ID del doctor
     * @returns Promesa con las órdenes del doctor
     */
    async getOrdersByDoctorId(
        doctorId: string
    ): Promise<FilterOrdersResponse> {
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
    ): Promise<FilterOrdersResponse> {
        return this.getOrders({ patientId, status: 'pending' });
    },

    /**
     * Obtiene órdenes completadas de un paciente
     * @param patientId - ID del paciente
     * @returns Promesa con las órdenes completadas
     */
    async getCompletedOrdersByPatient(
        patientId: string
    ): Promise<FilterOrdersResponse> {
        return this.getOrders({ patientId, status: 'completed' });
    },
};
