import type { AxiosInstance, AxiosError } from 'axios';

/**
 * Configuración común de interceptores para todos los clientes HTTP
 * Maneja autenticación y errores de manera centralizada
 */
export const setupAuthInterceptors = (httpClient: AxiosInstance, serviceName: string = 'servicio') => {
    // Interceptor de peticiones - agregar token
    httpClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.error(`Error en petición HTTP (${serviceName}):`, error);
            return Promise.reject(error);
        }
    );

    // Interceptor de respuestas - manejar errores de autenticación
    httpClient.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            const status = error.response?.status;
            
            if (status === 401) {
                // Token inválido o expirado
                console.warn(`Token expirado en ${serviceName}, cerrando sesión...`);
                
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                
                // Redirigir al login si no estamos ya ahí  
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                
                return Promise.reject(new Error('Sesión expirada. Por favor, inicia sesión nuevamente.'));
            }
            
            if (status === 403) {
                return Promise.reject(new Error('No tienes permisos para realizar esta acción.'));
            }
            
            if (status === 404) {
                return Promise.reject(new Error('Recurso no encontrado.'));
            }
            
            if (status === 500) {
                return Promise.reject(new Error('Error interno del servidor. Intenta nuevamente.'));
            }
            
            // Para otros errores, usar el mensaje del servidor si está disponible
            const errorData = error.response?.data as any;
            const errorMessage = errorData?.message || 
                               errorData?.error || 
                               error.message || 
                               `Error de conexión con ${serviceName}`;
                               
            console.error(`Error HTTP ${status} en ${serviceName}:`, errorMessage);
            return Promise.reject(new Error(errorMessage));
        }
    );
};