import { useState, useEffect } from "react";
import { authService } from "../../services/authService";

interface User {
    id: string;
    fullname?: string;
    email?: string;
    role?: string;
    [key: string]: any;
}

interface UseCurrentUserReturn {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
}

/**
 * Hook para obtener el usuario actualmente autenticado
 * Responsabilidad única: Gestionar el estado del usuario autenticado
 * Principio de abstracción: Encapsula el acceso a authService
 */
export function useCurrentUser(): UseCurrentUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            try {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error loading current user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        // Opcional: Escuchar cambios en localStorage (si se implementa)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "user" || e.key === "accessToken") {
                loadUser();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return {
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        loading,
    };
}