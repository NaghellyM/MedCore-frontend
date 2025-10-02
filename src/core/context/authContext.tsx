import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeAuth, getCurrentUser, logout, login } from "../services/authService";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    error: string | null;
    loginUser: (credentials: any) => Promise<any>;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [authState, setAuthState] = useState<any>({
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Inicializar el estado de autenticación al cargar la aplicación
        const initAuth = () => {
            try {
                initializeAuth();
                const user = getCurrentUser();
                setAuthState({
                    isAuthenticated: !!user,
                    user,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: "Error initializing authentication",
                });
            }
        };

        initAuth();
    }, []);

    const loginUser = async (credentials: any) => {
        try {
            const response = await login(credentials.email, credentials.password);
            setAuthState({
                isAuthenticated: true,
                user: getCurrentUser(),
                loading: false,
                error: null,
            });
            return response;
        } catch (error) {
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: "Login failed",
            });
            throw error;
        }
    };
    const logoutUser = () => {
        logout();
        setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
        });
        // Navigation will be handled by the component that calls logoutUser
        window.location.href = "/";
    };


    return (
        <AuthContext.Provider
            value={{
                ...authState,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};