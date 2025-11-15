import httpPatient from "../../infrastructure/http/httpPatient";
import type { 
    PatientMedicalHistoryResponse, 
    MedicalHistoryByIdResponse,
    CreateMedicalHistoryResponse,
    UpdateMedicalHistoryResponse 
} from "../types/medicalHistory";

// URL base para el historial medico de pacientes
const medicalHistoryUrl = `/medical-history`;

export const medicalHistoryService = {

    //Crear historia clínica de un paciente
    async createMedicalHistory(patientId: string, data: any): Promise<CreateMedicalHistoryResponse> {
        const response = await httpPatient.post<CreateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/patient/${patientId}`,
            data
        );
        return response.data;
    },

    // Obtener historial medico de un paciente por su ID desde el rol de doctor/administrador
    async getMedicalHistoryByPatientId(
        patientId: string,
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/patient/${patientId}`;      
        const response = await httpPatient.get(url, { params });
        return response.data;
    },
    
    // Obtener mi propia historia médica rol de pacientes
    async getMyMedicalHistory(
        params?: { page?: number; limit?: number }
    ): Promise<PatientMedicalHistoryResponse> {
        const url = `${medicalHistoryUrl}/me`;
        const response = await httpPatient.get(url, { params });
        return response.data;        
    },
    //obtener linea de tiempo del historial medico de un paciente por su ID
    async getMedicalHistoryTimelineByPatientId(patientId: string) {
        const response = await httpPatient.get(
            `${medicalHistoryUrl}/patient/${patientId}/timeline`
        );
        return response.data;
    },
    
    // Obtener historia clínica por ID
    async getMedicalHistoryById(historyId: string): Promise<MedicalHistoryByIdResponse> {
        const response = await httpPatient.get<MedicalHistoryByIdResponse>(
            `${medicalHistoryUrl}/${historyId}`
        );
        return response.data;
    },

    //Actualizar historia clínica
    async updateMedicalHistory(historyId: string, data: any): Promise<UpdateMedicalHistoryResponse> {
        const response = await httpPatient.patch<UpdateMedicalHistoryResponse>(
            `${medicalHistoryUrl}/${historyId}`,
            data
        );
        return response.data;
    },
}