// src/services/authService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1"; 
// mejor manejarlo con variables de entorno

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/sign-in`, {
      email,
      current_password: password, // ojo! el backend lo pide así
    });

    return response.data;
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
}
