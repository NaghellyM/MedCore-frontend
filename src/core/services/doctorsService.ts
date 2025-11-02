import http from "../../infrastructure/http/http"
import { ApiUrls } from "../../environments/environments"
import { da } from "date-fns/locale"

interface DoctorResponse {
  users: any[]
  totalPages: number
  currentPage: number
}

export const doctorsService = {
  // Obtener todos los médicos con paginación opcional
  async getAll(page?: number, limit?: number): Promise<DoctorResponse> {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=medico${
        page ? `&page=${page}` : ""
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
      `${ApiUrls.msSecurity}/users/search-by-role?query=${query}&role=medico${
        page ? `&page=${page}` : ""
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
      `${ApiUrls.msSecurity}/users/doctors/by-specialty?specialty=${specialty}`
    )

    return response.data
  } catch (error) {
    console.error("Error al obtener doctores por especialidad:", error)
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
        `${ApiUrls.msSecurity}/users/by-role-status?role=medico&status=${status.toUpperCase()}${
          page ? `&page=${page}` : ""
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

async deleteDoctor(id: string): Promise<void> {
  try {
    const response = await http.delete(`${ApiUrls.msSecurity}/users/${id}`)
    console.log(`✅ Doctor con ID ${id} eliminado correctamente.`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`⚠️ El doctor con ID ${id} ya no existe (404 ignorado).`)
      return
    }
  }
},


  // En doctorsService.ts
async updateDoctor(id: string, data: any): Promise<any> {

  console.log("este es la data que envio", data);
  

  try {
    const response = await http.put(`${ApiUrls.msSecurity}/users/doctors/${id}`, data)
    console.log(`✅ Doctor con ID ${id} actualizado correctamente.`)
    return response.data
  } catch (error) {
    console.error(`❌ Error al actualizar el doctor con ID ${id}:`, error)
    throw error
  }
},

// Obtener doctor por ID
async getDoctorById(id: string) {
  console.log("este es el id mamastroso", id);
  
  const response = await http.get(`${ApiUrls.msSecurity}/users/${id}`)
  return response.data
},


}
