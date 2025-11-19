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
    async createMedicalHistory(patientId: string, _formData?: any): Promise<CreateMedicalHistoryResponse> {
        const response = await httpPatient.post<CreateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/patient/${patientId}`,
            {} 
        );
        
        return response.data;
    },

    async getMedicalHistoryByPatientId(
        patientId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/patient/${patientId}`;      
        const response = await httpPatient.get(url, { params });
        return response.data;
    },
    
    async getMyMedicalHistory(
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/me`;
        const response = await httpPatient.get(url, { params });
        return response.data;        
    },

    async getMedicalHistoryTimelineByPatientId(patientId: string) {
        const response = await httpPatient.get(
            `${medicalHistoryUrl}/patient/${patientId}/timeline`
        );
        return response.data;
    },
    
    async getMedicalHistoryById(historyId: string): Promise<MedicalHistoryByIdResponse> {
        const response = await httpPatient.get<MedicalHistoryByIdResponse>(
            `${medicalHistoryUrl}/${historyId}`
        );
        return response.data;
    },

    async updateMedicalHistory(historyId: string, data: any): Promise<UpdateMedicalHistoryResponse> {
        const response = await httpPatient.patch<UpdateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/${historyId}`,
            data
        );
        return response.data;
    },

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
