import httpPatient from "../../infrastructure/http/httpPatient";
import type {
    CreatePrescriptionDto,
    CreatePrescriptionResponse,
    GetPrescriptionByIdResponse,
    GetPrescriptionsByPatientResponse,
    GetActivePrescriptionsResponse,
    UpdatePrescriptionStatusDto,
    UpdatePrescriptionStatusResponse,
    GetPrescriptionsParams,
} from "../types/prescription";

const prescriptionsUrl = `/prescriptions`;

export const prescriptionService = {
    // Crea una nueva prescripción/receta médica
    async createPrescription(data: CreatePrescriptionDto): Promise<CreatePrescriptionResponse> {
        const response = await httpPatient.post<CreatePrescriptionResponse>(
            prescriptionsUrl,
            data
        );
        return response.data;
    },

    // Obtiene todas las prescripciones de un paciente con paginación
    async getPrescriptionsByPatientId(
        patientId: string,
        params?: GetPrescriptionsParams
    ): Promise<GetPrescriptionsByPatientResponse> {
        const response = await httpPatient.get<GetPrescriptionsByPatientResponse>(
            `${prescriptionsUrl}/patient/${patientId}`,
            { params }
        );
        return response.data;
    },

    // Obtiene solo las prescripciones activas de un paciente
    async getActivePrescriptionsByPatientId(
        patientId: string
    ): Promise<GetActivePrescriptionsResponse> {
        const response = await httpPatient.get<GetActivePrescriptionsResponse>(
            `${prescriptionsUrl}/patient/${patientId}/active`
        );
        return response.data;
    },

    // Obtiene una prescripción específica por su ID
    async getPrescriptionById(prescriptionId: string): Promise<GetPrescriptionByIdResponse> {
        const response = await httpPatient.get<GetPrescriptionByIdResponse>(
            `${prescriptionsUrl}/${prescriptionId}`
        );
        return response.data;
    },

    // Descarga la prescripción en formato PDF
    async downloadPrescriptionPdf(prescriptionId: string): Promise<Blob> {
        const response = await httpPatient.get(
            `${prescriptionsUrl}/${prescriptionId}/pdf`,
            { responseType: 'blob' }
        );
        return response.data;
    },

    // Obtiene la URL para descargar el PDF
    getPrescriptionPdfUrl(prescriptionId: string): string {
        return `${prescriptionsUrl}/${prescriptionId}/pdf`;
    },

    // Actualiza el estado de una prescripción
    async updatePrescriptionStatus(
        prescriptionId: string,
        data: UpdatePrescriptionStatusDto
    ): Promise<UpdatePrescriptionStatusResponse> {
        const response = await httpPatient.patch<UpdatePrescriptionStatusResponse>(
            `${prescriptionsUrl}/${prescriptionId}/status`,
            data
        );
        return response.data;
    },

    // Marca una prescripción como completada
    async completePrescription(prescriptionId: string): Promise<UpdatePrescriptionStatusResponse> {
        return this.updatePrescriptionStatus(prescriptionId, { status: 'COMPLETED' });
    },

    // Cancela una prescripción
    async cancelPrescription(prescriptionId: string): Promise<UpdatePrescriptionStatusResponse> {
        return this.updatePrescriptionStatus(prescriptionId, { status: 'CANCELLED' });
    },

    // Reactiva una prescripción
    async reactivatePrescription(prescriptionId: string): Promise<UpdatePrescriptionStatusResponse> {
        return this.updatePrescriptionStatus(prescriptionId, { status: 'ACTIVE' });
    },
};
