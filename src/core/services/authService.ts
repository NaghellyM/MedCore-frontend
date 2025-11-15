
import axios from "axios"; 
import http from "../../infrastructure/http/httpSecurity";
import { decodeToken } from "../auth/decodeToken";
import { apiPost } from "../../infrastructure/http/apiPost";
import type { RegisterUserDto } from "../models/user";

// Interfaces para autenticación
export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  message: string;
  user?: any;
}

// URL base para autenticación
const authBaseUrl = `/auth`;

export const authService = {
  /**
   * Iniciar sesión
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const url = `${authBaseUrl}/sign-in`;
    const data = { email, current_password: password };
    const response = await apiPost<LoginResponse>(url, data);
    
    if (response.accessToken) {
      setAuthHeader(response.accessToken);
    }
    
    return response;
  },

  /**
   * Registrar nuevo usuario
   * @param user - Datos del usuario a registrar
   */
  async registerUser(user: RegisterUserDto): Promise<RegisterResponse> {
    try {
      const response = await http.post(`${authBaseUrl}/sign-up`, user);
      return {
        message: response.data?.message || "Usuario registrado exitosamente",
        user: response.data
      };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    removeAuthHeader();
  },

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser(): any {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  /**
   * Inicializar el servicio de autenticación
   */
  initialize(): void {
    const token = this.getToken();
    if (token) {
      setAuthHeader(token);
    }
  },

  /**
   * Verificar si el token es válido (no expirado)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken = decodeToken(token);
      const now = Date.now() / 1000;
      return decodedToken.exp > now;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  }
};

// Funciones legacy para compatibilidad hacia atrás
export async function login(email: string, password: string): Promise<LoginResponse> {
  return authService.login(email, password);
}

export async function registerUser(user: RegisterUserDto): Promise<RegisterResponse> {
  return authService.registerUser(user);
}

export function logout(): void {
  return authService.logout();
}

export function getCurrentUser(): any {
  return authService.getCurrentUser();
}

export function isAuthenticated(): boolean {
  return authService.isAuthenticated();
}

export function getToken(): string | null {
  return authService.getToken();
}

export function initializeAuth(): void {
  return authService.initialize();
}

// Funciones de utilidad internas
function setAuthHeader(token: string): void {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("accessToken", token);
  localStorage.setItem("refreshToken", token);
  localStorage.setItem("user", JSON.stringify(decodeToken(token)));
}

function removeAuthHeader(): void {
  delete axios.defaults.headers.common["Authorization"];
}
