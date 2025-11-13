import http from "../../infrastructure/http/httpSecurity"
import { ApiUrls } from "../../environments/environments";

export const nursesService = {
  async getAll(page = 1) {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=enfermera`
    )
    return response.data
  },

  async searchByNameOrId(query: string) {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/search-by-role?query=${query}&role=enfermera`
    )
    return response.data
  },

  async filterByStatus(status: "active" | "inactive" | "pending") {
    const response = await http.get(
      `${ApiUrls.msSecurity}/users/by-role-status?role=enfermera&status=${status.toUpperCase()}`
    )
    return response.data
  },
}
