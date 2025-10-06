
import axios from "axios";
import { decodeToken } from "../utils/decodeToken";
import { ApiUrls } from "../../environments/environments";
import { apiPost } from "../../infrastructure/http/apiPost";

export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const url = `${ApiUrls.msSecurity}/auth/sign-in`;
  const data = { email, current_password: password };
  const response = await apiPost<LoginResponse>(url, data);
  if (response.accessToken) {
    setAuthHeader(response.accessToken);
  }
  return response;
}

export function logout(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  removeAuthHeader();
}

export function getCurrentUser(): any {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("accessToken");
}

export function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

 // Configurar el token en el header para todas las peticiones
export function setAuthHeader(token: string): void {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", token);
    localStorage.setItem("user", JSON.stringify(decodeToken(token)));
  }

  export function removeAuthHeader(): void {
    delete axios.defaults.headers.common["Authorization"];
  }

  // Inicializar el servicio (llamar al inicio de la aplicación)
  export function initializeAuth(): void {
    const token = getToken();
    if (token) {
      setAuthHeader(token);
    }
  }
