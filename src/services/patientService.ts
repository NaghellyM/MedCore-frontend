// src/services/patientService.ts
import http from "../api/http"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002"

// ✅ DTO para registrar usuario
export interface RegisterUserDto {
  email: string
  fullname: string
  role?: string
  current_password: string
  status?: string
  specialization?: string
  department?: string
  license_number?: string
  phone?: string
  date_of_birth?: string
}

// ✅ Servicio para registrar usuario
export async function registerUser(user: RegisterUserDto) {
  const response = await http.post(`${API_URL}/api/v1/auth/sign-up`, user)
  return response.data
}
