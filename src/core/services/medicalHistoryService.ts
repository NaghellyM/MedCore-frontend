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
    async createMedicalHistory(patientId: string, data: any): Promise<CreateMedicalHistoryResponse> {
        const transformedData = { ...data };
        
        if (data.diagnostics && typeof data.diagnostics === 'object' && !Array.isArray(data.diagnostics)) {
            const diagnosticObject = {
                title: data.diagnostics.primaryDiagnosis || "Diagnóstico",
                description: data.diagnostics.diagnosticImpression || null,
                symptoms: data.diagnostics.symptoms || null,
                diagnosis: data.diagnostics.primaryDiagnosis || null,
                treatment: null,
                observations: data.diagnostics.clinicalFindings || null,
                prescriptions: null,
                physicalExam: data.physicalExam ? JSON.stringify(data.physicalExam) : null,
                vitalSigns: data.physicalExam?.vitalSigns ? JSON.stringify(data.physicalExam.vitalSigns) : null,
                consultDate: new Date().toISOString(),
                nextAppointment: null,
                state: 'ACTIVE',
                customFields: data.diagnostics.secondaryDiagnosis ? {
                    secondaryDiagnosis: data.diagnostics.secondaryDiagnosis
                } : null,
            };
            
            transformedData.diagnostics = [diagnosticObject];
        }
        
        const response = await httpPatient.post<CreateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/patient/${patientId}`,
            transformedData
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
