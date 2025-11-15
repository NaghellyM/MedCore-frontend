import http from "../../infrastructure/http/http"
const BASE_URL = ApiUrls.msPatient;
import { ApiUrls } from "../../environments/environments";
import { id } from "date-fns/locale";

export const documentsService = {
  /**
   * Subir uno o varios documentos asociados a un diagnóstico.
   */
  async uploadDocuments({ patientId, diagnosticId, files }) {
    const formData = new FormData();
    patientId = "69090372f2a08c7fe006739a";
    diagnosticId =  "74b89764-7af0-4630-b6d4-d07f1bd66ebf";
    formData.append("patientId", patientId);
    formData.append("diagnosticId", diagnosticId);

    for (const file of files) {
      formData.append("documents", file);
    }

    return http.post(`${BASE_URL}/documents/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Obtener todos los documentos de un paciente.
   */
  async getDocumentsByPatient(patientId: string) {
    return http.get(`${BASE_URL}/documents/patient/${patientId}`);
  },

  /**
   * Obtener todas las versiones de un documento.
   */
  async getDocumentVersions(documentId: string) {
    return http.get(`${BASE_URL}/${documentId}/versions`);
  },

  /**
   * Descargar archivo (en blob).
   */
  async downloadDocument(documentId: string) {
    return http.get(`${BASE_URL}/documents/${documentId}`, {
      responseType: "blob",
    });
  },

  /**
   * Descargar una versión específica.
   */
  async downloadDocumentVersion(documentId: string, version: number) {
    return http.get(`${BASE_URL}/download/${documentId}/version/${version}`, {
      responseType: "blob",
    });
  },

  /**
   * Crear nueva versión de un documento.
   */
  async createDocumentVersion(documentId: string, { reason, file }) {
    const formData = new FormData();
    if (reason) formData.append("reason", reason);
    if (file) formData.append("document", file);

    return http.post(`${BASE_URL}/${documentId}/versions`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Eliminar documento.
   */
  async deleteDocument(documentId: string) {
    console.log("id:", id);
    return http.delete(`${BASE_URL}/documents/${documentId}`);
  },
};
