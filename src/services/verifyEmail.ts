// src/services/authService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/sign-in`, {
      email,
      current_password: password,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
}

export async function verifyEmail(email: string, code: string): Promise<LoginResponse> {

    console.log("me esta llegando: ", email, code);
    

  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/verify-email`, {
      email,
      "verificationCode": code,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error en verificación:", error.response?.data || error.message);
    throw error.response?.data || { message: "Error al verificar código" };
  }
}
