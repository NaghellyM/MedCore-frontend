import { useAuth } from '../../context/authContext';
import { normalizeRole, type NormalizedRole } from '../../types/shared/roles';

/**
 * Hook personalizado para obtener el rol del usuario autenticado
 * 
 * @returns {Object} Objeto con el rol normalizado e información adicional
 */
export const useUserRole = () => {
    const { user, isAuthenticated, loading } = useAuth();

    // Obtener el rol del usuario desde diferentes posibles propiedades
    const rawRole = user?.role ?? user?.rol ?? user?.userRole;
    
    // Normalizar el rol
    const role: NormalizedRole = normalizeRole(rawRole);

    return {
        role,
        rawRole,
        isAuthenticated,
        loading,
        user,
        isAdmin: role === 'admin',
        isDoctor: role === 'doctor',
        isNurse: role === 'nurse',
        isPatient: role === 'patient',
    };
};