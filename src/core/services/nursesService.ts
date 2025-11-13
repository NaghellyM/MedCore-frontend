import http from "../../infrastructure/http/httpSecurity"
import { ApiUrls } from "../../environments/environments";

export const nursesService = {
  async getAll(_page = 1) {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=enfermera`
    )

    console.log(response.data);
    return response.data
  },

  async searchByNameOrId(query: string) {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/search-by-role?query=${query}&role=enfermera`
    )
    return response.data
  },

  async deleteNurse(id: string): Promise<void> {
  try {
    const response = await http.delete(`${ApiUrls.msSecurity}/users/${id}`)
    console.log(`✅ Enfermera con ID ${id} eliminada correctamente.`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn(`⚠️ La enfermera con ID ${id} ya no existe (404 ignorado).`)
      return
    }
  }
},

  // En doctorsService.ts
async updateNurse(id: string, data: any): Promise<any> {

  console.log("este es la data que envio", data);
  

  try {
    const response = await http.put(`${ApiUrls.msSecurity}/users/nurses/${id}`, data)
    console.log(`✅ Doctor con ID ${id} actualizado correctamente.`)
    return response.data
  } catch (error) {
    console.error(`❌ Error al actualizar el doctor con ID ${id}:`, error)
    throw error
  }
},

  async filterByStatus(status: "active" | "inactive" | "pending") {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=enfermera&status=${status.toUpperCase()}`
    )
    return response.data
  },
}
