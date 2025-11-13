import http from "../../infrastructure/http/httpSecurity"
import { ApiUrls } from "../../environments/environments"

// 🔹 Envío del archivo CSV al backend usando el token de http
export async function uploadUsersCsv(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await http.post(
    `${ApiUrls.msSecurity}/admin/bulk-upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return response.data
}
