import httpPatient from "../../infrastructure/http/httpPatient"
import { PatientValidator } from "../validators"

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
} from "../types/patient"

// URL base para pacientes
const patientBaseUrl = "/patients";

export const patientService = {
  /**
   * Obtiene todos los pacientes con paginación
   * GET /patients
   * @param page - Página actual (por defecto 1)
   * @param limit - Límite de resultados por página (por defecto 20)
   */
  async getAllPatients(page: number = 1, limit: number = 20): Promise<PatientSearchResponse> {
    try {
      const { page: validPage, limit: validLimit } = PatientValidator.validatePaginationParams(page, limit);

      const response = await httpPatient.get(patientBaseUrl, {
        params: { page: validPage, limit: validLimit }
      });
      return {
        patients: response.data.patients || response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || validPage,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || validPage
      };
    } catch (error) {
      throw new Error(`Error al obtener pacientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Búsqueda avanzada de pacientes
   * GET /patients/search/advanced/?diagnostic=fiebre
   * @param params - Parámetros de búsqueda avanzada
   */
  async advancedSearchPatients(params: AdvancedSearchParams): Promise<PatientSearchResponse> {
    try {
      // Validar parámetros de búsqueda antes de procesar
      PatientValidator.validateAdvancedSearchParams(params);

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
      throw new Error(`Error en búsqueda avanzada: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },

  /**
   * Obtiene la información completa de un paciente por ID
   * GET /patients/:id
   * @param patientId - ID del paciente
   */
  async getPatientById(patientId: string): Promise<Patient> {
    try {
      PatientValidator.validatePatientId(patientId);

      const response = await httpPatient.get<GetPatientResponse>(`${patientBaseUrl}/${patientId}`);
      return response.data;
    } catch (error) {
      // El interceptor ya maneja los errores de autenticación y formato
      // Solo re-lanzamos el error para que sea manejado por el hook
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
      // Validar datos del paciente antes de crear
      PatientValidator.validateCreatePatientData(patientData);

      const response = await httpPatient.post(patientBaseUrl, patientData);

      return {
        success: true,
        message: response.data?.message || "Paciente creado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      throw new Error(`Error al crear paciente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
      // Validar ID del paciente y datos de actualización
      PatientValidator.validatePatientId(patientId);
      PatientValidator.validateUpdatePatientData(patientData);

      const response = await httpPatient.put(`${patientBaseUrl}/${patientId}`, patientData);

      return {
        success: true,
        message: response.data?.message || "Paciente actualizado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      throw new Error(`Error al actualizar paciente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
      // Validar ID del paciente y datos del estado
      PatientValidator.validatePatientId(patientId);
      PatientValidator.validatePatientStateUpdate(stateData);

      const response = await httpPatient.patch(`${patientBaseUrl}/state/${patientId}`, stateData);

      return {
        success: true,
        message: response.data?.message || "Estado del paciente actualizado exitosamente",
        data: response.data.data || response.data
      };
    } catch (error) {
      throw new Error(`Error al actualizar estado del paciente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  },


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
      // Validar término de búsqueda
      PatientValidator.validateSearchQuery(query);

      // Validar parámetros de paginación
      const { page: validPage, limit: validLimit } = PatientValidator.validatePaginationParams(page, limit);

      // Si el query es numérico, buscar por identificación
      const isNumeric = /^\d+$/.test(query.trim());
      const searchParams: AdvancedSearchParams = {
        page: validPage,
        limit: validLimit
      };

      if (isNumeric) {
        searchParams.identificacion = query.trim();
      } else {
        searchParams.fullname = query.trim();
      }

      return await this.advancedSearchPatients(searchParams);
    } catch (error) {
      throw new Error(`Error en búsqueda de pacientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
    // Validar término de diagnóstico
    if (!diagnostic || typeof diagnostic !== 'string' || diagnostic.trim().length < 3) {
      throw new Error("El diagnóstico debe tener al menos 3 caracteres");
    }

    // Validar parámetros de paginación
    const { page: validPage, limit: validLimit } = PatientValidator.validatePaginationParams(page, limit);

    return this.advancedSearchPatients({
      diagnostic: diagnostic.trim(),
      page: validPage,
      limit: validLimit
    });
  },

  /**
   * Obtiene pacientes activos solamente
   * @param page - Página actual
   * @param limit - Límite de resultados
   */
  async getActivePatients(page: number = 1, limit: number = 20): Promise<PatientSearchResponse> {
    // Validar parámetros de paginación
    const { page: validPage, limit: validLimit } = PatientValidator.validatePaginationParams(page, limit);

    return this.advancedSearchPatients({
      status: "ACTIVE",
      page: validPage,
      limit: validLimit
    });
  },

  /**
   * Obtiene una lista de pacientes recientes (simulado con getAllPatients)
   * @param limit - Número de pacientes recientes a obtener
   */
  async getRecentPatients(limit: number = 5): Promise<PatientSearchResult[]> {
    try {
      // Validar límite
      const validLimit = Math.max(1, Math.min(limit, 50)); // Entre 1 y 50

      const response = await this.getAllPatients(1, validLimit);
      return response.patients;
    } catch (error) {
      throw new Error(`Error al obtener pacientes recientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
};

// Mantener la función original para compatibilidad hacia atrás
export async function getPatientById(patientId: string): Promise<Patient> {
  return patientService.getPatientById(patientId);
}
