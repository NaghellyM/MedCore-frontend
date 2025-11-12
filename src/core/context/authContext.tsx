import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { initializeAuth, getCurrentUser, logout, login } from "../services/authService";
import type { AuthContextType } from "../types/authContextTypes";

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
            console.log("Login service response:", response);

            const currentUser = getCurrentUser();
            console.log("Current user after login:", currentUser);

            setAuthState({
                isAuthenticated: true,
                user: currentUser,
                loading: false,
                error: null,
            });
            return response;
        } catch (error) {
            console.error("Login error:", error);
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
