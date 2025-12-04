import httpPatient from "../../infrastructure/http/httpPatient";
import { DocumentValidator } from "../validators";

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
    DocumentValidator.validateDocumentId(documentId);
    
    const response = await httpPatient.get(
      `${documentsUrl}/${documentId}`
    );
    return response.data;
  },

  //Obtener documentos por ID de paciente
  async getDocumentsByPatientId(patientId: string) {
    DocumentValidator.validatePatientId(patientId);
    
    const response = await httpPatient.get(
      `${documentsUrl}/patient/${patientId}`
    );
    return response.data;
  },

  // Subir uno o más documentos asociados a un diagnóstico de un paciente
  async uploadDocuments({ patientId, diagnosticId, files }: UploadDocumentsParams) {
    
    // Validar todos los parámetros usando el validador centralizado
    DocumentValidator.validateUploadParams({ patientId, diagnosticId, files });

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("diagnosticId", diagnosticId);

    for (const file of files) {
  formData.append("documents", file); // <- NOMBRE CORRECTO PARA MULTER
 }
    
    const response = await httpPatient.post(`${documentsUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response;
  },

  // Descargar archivo (en blob).
  async downloadDocument(documentId: string) {
    DocumentValidator.validateDocumentId(documentId);
    
    return httpPatient.get(`${documentsUrl}/${documentId}`, {
      responseType: "blob",
    });
  },

  // Descargar una versión específica.
  async downloadDocumentVersion(documentId: string, version: number) {
    DocumentValidator.validateVersionDownload(documentId, version);
    
    return httpPatient.get(`${documentsUrl}/download/${documentId}/version/${version}`, {
      responseType: "blob",
    });
  },

  //Eliminar un documento por su ID
  async deleteDocument(documentId: string) {
    DocumentValidator.validateDocumentId(documentId);
    
    const response = await httpPatient.delete(
      `${documentsUrl}/${documentId}`
    );
    return response.data;
  }

};
