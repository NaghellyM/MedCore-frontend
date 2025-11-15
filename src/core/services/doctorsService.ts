import http from "../../infrastructure/http/httpSecurity"
import { ApiUrls } from "../../environments/environments"

interface DoctorResponse {
  users: any[]
  totalPages: number
  currentPage: number
  itemsPerPage?: number
}

const Url = `${ApiUrls.msSecurity}`

export const doctorsService = {
  // Obtener todos los médicos con paginación opcional
  async getAll(page?: number, limit?: number): Promise<DoctorResponse> {
    const response = await http.get(
      `${Url}/users/by-role-status?role=medico${page ? `&page=${page}` : ""
      }${limit ? `&limit=${limit}` : ""}`
    )
    return {
      users: response.data?.users || [],
      totalPages: response.data?.totalPages || 1,
      currentPage: response.data?.currentPage || 1,
    }
  },

  // Buscar por nombre o ID con paginación
  async searchByNameOrId(query: string, page?: number, limit?: number): Promise<DoctorResponse> {
    const response = await http.get(
      `${Url}/users/search-by-role?query=${query}&role=medico${page ? `&page=${page}` : ""
      }${limit ? `&limit=${limit}` : ""}`
    )
    return {
      users: response.data?.users || [],
      totalPages: response.data?.totalPages || 1,
      currentPage: response.data?.currentPage || 1,
    }
  },

  // Filtrar por especialidad con paginación
  async filterBySpecialty(specialty: string): Promise<DoctorResponse> {
    try {
      const response = await http.get(
        `${Url}/users/doctors/by-specialty?specialty=${encodeURIComponent(specialty)}`
      )

      return {
        users: response.data?.users || response.data?.doctors || [],
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      }
    } catch (error) {
      return { users: [], totalPages: 1, currentPage: 1 }
    }
  },

  // Filtrar por estado con paginación
  async filterByStatus(
    status: "active" | "inactive" | "pending",
    page?: number,
    limit?: number
  ): Promise<DoctorResponse> {
    try {
      const response = await http.get(
        `${Url}/users/by-role-status?role=medico&status=${status.toUpperCase()}${page ? `&page=${page}` : ""
        }${limit ? `&limit=${limit}` : ""}`
      )
      return {
        users: response.data?.users || [],
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      }
    } catch (err) {
      return { users: [], totalPages: 1, currentPage: 1 }
    }
  },

  // Obtener todas las especialidades (sin paginación)
  async getSpecialties(): Promise<{ id: string; nombre: string; departamento?: any }[]> {
    const response = await http.get(`${Url}/specialties`)
    return response.data?.especialidades || []
  },

  async deleteDoctor(id: string): Promise<void> {
    try {
      const response = await http.delete(`${ApiUrls.msSecurity}/users/${id}`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return
      }
    }
  },


  // En doctorsService.ts
  async updateDoctor(id: string, data: any): Promise<any> {
    try {
      const response = await http.put(`${ApiUrls.msSecurity}/users/doctors/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Obtener doctor por ID
  async getDoctorById(id: string) {
    const response = await http.get(`${ApiUrls.msSecurity}/users/${id}`)
    return response.data
  },


}
