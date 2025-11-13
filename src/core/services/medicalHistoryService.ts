import http from "../../infrastructure/http/httpSecurity";
import { ApiUrls } from "../../environments/environments";

const medicalHistoryUrl = `${ApiUrls.msPatient}/medical-history`;

export const medicalHistoryService = {

    // Obtener el historial medico de un paciente por su ID
    async getMedicalHistoryByPatientId(patientId: string) {
        const response = await http.get(
            `${medicalHistoryUrl}/patient/${patientId}`
        )
        return response.data
    },

    
}