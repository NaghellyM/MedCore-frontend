import http from "../../infrastructure/http/http"
import { ApiUrls } from "../../environments/environments"

interface DoctorResponse {
  users: any[]
  totalPages: number
  currentPage: number
  itemsPerPage?: number
}

export const doctorsService = {
  // Obtener todos los médicos con paginación opcional
  async getAll(page?: number, limit?: number): Promise<DoctorResponse> {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=medico${page ? `&page=${page}` : ""
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
      `${ApiUrls.msSecurity}/users/search-by-role?query=${query}&role=medico${page ? `&page=${page}` : ""
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
      console.log("Especialidad:", specialty)

      const response = await http.get(
        `${ApiUrls.msSecurity}/users/doctors/by-specialty?specialty=${encodeURIComponent(specialty)}`
      )

      return {
        users: response.data?.users || response.data?.doctors || [],
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      }
    } catch (error) {
      console.error("Error al obtener doctores por especialidad:", error)
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
        `${ApiUrls.msSecurity}/users/by-role-status?role=medico&status=${status.toUpperCase()}${page ? `&page=${page}` : ""
        }${limit ? `&limit=${limit}` : ""}`
      )
      return {
        users: response.data?.users || [],
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      }
    } catch (err) {
      console.error("❌ Error fetching doctors by status:", err)
      return { users: [], totalPages: 1, currentPage: 1 }
    }
  },

  // Obtener todas las especialidades (sin paginación)
  async getSpecialties(): Promise<{ id: string; nombre: string; departamento?: any }[]> {
    const response = await http.get(`${ApiUrls.msSecurity}/specialties`)
    return response.data?.especialidades || []
  },
}
