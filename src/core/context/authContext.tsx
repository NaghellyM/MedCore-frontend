import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeAuth, getCurrentUser, logout, login } from "../services/authService";
import type { AuthContextType } from "../types/authContextTypes";
import { toast } from "sonner";

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

            const currentUser = getCurrentUser();
            setAuthState({
                isAuthenticated: true,
                user: currentUser,
                loading: false,
                error: null,
            });
            
            // Show success toast for login (non-blocking feedback)
            toast.success("¡Bienvenido!", {
                description: `Hola ${currentUser?.fullname}`,
                duration: 3000,
            });
            
            return response;
        } catch (error: any) {
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: "Login failed",
            });
            // Don't show the error message here to avoid duplicates
            // Let the calling component handle the error display
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
        
        // Show success toast for logout (non-blocking feedback)
        toast.success("Sesión cerrada", {
            description: "Has cerrado sesión exitosamente",
            duration: 3000,
        });
        
        window.location.href = "/";
    };
    const refreshUser = async () => {
        try {
            const currentUser = getCurrentUser(); 
            setAuthState((prev: any) => ({
                ...prev,
                isAuthenticated: !!currentUser,
                user: currentUser,
            }));
            return currentUser;
        } catch (error) {
            setAuthState((prev: any) => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                error: prev?.error ?? null,
            }));
            throw error;
        }
    };


    return (
        <AuthContext.Provider
            value={{
                ...authState,
                loginUser,
                logoutUser,
                refreshUser,
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
