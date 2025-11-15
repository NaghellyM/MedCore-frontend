
export interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    error: string | null;
    loginUser: (credentials: any) => Promise<any>;
    logoutUser: () => void;
    refreshUser: () => Promise<any>
}
