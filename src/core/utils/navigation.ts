import { getCurrentUser } from "../services/authService";

/**
 * Obtiene la ruta de inicio según el rol del usuario logueado
 */
export function getHomeRouteByRole(): string {
    const user = getCurrentUser();
    const role = user?.role?.toUpperCase();
    
    switch (role) {
        case "ADMIN":
        case "ADMINISTRADOR":
            return "/adminPage";
        case "MEDICO":
        case "DOCTOR":
            return "/doctorPage";
        case "ENFERMERA":
        case "NURSE":
            return "/nursePage";
        case "PACIENTE":
        case "PATIENT":
            return "/patient-dashboard";
        default:
            return "/";
    }
}

/**
 * Hook helper para usar en componentes con useAuth
 */
export function getHomeRouteFromRole(role?: string): string {
    const normalizedRole = role?.toUpperCase();
    
    switch (normalizedRole) {
        case "ADMIN":
        case "ADMINISTRADOR":
            return "/adminPage";
        case "MEDICO":
        case "DOCTOR":
            return "/doctorPage";
        case "ENFERMERA":
        case "NURSE":
            return "/nursePage";
        case "PACIENTE":
        case "PATIENT":
            return "/patient-dashboard";
        default:
            return "/";
    }
}
