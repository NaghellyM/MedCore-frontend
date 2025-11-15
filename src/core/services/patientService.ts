import httpPatient from "../../infrastructure/http/httpPatient"

// Importar todas las interfaces desde el dominio patient
import type { 
    Patient,
    GetPatientResponse,
    PatientSearchResult, 
    CreatePatientDto,
    PatientStateUpdateDto,
    PatientSearchResponse, 
    CreatePatientResponse, 
    UpdatePatientResponse,
    AdvancedSearchParams 
} from "../types/patient"// URL base para pacientes
const patientBaseUrl = "/patients";

// Servicio de pacientes completamente alineado con el backend
export const patientService = {
  /**
   * Obtiene todos los pacientes con paginación
   * GET /patients
   * @param page - Página actual (por defecto 1)
   * @param limit - Límite de resultados por página (por defecto 20)
   */
  async getAllPatients(page: number = 1, limit: number = 20): Promise<PatientSearchResponse> {
    try {
      const response = await httpPatient.get(patientBaseUrl, {
        params: { page, limit }
      });

      return {
        patients: response.data.patients || response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || page,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || page
      };
    } catch (error) {
      console.error("Error fetching all patients:", error);
      throw error;
    }
  },

  /**
   * Búsqueda avanzada de pacientes
   * GET /patients/search/advanced/?diagnostic=fiebre
   * @param params - Parámetros de búsqueda avanzada
   */
  async advancedSearchPatients(params: AdvancedSearchParams): Promise<PatientSearchResponse> {
    try {
      const queryParams = new URLSearchParams();

      // Agregar parámetros de búsqueda
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await httpPatient.get(
        `${patientBaseUrl}/search/advanced/?${queryParams.toString()}`
      );

      return {
        patients: response.data.patients || response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || params.page || 1,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || params.page || 1
      };
    } catch (error) {
      console.error("Error in advanced search:", error);
      throw error;
    }
  },

  /**
   * Obtiene la información completa de un paciente por ID
   * GET /patients/:id
   * @param patientId - ID del paciente
   */
  async getPatientById(patientId: string): Promise<Patient> {
    try {
      const response = await httpPatient.get<GetPatientResponse>(`${patientBaseUrl}/${patientId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching patient by ID:", error);
      throw error;
    }
  },

  /**
   * Crea un nuevo paciente
   * POST /patients
   * @param patientData - Datos del paciente a crear
   */
  async createPatient(patientData: CreatePatientDto): Promise<CreatePatientResponse> {
    try {
      const response = await httpPatient.post(patientBaseUrl, patientData);

      return {
        success: true,
        message: response.data?.message || "Paciente creado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  /**
   * Actualiza completamente un paciente
   * PUT /patients/:id
   * @param patientId - ID del paciente
   * @param patientData - Datos completos del paciente
   */
  async updatePatient(patientId: string, patientData: Partial<CreatePatientDto>): Promise<UpdatePatientResponse> {
    try {
      const response = await httpPatient.put(`${patientBaseUrl}/${patientId}`, patientData);

      return {
        success: true,
        message: response.data?.message || "Paciente actualizado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  },

  /**
   * Actualiza el estado de un paciente
   * PATCH /patients/state/:id
   * @param patientId - ID del paciente
   * @param stateData - Nuevo estado y razón opcional
   */
  async updatePatientState(patientId: string, stateData: PatientStateUpdateDto): Promise<UpdatePatientResponse> {
    try {
      const response = await httpPatient.patch(`${patientBaseUrl}/state/${patientId}`, stateData);

      return {
        success: true,
        message: response.data?.message || "Estado del paciente actualizado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error("Error updating patient state:", error);
      throw error;
    }
  },

  // ========== MÉTODOS DE CONVENIENCIA Y BÚSQUEDA ==========

  /**
   * Busca pacientes por término general (nombre, documento, etc.)
   * Utiliza búsqueda avanzada internamente
   * @param query - Término de búsqueda
   * @param page - Página actual (por defecto 1)
   * @param limit - Límite de resultados por página (por defecto 10)
   */
  async searchPatients(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientSearchResponse> {
    try {
      // Si el query es numérico, buscar por identificación
      const isNumeric = /^\d+$/.test(query.trim());
      const searchParams: AdvancedSearchParams = {
        page,
        limit
      };

      if (isNumeric) {
        searchParams.identificacion = query.trim();
      } else {
        searchParams.fullname = query.trim();
      }

      return await this.advancedSearchPatients(searchParams);
    } catch (error) {
      console.error("Error searching patients:", error);
      return {
        patients: [],
        total: 0,
        page: 1,
        totalPages: 1
      };
    }
  },

  /**
   * Busca pacientes por diagnóstico
   * @param diagnostic - Diagnóstico a buscar
   * @param page - Página actual
   * @param limit - Límite de resultados
   */
  async searchPatientsByDiagnostic(
    diagnostic: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PatientSearchResponse> {
    return this.advancedSearchPatients({
      diagnostic: diagnostic.trim(),
      page,
      limit
    });
  },

  /**
   * Obtiene pacientes activos solamente
   * @param page - Página actual
   * @param limit - Límite de resultados
   */
  async getActivePatients(page: number = 1, limit: number = 20): Promise<PatientSearchResponse> {
    return this.advancedSearchPatients({
      status: "ACTIVE",
      page,
      limit
    });
  },

  /**
   * Obtiene una lista de pacientes recientes (simulado con getAllPatients)
   * @param limit - Número de pacientes recientes a obtener
   */
  async getRecentPatients(limit: number = 5): Promise<PatientSearchResult[]> {
    try {
      const response = await this.getAllPatients(1, limit);
      return response.patients;
    } catch (error) {
      console.error("Error fetching recent patients:", error);
      return [];
    }
  }
};

// Mantener la función original para compatibilidad hacia atrás
export async function getPatientById(patientId: string): Promise<Patient> {
  return patientService.getPatientById(patientId);
}
