import httpPatient from "../../infrastructure/http/httpPatient";
import type { 
    PatientMedicalHistoryResponse, 
    MedicalHistoryByIdResponse,
    CreateMedicalHistoryResponse,
    UpdateMedicalHistoryResponse,
    AllMedicalHistoriesResponse
} from "../types/medicalHistory";

const medicalHistoryUrl = `/medical-history`;

export const medicalHistoryService = {
    // Crea o recupera el historial médico para un paciente
    async createMedicalHistory(patientId: string, _formData?: any): Promise<CreateMedicalHistoryResponse> {
        const response = await httpPatient.post<CreateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/patient/${patientId}`,
            {} 
        );
        return response.data;
    },

    // Obtiene el historial médico de un paciente específico
    async getMedicalHistoryByPatientId(
        patientId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/patient/${patientId}`;      
        const response = await httpPatient.get(url, { params });
        return response.data;
    },
    
    // Obtiene el historial médico del paciente autenticado
    async getMyMedicalHistory(
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/me`;
        const response = await httpPatient.get(url, { params });
        return response.data;        
    },

    // Obtiene el timeline de eventos médicos de un paciente específico
    async getMedicalHistoryTimelineByPatientId(
        patientId: string,
        params?: { page?: number; limit?: number }
    ) {
        const response = await httpPatient.get(
            `${medicalHistoryUrl}/patient/${patientId}/timeline`,
            { params }
        );
        return response.data;
    },

    // Obtiene el timeline de eventos médicos del paciente autenticado
    async getMyMedicalHistoryTimeline(
        params?: { page?: number; limit?: number }
    ) {
        const response = await httpPatient.get(
            `${medicalHistoryUrl}/me/timeline`,
            { params }
        );
        return response.data;
    },
    
    // Obtiene un historial médico por su ID
    async getMedicalHistoryById(historyId: string): Promise<MedicalHistoryByIdResponse> {
        const response = await httpPatient.get<MedicalHistoryByIdResponse>(
            `${medicalHistoryUrl}/${historyId}`
        );
        return response.data;
    },

    // Actualiza un registro de historial médico
    async updateMedicalHistory(historyId: string, data: any): Promise<UpdateMedicalHistoryResponse> {
        const response = await httpPatient.patch<UpdateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/${historyId}`,
            data
        );
        return response.data;
    },

    // Obtiene todos los historiales médicos con paginación
    async getAllMedicalHistories(
        params?: { page?: number; limit?: number }
    ): Promise<AllMedicalHistoriesResponse> {
        const response = await httpPatient.get<AllMedicalHistoriesResponse>(
            `${medicalHistoryUrl}`,
            { params }
        );
        return response.data;
    }
}
