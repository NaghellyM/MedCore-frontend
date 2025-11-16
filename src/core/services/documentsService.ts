import httpPatient from "../../infrastructure/http/httpPatient";

// Interfaces para los parámetros del servicio
export interface UploadDocumentsParams {
  patientId: string;
  diagnosticId: string;
  files: File[];
}

// Url base para documentos
const documentsUrl = "/documents";


export const documentsService = {

  // Obtener documentos por su ID
  async getDocumentsById(documentId: string) {
    const response = await httpPatient.get(
      `${documentsUrl}/${documentId}`
    );
    return response.data;
  },

  //Obtener documentos por ID de paciente
  async getDocumentsByPatientId(patientId: string) {
    const response = await httpPatient.get(
      `${documentsUrl}/patient/${patientId}`
    );
    return response.data;
  },

  // Subir uno o más documentos asociados a un diagnóstico de un paciente
  async uploadDocuments({ patientId, diagnosticId, files }: UploadDocumentsParams) {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("diagnosticId", diagnosticId);

    for (const file of files) {
      formData.append("files", file);
    }
    return httpPatient.post(`${documentsUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  // Descargar archivo (en blob).
  async downloadDocument(documentId: string) {
    return httpPatient.get(`${documentsUrl}/${documentId}`, {
      responseType: "blob",
    });
  },

  // Descargar una versión específica.
  async downloadDocumentVersion(documentId: string, version: number) {
    return httpPatient.get(`${documentsUrl}/download/${documentId}/version/${version}`, {
      responseType: "blob",
    });
  },

  //Eliminar un documento por su ID
  async deleteDocument(documentId: string) {
    const response = await httpPatient.delete(
      `${documentsUrl}/${documentId}`
    );
    return response.data;
  }

};